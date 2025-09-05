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

/**
 * Express middleware to extract and validate the JWT token from the Authorization header.
 * If a valid Bearer token is found and verified, attaches the decoded payload to req.user.
 * If the token is missing or invalid, responds with 401 Unauthorized.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export function tokenAuthentication(req, res, next) {
  let token = null;
  if (
    req &&
    req.headers &&
    req.headers.authorization &&
    typeof req.headers.authorization === 'string'
  ) {
    const authHeader = req.headers.authorization;
    // Expecting format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token missing or malformed'
    });
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token'
    });
  }
  req.user = decoded;
  next();
}



