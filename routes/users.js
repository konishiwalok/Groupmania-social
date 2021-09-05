const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");


const validations = require('../middleware/validations');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const usersCtrl = require('../controllers/usersCtrl');

//limite le nombre de tentatives de connection par 5 fois et bloque 5 min 

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 55,
    message: " Trop de tentatives échouées, réessayez dans 5 minutes",
});

// ----------  USERS ROUTES  ----------  //

//methode router, le 1ere argument on reseigne la route , + validations de securite + le verbe HTTp sera signup +La fonction a executer

router.post('/signup',validations , usersCtrl.signup);
router.post('/login', rateLimiter, usersCtrl.login);
router.get('/profile', auth, usersCtrl.findOne);
router.get('/', auth, usersCtrl.findAll);
router.put('/:id', auth, multer, usersCtrl.update);
router.delete('/:id', auth, usersCtrl.delete);

//on exportera les routes 

module.exports = router;