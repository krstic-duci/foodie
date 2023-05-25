import { Resolvers } from "../__generated__/schemaTypes";

const MOCK_BOOKS = [
  {
    title: "The Awakening",
    author: "Kate Chopin"
  },
  {
    title: "City of Glass",
    author: "Paul Auster"
  }
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: Resolvers = {
  Query: {
    books: () => MOCK_BOOKS
  }
};
