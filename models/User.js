import { db_runAsync, db_getAsync, db_allAsync } from '../database.js';

const createUser = async (userData) => {
  console.log('🔧 createUser called with:', { name: userData.name, email: userData.email });
  const createdAt = new Date().toISOString();
  const result = await db_runAsync(
    `INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, ?)`,
    [userData.name, userData.email, userData.password, createdAt]
  );
  const user = await findUserById(result.lastID);
  console.log('✅ User created successfully with ID:', user.id);
  return user;
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
