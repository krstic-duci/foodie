import { books } from "./books";
import { user } from "./user";

import {
  MutationAddBookArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  QueryGetBookByIdArgs,
  Resolvers
} from "__generated__/schemaTypes";

export const resolvers: Resolvers = {
  Query: {
    getBooks: (_: any, __: any, contextValue: any) =>
      books.getBooks(_, __, contextValue),
    getBookById: (_: any, args: QueryGetBookByIdArgs, contextValue: any) =>
      books.getBookById(_, args, contextValue)
  },
  Mutation: {
    addBook: (_: any, args: MutationAddBookArgs, contextValue: any) =>
      books.addBook(_, args, contextValue),
    signup: (_: any, args: MutationSignupArgs, contextValue: any) =>
      user.signup(_, args, contextValue),
    login: (_: any, args: MutationLoginArgs, contextValue: any) =>
      user.login(_, args, contextValue)
  }
};
