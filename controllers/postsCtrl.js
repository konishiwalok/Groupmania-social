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
          Post.create({
            content: req.body.content,
            imageUrl: imageUrl,
            UserId: userFound.id,
          }).then(function (newPost) {
            done(newPost);
          });
        } else {
          res.status(404).json({ error: "user not found" });
        }
      },
    ],
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

exports.findAll = (req, res) => {
  const fields = req.query.fields;
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const order = req.query.order;

  if (limit > ITEMS_LIMIT) {
    limit = ITEMS_LIMIT;
  }

  asyncLib.waterfall(
    [
      function (done) {
        Post.findAll({
          order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
          attributes:
            fields !== "*" && fields != null ? fields.split(",") : null,
          limit: !isNaN(limit) ? limit : null,
          offset: !isNaN(offset) ? offset : null,
          include: [
            {
              model: User,
              Comment,
              attributes: ["pseudo", "imageUrl", "isAdmin"],
            },
          ],
        })
          .then(function (posts) {
            done(posts);
          })
          .catch(function (err) {
            console.log(err);
            res.status(500).json({ error: "invalid fields" });
          });
      },
    ],
    function (posts) {
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
        Post.findOne({
          where: { id: req.params.id },
        })
          .then(function (postFound) {
            done(null, userFound, postFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "Post not found" });
          });
      },

      function (userFound, postFound) {
        if (userFound.id == postFound.userId || userFound.isAdmin == true) {
          Post.destroy({
            where: { id: req.params.id },
          })
            .then(() => res.status(200).json({ message: "Post supprimé !" }))
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
