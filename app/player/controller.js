const Player = require("./models");
const Voucher = require("../voucher/models");
const Category = require("../category/models");

module.exports = {
  // Pembuatan API untuk front end
  // API Landing Page
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  // API Detail Voucher Page
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("category", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({ message: "No Voucher found" });
      }

      res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({
        data: category,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
};
