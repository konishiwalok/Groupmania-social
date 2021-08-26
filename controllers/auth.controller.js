const bcrypt = require("bcryptjs");
const cryptojs = require('crypto-js');
const models = require('../models/user');

const { generateJWT } = require("../helpers/jwt");

exports.signup = (req, res, next) => {


  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const bio = req.body.bio;
  
  const cryptedResearchedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
 User.findOne({ email: cryptedResearchedEmail })
    .then(user => {
      if (user) {
        return res.status(401).json({
          ok: false,
          msg: 'utilisateur déjà enregistré'
        });
      }
      bcrypt.hash(req.body.password, 10)
        .then(hash => {

          const user = new User({
            email: cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString(), // cryptage de l'email, méthode 'HmacSHA256' SANS salage (pour pouvoir ensuite rechercher l'utilisateur simplement lors du login),
            // password: hash,
            // firstName: firstName,
            // lastName: lastName,
            // bio: bio,
            // isAdmin: 0,
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));



};

exports.login = (req, res, next) => {
  const cryptedResearchedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
 User.findOne({ email: cryptedResearchedEmail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          generateJWT(user._id)
            .then(token => {
              res.status(200).json({
                userId: user._id,
                token
              });
            })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

