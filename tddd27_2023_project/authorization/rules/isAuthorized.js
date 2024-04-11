import { rule } from "graphql-shield";
import verifyToken from "../../utils/verifyToken.js";

export const isAuthorized = rule()(async (parent, args, context, info) => {
    const token = context.token;

    if (!token) {
      return false;
    }
  
    const { userId } = verifyToken(token);
    return !!userId;
});
