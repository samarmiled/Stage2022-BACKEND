const cors = require('cors');
const router = require ('express').Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {registerValidation,loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
router.post('/register', async (req,res) => {
    //validate data
    const {error} = registerValidation(req.body)
    
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the user is already exist
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    const user = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    });
    try{
        const saveUser = await user.save();
        res.send({user: user.id});
    } catch(err){
        res.status(400).send(err);
    }
});
router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the mail exists
    //Checking if the user is already exist
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email id not found');
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password !');
    
    // Create token
    const token = jwt.sign({id: user.id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    



});


module.exports = router;