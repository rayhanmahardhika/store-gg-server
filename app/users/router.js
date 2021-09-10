var express = require("express");
var router = express.Router();
const { viewSignin, actionSignIn } = require("./controller");

/* GET home page. */
router.get("/", viewSignin);
router.post("/", actionSignIn);

module.exports = router;
