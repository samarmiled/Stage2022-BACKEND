const cors = require('cors');
const router = require ('express').Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Offre = require('../models/offre.model');
const {registerValidation} = require('../registerValidation');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fileupload = require("express-fileupload");
var path = require('path');

const fs = require('fs');

router.get('/all', async(req,res) => {
    try{
        const offre = await  Offre.find()
        res.json(offre)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});/* 
router.get("/image", (req, res, next) => {
    Offre.find()
      .select("image")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          offres: docs.map(doc => {
            return {
              image: doc.image,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/api/offres/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
    
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }); */
  /* let text = "hello smayer"
  router.get('/',(req,res) => {
    res.render('index.html',{message:text});

}); */
  router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Offre.findById(id)
      .select('image name domaine adresse')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.render('index.html',{image:doc.image,name:doc.name,adresse : doc.adresse});
            
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
                
router.get('/offre/:mc', async(req,res) => {
    try{
        const motcle = req.params.mc;
        const offre = await  Offre.find({
            $or : [
            {name : new RegExp(motcle)},
            {domaine : new RegExp(motcle)}
            ]
        
        });
        res.json(offre)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.get('/offre/:adresse', async(req,res) => {
    try{
        const adress = req.params.adresse;
        const offre = await  Offre.find({adresse : adress})
        res.json(offre)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.get('/offre/:domaine', async(req,res) => {
    try{
        const dmn = req.params.domaine;
        const offre = await  Offre.find({domaine : dmn})
        res.json(offre)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
});
module.exports = router;