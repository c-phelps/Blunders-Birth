const Opening = require("../models/Opening");
const openingData = require("../data/openingData.json");
const db = require("../config/connection");

db.once("open", async () => {
  try {
    const openingsCount = await Opening.countDocuments();
    if (openingsCount === 0) {
      await Opening.insertMany(openingData);
      console.log("Data seeding... success!");
    } else {
      console.log("Opening data already exists; skipping seed.")
    }
    process.exit();
  } catch (err) {
    console.error("Error seeding data;", err);
    process.exit(1);
  }
});
