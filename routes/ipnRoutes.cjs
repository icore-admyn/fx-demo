const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.cjs');
const { ipn, success, error } = require('../controllers/ipnController.cjs');

// Post IPN vailidation
router.post('/', authMiddleware, ipn);

// Redirect success page
router.get('/success', success);

// Redirect error page
router.get('/error', error);

module.exports = router;