const express = require("express");
const bodyParser = require("body-parser");
var passport = require("passport");
var authenticate = require("../authenticate");

const Users = require("../models/users");
const userRouter = express.Router();
userRouter.use(bodyParser.json());
var user = {};
/// signup method using file upload method ...

userRouter.post("/signup", (req, res, next) => {
  Users.register(
    new Users({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        user = { _id: user._id, name: user.username, email: user.email };
        res.render("index", {
          title: "DIXIT Login",
          _id: user._id,
        });
      }
    }
  );
});

// this login method will authenticate the username and password using local strategy of passport and create a new jwt token

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  // var token = authenticate.getToken({ _id: req.user._id });

  user = { _id: req.user._id, name: req.user.username, email: req.user.email };
  res.render("index", {
    title: "DIXIT App",
    _id: req.user._id,
  });
});

userRouter
  .route("/")

  // show all the users

  .get((req, res, next) => {
    Users.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // delete all users

  .delete((req, res, next) => {
    Users.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });


// show user by id

userRouter.route("/profile/:userId").get((req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (user) => {
        res.render("profile", {
          _id: req.params.userId,
          name: user.username,
          email: user.email,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
userRouter.route("/backIndex/:userId").get((req, res, next) => {
  res.render("index", { title: "DIXIT App", _id: req.params.userId });
});
module.exports = userRouter;
