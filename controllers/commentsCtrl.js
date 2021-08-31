const db = require("../models/index");
const Comment = db.comment;
const User = db.user;
const asyncLib = require('async');

// CREATE COMMENT  POST

exports.createComment = (req, res, next) => {

   
    const content = req.body;

    if (content == null) {
        return res.status(400).json({ 'error': 'missing body' });
    }

    asyncLib.waterfall([

        //  Get the user to be linked with the post
        function(done) {
            User.findOne({
                    where: { id: req.body.userId }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },

        // If found, create comment with input
        function(userFound, done) {
            if (userFound) {
                // Create the post and save it in DB
                Comment.create({
                        content: req.body.content,
                        UserId: userFound.id,
                        postId: req.params.id,
                    })
                    .then(function(newComment) {
                        done(newComment)
                    })
                    .catch(() => res.status(400).json({ message: "erreur commentaire controller" }));
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        },

        // if done, confirm it
    ], function(newComment) {
        if (newComment) {
            return res.status(201).json(newComment);
        } else {
            return res.status(500).json({ 'error': 'cannot send comment' });
        }
    })
};

// GET COMMENTS_CTRL

exports.getAllComments = (req, res, next) => {

        Comment.findAll({
                include: [{ // Links the post with User and Comments tables
                    model: User,
                    attributes: ['pseudo', 'imageUrl', 'isAdmin']
                }]
            })
            .then((comment => res.status(200).json(comment)))
            .catch(() => res.status(400).json({ error: "Erreur lors de l'affichage des commentaires" }));
    },