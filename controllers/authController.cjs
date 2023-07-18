const { generateToken, validateLogin, hashPassword, } = require('../services/authFunctions.cjs')
const { findUser, createUser, insertUser } = require('../services/userFunctions.cjs')

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user in the database
        const user = await findUser(email)
        if (!user) {
            console.log('Invalid email or password')
            return res.status(500).json({ error: 'Invalid email or password' });
        }

        // If the password is incorrect, return an error
        const validateUser = await validateLogin(user, password)
        if (!validateUser) {
            console.log('Invalid email or password');
            return res.status(500).json({ error: 'Invalid email or password' });
        }

        // Log the email
        console.log('User logged in:', user.email);

        // Generate a JWT with the user's ID and role
        const token = await generateToken(user._id, user.email);
        res.status(201).json({ token });

    } catch (err) {
        // Return error
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create admin user
const signUp = async (req, res) => {
    const { email, password, relayUrl, walletAddress, key } = req.body;

    try {
        // Find if the user is already in the database
        const user = await findUser(email)
        if (user) {
            console.log('User already exists!')
            return res.status(500).json({ error: 'User already exists!' });
        }

        // Hash password and create new user
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser(email, hashedPassword, relayUrl, walletAddress, key);
        const insert = await insertUser(newUser);
        if (!insert.status) {
            console.log(insert.error)
            return res.status(500).json({ error: insert.error });
        }

        // Log the created user
        console.log('User created:', newUser);

        // Generate a JWT with the new user's ID
        const token = await generateToken(newUser._id, newUser.email);
        res.status(201).json({ token });

    } catch (err) {
        // Return error
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    login,
    signUp
};