const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const { init } = require("../models/review");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

main()
  .then(() => {
    console.log("Database Connected Successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

async function initDB() {
  await Listing.deleteMany({});
  const updatedData = initData.data.map((obj) => {
    return { ...obj, owner: "69f47937e4d5f212da03aee2" };
  });

  await Listing.insertMany(updatedData);
  console.log("data was initialized");
}

initDB();
