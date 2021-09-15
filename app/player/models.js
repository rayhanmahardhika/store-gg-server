const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email cannot be empty"],
    },
    name: {
      type: String,
      require: [true, "Name cannot be empty"],
      maxlength: [225, "Name lenght need to be between 3 to 225 character"],
      minlength: [3, "Name lenght need to be between 3 to 225 character"],
    },
    username: {
      type: String,
      require: [true, "Name cannot be empty"],
      maxlength: [
        225,
        "User Name lenght need to be between 3 to 225 character",
      ],
      minlength: [3, "User Name lenght need to be between 3 to 225 character"],
    },
    password: {
      type: String,
      require: [true, "Password cannot be empty"],
      maxlength: [225, "Password lenght need to be between 225 character"],
    },
    phoneNumber: {
      type: String,
      require: [true, "Phone Number cannot be empty"],
      maxlength: [13, "Name lenght need to be between 9 to 13 character"],
      minlength: [9, "Name lenght need to be between 9 to 13 character"],
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
