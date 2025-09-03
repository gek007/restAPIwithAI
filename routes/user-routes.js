import express from 'express';
import { signup, login, getAllUsers, getUserById } from '../controllers/user-controller.js';

const router = express.Router();

// User signup route
router.post('/signup', (req, res) => {
  console.log('🛣️ POST /users/signup route called');
  signup(req, res);
});

// User login route
router.post('/login', (req, res) => {
  console.log('🛣️ POST /users/login route called');
  login(req, res);
});

// Get all users route
router.get('/', (req, res) => {
  console.log('🛣️ GET /users route called');
  getAllUsers(req, res);
});

// Get user by ID route
router.get('/:id', (req, res) => {
  console.log('🛣️ GET /users/:id route called with ID:', req.params.id);
  getUserById(req, res);
});

export default router;
