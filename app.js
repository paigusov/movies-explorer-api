const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config();
const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { CORS } = require('./middlewares/corserr');
app.use(CORS)
const { errors } = require("celebrate");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const auth = require("./middlewares/auth");
app.use(requestLogger);

mongoose.connect("mongodb://localhost:27017/yafilmsdb", {});

app.use("/", require("./routes/auth"))
// app.use(auth)
app.use("/", require("./routes/index"));

app.use((req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
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