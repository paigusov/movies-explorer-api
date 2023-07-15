const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { CORS } = require('./middlewares/corserr');
const router = require("./routes/index")
const { errors } = require("celebrate");
const NotFound = require("./errors/NotFound");
const helmet = require("helmet")
const limiter  = require('./middlewares/ratelimiter')

app.use(CORS);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet())
app.use(limiter)
mongoose.connect("mongodb://localhost:27017/yafilmsdb", {});

app.use("/", router);
app.use((req, res, next) => {
  next(new NotFound("Страница не найдена"));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});
app.listen(3000, () => {
  console.log('test')
});