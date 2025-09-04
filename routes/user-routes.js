import express from 'express';
import { signupController, loginController, getAllUsersController, getUserByIdController } from '../controllers/user-controller.js';

const router = express.Router();

// User signup route
router.post('/signup', (req, res) => {
  console.log('🛣️ POST /users/signup route called');
  signupController(req, res);
});

// User login route
router.post('/login', (req, res) => {
  console.log('🛣️ POST /users/login route called');
  loginController(req, res);
});

// Get all users route
router.get('/', (req, res) => {
  console.log('🛣️ GET /users route called');
  getAllUsersController(req, res);
});

// Get user by ID route
router.get('/:id', (req, res) => {
  console.log('🛣️ GET /users/:id route called with ID:', req.params.id);
  getUserByIdController(req, res);
});
export default router;
