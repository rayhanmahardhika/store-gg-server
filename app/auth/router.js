var express = require("express");
var router = express.Router();
const multer = require("multer");
const os = require("os");
const { signUp, signIn } = require("./controller");

// Router API
router.post("/signup", multer({ dest: os.tmpdir() }).single("image"), signUp);
router.post("/signin", signIn);

module.exports = router;
