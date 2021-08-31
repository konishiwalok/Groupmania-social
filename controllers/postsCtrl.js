const db = require("../models/index");
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const asyncLib = require('async');

//creating post PO
exports.createPost = (req, res, next) => {

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    asyncLib.waterfall([

        // Get the user to be linked with the post
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

        // If found, create the post with inputs
        function(userFound, done) {
            if (userFound) {
                Post.create({
                        content: req.body.content,
                        imageUrl: imageUrl,
                        UserId: userFound.id
                    })
                    .then(function(newPost) {
                        done(newPost);
                    });
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        },

        // if done, confirm it
    ], function(newPost) {
        if (newPost) {
            return res.status(201).json(newPost);
        } else {
            return res.status(500).json({ 'error': 'cannot send post' });
        }
    })
};