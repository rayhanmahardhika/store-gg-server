const mongoose = require("mongoose");

let bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Bank Name cannot be empty"],
    },
    ownerName: {
      type: String,
      require: [true, "Owner's Name cannot be empty"],
    },
    accountNumber: {
      type: String,
      require: [true, "Account Number cannot be empty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
