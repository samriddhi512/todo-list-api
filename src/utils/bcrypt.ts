import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function encodePassword(rpassword: string) {
  return bcrypt.hash(rpassword, SALT_ROUNDS);
}

export async function isValidPassword(rpassword: string, epassword: string) {
  return bcrypt.compare(rpassword, epassword);
}
