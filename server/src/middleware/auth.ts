import { AuthChecker } from "type-graphql";

import { COOKIE_NAME } from "@utils/constants";
import {
  verifyAccessToken,
  verifyRefreshTokenInCookie
} from "@utils/jwtTokens";
import type { CustomContext } from "@utils/types";

export const AuthMiddleware: AuthChecker<CustomContext> = ({
  root,
  args,
  context,
  info
}) => {
  // TODO: only for testing
  // console.log(root)
  // console.log(args)
  // console.log(context.req.headers.authorization, 'AUTH MIDDLEWARE')
  // console.log(info)
  const accessToken = context.req.headers.authorization?.split(" ")[1] || "";
  const refreshToken = context.req.cookies[COOKIE_NAME] || "";
  const isAccessTokenVerified = verifyAccessToken(accessToken);
  const isRefreshTokenInCookieVerified =
    verifyRefreshTokenInCookie(refreshToken);

  // 1. if "Cookie" isn't valid deny access
  if (!isRefreshTokenInCookieVerified) {
    return false;
  }
  // 2. if "Authorization" header isn't valid deny access
  if (!isAccessTokenVerified) {
    return false;
  }
  // 3. if "Authorization" header isn't valid but "Cookie" is revoke the
  // access token
  if (isRefreshTokenInCookieVerified) {
    if (!isAccessTokenVerified) {
      // create new "Authorization" token ?!?
      console.log("CREATED NEW AUTH TOKEN");
    }
  }
  return true;
};
