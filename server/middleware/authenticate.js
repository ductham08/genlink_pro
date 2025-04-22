import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Token không tồn tại!', 
      error_code: 1002 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn!', 
        error_code: 1003 
      });
    }
    return res.status(403).json({ 
      message: 'Token không hợp lệ!', 
      error_code: 1004 
    });
  }
};

export default authenticateToken; 