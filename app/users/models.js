const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email cannot be empty"],
    },
    name: {
      type: String,
      require: [true, "Name cannot be empty"],
    },
    password: {
      type: String,
      require: [true, "Password cannot be empty"],
    },
    phoneNumber: {
      type: String,
      require: [true, "Phone Number cannot be empty"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
