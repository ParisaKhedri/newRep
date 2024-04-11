import jwt from "jsonwebtoken";

export default function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};
