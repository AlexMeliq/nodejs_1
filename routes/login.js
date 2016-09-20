/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/test';
var app = express();

router.post('/', function (req, res, next) {
    MongoClient.connect(url, function(err, db) {
        db.users = db.collection('users');
        var email = req.body.email;
        var pass = req.body.password;
        db.users.find(
            {
                email: email,
                password: pass
            }
        ).toArray(function(err, users) {
            assert.equal(err, null);
            console.log("Found the following records");
            if(users.length === 1){
                var cookie = req.cookies.logged;
                if (cookie === undefined)
                {
                    // no: set a new cookie
                    var usid = users[0]._id;
                    res.cookie('logged',usid, { maxAge: 900000, httpOnly: true });
                    console.log('cookie created successfully');
                    res.redirect('/profile');
                }
            }else{
                res.render('login', {
                    title: 'Login',
                    info: 'Incorrect email or password',
                    color: 'red'
                });
            }
        });
    });
});
router.get('/', function (req, res, next) {
    var cookie = req.cookies.logged;
    if(cookie){
        res.redirect('/profile');
    }else {
        res.render('login', {
            title: 'Login',
            info: 'Please Login',
            color: 'green'
        });
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
