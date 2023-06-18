import { AuthenticationError } from "apollo-server-core";
import { sign, verify } from "jsonwebtoken";

import {
  ACCESS_TOKEN_FIFTEEN_MINUTES,
  REFERSH_TOKEN_TWO_DAYS
} from "./constants";

export const signAccessToken = (id: string) => {
  try {
    const accessToken = sign({ id }, process.env.ACCESS_TOKEN_JWT_SECRET!, {
      expiresIn: ACCESS_TOKEN_FIFTEEN_MINUTES
    });

    return accessToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError(
      "Something is wrong, please check login details..."
    );
  }
};

export const signRefreshTokenInCookie = (id: string) => {
  try {
    const foodieCookie = sign({ id }, process.env.REFRESH_TOKEN_JWT_SECRET!, {
      expiresIn: REFERSH_TOKEN_TWO_DAYS
    });

    return foodieCookie;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError(
      "Something is wrong, please check login details..."
    );
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    const verifiedAccessToken = verify(
      token,
      process.env.ACCESS_TOKEN_JWT_SECRET!
    );
    return verifiedAccessToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized...");
  }
};

export const verifyRefreshTokenInCookie = (token: string) => {
  try {
    const verifiedRefreshToken = verify(
      token,
      process.env.REFRESH_TOKEN_JWT_SECRET!
    );
    return verifiedRefreshToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized...");
  }
};
