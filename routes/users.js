var express = require('express');
var router = express.Router();
var middleware = require("../middleware");

/*获取登录页*/
router.get('/reg', middleware.checkNotLogin, function(req, res) {
  console.log("abc");
  res.render('users/reg', {title:"注册"});
});

/*提交*/
router.post('/reg', middleware.checkNotLogin, function(req, res) {
    var user = req.body;
    res.setHeader("content-type", "application/text; charset=utf-8");
    if(user.password != user.confirmPassword){
        return res.end(JSON.stringify({status:1, msg:'两次输入的密码不一致'}));
    }
    delete user.confirmPassword;
    new Model('User')(user).save(function(err, user){
        if(err){
            res.end(JSON.stringify({status:1, msg:'保存数据失败！'}));
        }else{
            console.log("user:" ,user);
            res.end(JSON.stringify({status:0}));
        }
    });
});

router.get('/login', middleware.checkNotLogin, function(req, res, next) {
    res.render('users/login', {title:"登录"});
});

router.post('/login', middleware.checkNotLogin, function(req, res) {
  var user = req.body;
  res.setHeader("content-type", 'text/application; charset=utf-8');
  Model('User').find(user, function(err, user){
        if(err){
            console.log(err);
        }else if(user.length > 0){
            req.session.user = user;
            res.end(JSON.stringify({status:0}));
        }else{
            res.end(JSON.stringify({status:1, msg: '用户名或密码错误'}));
        }
    });
});

router.get('/logout', middleware.checkLogin, function(req, res){
    req.session.user = null;
    req.flash("success", "退出成功，请重新登录");
    res.redirect('/users/login');
});
module.exports = router;
