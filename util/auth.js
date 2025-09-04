import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abc_test_token'; // In production, use env variable

/**
 * Generates a JWT for a user.
 * @param {object} user - The user object (must include id and email).
 * @param {object} [options] - Optional jwt.sign options (e.g., expiresIn).
 * @returns {string} - The signed JWT.
 */
export function generateJWT(user, options = { expiresIn: '1h' }) {
  if (!user || !user.id || !user.email) {
    throw new Error('User object with id and email required to generate JWT');
  }
  const payload = {
    id: user.id,
    email: user.email
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a JWT and returns the decoded payload if valid.
 * @param {string} token - The JWT to verify.
 * @returns {object|null} - The decoded payload if valid, otherwise null.
 */
export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
