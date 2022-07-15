const cors = require('cors');
const router = require ('express').Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Candidat = require('../models/candidat.model');
const Avis = require('../models/avis.model');
const {registerValidation} = require('../registerValidation');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fileupload = require("express-fileupload");
const { Double } = require('mongodb');

router.post('/register',async (req,res) => {
   /*  const newpath = __dirname + "/files/";
    const file = req.files.file;
    const filename = file.name; */

    //validate data
    //const {error} = registerValidation(req.body)
    //if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already exist
    const emailExist = await Candidat.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
       
            const candidat= new Candidat({
                fullname : req.body.fullname,
                birthday : req.body.birthday,
                pays : req.body.pays,
                etude : req.body.etude,
                experience : req.body.experience,
                email : req.body.email,
                password : hashedPassword,
            
            });
        
    
    try{
        const saveCandidat = await candidat.save();
        res.send({candidat: candidat.id});
    } catch(err){
        res.status(400).send(err);
    }
});
router.post('/login', async (req,res) => {
    //const {error} = loginValidation(req.body)
    //if(error) return res.status(400).send(error.details[0].message);

    //Check if the mail exists
    //Checking if the user is already exist
    const candidat = await Candidat.findOne({email: req.body.email})
    if(!candidat) return res.status(400).send('Email id not found');
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, candidat.password);
    if(!validPass) return res.status(400).send('Invalid Password !');
    
    // Create token
    const token = jwt.sign({id: candidat.id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    
});
router.patch('/:id', async(req,res)=> {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new : true };

        const result = await Candidat.findByIdAndUpdate(
            id, updatedData, options

        )
        res.send(result)

    }catch(err){
        res.status(400).send('Error ' + err)
    }
});
router.get('/:id', async(req,res) => {
    try{
        const candidat = await Candidat.findById(req.params.id)
        res.json(candidat)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.get('/all', async(req,res) => {
    try{
        const candidat = await Candidat.find()
        res.json(candidat)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Candidat.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Ajout Avis
router.post('/avis',async (req,res) => {
    const avis= new Avis({
        description : req.body.description,
        reviews : req.body.reviews
    });

try{
    const saveAvis = await avis.save();
res.send({avis: avis.description});
} catch(error){
res.status(400).json({ message: error.message })

}
});

module.exports = router;