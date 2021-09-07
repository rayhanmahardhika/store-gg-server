module.exports = {
  index: async (req, res) => {
    try {
      // render view ejs
      res.render("index", {
        title: "Express JS",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
