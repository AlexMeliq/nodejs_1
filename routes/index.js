var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'First experiment',
    name: 'Alex',
    email: 'alex@shahumyanmedia.com'
  });
});

module.exports = router;