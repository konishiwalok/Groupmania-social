const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postsCtrl = require('../controllers/postsCtrl');


// ROUTES POSTS  //

//methode router, le 1ere argument on renseigne la route , + validations de securite + le verbe HTTp sera createPost +La fonction a executer

router.post('/new', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.findAll);
router.delete('/:id', auth, postsCtrl.deletePost);

module.exports = router;