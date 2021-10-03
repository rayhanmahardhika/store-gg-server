const Player = require("./models");
const Voucher = require("../voucher/models");
const Nominal = require("../nominal/models");
const Payment = require("../payment/models");
const Transaction = require("../transaction/models");
const Bank = require("../bank/models");
const Category = require("../category/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

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

      const payment = await Payment.find().populate("banks");

      res.status(200).json({
        data: {
          voucher,
          payment,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  // API Category
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
  // API Checkout
  checkOut: async (req, res) => {
    try {
      const { userAccount, name, nominal, voucher, payment, bank } = req.body;

      const resVoucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (!resVoucher) {
        return res.status(404).json({ message: "Game voucher not found" });
      }
      // nominal
      const resNominal = await Nominal.findOne({ _id: nominal });
      if (!resNominal) {
        return res.status(404).json({ message: "Voucher nominal not found" });
      }
      // payment
      const resPayment = await Payment.findOne({ _id: payment });
      if (!resPayment) {
        return res.status(404).json({ message: "Voucher payment not found" });
      }
      // bank
      const resBank = await Bank.findOne({ _id: bank });
      if (!resBank) {
        return res.status(404).json({ message: "Payment bank not found" });
      }

      let tax = (10 / 100) * resNominal._doc.price;
      let value = resNominal._doc.price - tax;

      const payload = {
        voucherTopupHistory: {
          gameName: resVoucher._doc.name,
          category: resVoucher._doc.category
            ? resVoucher._doc.category.name
            : "-",
          thumbnail: resVoucher._doc.thumbnail,
          coinName: resNominal._doc.coinName,
          coinQuantity: resNominal._doc.coinQuantity,
          price: resNominal._doc.price,
        },
        paymentHistory: {
          name: resBank._doc.ownerName,
          type: resPayment._doc.type,
          bankName: resBank._doc.name,
          accountNumber: resBank._doc.accountNumber,
        },
        name: name,
        userAccount: userAccount,
        tax: tax,
        value: value,
        player: req.player._id,
        userHistory: {
          name: resVoucher._doc.user?.name,
          phoneNumber: resVoucher._doc.user?.phoneNumber,
        },
        category: resVoucher._doc.category?._id,
        user: resVoucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({ data: transaction });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res
        .status(200)
        .json({ data: history, total: total.length ? total[0].value : 0 });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const history = await Transaction.findOne({ _id: id });

      if (!history) {
        res.status(404).json({ message: "Transaction History not found" });
      }

      res.status(200).json({ data: history });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        {
          $match: { player: req.player._id },
        },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((element) => {
        count.forEach((data) => {
          if (data._id.toString() === element._id.toString()) {
            data.name = element.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({
        data: {
          history,
          count,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };
      res.status(200).json({ data: player });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const { name = "", phoneNumber = "" } = req.body;
      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        let tmpPath = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${fileName}`
        );

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on("end", async () => {
          let player = await Player.findOne({ _id: req.player._id });

          let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          player = await Player.findOneAndUpdate(
            { _id: req.player._id },
            {
              ...payload,
              avatar: fileName,
            },
            { new: true, runValidators: true }
          );

          res.status(201).json({
            data: {
              id: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          });

          src.on("err", async () => {
            next(err);
          });
        });
      } else {
        const player = await Player.findOneAndUpdate(
          { _id: req.player._id },
          payload,
          { new: true, runValidators: true }
        );

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        res.status(422).json({
          error: 1,
          message: err.message,
          field: err.errors,
        });
      }
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
};
