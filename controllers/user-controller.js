import { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  findAllUsers, 
  emailExists, 
  validateUser 
} from '../models/User.js';

// User signup
const signup = async (req, res) => {
  console.log('🚀 signup function called');
  console.log('📝 Request body:', req.body);
  
  // Check if request body exists
  if (!req.body) {
    console.log('❌ No request body provided');
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  
  try {
    const { name, email, password } = req.body;

    // Validate input data
    const validationErrors = validateUser({ name, email, password });
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if email already exists
    if (await emailExists(email)) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new user
    const newUser = await createUser({ name, email, password });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log('✅ Signup successful for user:', userWithoutPassword.id);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// User login
const login = async (req, res) => {
  console.log('🔑 login function called');
  console.log('📝 Request body:', req.body);
  
  // Check if request body exists
  if (!req.body) {
    console.log('❌ No request body provided');
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (simple comparison for now)
    if (user.password !== password) {
      console.log('❌ Invalid password for user:', user.id);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('✅ Login successful for user:', userWithoutPassword.id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  console.log('📋 getAllUsers function called');
  try {
    const users = await findAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    console.log('✅ Retrieved', usersWithoutPasswords.length, 'users');
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      users: usersWithoutPasswords,
      count: users.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  console.log('🔍 getUserById function called with ID:', req.params.id);
  try {
    const { id } = req.params;
    const user = await findUserById(parseInt(id));

    if (!user) {
      console.log('❌ User not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data (without password)
    const { password, ...userWithoutPassword } = user;

    console.log('✅ User retrieved successfully:', userWithoutPassword.id);
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  signup,
  login,
  getAllUsers,
  getUserById
};