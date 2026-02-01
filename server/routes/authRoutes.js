const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
// Requirement: "User registration (Admin-only)"
// So we protect this route
router.post('/register', protect, authorize('admin'), registerUser);

module.exports = router;
