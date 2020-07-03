const express = require("express");
const router = express.Router();

const User = require("../models/User.js");
const Post = require("../models/Post.js");

router.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) throw err;
    User.find({}, (err, users) => {
      if (err) throw err;
      res.render("index", {
        posts: posts,
        users: users,
      });
    });
  });
});

module.exports = router;
