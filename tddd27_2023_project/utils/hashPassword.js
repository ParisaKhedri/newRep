import { hash } from "argon2";


export default async function hashPassword(password) {
  return await hash(password);
};
