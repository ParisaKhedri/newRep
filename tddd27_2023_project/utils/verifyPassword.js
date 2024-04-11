import { verify } from "argon2";

export default async function verifyPassword(hash, password) {
  return await verify(hash, password);
};
