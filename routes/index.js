var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "DIXIT APP" });
});

router.get("/options", function (req, res, next) {
  res.render("options", { title: "OPTIONS" });
});

router.get("/players", function (req, res, next) {
  res.render("players", { title: "PLAYERS" });
});

router.get("/regestration", function (req, res, next) {
  res.render("regestration", { title: "SIGNUP/LOGIN" });
});
module.exports = router;
