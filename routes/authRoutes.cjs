const express = require('express');
const router = express.Router();
const { login, signUp } = require('../controllers/authController.cjs');

// Login route
router.post('/login', login);

// Register route
router.post('/register', signUp);

module.exports = router;