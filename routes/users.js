const express = require("express");
const bodyParser = require("body-parser");
var passport = require("passport");
var authenticate = require("../authenticate");

const Users = require("../models/users");
const userRouter = express.Router();
userRouter.use(bodyParser.json());

/// signup method using file upload method ...

userRouter.get("/signup", (req, res, next) => {
  res.render("signup", { title: "DIXIT APP" });
});

userRouter.post("/signup", (req, res, next) => {
  Users.register(
    new Users({
      username: req.body.username,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        res.render("login", { title: "DIXIT Login" });
      }
    }
  );
});

userRouter.get("/login", (req, res) => {
  res.render("login", { title: "DIXIT Login" });
});

// this login method will authenticate the username and password using local strategy of passport and create a new jwt token

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  // var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    // token: token,
    status: "You are successfully logged in!",
    User: req.user,
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

//// by id operations carried here

// show user by id

userRouter
  .route("/:userId")
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // edit user by id and body ... i.e. enter the id of the user in request url and the data in body ...

  .put((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // delete user by id

  .delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userId)
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

module.exports = userRouter;
