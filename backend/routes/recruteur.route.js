const cors = require('cors');
const router = require ('express').Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Offre = require('../models/offre.model')
const {registerValidation} = require('../registerValidation');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    fs.mkdir('./uploads/',(err)=>{
        cb(null, './uploads/');
     });
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Créer Compte
router.post('/register',async (req,res) => {

    //validate data
    //const {error} = registerValidation(req.body)
    //if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already exist
    const emailExist = await Recruteur.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
       
            const recruteur= new Recruteur({
                fullname : req.body.fullname,
                phone : req.body.phone,
                email : req.body.email,
                password : hashedPassword,
            
            });
        
    
    try{
        const saveRecruteur = await recruteur.save();
        res.send({recruteur: recruteur.id});
    } catch(err){
        res.status(400).send(err);
    }
});


//S'authentifier
router.post('/login', async (req,res) => {
    //const {error} = loginValidation(req.body)
    //if(error) return res.status(400).send(error.details[0].message);

    //Check if the mail exists
    //Checking if the user is already exist
    const recruteur = await Recruteur.findOne({email: req.body.email})
    if(!recruteur) return res.status(400).send('Email id not found');
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, recruteur.password);
    if(!validPass) return res.status(400).send('Invalid Password !');
    
    // Create token
    const token = jwt.sign({id: recruteur.id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    
});

//Update Data
router.patch('/:id', async(req,res)=> {
    try{
        const id = req.params.id;
        
        const options = { new : true };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const updatedData = {
            fullname : req.body.fullname,
            phone : req.body.phone,
            email : req.body.email,
            password : hashedPassword
        }

        const result = await Recruteur.findByIdAndUpdate(
            id, updatedData, options

        )
        res.send(result)

    }catch(err){
        res.status(400).send('Error ' + err)
    }
});
router.get('/:id', async(req,res) => {
    try{
        const recruteur = await Recruteur.findById(req.params.id)
        res.json(recruteur)

    }catch(err){
        res.send('Error ' + err)
    }
});

//Delete Account
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Recruteur.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

//Ajouter offre emploi
router.post('/ajoutOffre',upload.single('image'),async (req,res) => {
    console.log(req.file)
            const offre= new Offre({
                name : req.body.name,
                date_creation : req.body.date_creation,
                date_expiration : req.body.date_expiration,
                domaine : req.body.domaine,
                adresse : req.body.adresse,
                image : req.file.path
            
            });
        
    try{
        offre.save().then(result => {
            console.log(result);
            res.status(201).json({
              message: "Created successfully",
              createdOffre: {
                  name: result.name,
                  _id: result._id,
                  request: {
                      type: 'GET',
                      url: "http://localhost:3000/api/offres/" + result._id
                  }
              }
            });
          })
    } catch(error){
        res.status(400).json({ message: error.message })

    }
});

//Modifier offre

router.patch('/offre/:id', async(req,res)=> {
    try{
        const id = req.params.id;
        
        const options = { new : true };
        
        const updatedData = req.body;

        const result = await Offre.findByIdAndUpdate(
            id, updatedData, options

        )
        res.send(result)

    }catch(err){
        res.status(400).send('Error ' + err)
    }
});

//Delete OFFre
router.delete('/offre/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Offre.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

//Rechercher offre
router.get('/offre/date', async (req,res) => {
    try {
        const data = await Offre.find({date_creation: {
            $gte: new Date("2022-06-15"),
            $lt: new Date("2022-07-10")
        }});
        res.send(data);
    }catch (error){
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;