var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017/test';

router.get('/', function(req, res, next) {
  var cookie = req.cookies.logged;
  if(cookie) {
    MongoClient.connect(url, function (err, db) {
      db.users = db.collection('users');
      assert.equal(null, err);
      db.users.find({}).toArray(function (err, users) {
        assert.equal(err, null);
        res.render('admin/users', {
          title: 'All users',
          info: 'Users list with information',
          users: users
        });
      });
    });
  }else{
    res.redirect('/login');
  }
});

module.exports = router;
