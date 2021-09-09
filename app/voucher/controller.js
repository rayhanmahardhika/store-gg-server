const Voucher = require("./models");
const Category = require("../category/models");
const Nominal = require("../nominal/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    // ini fungsi get read
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const voucher = await Voucher.find();
      // render view ejs
      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    // ini fungsi get read
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", { category, nominal });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionCreate: async (req, res) => {
    // ini fungsi post create
    try {
      const { name, category, nominal } = req.body;

      // saving image
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
          try {
            const voucher = new Voucher({
              name,
              category,
              nominal,
              thumbnail: fileName,
            });

            await voucher.save();

            req.flash(
              "alertMessage",
              `New voucher successfuly added: "${name}"`
            );
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        //   if image not uploaded
        try {
          const voucher = new Voucher({
            name,
            category,
            nominal,
          });

          await voucher.save();

          req.flash("alertMessage", `New voucher successfuly added: "${name}"`);
          req.flash("alertStatus", "success");

          res.redirect("/voucher");
        } catch (err) {
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/voucher");
        }
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  //   viewEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;

  //       const voucher = await Voucher.findOne({ _id: id });

  //       res.render("admin/voucher/edit", {
  //         voucher,
  //       });
  //     } catch (err) {
  //       req.flash("alertMessage", `${err.message}`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/voucher");
  //     }
  //   },
  //   actionEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { coinName, coinQuantity, price } = req.body;

  //       const voucher = await Voucher.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           coinName,
  //           coinQuantity,
  //           price,
  //         }
  //       );

  //       req.flash(
  //         "alertMessage",
  //         `"${
  //           voucher.coinQuantity + " " + voucher.coinName
  //         }" voucher successfuly updated with: "${coinQuantity + " " + coinName}"`
  //       );
  //       req.flash("alertStatus", "success");

  //       res.redirect("/voucher");
  //     } catch (err) {
  //       req.flash("alertMessage", `${err.message}`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/voucher");
  //     }
  //   },
  //   actionDelete: async (req, res) => {
  //     try {
  //       const { id } = req.params;

  //       const voucher = await Voucher.findOneAndDelete({ _id: id });

  //       req.flash(
  //         "alertMessage",
  //         `"${
  //           voucher.coinQuantity + " " + voucher.coinName
  //         }" voucher successfuly deleted`
  //       );
  //       req.flash("alertStatus", "success");

  //       res.redirect("/voucher");
  //     } catch (err) {
  //       req.flash("alertMessage", `${err.message}`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/voucher");
  //     }
  //   },
};
