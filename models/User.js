// User model - basic structure without database integration
const users = []; // In-memory storage for now

// Create a new user
const createUser = (userData) => {
  console.log('🔧 createUser called with:', { name: userData.name, email: userData.email });
  
  const newUser = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  console.log('✅ User created successfully with ID:', newUser.id);
  return newUser;
};

// Find user by email
const findUserByEmail = (email) => {
  console.log('🔍 findUserByEmail called with email:', email);
  const user = users.find(user => user.email === email);
  console.log('🔍 User found:', user ? `ID ${user.id}` : 'Not found');
  return user;
};

// Find user by ID
const findUserById = (id) => {
  console.log('🔍 findUserById called with ID:', id);
  const user = users.find(user => user.id === id);
  console.log('🔍 User found:', user ? `Email ${user.email}` : 'Not found');
  return user;
};

// Get all users
const findAllUsers = () => {
  console.log('📋 findAllUsers called, returning', users.length, 'users');
  return users;
};

// Check if email already exists
const emailExists = (email) => {
  console.log('📧 emailExists called with email:', email);
  const exists = users.some(user => user.email === email);
  console.log('📧 Email exists:', exists);
  return exists;
};

// Validate user data
const validateUser = (userData) => {
  console.log('✅ validateUser called with:', { name: userData.name, email: userData.email });
  const errors = [];
  
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!userData.email || !userData.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
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
