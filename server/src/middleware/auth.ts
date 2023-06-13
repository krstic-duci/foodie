import { AuthChecker } from "type-graphql";
import { Context } from "types";

export const authChecker: AuthChecker<Context> = ({
  root,
  args,
  context,
  info
}) => {
  if (!context.user) {
    return false;
  }
  return true;
};
