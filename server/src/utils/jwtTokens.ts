import { AuthenticationError } from "apollo-server-core";
import { sign, verify } from "jsonwebtoken";

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

// FIXME: do we need this (express-jwt should do this for us)
export const signRefreshToken = (id: number) => {
  try {
    const refreshToken = sign(
      { userId: id },
      process.env.REFRESH_TOKEN_JWT_SECRET!,
      {
        expiresIn: "1d"
      }
    );

    return refreshToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized...");
  }
};

// FIXME: do we need this (express-jwt should do this for us)
export const verifyAccessToken = <T>(token: string): T | null => {
  try {
    const verifiedAccessToken = verify(
      token,
      process.env.ACCESS_TOKEN_JWT_SECRET!
    ) as T;
    return verifiedAccessToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized - cannot verify cookies...");
  }
};

// FIXME: do we need this (express-jwt should do this for us)
export const verifyRefreshToken = <T>(token: string): T | null => {
  try {
    const verifiedRefreshToken = verify(
      token,
      process.env.REFRESH_TOKEN_JWT_SECRET!
    ) as T;
    return verifiedRefreshToken;
  } catch (error) {
    console.error(error);
    throw new AuthenticationError("Unauthorized - cannot verify cookies...");
  }
};
