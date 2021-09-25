const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema(
  {
    voucherTopupHistory: {
      gameName: {
        type: String,
        require: [true, "Game Name cannot be empty"],
      },
      category: {
        type: String,
        require: [true, "Game Category cannot be empty"],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        require: [true, "Coin Name cannot be empty"],
      },
      coinQuantity: {
        type: String,
        require: [true, "Coin Quantity cannot be empty"],
      },
      price: {
        type: Number,
      },
    },
    paymentHistory: {
      name: {
        type: String,
        require: [true, "Name cannot be empty"],
      },
      type: {
        type: String,
        require: [true, "Payment Type cannot be empty"],
      },
      bankName: {
        type: String,
        require: [true, "Bank Name cannot be empty"],
      },
      accountNumber: {
        type: String,
        require: [true, "Account Number cannot be empty"],
      },
    },
    name: {
      type: String,
      require: [true, "Name cannot be empty"],
      maxlength: [225, "Name lenght need to be between 3 to 225 character"],
      minlength: [3, "Name lenght need to be between 3 to 225 character"],
    },
    userAccount: {
      type: String,
      require: [true, "User Account cannot be empty"],
      maxlength: [225, "Name lenght need to be between 3 to 225 character"],
      minlength: [3, "Name lenght need to be between 3 to 225 character"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    userHistory: {
      name: {
        type: String,
        require: [true, "Player Name cannot be empty"],
      },
      phoneNumber: {
        type: Number,
        require: [true, "User Account cannot be empty"],
        maxlength: [13, "Name lenght need to be between 9 to 13 character"],
        minlength: [9, "Name lenght need to be between 9 to 13 character"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
