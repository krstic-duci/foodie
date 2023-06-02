import { GraphQLError } from "graphql";

export const authMiddleware =
  (next: any) => (parent: any, args: any, context: any) => {
    if (!context.user) {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: 401
        }
      });
    }
    return next(parent, args, context);
  };
