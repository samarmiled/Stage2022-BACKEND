const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        min:6
    },
    email : {
        type : String,
        required : true,
        max : 30 
    },
    password : {
        type : String,
        required : true,
        min : 8
    }
});
module.exports = mongoose.model('user',userSchema);