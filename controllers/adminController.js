const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (err) {
    res.status(400).json({ message: 'Gagal membuat admin', error: err.message });   
  }
}
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: admin.id, username: admin.username, is_admin: true }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
};
