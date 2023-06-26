const express = require('express');
const routes = express.Router();
const userController = require('../controllers/users_controller');


routes.get('/profile', userController.profile);


module.exports = routes;