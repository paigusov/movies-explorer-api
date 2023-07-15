const userRoutes = require("express").Router();
const { getUserInfo, updateUserInfo } = require("../controllers/users");

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', updateUserInfo);

module.exports = userRoutes;
