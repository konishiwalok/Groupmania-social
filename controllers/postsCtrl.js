const db = require("../models/index");
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const asyncLib = require("async");
const ITEMS_LIMIT = 50;


//creating post POST

exports.createPost = (req, res, next) => {
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null;
//identifier l'utilisateur qui souhaite poster et on passe a la suivante fonction grace a done
  asyncLib.waterfall(
    [//where : on recupere dans la base de donnes notre utilisateur
      function (done) {
        User.findOne({
          where: { id: req.body.userId },
        })
          .then(function (userFound) {
            done(null, userFound);//utilisateur a etait trouve et on passe a la fonction suivante
          })
          .catch(function (err) {//pas trouve et on envoie une erreur
            return res.status(500).json({ error: "unable to verify user" });
          });
      },//on recupere les parametres pour creer le post + methode create qui va prendre en argument un objet = proprietes de le post +  UserId : la relation entre users+post pour les lier
      function (userFound, done) {
        if (userFound) {
          Post.create({
            UserId: userFound.id,
            content: req.body.content,
            imageUrl: imageUrl,
           //newpost est l'objet qu'on a cree et on passe a la derniere fonction
          }).then(function (newPost) {
            done(newPost);
          });
        } else {
          res.status(404).json({ error: "user not found" });
        }
      },
    ],//permet d'afficher a l"utilisateur si son post a etait bien poster ou pas avec une erreur 500
    function (newPost) {
      if (newPost) {
        return res.status(201).json(newPost);
      } else {
        return res.status(500).json({ error: "cannot send post" });
      }
    }
  );
};




// FINDPOST GET

//On recupere les parametres 
exports.findAll = (req, res) => {
  const fields = req.query.fields;//permet de selectioner les colomnes que l'on souhiate afficher
  const limit = parseInt(req.query.limit);//permet de recuperer les messages par segmentation 
  const offset = parseInt(req.query.offset);
  const order = req.query.order;//permet de sortir la liste des messages via un ordre particulier

  if (limit > ITEMS_LIMIT) {
    limit = ITEMS_LIMIT;
  }

  asyncLib.waterfall(
    [//on recupere tout les posts + on utilise methode findAll et elle prend tant que premiere parametre tous les attributs que l'on va passer dans notre requete
      function (done) {
        Post.findAll({//on s'assure que l'utilisateur rentre des donnes correctes = on s'assure qu'ils ne soient pas null si cest le cas on va pouvoir exploiter les donnes sinon  on va mettre des donnes par defaut
          order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
          attributes: 
            fields !== "*" && fields != null ? fields.split(",") : null,
          limit: !isNaN(limit) ? limit : null,
          offset: !isNaN(offset) ? offset : null,
          include: [
            {// on inclu la relation directe avec la table user et comment et on precise les attributs que l'on va afficher 
              model: User,
              Comment,
              attributes: ["pseudo", "imageUrl", "isAdmin"],
            },
          ],
        })
          .then(function (posts) {//on passe a la derniere fonction POSTS
            done(posts);
          })
          .catch(function (err) {
            console.log(err);
            res.status(500).json({ error: "invalid fields" });
          });
      },
    ],
    function (posts) { // on retourne les posts qui sont recupere via le serveur , on verifie si la valeur n'est pas null si cest le cas on retourne en statue 201 'reussie' et on formate tout les donnes en json
      if (posts) {
        return res.status(201).json(posts);
      } else {
        return res.status(500).json({ error: "cannot send post" });
      }
    }
  );
};

//DELETE POST-DELETE

exports.deletePost = (req, res, next) => {
  asyncLib.waterfall(
    [//Vérifie si la demande est envoyée par un utilisateur enregistré
      function (done) {
        User.findOne({// on utilise la methode findone pour preciser l'utilisateur + where : on va presiser qu on vet recuperer de l'user id preciser dans le token
          where: { id: req.body.userId },
        })
          .then(function (userFound) {
            done(null, userFound);// on passe au function suivante  
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },//on va trouver l'utilisateur dans la requete des parametres 
      function (userFound, done) {
        Post.findOne({
          where: { id: req.params.id },
        })
          .then(function (postFound) { // on passe au function suivante  
            done(null, userFound, postFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "Post not found" });
          });
      },
//condition de verification pour etre sur de avoir le bon post +bon usager, ou si administrateur est true on pourra supprimir avec la methode destroy grace a where
      function (userFound, postFound) {
        if (userFound.id == postFound.userId || userFound.isAdmin == true) {
          Post.destroy({ // Soft-deletion permet de modifier et ajouter au tableau AdDelete dans la base des donnes
            where: { id: req.params.id },
          })
            .then(() => res.status(200).json({ message: "Post supprimé !" })) //en renvoie un status 200 pour 'sucess comment supprime ' ou erreur 400 
            .catch((error) =>
              res
                .status(400)
                .json({ message: "Post introuvable", error: error })
            );
        } else {
          res.status(401).json({ error: "user not allowed" });
        }
      },
    ],

    function (userFound) {
      if (userFound) {
        return res.status(201).json({ message: "post deleted" });
      } else {
        return res.status(500).json({ error: "cannot delete post" });
      }
    }
  );
};
