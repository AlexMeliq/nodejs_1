/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    mongo = require('mongodb');
// Connection URL
var url = 'mongodb://localhost:27017/test';

router.get('/', function (req, res, next) {
    var cookie = req.cookies.logged;
    if(cookie) {
        var o_id = new mongo.ObjectID(cookie);
        MongoClient.connect(url, function(err, db) {
            db.users = db.collection('users');
            db.users.find(
                {
                    _id: o_id
                }
            ).toArray(function (err, user) {
                assert.equal(err, null);
                res.render('profile', {
                    title: 'My profile',
                    info: 'Dashboard',
                    user: user[0]
                });
            });
        })
    }else{
        res.redirect('/login')
    }
});



















var findUsers = function (db, callback) {
    //console.log(db.users.find());
    db.users.find({}).toArray(function(err, users) {
        assert.equal(err, null);
        // assert.equal(2, users.length);
        console.log("Found the following records");
        console.dir(users);
        router.get('/', function(req, res, next) {
            res.render('register', {
                title: 'Register',
                info: 'You can register or Login',
                users: users
            });
        });
        callback(users);
    });
};



module.exports = router;
