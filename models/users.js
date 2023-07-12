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

module.exports = mongoose.model("user", usersSchema);