/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    url = 'mongodb://localhost:27017/test';

mongoose.connect(url);


var Message = require('../models/messages');
var User = require('../models/user');


router.get('/', function (req, res, next) {
   var cookie = req.cookies.logged;
    if(cookie){
        getMessage(res);
    }else {
        res.redirect('/login');
    }
});

router.post('/', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        db.messages = db.collection('messages');
        assert.equal(null, err);
        insertMessage(db, function () {
            db.close();
        }, req);
    });
    getMessage(res);
});









var getMessage = function (res) {

    // Message.find({}, function(error, message) {
    //     User.find({_id: message.user_id}, function(error, user) {
    //         var all = {
    //             comment: message,
    //             user: user
    //         };
    //         console.log(message);
    //     });
    // });


    MongoClient.connect(url, function (err, db) {
        db.messages = db.collection('messages');
        db.users = db.collection('users');





        assert.equal(null, err);
        db.messages.find({}).toArray(function (err, messagesQ) {
            assert.equal(err, null);
            res.io.emit("socketMessages", messagesQ);
            console.log(messagesQ);
            res.render('chat', {
                title: 'Chat',
                messages: messagesQ
            });
        });



    });
};

var insertMessage = function (db, callback, info) {
    // console.log(info.body.text);
    function getNextSequence(name) {
        var ret = db.messages.findAndModify(
            {
                query: { _id: name },
                update: { $inc: { seq: 1 } },
                new: true
            }
        );
        return ret.seq;
    }
    var collection = db.messages;
    collection.insertOne({
        _id: getNextSequence("_id"),
        content: info.body.text,
        user_id: info.app.locals.currentUser._id

    }, function (res) {
        // console.log(res);
    });
};






module.exports = router;



// for (var message in messagesQ) {
//     if (messagesQ.hasOwnProperty(message)) {
//         var o_id = new mongo.ObjectID(messagesQ[message].user_id);
//         db.users.find(
//             {
//                 _id: o_id
//             }
//         ).toArray(function (err, user) {
//             assert.equal(err, null);
//             messagesQ[message].userInfo = user[0];
//             // console.log(messagesQ[message]);
//         });
//     }
// }
