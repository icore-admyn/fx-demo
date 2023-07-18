const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.cjs');
const { getUser, editUser, deposit } = require('../controllers/userController.cjs');

// Get user settings
router.get('/', authMiddleware, getUser);

// Edit user settings
router.post('/', authMiddleware, editUser);

// Deposit route
router.post('/deposit', authMiddleware, deposit);

module.exports = router;