const userRoutes = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { validateUpdateUserInfo } = require('../middlewares/validation');

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = userRoutes;
