const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const moviesRoutes = require("./movies");
const authRouters = require("./auth")

router.use("/users", userRoutes);
router.use("/movies", moviesRoutes);

router.use(express.json());

module.exports = router;