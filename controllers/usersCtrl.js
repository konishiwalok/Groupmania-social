const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;
require("dotenv").config();

const asyncLib = require("async");

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


//POST SIGNUP

exports.signup = async (req, res, next) => {
  // on declare une varaible  ,on le cherche dans l'objet request + dans le body et on recuperara le parametre declare 
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  const password = req.body.password;
  const imageUrl = "https://pic.onlinewebfonts.com/svg/img_24787.png";

  //conditions on verifie si les parametres sont obligatoires , si sont vides ou pas et on returne une error 400
  if (
    req.body.pseudo == null ||
    req.body.email == null ||
    req.body.password == null
  ) {
    return res
      .status(400)
      .json({ error: "Merci de renseigner tous les champs !" });
  }
   //conditions on verifie les varibles = si le pseudo  est egale / superieur a 13 caracteres AND le pseudo soit inferieur/egale a 4  et on renvoie une erreur 400 si les conditions ne sont pas respectes 
  if (req.body.pseudo.length >= 13 || req.body.pseudo.length <= 4) {
    return res
      .status(400)
      .json({ error: "wrong pseudo (must be length 5 - 12)" });
  }
  // on utlise regex pour le format email pour verifier si l'email est valide ou non (Securite)  et s il est different on renvoit une erreur 
  if (!EMAIL_REGEX.test(req.body.email)) {
    return res.status(400).json({ error: "email is not valid" });
  }

  // async-waterfall permet d'exécuter une série de fonctions (+lisible + agreable a faire )
  asyncLib.waterfall(
    [
      //verifie si l utilisateur existe deja 
      function (done) {
        // done = main parameter
        User.findOne({
          attributes: ["email"],
          where: { email: email },
        })
          .then(function (userFound) {
            // userFound sera le prochain parametre
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      //on verifie si l utilisateur existe, sil existe pas en retourne une erreur comflit en disant aue l'utilisateur est deja present sur la base de donnes + on va sale et hasher le mot de passe pour etre sur aue personne puisse le decrypte  = 12  par defaut et conseiller
      function (userFound, done) {
        if (!userFound) {
          bcrypt.hash(password, 12, function (err, bcryptedPassword) {
            // new param to add next
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ error: "user already exist" });
        }
      },

      // Creatation utilisateur en base des donnes 
      function (userFound, bcryptedPassword, done) {
        // creation de nouvelle utlisateur avec les proprietes de bd (email, pseudo )
        let newUser = User.create({
          email: email,
          pseudo: pseudo,
          imageUrl: imageUrl,
          password: bcryptedPassword,
          isAdmin: 0,
        })
          .then(function (newUser) {
            done(newUser); // function suivante pour nouvel utilisateur
          })
          .catch(function (err) {
            return res.status(500).json({ error: "cannot add user" });
          });
      },
    ],

    //(s il n y aucun erreur 201 par defaut dans la methode post )on retourne un nouvel utilisateur avec son id qui sera stoke dans user.db +  on return une erreur error 
    
    function (newUser) {
      if (newUser) {
        return res.status(201).json({
          userId: newUser.id,
        });
      } else {
        return res.status(500).json({ error: "cannot add user" });
      }
    }
  );
};

//POST LOGIN

exports.login = (req, res, next) => {
  // on recupere les parametres pour se connecter
  const email = req.body.email;
  const password = req.body.password;
//verification si les deux paremetres sont correctes ou pas
  if (email == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  asyncLib.waterfall(
    [
      //on verifie si l'utilisateur existe deja ou pas avec son email
      function (done) {
        User.findOne({
          where: { email: email },
        })
          .then(function (userFound) { //function suivante 
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },

      // verifie si l'utilisateur existe sans le ! pour passer directemet sur le return  , et on verifie si l'utilisateur a saisi le bon mot de passe avec bcrypt.compare qui est stoke sur la bd//
      function (userFound, done) {
        if (userFound) {
          bcrypt.compare(
            password,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            }
          );
        } else {
          return res.status(404).json({ error: "user not exist in DB" });
        }
      },

       // si le hashage coincide on lui donne acces a user
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ error: "invalid user or password ,try again" });
        }
      },

     // si utilisisateur saisi le bon mot de passe  returnera l utilisateur ainsi que le token  + on appelle notre jwt qui expira en 3h + on stoker et verfie si l utilisateur est adminitrateur sinon , sinon erreur 500//
    ],
    function (userFound) {
      if (userFound) {
        return res.status(200).json({
          userId: userFound.id,
          token: jwt.sign({ userId: userFound.id }, process.env.DB_TOKEN, {
            expiresIn: "3h",
          }),
          isAdmin: userFound.isAdmin,
        });
      } else {
        return res.status(500).json({ error: "cannot log on user" });
      }
    }
  );
};


//GET /profile
// recupere les  informations d un seul utilisateur et on precise les attributes qu on veut recuperer
exports.findOne = (req, res, next) => {
  // where : on va presiser qu on vet recuperer de l'user id preciser dans le token  
  User.findOne({
    attributes: ["id", "email", "pseudo", "imageUrl", "isAdmin"],
    where: { id: req.body.userId },
  })
    .then((user) => { //dans le then on affiche l'utilisateur une fois que celui ci a etait recupere
      if (user) {
        res.status(201).json(user); // confirm if found
      } else {
        res.status(404).json({ error: "user not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "cannot fetch user" });
    });
};


//GET juste admin true va acceder
exports.findAll = (req, res) => {
  asyncLib.waterfall(
    [
      // on recupere l'utilisateur dans la base des donnes avec son id pour retrouver un utilisateur precis + celui preciser dans le token 
      function (done) {
        User.findOne({
          where: { id: req.body.userId },
        })
          .then(function (userFound) {
            done(null, userFound); //l'utilisateurva etre retourne dans l userfound et on passe a a fonction  
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      // 2. si on le trouve  on va recevoir tous les utlisisateurs  par son pseudo et id et juste le admin pourra avoir acess 
      function (userFound, done) {
        if (userFound && userFound.isAdmin == 1) {
          User.findAll({
            attributes: [
              "id",
              "pseudo",
              "email",
              "imageUrl",
              "isAdmin",
              "createdAt",
            ],
          })
            .then(function (users) {
              done(users);
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "invalid fields" });
            });
        } else { // si il est pas administrateur 
          res.status(404).json({ error: "user not allowed" });
        }
      },
      // 3.si cest bon on le confirme
    ],
    function (users) {
      if (users) {
        return res.status(201).json(users);
      } else {
        return res.status(500).json({ error: "cannot send users" });
      }
    }
  );
};

//MODIFY


exports.update = async (req, res, next) => {
  // Parametres
  const pseudo = req.body.pseudo;
  const email = req.body.email;
  const password = req.body.password;
  const imageUrl =
    req.body && req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : null;

  const emailExists = await User.findOne({ where: { email: email } });
  const pseudoExists = await User.findOne({ where: { pseudo: pseudo } });

  if (emailExists != null || pseudoExists !== null) {
    return res.status(406).json({ error: "Email already registered" });
  } else {
    asyncLib.waterfall(
      [
        // Checks if the request is sent from an registered user
        function (done) {
          User.findOne({
            where: { id: req.body.userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },

        function (userFound, done) {
          // Checks if the user is the owner of the targeted one
          if (userFound.id == req.body.userId) {
            // If the request got a password
            if (password !== "") {
              bcrypt.hash(password, 12).then((hash) => {
                userFound
                  .update({
                    pseudo: pseudo ? pseudo : userFound.pseudo,
                    email: email ? email : userFound.email,
                    password: hash,
                    imageUrl: imageUrl ? imageUrl : userFound.imageUrl,
                  })
                  .then(function () {
                    done(userFound);
                  })
                  .catch(function (err) {
                    res.status(500).json({ error: "cannot update user" });
                  });
              });
              // If not
            } else if (password == "") {
              userFound
                .update({
                  pseudo: pseudo ? pseudo : userFound.pseudo,
                  email: email ? email : userFound.email,
                  imageUrl: imageUrl ? imageUrl : userFound.imageUrl,
                  password: userFound.password,
                })
                .then(function () {
                  done(userFound);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "cannot update user" });
                });
            } else {
              res.status(404).json({ error: "user not found" });
            }
          } else {
            res.status(401).json({ error: "user not allowed" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    );
  }
};


//DELATE


exports.delete = (req, res, next) => {
  asyncLib.waterfall(
    [
      // Checks if the request is sent from an registered user
      function (done) {
        User.findOne({
          where: { id: req.body.userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },

      function (userFound, done) {
        // Checks if the user is the owner of the targeted one
        if (userFound.id == req.body.userId || userFound.isAdmin == true) {
          // or if he's admin

          // Soft-deletion modifying the post the ad a timestamp to deletedAt
          User.destroy({
            where: { id: req.params.id },
          })
            .then(() =>
              res.status(200).json({ message: "Utilisateur supprimé" })
            ) // send confirmation if done
            .catch((error) =>
              res.status(500).json({ error: "cannot delete user" })
            );
        } else {
          res.status(401).json({ error: "user not allowed" });
        }
      },
    ],

    function (userFound) {
      if (userFound) {
        return res.status(201).json({ message: "profile deleted" });
      } else {
        return res.status(500).json({ error: "cannot delete profile" });
      }
    }
  );
};
