const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentsCtrl = require('../controllers/commentsCtrl');

router.post('/:id/comment', auth, commentsCtrl.createComment);
router.get('/comment', auth, commentsCtrl.getAllComments);


module.exports = router;