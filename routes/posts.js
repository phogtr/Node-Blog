const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const imageType = ["image/jpeg", "image/png", "image/gif"];

// Post model
const Post = require("../models/Post.js");
const upload = multer({
  dest: path.join("public", Post.imagePath),
  fileFilter: (req, file, callback) => {
    callback(null, imageType.includes(file.mimetype));
  },
});

// new post
router.get("/new", (req, res) => {
  res.render("posts/new");
});

// new post handler
router.post("/new", upload.single("image"), (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const { title, content, image, author } = req.body;
  let errors = [];

  if (!title || !author) {
    errors.push({ msg: "Please fill in the title" });
  }

  if (fileName == null) {
    errors.push({ msg: "Please attach an image" });
  }

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
      author,
    });
  } else {
    const newPost = new Post({
      title,
      content,
      image: fileName,
      author,
    });

    newPost
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  }
});

// single post
router.get("/:id", (req, res) => {
  Post.findById(req.params.id, (err, posts) => {
    if (err) throw err;
    res.render("posts/post", {
      posts: posts,
    });
  });
});

// edit post
router.get("/edit/:id", (req, res) => {
  Post.findById(req.params.id, (err, posts) => {
    if (err) throw err;
    res.render("posts/edit", {
      posts: posts,
    });
  });
});

// edit post handler
router.post("/edit/:id", upload.single("image"), (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const { title, content, image, author } = req.body;
  let errors = [];

  if (!title || !author) {
    errors.push({ msg: "Please fill in the title" });
  }

  if (fileName == null) {
    errors.push({ msg: "Please attach an image" });
  }

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
        author,
        posts: posts,
      });
    });
  } else {
    var post = {};
    post.title = title;
    post.content = content;
    post.image = fileName;
    post.author = author;

    Post.updateOne({ _id: req.params.id }, post, (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

// delete post
router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }, (err) => {
    if (err) throw err;
    res.send("Post deleted successfully");
  });
});

module.exports = router;
