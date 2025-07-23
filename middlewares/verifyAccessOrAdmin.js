
exports.verifyAccessOrAdmin = (req, res, next) => {
  const { id } = req.params;

  if (req.user.is_admin || req.user.id === parseInt(id)) {
    return next();
  }

  return res.status(403).json({ message: 'Akses ditolak' });
};
