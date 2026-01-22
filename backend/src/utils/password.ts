import crypto from 'crypto';

const SALT_ROUNDS = 12;

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(SALT_ROUNDS);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return salt.toString('hex') + ':' + hash.toString('hex');
};

export const verifyPassword = (password: string, hashed: string): boolean => {
  const parts = hashed.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const salt = Buffer.from(parts[0], 'hex');
  const hash = parts[1];

  const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return testHash.toString('hex') === hash;
};
