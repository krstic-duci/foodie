import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

import Book from "../db/models/book";
import User from "../db/models/user";

import { QueryResolvers } from "__generated__/schemaTypes";

export const resolvers: QueryResolvers = {
  Query: {
    getBooks: async () => await Book.find()
    // getBookById: (_: any, args: QueryGetBookByIdArgs) =>
    //   books.getBookById(_, args)
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email.trim() });

      if (!user) {
        throw new Error("Cannot login");
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Cannot login");
      }

      console.log("HERE");
      return sign(
        { id: user._id, email: user.email, firstName: user.firstName },
        process.env.ACCESS_TOKEN_JWT_SECRET!
      );
    },
    signUp: async (parent, { email, password, firstName }) => {
      const hashed = await hash(password, 13);
      try {
        const user = await User.create({
          email: email.trim(),
          password: hashed,
          firstName
        });
        return sign(
          { id: user._id, email: user.email },
          process.env.ACCESS_TOKEN_JWT_SECRET!
        );
      } catch (err) {
        console.log(err);
        throw new Error("Error creating account");
      }
    }
  }
};
