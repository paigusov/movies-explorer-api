const authRoutes = require("express").Router();
const { login, createUser } = require("../controllers/users");
authRoutes.post("/signin", login);
authRoutes.post("/signup", createUser);

module.exports = authRoutes;
