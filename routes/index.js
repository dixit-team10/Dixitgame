var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/options", function (req, res, next) {
  res.render("options", { title: "OPTIONS" });
});

router.get("/players", function (req, res, next) {
  res.render("players", { title: "PLAYERS" });
});

router.get("/", function (req, res, next) {
  res.render("regestration", { title: "SIGNUP/LOGIN" });
});

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "DIXIT APP" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "DIXIT Login" });
});

router.get("/playersonline", function (req, res, next) {
  res.render("players-online", { title: "Wait for Players" });
});

router.get("/win", function (req, res, next) {
  res.render("win", { title: "You Won" });
});

router.get("/profile", function (req, res, next) {
  res.render("profile", { title: "Profile" });
});

router.get("/achievements", function (req, res, next) {
  res.render("achievements", { title: "Achievements" });
});
router.get("/describe", function (req, res, next) {
  res.render("describe", { title: "Describe" });
});
router.get("/results", function (req, res, next) {
  res.render("results", { title: "Results" });
});

module.exports = router;
