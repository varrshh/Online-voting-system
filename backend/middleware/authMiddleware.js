const jwt = require('jsonwebtoken');

// Middleware to authenticate using JWT
const protect = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;  // Attach the user payload to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
//$2a$10$6r/RxdiSBMxOVlwYAqgzH.UGYJtL8sz4ETIi1Ird1.TtyCUyo7jme