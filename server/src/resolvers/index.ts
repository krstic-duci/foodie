import { Resolvers } from "../__generated__/schemaTypes.js";
import { books } from "./books.js";
import { user } from "./user.js";

export const resolvers: Resolvers = {
  Query: {
    getBooks: () => books.getBooks(),
    getBookById: (_, args, contextValue) =>
      books.getBookById(_, args, contextValue)
  },
  Mutation: {
    addBook: (_, args, contextValue) => books.addBook(_, args, contextValue),
    signup: (_, args, contextValue) => user.signup(_, args, contextValue),
    login: (_, args, contextValue) => user.login(_, args, contextValue)
  }
};
