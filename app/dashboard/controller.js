module.exports = {
  index: async (req, res) => {
    try {
      // render view ejs
      res.render("index", {
        name: req.session.user.name,
        title: "Dashboard Page",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
