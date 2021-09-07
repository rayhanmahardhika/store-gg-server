const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Category name needs to be filled out"],
  },
});

module.exports = mongoose.model("Category", categorySchema);
