const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models/user');

//routes

module.exports = {
  register: function (req, res) {


    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ error: "missing parameters" });
    }
    
    //verify pseudo lengths, email regex , password
    models.User.findOne({
      attributes: ['email'],
      where: { email: email }
    })
    
    .then(function (UserFound) { 
        if(!UserFound) {

          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            const newUser = models.User.create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: bycryptedPassword,
              bio: bio,
              isAdmin: 0,
            })
            .then(function (newUser) {
              return res.status(201).json({ 'userId': newUser.id })
            })
            .catch(function (err) {
              return res.status(500).json({ 'error': 'Cannot add user'});
            });
          });

        } else {
            return res.status(409).json({'error': 'user already exists'});
        }

    })
    .catch(function (err) {
        return res.status(500).json({'error': 'cannot add user' });
    });
},
login: function (req, res) {

}
}

