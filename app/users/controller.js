const User = require("./models");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    // ini fungsi get read
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        // render view ejs
        res.render("admin/users/view_signin", {
          alert,
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (user) {
        if (user.status === "Y") {
          const checkPassword = await bcrypt.compare(password, user.password);
          if (checkPassword) {
            req.session.user = {
              id: user._id,
              email: user.email,
              name: user.name,
              status: user.status,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", `Wrong Password`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash(
            "alertMessage",
            `User is found but status inactive, please contact admin!`
          );
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Email unrecognized`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
};
