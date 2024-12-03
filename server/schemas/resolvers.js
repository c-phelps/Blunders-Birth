const Opening = require("../models/Opening");

const resolvers = {
  Query: {
    findMainLineOpenings: async () => {
      return await Opening.find({ name: { $not: /:/ } });
    },
  },
};

module.exports = resolvers;
