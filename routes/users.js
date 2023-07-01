const express = require('express');
const routes = express.Router();
const userController = require('../controllers/users_controller');


routes.get('/profile', userController.profile);

routes.get('/sign-up', userController.signUp);
routes.get('/sign-in', userController.signIn);

routes.post('/create', userController.create);


module.exports = routes;