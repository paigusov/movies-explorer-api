const User = require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
} = require("http2").constants;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Юзер не найден`,
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный id`,
        });
      } else if (err.message === "NotFound") {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Юзер не найден`,
        });
      } else next(err);
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка` });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_CONFLICT).send({
          message: `Неверный логин или пароль`,
        });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.status(HTTP_STATUS_CONFLICT).send({
            message: `Неверный логин или пароль`,
          });
        }
        return res.send({
          token: jwt.sign({ _id: user._id }, "dev-secret", { expiresIn: "7d" }),
        });
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name
      })
    )
    // .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(HTTP_STATUS_CONFLICT).send({
          message: `Юзер с таким email уже существует`,
        });
      }
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка` });
      }
    });
};