import { Resolvers } from "../__generated__/schemaTypes.js";
import { books } from "./books.js";

export const resolvers: Resolvers = {
  Query: {
    getBooks: () => books.getBooks(),
    getBookById: (_, args, contextValue) =>
      books.getBookById(_, args, contextValue)
  },
  Mutation: {
    addBook: (_, args, contextValue) => books.addBook(_, args, contextValue)
  }
};
