const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema
const moviesSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    valudate: [validator.isUrl, "invalid URL"]
  },
  trailerLink: {
    type: String,
    required: true,
    valudate: [validator.isUrl, "invalid URL"]
  },
  thumbnail: {
    type: String,
    required: true,
    valudate: [validator.isUrl, "invalid URL"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  movieid: {
    type: Number,
    required: true
  },
  nameRU: {
    type: String,
    required: true
  },
  nameEN: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model("movie", moviesSchema);