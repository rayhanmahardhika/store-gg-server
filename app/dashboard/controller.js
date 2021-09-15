const Transaction = require("../transaction/models");
const Voucher = require("../voucher/models");
const Category = require("../category/models");
const Player = require("../player/models");

module.exports = {
  index: async (req, res) => {
    try {
      // query to count total documents inside collection
      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments();
      const category = await Category.countDocuments();
      const player = await Player.countDocuments();
      // render view ejs
      res.render("admin/dashboard/view_dashboard", {
        transaction,
        voucher,
        category,
        player,
        name: req.session.user.name,
        title: "Dashboard Page",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
