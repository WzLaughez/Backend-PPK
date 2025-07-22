const User = require('../models/user');
const bcrypt = require('bcrypt');
// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  // ❗ Pastikan user yang login sesuai dengan ID yang diminta
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Kamu tidak punya akses ke data ini' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};
// CREATE user
exports.createUser = async (req, res) => {
  try {
    const {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      agama,
      no_hp,
      rt,
      rw,
      email
    } = req.body;

    // Format tanggal_lahir ke string YYYYMMDD
    const dateObj = new Date(tanggal_lahir);
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // getMonth() dari 0-11
    const yyyy = dateObj.getFullYear();
    const formattedDate = `${dd}${mm}${yyyy}`;

    // Hash password dari tanggal lahir
    const hashedPassword = await bcrypt.hash(formattedDate, 10);

    // Buat user
    const user = await User.create({
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      agama,
      no_hp,
      rt,
      rw,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      agama,
      no_hp,
      rt,
      rw,
      email
    } = req.body;

    // Cari user
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Jika tanggal_lahir diubah, hash ulang password
    let hashedPassword = user.password; // default: tetap pakai password lama
    if (tanggal_lahir) {
      const dateObj = new Date(tanggal_lahir);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      const formattedDate = `${dd}${mm}${yyyy}`;
      hashedPassword = await bcrypt.hash(formattedDate, 10);
    }

    // Update user
    await user.update({
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      agama,
      no_hp,
      rt,
      rw,
      email,
      password: hashedPassword
    });

    res.status(200).json({ message: 'User berhasil diupdate', user });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate user', error: err.message });
  }
};


// DELETE user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
