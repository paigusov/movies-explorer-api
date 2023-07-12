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
app.use("/", auth, require("./routes/index"));
app.use(errorLogger);
app.use(errors());

app.listen(3000, () => {
  console.log('test')
});