const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postsCtrl = require('../controllers/postsCtrl');

router.post('/new', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.findAll);
router.delete('/:id', auth, postsCtrl.deletePost);

module.exports = router;