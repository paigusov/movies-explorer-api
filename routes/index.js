const express = require("express")
const router = express.Router();
const auth = require("../middlewares/auth");
const userRoutes = require("./users");
const moviesRoutes = require("./movies");
const authRouters = require("./auth");

router.use("/", authRouters);

router.use(auth);
router.use("/users", userRoutes);
router.use("/movies", moviesRoutes);

module.exports = router;