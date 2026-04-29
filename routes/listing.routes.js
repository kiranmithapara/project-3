const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema");

const validateListing = (req, res, next) => {
  //error che te ek object che tethi req.body mathi je error avse tema ditails che te object che theti error ma badhi detais save thase
  //tyar bad details name na array par map function chalavi ne je element  ni kye message hase te print thase ane jo message ma ek thi vadhu error avse to , thi joint thay jase
  const { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

//New Route - cerate a new listings - show aa form
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Create new listing Route

// app.post("/listings", async (req, res) => {
//   let { title, description, country, price, image, location } = req.body;
//   // let addListing = await Listing.insertOne({
//   //   title,
//   //   description,
//   //   country,
//   //   price,
//   //   image,
//   //   location,
//   // });

//   console.log(req.body);

//   let newListing = new Listing(req.body);

//   await newListing.save();

//   res.redirect("/listings");
// });

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // console.log(req.body);
    if (!req.body) {
      //postman mathi request nakhe and error ave ena mate
      throw new ExpressError(400, "send valid data for listings");
    }
    let newListing = new Listing(req.body);
    // if (!newListing.title) {
    //   throw new ExpressError(400, "Title is missing");
    // }
    // if (!newListing.description) {
    //   throw new ExpressError(400, "Description is missing");
    // }
    // if (!newListing.price) {
    //   throw new ExpressError(400, "Price is missing");
    // }
    // if (!newListing.location) {
    //   throw new ExpressError(400, "Location is missing");
    // }
    // if (!newListing.country) {
    //   throw new ExpressError(400, "Country is missing");
    // }
    //ek thi vadhu if na use karva pade ee mate joi no use karvo

    await newListing.save();
    res.redirect("/listings");
  }),
);

//Edit Route = edit form show
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.send("Listing not found");
    }

    res.render("listing/edit.ejs", { listing });
  }),
);
//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
      return res.send("Listing not found");
    }

    res.render("listing/show.ejs", { listing });
  }),
);

//Upadte Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body;

    await Listing.findByIdAndUpdate(id, newListing);

    res.redirect(`/listings/${id}`);
  }),
);
//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  }),
);

module.exports = router;
