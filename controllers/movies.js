const { HTTP_STATUS_CREATED } = require('http2').constants;
const Movie = require('../models/movies');
const NotFound = require('../errors/NotFound'); // 404
const CurrentError = require('../errors/CurrentError'); // 403
const BadRequest = require('../errors/BadRequest'); // 400

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieid,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieid,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильма с таким id не существует');
      }
      if (req.user._id !== movie.owner.toHexString()) {
        throw new CurrentError('Вы не можете удалить чужой фильм');
      } else {
        return Movie.findByIdAndRemove(movie)
          .then(() => {
            res.send({ message: 'Фильм удалён' });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные удаления'));
      }
      return next(err);
    });
};
