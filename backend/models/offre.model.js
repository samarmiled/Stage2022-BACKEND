const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    date_creation :{
        type : Date,
        required : true
    },
    date_expiration : {
        type : Date,
        required : true
    },
    domaine : {
        type : String,
        required : true
    },
    adresse : {
        type : String,
        required : true
    },
    image : {
        type: String,
        required : true
    }
   
    
});
module.exports = mongoose.model('offre',offreSchema);