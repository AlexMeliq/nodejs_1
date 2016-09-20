var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/admin', {
    title: 'Admin Panel',
    name: 'Alex ',
    email: 'alex@shahumyanmedia.com'
  });
});

module.exports = router;