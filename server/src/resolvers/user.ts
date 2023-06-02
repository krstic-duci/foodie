import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  MutationLoginArgs,
  MutationSignupArgs
} from "__generated__/schemaTypes";

dotenv.config();

export const user = {
  signup: async (_: any, { input }: MutationSignupArgs, { models }: any) => {
    const { firstname, lastname, email, password, telephone } = input;
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        firstname,
        lastname,
        email: email.trim().toLowerCase(),
        password: hashed,
        telephone
      });
      // create and return the json web token
      // TODO:
      return {
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
          expiresIn: "2h"
        })
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  login: async (_: any, { input }: MutationLoginArgs, { models }: any) => {
    let { email, password } = input;
    email = email.trim().toLowerCase();
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
    return { token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!) };
  }
};
