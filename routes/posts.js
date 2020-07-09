const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const imageType = ["image/jpeg", "image/png", "image/gif"];
const { authenticated } = require("../config/auth");

// Post & User model
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const upload = multer({
  dest: path.join("public", Post.imagePath),
  fileFilter: (req, file, callback) => {
    callback(null, imageType.includes(file.mimetype));
  },
});

// new post
router.get("/new", authenticated, (req, res) => {
  res.render("posts/new");
});

// new post handler
router.post("/new", upload.single("image"), (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const { title, content, image } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ msg: "Please fill in the title" });
  }

  // if (fileName == null) {
  //   errors.push({ msg: "Please attach an image" });
  // }

  if (errors.length > 0) {
    if (fileName != null) {
      fs.unlink(path.join("public", Post.imagePath, fileName), (err) => {
        if (err) throw err;
      });
    }
    res.render("posts/new", {
      errors,
      title,
      content,
      image,
      user: req.user._id,
    });
  } else {
    const newPost = new Post({
      title,
      content,
      image: fileName,
      author: req.user._id,
    });

    newPost
      .save()
      .then(() => {
        req.flash("success_msg", "New post has been added");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  }
});

// single post
router.get("/:id", (req, res) => {
  Post.findById(req.params.id, (err, posts) => {
    if (err) throw err;
    User.findById(posts.author, (err, users) => {
      if (err) throw err;
      res.render("posts/post", {
        posts: posts,
        author: users.name,
      });
    });
  });
});

// edit post
router.get("/edit/:id", authenticated, (req, res) => {
  Post.findById(req.params.id, (err, posts) => {
    if (err) throw err;
    if (posts.author != req.user._id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/");
    } else {
      res.render("posts/edit", {
        posts: posts,
      });
    }
  });
});

// edit post handler
router.post("/edit/:id", upload.single("image"), (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const { title, content, image } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ msg: "Please fill in the title" });
  }

  // if (fileName == null) {
  //   errors.push({ msg: "Please attach an image" });
  // }

  if (errors.length > 0) {
    if (fileName != null) {
      fs.unlink(path.join("public", Post.imagePath, fileName), (err) => {
        if (err) throw err;
      });
    }
    Post.findById(req.params.id, (err, posts) => {
      if (err) throw err;
      res.render("posts/edit", {
        errors,
        title,
        content,
        image,
        posts: posts,
        user: req.user._id,
      });
    });
  } else {
    Post.findById(req.params.id, (err, posts) => {
      if (err) throw err;
      if (posts.image != null) {
        fs.unlink(path.join("public", Post.imagePath, posts.image), (err) => {
          if (err) throw err;
        });
      }
    });

    var post = {};
    post.title = title;
    post.content = content;
    post.image = fileName;
    post.author = req.user._id;
    post.date = Date.now();

    Post.updateOne({ _id: req.params.id }, post, (err) => {
      if (err) throw err;
      req.flash("success_msg", "Your post has been updated");
      res.redirect("/");
    });
  }
});

// delete post handler
router.delete("/:id", (req, res) => {
  if (!req.user._id) res.status(500).send();

  Post.findById(req.params.id, (err, posts) => {
    if (err) throw err;
    if (posts.image != null) {
      fs.unlink(path.join("public", Post.imagePath, posts.image), (err) => {
        if (err) throw err;
      });
    }
  });
  Post.deleteOne({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash("success_msg", "Your post has been deleted");
    res.send("Post deleted successfully");
  });
});

module.exports = router;
