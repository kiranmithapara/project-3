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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
