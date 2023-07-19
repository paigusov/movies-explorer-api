const authRoutes = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');

authRoutes.post('/signin', validateLogin, login);
authRoutes.post('/signup', validateCreateUser, createUser);

module.exports = authRoutes;
