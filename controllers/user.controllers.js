
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// const db = require("../models/index");
// const User = db.user;
const User = require('../models/user');

require('dotenv').config();

const asyncLib = require('async');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// ----------  CRUD MODEL  ----------  //
exports.signup = async(req, res, next) => {

    // Params
    const email = req.body.email;
    const firstName = req.body.firstName;
    const password = req.body.password;

    // Checking if any of inputs are blanks
    if (req.body.firstName == null || req.body.email == null || req.body.password == null) {
        return res.status(400).json({ 'error': 'Merci de renseigner tous les champs !' });
    }
    // Checking required firstName length
    if (req.body.firstName.length >= 13 || req.body.firstName.length <= 4) {
        return res.status(400).json({ 'error': 'wrong firstName (must be length 5 - 12)' });
    }
    // Checking required email format
    if (!EMAIL_REGEX.test(req.body.email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
    }

    // Using Waterfall to enchain functions
    asyncLib.waterfall([

            // 1. Checks if User exists
            function(done) { // done = main parameter
                User.findOne({
                        attributes: ['email'],
                        where: { email: email }
                    })
                    .then(function(userFound) { // userFound will be next parameter
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },

            // 2. If not, Hash the password
            function(userFound, done) { // keeping done as main param and adding previous param
                if (!userFound) {
                    // 12 loops of encrypting (default recommended)
                    bcrypt.hash(password, 12, function(err, bcryptedPassword) { // new param to add next
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ error: 'user already exist' });
                }
            },

            // 3. Create User in DB
            function(userFound, bcryptedPassword, done) { // keeping previous params
                // Use the model to create a new User
                let newUser = User.create({
                        email: email,
                        firstName: firstName,
                        password: bcryptedPassword,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        done(newUser); // final param to use
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            }
        ],

        // 4. after created, return new User id
        function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
};

