const Category = require("./models");

module.exports = {
  index: async (req, res) => {
    // ini fungsi get read
    try {
      const category = await Category.find();
      // render view ejs
      res.render("admin/category/view_category", {
        category,
      });
    } catch (err) {
      console.log(err);
    }
  },
  viewCreate: async (req, res) => {
    // ini fungsi get read
    try {
      res.render("admin/category/create");
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    // ini fungsi post create
    try {
      const { name } = req.body;

      let category = await Category({ name });
      await category.save();

      res.redirect("/category");
    } catch (err) {
      console.log(err);
    }
  },
};
