const mongoose = require("mongoose");

let categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category Name cannot be empty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
