const mongoose = require("mongoose");

let nominalSchema = mongoose.Schema({
  coinQuantity: {
    type: Number,
    default: 0,
  },
  coinName: {
    type: String,
    require: [true, "Coin Name cannot be empty"],
  },
  price: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Nominal", nominalSchema);
