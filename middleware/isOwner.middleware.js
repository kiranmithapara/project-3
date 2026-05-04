const Listing = require("../models/listing");

module.exports = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  // 1. Listing exist check
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // 2. User login check
  if (!res.locals.currentUser) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  // 3. Ownership check
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
