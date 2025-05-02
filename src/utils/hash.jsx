import CryptoJS from 'crypto-js';

const SALT = import.meta.env.VITE_COURSE_SALT;
if (!SALT) {
  throw new Error('Missing VITE_COURSE_SALT in .env');
}
export function encodeId(id) {
  const str = String(id);
  const encrypted = CryptoJS.AES.encrypt(str, SALT).toString();
  return encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
export function decodeId(hash) {
  let b64 = hash
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  try {
    const bytes = CryptoJS.AES.decrypt(b64, SALT);
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch {
    return null;
  }
}
