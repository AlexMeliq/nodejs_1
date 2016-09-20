/**
 * Created by Administrator on 9/13/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.clearCookie('logged');
    res.redirect('/');
});

module.exports = router;
