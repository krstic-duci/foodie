import { authMiddleware } from "../middleware/auth";

import {
  BookResolvers,
  MutationAddBookArgs,
  QueryGetBookByIdArgs
} from "__generated__/schemaTypes";

export const books: BookResolvers = {
  getBooks: async (_: any, __: any, { models }: any) => {
    return await models.Book.find();
  },
  // TODO: better typing
  getBookById: authMiddleware(
    async (_: any, args: QueryGetBookByIdArgs, { models }: any) => {
      return await models.Book.findById(args.id);
    }
  ),
  // TODO: better typing
  addBook: authMiddleware(
    async (_: any, args: MutationAddBookArgs, { models }: any) => {
      return await models.Book.create({
        title: args.title,
        author: args.author
      });
    }
  )
};
