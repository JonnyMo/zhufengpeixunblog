var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('articles/add', {});
});
router.get('/post', function(req, res, next) {
  res.send('post');
});

module.exports = router;
