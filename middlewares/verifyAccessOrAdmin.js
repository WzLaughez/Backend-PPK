export const verifyAccessOrAdmin = (req, res, next) => {
  const userId = req.user.id; // dari token
  const paramId = parseInt(req.params.id);
  const isAdmin = req.user.role === 'admin';
  
  if (userId === paramId || isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak', isAdmin });
  }
};
