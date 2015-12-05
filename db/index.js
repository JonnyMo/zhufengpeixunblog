var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
var Schema = mongoose.Schema;
mongoose.model('User',new Schema({
    username:String,
    password:String,
    email:String})
);

global.Module = function(modelName){
    return mongoose.model(modelName);
};
