const express = require("express");
const router = express.Router();

const User = require("../models/User.js");
const Post = require("../models/Post.js");

// home page
router.get("/", (req, res) => {
  let searchTitle = {};
  let searchAuthor = {};

  if (req.query.search != null && req.query.search !== "") {
    if (req.query.selectSearch == "title") {
      searchTitle.title = new RegExp(req.query.search, "i");
    } else {
      searchAuthor.name = new RegExp(req.query.search, "i");
    }
  }
  Post.find(searchTitle, (err, posts) => {
    if (err) throw err;
    User.find(searchAuthor, (err, users) => {
      if (err) throw err;
      res.render("index", {
        posts: posts,
        users: users,
      });
    });
  });
});

// advance search
router.get("/advanceSearch", (req, res) => {
  let searchTitle = {};
  let searchAuthor = {};

  if (req.query.title != null && req.query.title !== "") {
    searchTitle.title = new RegExp(req.query.title, "i");
  }

  if (req.query.author != null && req.query.author !== "") {
    searchAuthor.name = new RegExp(req.query.author, "i");
  }

  Post.find(searchTitle, (err, posts) => {
    if (err) throw err;
    User.find(searchAuthor, (err, users) => {
      if (err) throw err;
      res.render("index", {
        posts: posts,
        users: users,
      });
    });
  });
});

module.exports = router;
