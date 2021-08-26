//Path: /api/user
const { Router } = require("express");
const { check } = require("express-validator");

const passwordVerify = require("../middleware/password");

const userCtrl = require("../controllers/auth.controller");
const { validator } = require("../middleware/validator");

const router = Router();
router.post(
  "/signup",

  [
    check("email", "Le courrier est obligatoire").isEmail(),
    check("password", "Le mot de passe est obligatoire").not().isEmpty(),
    validator,
  ],
  passwordVerify,
  userCtrl.signup
);
router.post(
  "/login",
  [
    check("email", "Le courrier est obligatoire").isEmail(),
    check("password", "Le mot de passe est obligatoire").not().isEmpty(),
    validator,
  ],
  userCtrl.login
);

module.exports = router;
