const typeDefs = `
    type Opening {
        _id: ID
        eco: String
        name: String!
        pgn: String
        fen: String
    }
    enum SortOrder {
        ASC
        DESC
    }
    input OrderByInput {
        name: SortOrder
        eco: SortOrder
    }

    type Query {
        findMainLineOpenings(orderBy: OrderByInput): [Opening]
        findContinuations(orderBy: OrderByInput, eco: String, opening: String): [Opening]
    }
`;

module.exports = typeDefs;
