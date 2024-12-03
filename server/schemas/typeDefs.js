const typeDefs = `
    type Opening {
        _id: ID
        eco: String
        name: String!
        pgn: String
        fen: String
    }

    type Query {
        findMainLineOpenings() [Opening]
    }
`;

module.exports = typeDefs;
