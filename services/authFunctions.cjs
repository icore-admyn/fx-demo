const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { usersDB } = require('../models/database.cjs');
require('dotenv').config()

// Generate secrete auth token 
const generateToken = (userId, email) => {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET);
};

// Validate that login details match
const validateLogin = async (user, password) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return false;
    }
    return true;
}

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


module.exports = {
    generateToken,
    validateLogin,
    hashPassword,
}