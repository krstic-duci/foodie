import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  MutationLoginArgs,
  MutationSignupArgs
} from "../__generated__/schemaTypes.js";

dotenv.config();

export const user = {
  signup: async (
    _: any,
    { email, password }: MutationSignupArgs,
    { models }: any
  ) => {
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        email: email.trim().toLowerCase(),
        password: hashed
      });
      // create and return the json web token
      // TODO:
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  login: async (
    _: any,
    { email, password }: MutationLoginArgs,
    { models }: any
  ) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }]
    });
    // if there is no user, throw an authentication error
    if (!user) {
      throw new Error("Error signing in");
    }
    // if the passwords don't match, throw an error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Error signing in");
    }
    // create and return the json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
  }
};
