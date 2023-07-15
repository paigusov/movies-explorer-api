const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const ConflictError = require("../errors/ConflictError");
const Schema = mongoose.Schema
const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "invalid email"]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
},
)

usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new ConflictError("Неправильная почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new ConflictError("Неправильная почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", usersSchema);