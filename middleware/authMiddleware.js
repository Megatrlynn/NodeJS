const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 'turbodiesel', (err, decodedToken) => { // Use the secret key here
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized: Token has expired' });
      }
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.user = decodedToken;
    next();
  });
};

module.exports = { authenticateToken };
