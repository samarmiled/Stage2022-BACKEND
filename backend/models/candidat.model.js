const { date } = require('@hapi/joi/lib/template');
const mongoose = require('mongoose');
const avisSchema = require('./avis.model.js').schema;
const candidatSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    birthday :{
        type : Date,
        required : true
    },
    pays : {
        type : String,
        required : true
    },
    etude : {
        type : String,
        required : true
    },
    experience : {
        type : String,
        required : true
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
    },
    avis : [avisSchema]
});
module.exports = mongoose.model('candidat',candidatSchema);