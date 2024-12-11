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

export const FIND_CONTINUATIONS = gql`
  query findContinuations($orderBy: OrderByInput, $eco: String, $opening: String) {
    findContinuations(orderBy: $orderBy, eco: $eco, opening: $opening) {
      _id
      eco
      name
      pgn
      fen
    }
  }
`;
