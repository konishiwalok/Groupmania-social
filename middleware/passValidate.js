const schema = require("../models/password");

module.exports = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        res.status(401).json({
            error: ('Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces !')
        });
    } else {
        next();
    }
};