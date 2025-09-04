import express from 'express';
import userRoutes from './routes/user-routes.js';
import eventRouter from './routes/events-routes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to REST API with User Authentication',
    version: '1.0.0',
    endpoints: {
      signup: 'POST /users/signup',
      login: 'POST /users/login',
      getAllUsers: 'GET /users',
      getUserById: 'GET /users/:id'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}`);
  console.log(`👤 User endpoints: http://localhost:${PORT}/users`);
});

export default app;