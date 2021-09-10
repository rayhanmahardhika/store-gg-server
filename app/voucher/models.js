const mongoose = require("mongoose");

let voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Game Name cannot be empty"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    thumbnail: {
      type: String,
    },
    // Category ini merupakan relasi ke collection Categories
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    nominals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nominal" }],
    //   user: { type: mongoose.Schema.Types.ObjeckID, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
