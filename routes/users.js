const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { authenticated } = require("../config/auth");

// User model
const User = require("../models/User.js");
//const { route } = require("./index.js");

//login
router.get("/login", (req, res) => {
  res.render("users/login");
});

//register
router.get("/register", (req, res) => {
  res.render("users/register");
});

// register handler
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already registered" });
        res.render("users/register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash pw
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash("success_msg", "Successfully registered.");
                res.redirect("login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// login handler
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

// logout handler
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("login");
});

router.get("/dashboard", authenticated, (req, res) => {
  res.render("users/dashboard", {
    name: req.user.name,
  });
});

module.exports = router;
