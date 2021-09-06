const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentsCtrl = require('../controllers/commentsCtrl');


// ROUTES COMMENTAIRES  //

//methode router, le 1ere argument on renseigne la route , + validations de securite + le verbe HTTp sera createComment +La fonction a executer


router.post('/:id/comment', auth, commentsCtrl.createComment);
router.get('/comment', auth, commentsCtrl.getAllComments);
router.delete('/:id/comment', auth, commentsCtrl.deleteComment);


module.exports = router;