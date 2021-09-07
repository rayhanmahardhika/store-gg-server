module.exports = {
  index: async (req, res) => {
    try {
      // render view ejs
      res.render("index");
    } catch (err) {
      console.log(err);
    }
  },
};
