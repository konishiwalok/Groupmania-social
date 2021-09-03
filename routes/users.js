const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");


const validations = require('../middleware/validations');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const usersCtrl = require('../controllers/usersCtrl');


const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 55,
    message: " Trop de tentatives échouées, réessayez dans 5 minutes",
});

// ----------  USERS ROUTES  ----------  //
router.post('/signup',validations , usersCtrl.signup);
router.post('/login', rateLimiter, usersCtrl.login);
router.get('/profile', auth, usersCtrl.findOne);
router.get('/', auth, usersCtrl.findAll);
router.put('/:id', auth, multer, usersCtrl.update);
router.delete('/:id', auth, usersCtrl.delete);

module.exports = router;