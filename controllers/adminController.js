const Admin = require('../models/Admin');
const User = require('../models/user');
const DataKesehatan = require('../models/dataKesehatan');
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
exports.getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const users = await User.findAll({
      include: [{
        model: DataKesehatan,
        separate: true,
        order: [['tanggal_pemeriksaan', 'DESC']],
        limit: 1
      }]
    });

    let totalPeriksa = 0;
    let totalBelumPeriksa = 0;
    let jumlahRisikoTinggi = 0;

    const statusBMI = { Kurus: 0, Normal: 0, Gemuk: 0, Obesitas: 0 };
    const statusGula = { Hipoglikemia: 0, Normal: 0, Pradiabetes: 0, Diabetes: 0 };
    const statusTekanan = {
      Rendah: 0,
      Normal: 0,
      'Pra Hipertensi': 0,
      'Hipertensi Tahap 1': 0,
      'Hipertensi Tahap 2': 0
    };

    // Detail risiko tinggi
    const risikoTinggiDetail = {
      Pradiabetes: 0,
      Diabetes: 0,
      'Pra Hipertensi': 0,
      'Hipertensi Tahap 1': 0,
      'Hipertensi Tahap 2': 0
    };

    for (const user of users) {
      const data = user.data_kesehatans[0];

      if (!data) {
        totalBelumPeriksa++;
        continue;
      }

      const tgl = new Date(data.tanggal_pemeriksaan);
      const isThisMonth = tgl.getMonth() + 1 === currentMonth && tgl.getFullYear() === currentYear;

      if (isThisMonth) {
        totalPeriksa++;

        // Cek risiko tinggi dan catat detilnya
        if (data.status_gula_darah === 'Pradiabetes') {
          jumlahRisikoTinggi++;
          risikoTinggiDetail.Pradiabetes++;
        }
        if (data.status_gula_darah === 'Diabetes') {
          jumlahRisikoTinggi++;
          risikoTinggiDetail.Diabetes++;
        }
        if (data.status_tekanan_darah === 'Pra Hipertensi') {
          jumlahRisikoTinggi++;
          risikoTinggiDetail['Pra Hipertensi']++;
        }
        if (data.status_tekanan_darah === 'Hipertensi Tahap 1') {
          jumlahRisikoTinggi++;
          risikoTinggiDetail['Hipertensi Tahap 1']++;
        }
        if (data.status_tekanan_darah === 'Hipertensi Tahap 2') {
          jumlahRisikoTinggi++;
          risikoTinggiDetail['Hipertensi Tahap 2']++;
        }
      } else {
        totalBelumPeriksa++;
      }

      // Histogram semua data terakhir
      if (data.status_bmi && statusBMI[data.status_bmi] !== undefined) {
        statusBMI[data.status_bmi]++;
      }

      if (data.status_gula_darah && statusGula[data.status_gula_darah] !== undefined) {
        statusGula[data.status_gula_darah]++;
      }

      if (data.status_tekanan_darah && statusTekanan[data.status_tekanan_darah] !== undefined) {
        statusTekanan[data.status_tekanan_darah]++;
      }
    }

    // History pemeriksaan per bulan tahun ini
    const historyPeriksa = Array(12).fill(0);
    const allData = await DataKesehatan.findAll();
    for (const data of allData) {
      const tgl = new Date(data.tanggal_pemeriksaan);
      if (tgl.getFullYear() === currentYear) {
        const bulan = tgl.getMonth(); // 0-based
        historyPeriksa[bulan]++;
      }
    }

    res.json({
      totalUsers: users.length,
      totalPeriksa,
      totalBelumPeriksa,
      jumlahRisikoTinggi,
      risikoTinggiDetail,
      statusBMI,
      statusGula,
      statusTekanan,
      historyPeriksa,
      currentMonth,
      currentYear,
      now
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data dashboard." });
  }
};

