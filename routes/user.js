/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/test';

router.get('/*', function (req, res, next) {
    var usName = req.originalUrl.split('/')[2];
    console.log(usName);
    MongoClient.connect(url, function(err, db) {
        db.users = db.collection('users');
        db.users.find(
            {
                name: usName
            }
        ).toArray(function(err, users) {
            assert.equal(err, null);
            console.log("Found the following records");
            if(users.length === 1){
                    res.render('user', {
                        title: usName + '\'s Profile',
                        user: users[0]
                    });
            }else{
                next();
            }
        });
    });
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
