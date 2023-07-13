const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRoutes = require("./users");
const moviesRoutes = require("./movies");
const authRouters = require("./auth");

router.use("/", authRouters);

router.use(auth);
router.use("/users", userRoutes);
router.use("/movies", moviesRoutes);

router.use(express.json());

module.exports = router;