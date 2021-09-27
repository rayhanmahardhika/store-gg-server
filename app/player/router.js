var express = require("express");
var router = express.Router();
const multer = require("multer");
const os = require("os");
const {
  landingPage,
  detailPage,
  category,
  checkOut,
  history,
  historyDetail,
  dashboard,
  profile,
  editProfile,
} = require("./controller");
const { isLoginPlayer } = require("../middlewares/auth");

// Router API
router.get("/landingpage", landingPage);
router.get("/:id/detail", detailPage);
router.get("/category", category);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id/detail", isLoginPlayer, historyDetail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.post("/checkout", isLoginPlayer, checkOut);
router.put(
  "/profile",
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single("image"),
  editProfile
);

module.exports = router;
