const jwt = require('jsonwebtoken');

const verifyAny = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.user_role !== 'Admin' && decoded.user_role !== 'User') {
        return res.status(403).json({ error: 'Access denied.' });
      }
      
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  module.exports = verifyAny;
