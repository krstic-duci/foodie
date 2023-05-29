import {
  BookResolvers,
  MutationAddBookArgs,
  QueryGetBookByIdArgs
} from "../__generated__/schemaTypes.js";
import { models } from "../db/models/index.js";

export const books: BookResolvers = {
  getBooks: async () => {
    return await models.Book.find();
  },
  // TODO: better typing
  getBookById: async (_: any, args: QueryGetBookByIdArgs, { models }: any) => {
    return await models.Book.findById(args.id);
  },
  // TODO: better typing
  addBook: async (_: any, args: MutationAddBookArgs, { models }: any) => {
    return await models.Book.create({
      title: args.title,
      author: args.author
    });
  }
};
