const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  //jyare image nu location na hoy tyare image nu location defult set karva mate
  //jo location fild khali hoy to default location api dese
  image: {
    type: String,
    default:
      "https://tse3.mm.bing.net/th/id/OIP.Megxa8IH2Gw6WCy53M2qEAHaE8?pid=Api&P=0&h=180",
    set: (v) =>
      v === ""
        ? "https://tse3.mm.bing.net/th/id/OIP.Megxa8IH2Gw6WCy53M2qEAHaE8?pid=Api&P=0&h=180"
        : v,
  },

  price: { type: Number, required: true },
  location: String,
  country: String,
});   

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
