exports.checkLogin = function(req, res, next){
    if(req.session.user){
        next();
    }else{
        req.flash("error", "你还没登录呢！");
        res.redirect('back');
    }
};

exports.checkNotLogin = function(req, res, next){
    if(!req.session.user){
        next();
    }else{
        req.flash("error", "你已经登录！");
        res.redirect('back');
    }
};