var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
mongoose.model('User',new Schema({
    username:String,
    password:String,
    email:String})
);
mongoose.model('Article',new Schema({
        title:String,
        content:String,
        author:ObjectId,
        poster:String
    })
);


global.Model = function(modelName){
    return mongoose.model(modelName);
};
