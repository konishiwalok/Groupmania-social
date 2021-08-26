const jwt = require("jsonwebtoken")

const generateJWT = ( uid ) => {

    return new Promise((resolve, reject) => {

        // and can add more different fields to the uid, 
        //such as name etc, (do not send sensitive info)
        const payload = {
            userId: uid,
        }
        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '3h'
        }, (err, token) => {
            if (err){
                console.log(err);
                reject('Impossible de générer le JWT');
            } else {
                resolve(token); 
            }

        });
    });
}

module.exports = {
    generateJWT
}