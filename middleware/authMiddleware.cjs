const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Set the user ID on the request object
        req.userId = decodedToken.userId;
        req.email = decodedToken.email;

        next();
      } catch (err) {
        // Token verification failed
        return res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      // Token not found in the Authorization header
      return res.status(401).json({ error: 'Token not found' });
    }
  } else {
    // Authorization header not found
    return res.status(401).json({ error: 'Authorization header not found' });
  }
};

module.exports = authMiddleware;
