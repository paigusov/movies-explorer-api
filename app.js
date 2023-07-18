const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { CORS } = require('./middlewares/corserr');
const router = require('./routes/index');
const NotFound = require('./errors/NotFound');
const limiter = require('./middlewares/ratelimiter');
const errorHandler = require('./middlewares/errorHandler');
const { MONGO_URL_DEV } = require('./utils/constants');

const { NODE_ENV, MONGO_URL, PORT = 3000 } = process.env;

app.use(CORS);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV);

app.use('/', router);
app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
