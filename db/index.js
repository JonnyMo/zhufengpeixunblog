var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
var Schema = mongoose.Schema;
mongoose.model('User',new Schema({
    username:String,
    password:String,
    email:String})
);

global.Model = function(modelName){
    return mongoose.model(modelName);
};
