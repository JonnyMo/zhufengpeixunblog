var express = require('express');
var router = express.Router();
var middleware = require("../middleware");
var path = require('path');
var multer = require('multer');
var perPage = 10;
//添加上传图片功能
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +  path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage });

/* GET users listing. */
router.get('/add', middleware.checkLogin, function(req, res, next) {
    var id = req.query.id;
    if(id && id.length > 0){
        Model('Article').findById(id, function(err, article){
            if(err){
                console.log(err);
                res.end(404);
            }else{
                res.render('articles/add', {title:'文章详情', article: article});
            }
        })
    }else{
        res.render('articles/add', {title:'发表文章', article:{}});
    }
});

router.get('/list/:pageNum/:pageSize', function(req, res){
    var pageNum = parseInt(req.params.pageNum);
    var pageSize = parseInt(req.params.pageSize);
    var keyword = req.query.keyword || '';
    var totalPage = 0;
    pageNum = pageNum <= 0 ? 1 : pageNum;
    var queryObj = {};
    if(keyword){
        queryObj = {$or:[{title: new RegExp(keyword, 'ig')}, {content: new RegExp(keyword, 'ig')}]};
    }
    Model('Article').count(queryObj, function (err, count) {
        if (err){console.log(err)};
        var pageObj;
        if(count == 0){
            pageObj = {};
            res.render('index', {
                title: '首页',
                articles: [],
                keyword:keyword,
                pageObj:pageObj
            });
        }else{
            pageObj = getPageObj(pageNum,count, pageSize, perPage);
            Model("Article").find(queryObj).skip((pageObj.pageNum-1)*pageSize).limit(pageSize)
            .exec(function(err, articles) {
                console.log("articles: ", articles);
                res.render('index', {
                    title: '首页',
                    articles: articles,
                    keyword:keyword,
                    pageObj:pageObj
                });
            });
        }
    });
});

router.get('/detail', function(req, res) {
    var id = req.query.id;
    Model('Article').findById(id, function(err, article){
        if(err){
            console.log(err);
            res.end(404);
        }else{
            res.render('articles/detail', {title:'文章详情', article: article});
        }
    })
});

//文件上传是注意form表单enctype属性 multipart/form-data
router.post('/add', upload.single('poster'), function(req, res) {
    var article = req.body;
    if(req.file){
        article.poster = path.join( '/upload', req.file.filename);
    }
    if(article.id){//修改
        if(!article.poster){
            delete article.poster;
        }
        Model('Article').update(article.id, {$set: article}, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/articles/list/1/2');
            }
        });
    }else{//添加
      new Model('Article')(article).save(function(err, article){
          if(err){
              console.log(err);
          }else{
              res.redirect("/articles/list/1/2");
          }
      });
    }
});

function getPageObj(pageNum,count, pageSize, perPage){
    var totalPage = Math.ceil(count / pageSize);
    var pageObj = {pageSize: pageSize, perPage : perPage};
    pageNum = pageNum > totalPage ? totalPage : pageNum;
    if(pageNum < perPage){
        if(pageNum <= (Math.ceil(perPage/2) + 1)){
            pageObj.start = 1;
        }else{
            pageObj.start = pageNum - Math.ceil(perPage/2);
        }
        pageObj.end = perPage > totalPage  ? totalPage : perPage;
    }else{
        if(pageNum<(totalPage-perPage)){
            pageObj.start = pageNum - Math.ceil(perPage/2);
            pageObj.end = pageNum + Math.ceil(perPage/2);
        }else{
            pageObj.start = totalPage - perPage;
            pageObj.end = totalPage;
        }
    }
    pageObj.totalPage = totalPage;
    pageObj.pageNum = pageNum;
    return pageObj;
}
module.exports = router;
