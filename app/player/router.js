var express = require("express");
var router = express.Router();
const {
  landingPage,
  detailPage,
  category,
  checkOut,
  history,
  historyDetail,
  dashboard,
} = require("./controller");
const { isLoginPlayer } = require("../middlewares/auth");

// Router API
router.get("/landingpage", landingPage);
router.get("/:id/detail", detailPage);
router.get("/category", category);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id/detail", isLoginPlayer, historyDetail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.post("/checkout", isLoginPlayer, checkOut);

module.exports = router;
