const express= require('express');
const usersCtrl= require('./routes/usersCtrl');

//router 

exports.router = (function(){
    const apiRouter = express.Router(); 

//users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);

return apiRouter;

})
();