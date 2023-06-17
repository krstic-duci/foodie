import { AuthenticationError } from "apollo-server-core";
import { sign, verify } from "jsonwebtoken";

import {
  ACCESS_TOKEN_FIFTEEN_MINUTES,
  REFERSH_TOKEN_ONE_DAY
} from "./constants";
import { toMilliseconds } from "./toMiliseconds";

type UserWithNoPassword = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export const signAccessToken = ({
  id,
  email,
  firstName,
  lastName
}: UserWithNoPassword) => {
  try {
    const accessToken = sign(
      { id, email, firstName, lastName },
      process.env.ACCESS_TOKEN_JWT_SECRET!,
      {
        expiresIn: "15m"
      }
    );

    return accessToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized...");
  }
};

export const signRefreshToken = ({
  id,
  email,
  firstName,
  lastName
}: UserWithNoPassword) => {
  try {
    const refreshToken = sign(
      { id, email, firstName, lastName },
      process.env.REFRESH_TOKEN_JWT_SECRET!,
      {
        expiresIn: "7 days"
      }
    );

    return refreshToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized...");
  }
};

// FIXME: do we need this (express-jwt should do this for us)
export const verifyAccessToken = (token: string) => {
  try {
    const verifiedAccessToken = verify(
      token,
      process.env.ACCESS_TOKEN_JWT_SECRET!
    );
    return verifiedAccessToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized - cannot verify cookies...");
  }
};

// FIXME: do we need this (express-jwt should do this for us)
export const verifyRefreshToken = (token: string) => {
  try {
    const verifiedRefreshToken = verify(
      token,
      process.env.REFRESH_TOKEN_JWT_SECRET!
    );
    return verifiedRefreshToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized - cannot verify cookies...");
  }
};
