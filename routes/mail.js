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
                res.render('mail', {
                    title: 'Mail Sender',
                    info: ':)',
                    user: user[0]
                });
            });
        })
    }else{
        res.redirect('/login')
    }
});
router.post('/', function(req, res){
    console.log('body: ' + JSON.stringify(req.body));
    setTimeout(function () {
        res.send(req.body);
    }, 1000)
});

module.exports = router;
