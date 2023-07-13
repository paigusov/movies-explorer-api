const mongoose = require('mongoose')
const validator = require('validator')
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
    default: ''
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
})

usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized("Неправильная почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Unauthorized("Неправильная почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", usersSchema);