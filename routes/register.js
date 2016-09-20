/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017/test',
    multer  = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    upload = multer({storage: storage});


router.get('/', function(req, res, next) {
    var cookie = req.cookies.logged;
    if(!cookie) {
        res.render('register', {
            title: 'Register',
            info: 'You can register or Login'
        });
    }else {
        res.redirect('/profile');
    }
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    var cookie = req.cookies.logged;
    if(!cookie) {
        MongoClient.connect(url, function (err, db) {
            db.users = db.collection('users');
            assert.equal(null, err);
            insertUser(db, function () {
                db.close();
            }, req);
            res.redirect('/login');
        });
    }
});

var insertUser = function (db, callback, info) {
    function getNextSequence(name) {
        var ret = db.users.findAndModify(
            {
                query: { _id: name },
                update: { $inc: { seq: 1 } },
                new: true
            }
        );
        return ret.seq;
    }
    var collection = db.users;
    if(Object.keys(info).length >= 4) {
        collection.insertOne({
            _id: getNextSequence("_id"),
            name: info.body.name,
            surName: info.body.surName,
            email: info.body.email,
            password: info.body.password,
            avatar: info.file.originalname

        }, function (res) {
            console.log(res);
        });
    }
};

module.exports = router;
