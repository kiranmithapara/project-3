const express = require("express");
const { route } = require("./listing.routes");
const router = express.Router();
const User = require("../models/user.model.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/isLoggedIn.middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, password, email } = req.body;

      let newUser = new User({ username, email });
      let registeruser = await User.register(newUser, password); //data base ma data save karyo and user ne register kariyu

      req.login(registeruser, (err) => {
        //register thaya pachi taart login karva mate
        if (err) {
          return next(err);
        }
        req.flash("success", "User registered successfully!"); // jo user register thay jase to aa flash mag avse
        res.redirect("/listings");
      });
    } catch (e) {
      // jo koi error avse to new eeror page ma nay jay but e error ne flash mes tarike mokalse
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login", //jo password and username matche nay thay to fari var login vala page par lay jase
    failureFlash: true, //jo error avse to error masg lash thase
  }), //je data che te vallid che ke nat te chek karva mate middalvare lagavyu
  async (req, res) => {
    req.flash("success", "welcome bake to wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // jayre redirectUrl ma undifine hoy etle ke jyare sidhuj login karvi tyare redirect url undifine hase tyare tene /listings par redirect karavo
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    //logout karva mate logout nam ni callback function no use thay
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "logged you out");
  res.redirect("/listings");
});

module.exports = router;
