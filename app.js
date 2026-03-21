const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/warapAcync");

const ExpressError = require("./utils/ExpressError");

const listingSchema = require("./schema");

async function main() {
  mongoose.connect("mongodb://localhost:27017/wanderlust");
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

app.get("/", (req, res) => {
  res.send("hi, i am a root.");
});

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

//New Route - cerate a new listings - show aa form
app.get("/listings/new", (req, res) => {
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

app.post(
  "/listings",
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
app.get(
  "/listings/:id/edit",
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
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.send("Listing not found");
    }

    res.render("listing/show.ejs", { listing });
  }),
);

//Upadte Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body;

    await Listing.findByIdAndUpdate(id, newListing);

    res.redirect(`/listings/${id}`);
  }),
);
//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  }),
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong !" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`port is listening on port no ${PORT}`);
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
