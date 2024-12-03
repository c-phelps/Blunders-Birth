const { Schema, model } = require("mongoose");
const openingSchema = new Schema(
  {
    eco: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    pgn: {
      type: String,
    },
    fen: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Opening = model("Opening", openingSchema);

module.exports = Opening;
