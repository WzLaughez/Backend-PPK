const User = require('../models/user');
const bcrypt = require('bcrypt');
const DataKesehatan = require('../models/dataKesehatan');
// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    // Kecuali password, ambil semua data user
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    // Ubah ke objek biasa dan hitung umur
    const result = users.map(user => {
      const plainUser = user.toJSON();

      if (plainUser.tanggal_lahir) {
        const today = new Date();
        const birthDate = new Date(plainUser.tanggal_lahir);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        plainUser.umur = age;
      }

      return plainUser;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const plainUser = user.toJSON();

    // Hitung umur dari tanggal_lahir
    if (plainUser.tanggal_lahir) {
      const today = new Date();
      const birthDate = new Date(plainUser.tanggal_lahir);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      plainUser.umur = age;
    }

    res.json(plainUser);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};


// GET jumlah user yang belum periksa bulan ini
exports.getBelumPeriksaBulanIni = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: DataKesehatan,
        attributes: ['tanggal_pemeriksaan'],
        separate: true,
        order: [['tanggal_pemeriksaan', 'DESC']],
        limit: 1
      }]
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const belumPeriksa = users.filter(user => {
      const lastCheck = user.data_kesehatans?.[0]?.tanggal_pemeriksaan;
      if (!lastCheck) return true;
      const tgl = new Date(lastCheck);
      return (tgl.getMonth() +1) !== currentMonth || tgl.getFullYear() !== currentYear;
    });

    res.json({ total: belumPeriksa.length, currentMonth, currentYear});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data pengguna yang belum periksa." });
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
      jenis_kelamin,
      agama,
      alamat,
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
      jenis_kelamin,
      agama,
      alamat,
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
      jenis_kelamin,
      agama,
      alamat,
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
      jenis_kelamin,
      alamat,
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
