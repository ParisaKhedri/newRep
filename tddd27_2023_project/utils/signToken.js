import jwt from "jsonwebtoken";


export default function signToken (data) {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(data, secret, {expiresIn: '24h'});
  
  return token;
};