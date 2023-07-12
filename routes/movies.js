const moviesRoutes = require("express").Router();

const { getAllMovies, createMovie, deleteMovie } = require("../controllers/movies");
const { validateCreateMovie, validateDeleteMovie } = require("../middlewares/validation")
moviesRoutes.get("/", getAllMovies);
moviesRoutes.post("/", validateCreateMovie, createMovie);
moviesRoutes.delete("/:movieId", validateDeleteMovie, deleteMovie);

module.exports = moviesRoutes;