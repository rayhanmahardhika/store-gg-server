var express = require("express");
var router = express.Router();
const { viewSignin, actionSignIn, actionLogOut } = require("./controller");

/* GET home page. */
router.get("/", viewSignin);
router.post("/", actionSignIn);
router.get("/logout", actionLogOut);

module.exports = router;
