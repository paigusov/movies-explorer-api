const Movie = require("../models/movies")
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
} = require("http2").constants;

module.exports.getAllMovies = (req, res) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка` }))
}

module.exports.createMovie = (req, res) => {
  const owner = req.user._id;
  Card.create(country,
  director,
  duration,
  year,
  description,
  image,
  trailerLink,
  thumbnail,
  movieid,
  nameRU,
  nameEN)
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка` });
      }
    });
};

module.exports.deleteMovie = (req, res) => {
  const owner = req.user._id;
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return res
          .status(HTTP_STATUS_FORBIDDEN)
          .send({ message: `Вы не можете удалить чужую карточку` });
      }
      if (!movie) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка не существует" });
      }
      res.send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      }
      if (err.name === "TypeError") {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: "Фильм не существует" });
      }
      if (err.message === "NotFound") {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: "Фильм не существует" });
        return;
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка` });
      }
    });
};