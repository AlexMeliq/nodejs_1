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
var http = require('http').Server(app);
var io = require('socket.io')(http);
router.get('/', function (req, res, next) {
    var cookie = req.cookies.logged;
    if(cookie){


        res.render('chat', {
            title: 'Chat',
            info: '))'
        });
    }else {
        res.redirect('/login');
    }
});



module.exports = router;
