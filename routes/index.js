const express = require("express");
const router = express.Router();

const Post = require("../models/Post.js");

router.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) throw err;
    res.render("index", {
      posts: posts,
    });
  });
});

module.exports = router;
