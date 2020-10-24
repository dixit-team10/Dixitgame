const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema({
    email: {
      type: String,
    },
  });

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
