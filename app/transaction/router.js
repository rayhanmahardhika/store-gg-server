var express = require("express");
var router = express.Router();
const { index, actionStatus } = require("./controller");
const { isLoginAdmin } = require("../middlewares/auth");

// middleware
router.use(isLoginAdmin);
// route(s)
router.get("/", index);
router.put("/status/:id", actionStatus);

module.exports = router;
