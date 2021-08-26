require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const rateLimit = require("express-rate-limit");
// const { dbConnection } = require('./database/config');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const session = require('express-session');
app.use(session({
secret:'secret',
resave: true,
saveUninitialized:true
}));

const dbconnection = require('./database/db');



app.use( express.json() );


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

// Sauce
app.use('/api/auth', require('./routes/auth.routes'));


// Reading and parsing the body

module.exports = app;