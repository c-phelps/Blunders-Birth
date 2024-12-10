const Opening = require("../models/Opening");
const openingData = require("../data/openingData.json");
const db = require("../config/connection");

db.once("open", async () => {
  try {
    await Opening.insertMany(openingData);
    console.log("Data seeding... success!");
    process.exit();
  } catch (err) {
    console.error("Error seeding data;", err);
    process.exit(1);
  }
});