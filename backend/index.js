const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { MongoClient } = require('mongodb');
const path = require('path')

dotenv.config();
const client = new MongoClient(process.env.DB_CONNECT);
//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser:true},
     ()=> {
    console.log('Connected to DB!');
    
})

app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended : false}));

//Import Routes
const authRoute = require('./routes/auth');
const candidatRoute = require('./routes/candidat.route');
const recruteurRoute = require('./routes/recruteur.route');
const offreRoute = require('./routes/offre.route');
const avisRoute = require('./routes/avis.route');

app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/candidat',candidatRoute);
app.use('/api/recruteur',recruteurRoute);
app.use('/api/offres',offreRoute);
app.use('/api/avis',avisRoute);

app.use('/uploads',express.static('uploads'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)


app.listen(3000, () => console.log('Server Up and running'));
