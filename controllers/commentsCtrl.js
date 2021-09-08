const db = require("../models/index");
const Comment = db.comment;
const User = db.user;
const asyncLib = require("async");

// CREATE COMMENT POST

exports.createComment = (req, res, next) => {
  const content = req.body;

  if (content == null) {
    return res.status(400).json({ error: "missing body" });
  }
//identifier l'utilisateur qui souhaite faire un commentaire et on passe a la suivante fonction grace a done
  asyncLib.waterfall(
    [//where : on recupere dans la base de donnes notre utilisateur
      function (done) {
        User.findOne({
          where: { id: req.body.userId },
        })
          .then(function (userFound) {
            done(null, userFound);//utilisateur a etait trouve et on passe a la fonction suivante
          })
          .catch(function (err) { //pas trouve et on envoie une erreur
            return res.status(500).json({ error: "unable to verify user" });
          });
      },//on recupere les parametres pour creer un commentaire + methode create qui va prendre en argument un objet = proprietes du commentaire +  UserId/postId : la relation entre users+post pour les lier
      function (userFound, done) {
        if (userFound) {
          Comment.create({
            UserId: userFound.id,
            postId: req.params.id,
            content: req.body.content,
          })
           //newpost est l'objet qu'on a cree et on passe a la derniere fonction
            .then(function (newComment) {
              done(newComment);
            })
            .catch(() =>
              res.status(400).json({ message: "erreur commentaire" })
            );
        } else {
          res.status(404).json({ error: "user not found" });
        }
      },
    ],//permet d'afficher a l"utilisateur si son commentaire a etait bien poster ou pas avec une erreur 500
    function (newComment) {
      if (newComment) {
        return res.status(201).json(newComment);
      } else {
        return res.status(500).json({ error: "cannot send comment" });
      }
    }
  );
};

// GET COMMENTS_CTRL

//on recupere tout les commentaires
(exports.getAllComments = (req, res, next) => {
  Comment.findAll({
    include: [
      { // on inclu la relation directe avec la table user et on precise les attributs que l'on va afficher 
        model: User,
        attributes: ["pseudo", "imageUrl", "isAdmin"],
      },
    ],
  }) // on retourne les commentaires qui sont recupere via le serveur , on verifie si la valeur n'est pas null si cest le cas on retourne en statue 200 'reussie' et on formate tout les donnes en json
    .then((comment) => res.status(200).json(comment))
    .catch(() =>
      res
        .status(400)
        .json({ error: "Erreur lors de l'affichage des commentaires" })
    );
}),
  // DELETE COMMENTS

  (exports.deleteComment = (req, res, next) => {
    asyncLib.waterfall(
      [
        function (done) {
          User.findOne({  // on utilise la methode findone pour preciser l'utilisateur + where : on va presiser qu on vet recuperer de l'user id preciser dans le token  
            where: { id: req.body.userId },
          })
            .then(function (userFound) {
              done(null, userFound);// on passe au function suivante  
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          Comment.findOne({ //  on cherche l'id dan la requete des parametres 
            where: { id: req.params.id },
          })
            .then(function (commentFound) {// on passe au function suivante  
              done(null, userFound, commentFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Comment not found" });
            });
        },

        function (userFound, commentFound, done) {
          if ( //condition pour verifier si l'utilisateur est le proprietaire du post id , ou si administrateur est true on pourra supprimir avec la methode destroy grace a where 
            userFound.id == commentFound.userId ||
            userFound.isAdmin == true
          ) {
            Comment.destroy({// Soft-deletion permet de modifier et ajouter au tableau AdDelete dans la base des donnes
              where: { id: req.params.id },
            })//en renvoie un status 200 pour 'sucess comment supprime ' ou erreur 400 
              .then(() =>
                res.status(200).json({ message: "Comment supprimé !" })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(401).json({ error: "user not allowed" });
          }
        },
      ],

      function (userFound) {  //on verifie si userfound est toujours valide si cest  le cas on returne une reponse 201 en dissant que que le commentaire e etait supprime
        if (userFound) {
          return res.status(201).json({ message: "post deleted" });
        } else {
          return res.status(500).json({ error: "cannot delete post" });
        }
      }
    );
  });
