const jwt = require('jsonwebtoken');

// Middleware to authenticate using JWT
const protect = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224');
   // Attach the decoded user info to req.user
   req.user = { id: decoded.id, username: decoded.username }; // Attach the user payload to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
//$2a$10$6r/RxdiSBMxOVlwYAqgzH.UGYJtL8sz4ETIi1Ird1.TtyCUyo7jme