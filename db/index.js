const mongoose = require("mongoose");
const { urlDB } = require("../config");

mongoose.connect(urlDB, {
  useUnifiedTopology: true,
  //   useFindAndModify: true,
  //   useCreateIndex: true,
});

const db = mongoose.connection;

module.exports = db;
