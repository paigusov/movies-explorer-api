const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRouters = require('./auth');
const NotFound = require('../errors/NotFound');

router.use('/', authRouters);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
