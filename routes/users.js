var express = require('express');
var router = express.Router();
var myutil = require('../myutil');

/* GET users listing. */
router.get('/reg', function(req, res, next) {
  res.render('users/reg', {title:"注册"});
});

router.post('/reg', function(req, res) {
  var user = req.body;
  res.setHeader("content-type", "application/text; charset=utf-8");
  if(user.password != user.confirmPassword){
      res.end(JSON.stringify({status:1, msg:'两次输入的密码不一致'}));
  }else{
      new Model('User')(user).save(function(err, user){
          if(err){
            res.end(JSON.stringify({status:1, msg:'保存数据失败！'}));
          }else{
            res.end(JSON.stringify({status:0}));
          }
      });
  }
});
router.get('/login', function(req, res, next) {
  res.render('users/login', {title:"登录"});
});

router.post('/login', function(req, res) {
  var user = req.body;
  res.setHeader("content-type", 'text/application; charset=utf-8');
  new Model('User').find(user, function(err, doc){
        console.log("---", arguments);
        if(err){
            console.log(err);
        }else if(doc.length > 0){
            res.end(JSON.stringify({status:0}));
        }else{
            res.end(JSON.stringify({status:1, msg: '用户名或密码错误'}));
        }
    });
});
module.exports = router;
