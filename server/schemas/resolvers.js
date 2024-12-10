const Opening = require("../models/Opening");

const resolvers = {
  Query: {
    findMainLineOpenings: async (_, { orderBy }) => {
      const sortOrder = orderBy && orderBy.name === "ASC" ? 1 : -1;
      const result = await Opening.aggregate([
        { $match: { name: { $not: /:/ } } }, // find where there is no colon
        { $addFields: { pgnLength: { $strLenCP: "$pgn" } } }, // create a new field named pgnLength that takes the length of pgn using strLenCP
        {
          // group by name and eco
          $group: {
            _id: { name: "$name", eco: "$eco" },
            openings: { $push: "$$ROOT" }, // push all matching documents into an array
          },
        },
        {
          // sort the grouped documents by pgnLength in descending order
          $addFields: {
            sortedOpenings: {
              $sortArray: { input: "$openings", sortBy: { pgnLength: -1 } }, // sort by pgnLength in descending order
            },
          },
        },
        {
          // pick the first document in the sorted array (longest pgn)
          $addFields: {
            longestOpening: { $arrayElemAt: ["$sortedOpenings", 0] },
          },
        },
        {
          // replace the root with the longestOpening document
          $replaceRoot: { newRoot: "$longestOpening" },
        },
        { $sort: { name: sortOrder, eco: sortOrder } }, // sort by name and eco
      ]);
      return result;
    },
  },
};

module.exports = resolvers;
