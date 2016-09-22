var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = req.originalUrl.split('?')[1];
  if(query == 'new'){
    res.render('admin/pages', {
      title: 'Add new page',
      query: query,
      inputs: {
        'title': 'text',
        'slug' : 'text',
        'content': 'textarea'
  }
    });
  }else if(query == undefined){
    MongoClient.connect(url, function (err, db) {
      db.users = db.collection('posts');
      assert.equal(null, err);
      db.users.find(
          {
            type: 'page'
          }
      ).toArray(function (err, pages) {
        assert.equal(err, null);
        res.render('admin/pages', {
          title: 'All Pages',
          pages: pages
        });
      });
    });
  }
});

router.post('/new', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    db.posts = db.collection('posts');
    assert.equal(null, err);
    insertPage(db, function () {
      db.close();
    }, req);
    res.redirect('/admin/pages');
  });
});



var insertPage = function (db, callback, info) {
  function getNextSequence(name) {
    var ret = db.posts.findAndModify(
        {
          query: { _id: name },
          update: { $inc: { seq: 1 } },
          new: true
        }
    );
    return ret.seq;
  }
  var collection = db.posts;
  if(Object.keys(info).length >= 4) {
    collection.insertOne({
      _id: getNextSequence("_id"),
      title: info.body.title,
      slug: info.body.slug,
      content: info.body.content,
      user_id: info.app.locals.currentUser._id,
      type: 'page',
      date: ''

    }, function (res) {
      // console.log(res);
    });
  }
};

module.exports = router;