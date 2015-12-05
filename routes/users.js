var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('reg', function(req, res, next) {
  res.render('users/reg', {});
});

router.post('reg', function(req, res, next) {
  res.send('reg');
});
router.get('login', function(req, res, next) {
  res.render('users/login', {});
});
router.post('login', function(req, res, next) {
  res.send('login');
});

module.exports = router;
