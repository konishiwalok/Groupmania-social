const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postsCtrl = require('../controllers/postsCtrl');

router.post('/new', auth, multer, postsCtrl.createPost);


module.exports = router;