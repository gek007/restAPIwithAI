import { db_runAsync, db_getAsync, db_allAsync } from '../database.js';

import bcrypt from 'bcryptjs';

const createUser = async (userData) => {
  console.log('🔧 createUser called with:', { name: userData.name, email: userData.email });
  const createdAt = new Date().toISOString();

  // Hash the password before storing
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const result = await db_runAsync(
    `INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, ?)`,
    [userData.name, userData.email, hashedPassword, createdAt]
  );
  const user = await findUserById(result.lastID);
  console.log('✅ User created successfully with ID:', user.id);
  return user;
};


/**
 * Verifies user credentials by email and password.
 * @param {string} email - The user's email address.
 * @param {string} plainPassword - The plain text password to check.
 * @returns {Promise<object|null>} - Returns the user object (without password) if credentials are valid, otherwise null.
 */
export async function verifyUserCredentials(email, plainPassword) {
  console.log('🔑 verifyCredentials called with:', { email });
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    console.log('❌ User not found or missing password for email:', email);
    return null;
  }
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  console.log('🔍 Password match result:', isMatch);
  if (!isMatch) {
    console.log('❌ Invalid password for email:', email);
    return null;
  }
  // Exclude password from returned user object
  const { password, ...userWithoutPassword } = user;
  console.log('✅ Credentials verified for user ID:', user.id);
  return userWithoutPassword;
};


const findUserByEmail = async (email) => {
  console.log('🔍 findUserByEmail called with email:', email);
  const row = await db_getAsync(`SELECT * FROM users WHERE email = ?`, [email]);
  console.log('🔍 User found:', row ? `ID ${row.id}` : 'Not found');
  return row || null;
};

const findUserById = async (id) => {
  console.log('🔍 findUserById called with ID:', id);
  const row = await db_getAsync(`SELECT * FROM users WHERE id = ?`, [id]);
  console.log('🔍 User found:', row ? `Email ${row.email}` : 'Not found');
  return row || null;
};

const findAllUsers = async () => {
  console.log('📋 findAllUsers called');
  const rows = await db_allAsync(`SELECT id, name, email, password, createdAt FROM users ORDER BY id ASC`);
  console.log('📋 Returning', rows.length, 'users');
  return rows;
};

const emailExists = async (email) => {
  console.log('📧 emailExists called with email:', email);
  const row = await db_getAsync(`SELECT 1 FROM users WHERE email = ?`, [email]);
  const exists = !!row;
  console.log('📧 Email exists:', exists);
  return exists;
};

const validateUser = async (userData) => {
  console.log('✅ validateUser called with:', { name: userData.name, email: userData.email });
  const errors = [];

  // Name validation
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Email validation (format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push('Valid email is required');
  } else {
    // Email uniqueness check
    const exists = await emailExists(userData.email);
    if (exists) {
      errors.push('Email already exists');
    }
  }

  // Password validation
  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  console.log('✅ Validation result:', errors.length > 0 ? errors : 'Valid');
  return errors;
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUsers,
  emailExists,
  validateUser
};
