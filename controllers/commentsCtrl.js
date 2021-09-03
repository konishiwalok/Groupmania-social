const db = require("../models/index");
const Comment = db.comment;
const User = db.user;
const asyncLib = require("async");

// CREATE COMMENT  POST

exports.createComment = (req, res, next) => {
  const content = req.body;

  if (content == null) {
    return res.status(400).json({ error: "missing body" });
  }

  asyncLib.waterfall(
    [
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
        if (userFound) {
          Comment.create({
            content: req.body.content,
            UserId: userFound.id,
            postId: req.params.id,
          })
            .then(function (newComment) {
              done(newComment);
            })
            .catch(() =>
              res.status(400).json({ message: "erreur commentaire controller" })
            );
        } else {
          res.status(404).json({ error: "user not found" });
        }
      },
    ],
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

(exports.getAllComments = (req, res, next) => {
  Comment.findAll({
    include: [
      {
        model: User,
        attributes: ["pseudo", "imageUrl", "isAdmin"],
      },
    ],
  })
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
          Comment.findOne({
            where: { id: req.params.id },
          })
            .then(function (commentFound) {
              done(null, userFound, commentFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Comment not found" });
            });
        },

        function (userFound, commentFound, done) {
          if (
            userFound.id == commentFound.userId ||
            userFound.isAdmin == true
          ) {
            Comment.destroy({
              where: { id: req.params.id },
            })
              .then(() =>
                res.status(200).json({ message: "Comment supprimé !" })
              )
              .catch((error) => res.status(400).json({ error }));
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
  });
