const Bank = require("./models");

module.exports = {
  index: async (req, res) => {
    // ini fungsi get read
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const bank = await Bank.find();
      // render view ejs
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Bank Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    // ini fungsi get read
    try {
      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Bank Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionCreate: async (req, res) => {
    // ini fungsi post create
    try {
      const { name, ownerName, accountNumber } = req.body;

      let bank = await Bank({ name, ownerName, accountNumber });
      await bank.save();

      req.flash(
        "alertMessage",
        `New bank successfuly added: "${name + " - " + ownerName}"`
      );
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findOne({ _id: id });

      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Bank Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, ownerName, accountNumber } = req.body;

      const bank = await Bank.findOneAndUpdate(
        { _id: id },
        {
          name,
          ownerName,
          accountNumber,
        }
      );

      req.flash(
        "alertMessage",
        `"${
          bank.name + " - " + bank.ownerName
        }" bank successfuly updated with: "${name + " - " + ownerName}"`
      );
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findOneAndDelete({ _id: id });

      req.flash(
        "alertMessage",
        `"${bank.name + " " + bank.ownerName}" bank successfuly deleted`
      );
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
