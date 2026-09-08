import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
export const digest = (value) =>
  createHash('sha256').update(value).digest('hex');
export const sessionToken = () => randomBytes(32).toString('hex');
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, encoded) {
  const [salt, hex] = encoded.split(':');
  const hash = await derive(password, salt, 64);
  const expected = Buffer.from(hex, 'hex');
  return expected.length === hash.length && timingSafeEqual(expected, hash);
}
export function cookieToken(req) {
  return (
    (req.headers.cookie || '')
      .split(';')
      .map((x) => x.trim())
      .find((x) => x.startsWith('session='))
      ?.slice(8) || ''
  );
}
