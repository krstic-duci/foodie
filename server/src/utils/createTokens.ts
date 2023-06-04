import { sign } from "jsonwebtoken";

import { User } from "__generated__/schemaTypes";

export const createTokens = (user: User) => {
  const refreshToken = sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_JWT_SECRET!,
    {
      expiresIn: "7d"
    }
  );
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_JWT_SECRET!,
    {
      expiresIn: "10s"
    }
  );
  return { refreshToken, accessToken };
};
