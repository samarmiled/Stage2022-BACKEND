const mongoose = require('mongoose');

const recruteurSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
        min:6
    },
    phone : {
        type : String,
        require : true
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
module.exports = mongoose.model('recruteur',recruteurSchema);