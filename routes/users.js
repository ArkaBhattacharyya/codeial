const express = require('express');
const routes = express.Router();
const passport = require('passport');
const userController = require('../controllers/users_controller');


routes.get('/profile/:id', passport.checkAuthentication, userController.profile);

routes.post('/update/:id', passport.checkAuthentication, userController.update);

routes.get('/sign-up', userController.signUp);
routes.get('/sign-in', userController.signIn);

routes.post('/create', userController.create);

routes.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}, 
    ) , userController.createSession);

routes.get('/sign-out', userController.destroySession);


module.exports = routes;