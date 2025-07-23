const jwt = require('jsonwebtoken');
exports.verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token dibutuhkan' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.is_admin) {
      return res.status(403).json({ message: 'Akses hanya untuk admin' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token admin tidak valid' });
  }
};
