import Book from "../db/models/book";

import { QueryResolvers } from "__generated__/schemaTypes";

export const resolvers: QueryResolvers = {
  Query: {
    getBooks: async () => await Book.find()
    // getBookById: (_: any, args: QueryGetBookByIdArgs) =>
    //   books.getBookById(_, args)
  }
};
