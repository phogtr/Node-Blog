module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You are not logged in");
    res.redirect("/user/login");
  },
};
