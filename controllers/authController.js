const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  const { nik, password } = req.body;
  try {
    const user = await User.findOne({ where: { nik } });

    if (!user) return res.status(404).json({ message: 'nik tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, nik: user.nik},
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, nik: user.nik} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};