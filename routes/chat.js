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
    ObjectId = Schema.ObjectId,
    url = 'mongodb://localhost:27017/test';

mongoose.connect(url);




var userSchema   = new Schema({
    _id: ObjectId,
    name: String,
    avatar: String
});

var messageSchema = new Schema({
    _id: Number,
    content: String,
    user_id: [{type: ObjectId, ref: 'User'}]
}, {
    timestamps: true
});


var Message = mongoose.model('Message', messageSchema, 'messages');
var User = mongoose.model('User', userSchema);






router.get('/', function (req, res, next) {
    if(req.app.locals.currentUser){
        getMessage(res);
    }else {
        res.redirect('/login');
    }
});

router.post('/', function (req, res) {
        insertMessage(req, res);
});









var getMessage = function (res) {
    Message
        .find({})
        .populate('user_id')
        .exec(function (err, messagesQ) {
            res.render('chat', {
                title: 'Chat',
                messages: messagesQ
            });
            res.io.emit("socketMessages", messagesQ);
        });
};

var insertMessage = function (info, res) {
    Message.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
        var id = 1;
        if( post ) id = post._id + 1;
        var mess = new Message({
            _id: id,
            content: info.body.text,
            user_id: info.app.locals.currentUser._id
        });
        mess.save(function (err) {
            if (err) {
                return err;
            }
            else {
                Message
                    .find({})
                    .populate('user_id')
                    .exec(function (err, messagesQ) {
                        res.render('chat', {
                            title: 'Chat',
                            messages: messagesQ
                        });
                        console.log(messagesQ);
                        res.io.emit("socketMessages", messagesQ);
                    });
            }
        });
    });


};






module.exports = router;

