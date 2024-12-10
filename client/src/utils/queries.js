import { gql } from "@apollo/client";

export const OPENINGS_ASC = gql`
  query findMainLineOpenings($orderBy: OrderByInput) {
    findMainLineOpenings(orderBy: $orderBy) {
      _id
      eco
      name
      pgn
      fen
    }
  }
`;
