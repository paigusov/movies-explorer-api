const User = require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFound = require("../errors/NotFound"); // 404
const BadRequest = require("../errors/BadRequest"); // 400
const ConflictError = require("../errors/ConflictError"); // 409
const AuthError = require("../errors/AuthError"); // 401
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Юзер не найден')
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный id`,
        });
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req._id,
    { name },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Переданы некорректные данные"));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Неверный логин или пароль");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError("Неверный логин или пароль");
        }
        return res.send(jwt.sign({ _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" })
        )
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash
      })
    )
    .then(() => res.send({ name, email }))
    .catch((err) => {
      if (err.name === "MongoServerError" || err.code === 11000) {
        return next(
          new ConflictError("Пользователь с таким email уже существует")
        );
      }
      if (err.name === "ValidationError") {
        return next(new BadRequest("Некорректные данные"));
      }
      return next(err);
    });
};