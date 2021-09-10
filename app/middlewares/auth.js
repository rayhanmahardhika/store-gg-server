module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertMessage", `User session time out, please re-login`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
        next()
    }
  },
};
