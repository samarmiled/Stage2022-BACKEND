const { date } = require('@hapi/joi/lib/template');
const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
    },
    reviews : {
        type : Number,
        required : true
    },
});
module.exports = mongoose.model('avis',avisSchema);