import { verify } from "jsonwebtoken";

const getUserFromToken = (token: string | null) => {
  console.log(token);
  if (token) {
    try {
      return verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!);
    } catch (err) {
      throw new Error("JWT cannot be verified invalid");
    }
  }

  return null;
};

export default getUserFromToken;
