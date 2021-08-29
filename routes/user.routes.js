const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controllers');


//router users

router.post('/signup',userCtrl.signup);

module.exports = router;