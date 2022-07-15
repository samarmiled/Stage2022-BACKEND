const cors = require('cors');
const router = require ('express').Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const  Avis = require('../models/avis.model');
const {registerValidation} = require('../registerValidation');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fileupload = require("express-fileupload");

router.get('/all', async(req,res) => {
    try{
        const avis = await Avis.find()
        res.json(avis)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});
module.exports = router;