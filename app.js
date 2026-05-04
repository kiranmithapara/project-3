const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing.routes.js");
const reviews = require("./routes/review.routes.js");
const users = require("./routes/user.route.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.model.js");
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

main()
  .then(() => {
    console.log("conection Sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.json()); // post me se jason data lene ke liye
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //res.locals no use kari ne apde ee value sidha j ejs ma use kari sakvi chi
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  // console.log(res.locals.currentUser);

  //req.user ma jo log in hasu to session ma object ma username and email batavse and login nay hoy to undeined banvase
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({ username: "kiran1212", email: "kiran@gmail.com" });
//   let registerUsre = await User.register(fakeUser, "123456");
//   res.send(registerUsre);
// });
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews); //ama id ne lakhi che tethi router=express.Router({mergeParams: true}) lakhvu padse jethi req.params ma te id pan access kari sakvi
app.use("/", users);

app.get("/", (req, res) => {
  res.send("hi, i am a root.");
});
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  // console.log(err);

  let { statusCode = 500, message = "something went wrong !" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`Sever is listening on port no ${PORT}`);
});

// app.get("/testListing", async (req, res) => {
//   let simpalListing = new Listing({
//     title: "My New Villa",
//     description: "By the Beach",
//     price: 1200,
//     location: "Calangute Goa",
//     country: "India",
//   });
//   await simpalListing.save();
//   console.log("data was saved");
//   res.send("test");
// });
