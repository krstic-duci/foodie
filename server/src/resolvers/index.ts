import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import User from "../db/models/user";
import { FIFTEEN_MINUTES, SEVEN_DAYS } from "../utils/constants";
import { createTokens } from "../utils/createTokens";

export const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      const user = await User.findById(req.userId);

      return user;
    }
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword
      });

      return true;
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email: email.trim() });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      const tokens = createTokens(user);

      res.cookie("refresh-token", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: SEVEN_DAYS
        // sameSite: lax
      });
      res.cookie("access-token", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: FIFTEEN_MINUTES
        // sameSite: lax
      });

      return user;
    },
    invalidateTokens: async (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      // FIXME: this is so wrong
      const user = await User.findById(req.userId);
      if (!user) {
        return false;
      }

      user.count += 1;
      console.log(user, "RESOLVERS 1");
      return true;
    }
  }
};
