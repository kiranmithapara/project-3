const express = require("express");
const router = express.Router({ mergeParams: true }); //Parent route ke params ko child router me merge (combine) karta hai
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware/isLoggedIn.middleware.js");

const { reviewSchema } = require("../schema");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    let review = new Review(req.body);

    listing.reviews.push(review._id);

    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  }),
);

//Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // 1. Listing se review id remove
    // $pull kya hota hai?
    //  $pull ek MongoDB operator hai
    //  Use hota hai array ke andar se koi value remove karne ke liye
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // 2. Review delete
    await Review.findByIdAndDelete(reviewId);

    // 3. Redirect (IMPORTANT)
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
