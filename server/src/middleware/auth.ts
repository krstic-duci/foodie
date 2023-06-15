import { AuthChecker } from "type-graphql";

import type { CustomContext } from "@utils/types";

export const authMiddleware: AuthChecker<CustomContext> = ({
  root,
  args,
  context,
  info
}) => {
  // TODO: only for testing
  // console.log(context.req.auth, 'AUTH MIDDLEWARE')
  if (!context.req.auth) {
    return false;
  }
  return true;
};
