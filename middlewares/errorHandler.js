const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  next();
};

module.exports = errorHandler;
