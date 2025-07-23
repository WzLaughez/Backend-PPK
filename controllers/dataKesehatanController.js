const DataKesehatan = require("../models/dataKesehatan");
const { Op, fn, col, where, Sequelize } = require("sequelize");
// Ambil semua data
exports.getAll = async (req, res) => {
  try {
    const data = await DataKesehatan.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil data berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const data = await DataKesehatan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Ambil data berdasarkan bulan dan tahun untuk Admin

exports.getByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Tahun (year) dibutuhkan" });
    }

    const conditions = [
      Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("tanggal_pemeriksaan")), year)
    ];

    if (month) {
      conditions.push(
        Sequelize.where(Sequelize.fn("MONTH", Sequelize.col("tanggal_pemeriksaan")), month)
      );
    }

    const data = await DataKesehatan.findAll({
      where: {
        tanggal_pemeriksaan: {
          [Op.and]: conditions
        }
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving data", error: err.message });
  }
};

// Ambil data berdasarkan tahun untuk User
exports.getByYear = async (req, res) => {
  try {
    const { year, user_id } = req.query;

    if (!year || !user_id) {
      return res.status(400).json({ message: "Tahun dan user_id wajib diisi" });
    }

    const data = await DataKesehatan.findAll({
      where: {
        user_id: parseInt(user_id),
        [Op.and]: where(fn('YEAR', col('tanggal_pemeriksaan')), year)
      },
      order: [['tanggal_pemeriksaan', 'ASC']]
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data per tahun", error: err.message });
  }
};

// GET /data_kesehatan?user_id=1
exports.getAllByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const where = user_id ? { user_id: parseInt(user_id) } : {};

    const data = await DataKesehatan.findAll({ where ,
      order: [['tanggal', 'DESC']]});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==============================
// 👇 Tambahan untuk data spesifik
// ==============================

// GET /data_kesehatan/filter/bmi / data_kesehatan/filter/bmi?user_id=1
exports.getBMI = async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: req.query.user_id } : {};
    const data = await DataKesehatan.findAll({
        where,
        attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'tinggi_badan', 'berat_badan', 'lingkar_lengan', 'lingkar_pinggang', 'status_bmi'],
        order: [['tanggal_pemeriksaan', 'DESC']]
    });
    res.json(data);
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

// GET /data_kesehatan/filter/gula_darah?user_id=1
exports.getGulaDarah = async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: req.query.user_id } : {};
    const data = await DataKesehatan.findAll({
        where,
        attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'gula_darah', 'tipe_gula_darah', 'status_gula_darah'],
        order: [['tanggal_pemeriksaan', 'DESC']]
    });
    res.json(data);
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

// GET /data_kesehatan/filter/tekanan_darah?user_id=1
exports.getTekananDarah = async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: req.query.user_id } : {};
    const data = await DataKesehatan.findAll({
      where,
      attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'tekanan_sistolik', 'tekanan_diastolik', 'status_tekanan_darah'],
      order: [['tanggal_pemeriksaan', 'DESC']]
    });
    res.json(data);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

      // Buat data baru
exports.create = async (req, res) => {
        try {
    const {
      tinggi_badan,
      berat_badan,
      gula_darah,
      tipe_gula_darah,
      tekanan_sistolik,
      tekanan_diastolik,
      ...rest
    } = req.body;
    // Hitung BMI
    let bmi = null;
    if (tinggi_badan && berat_badan) {
      const tinggi_m = parseFloat(tinggi_badan) / 100;
      bmi = berat_badan / (tinggi_m * tinggi_m);
    }
    // Logika status BMI
    let status_bmi = null;
    if (bmi) {
      if (bmi < 18.5) status_bmi = 'Kurus';
      else if (bmi < 25) status_bmi = 'Normal';
      else if (bmi < 30) status_bmi = 'Gemuk';
      else status_bmi = 'Obesitas';
    }

    // Logika status Gula Darah
    let status_gula_darah = null;
    if (gula_darah && tipe_gula_darah) {
      const gd = parseFloat(gula_darah);
      switch (tipe_gula_darah) {
        case 'puasa':
          if (gd < 70) status_gula_darah = 'Hipoglikemia';
          else if (gd <= 100) status_gula_darah = 'Normal';
          else if (gd <= 125) status_gula_darah = 'Pradiabetes';
          else status_gula_darah = 'Diabetes';
          break;
        case '2_jam_pp':
          if (gd < 140) status_gula_darah = 'Normal';
          else if (gd <= 199) status_gula_darah = 'Pradiabetes';
          else status_gula_darah = 'Diabetes';
          break;
        case 'sewaktu':
          if (gd < 200) status_gula_darah = 'Normal';
          else status_gula_darah = 'Diabetes';
          break;
      }
    }

    // Logika status Tekanan Darah
    let status_tekanan_darah = null;
    if (tekanan_sistolik && tekanan_diastolik) {
      const sis = parseInt(tekanan_sistolik);
      const dias = parseInt(tekanan_diastolik);

      if (sis < 90 || dias < 60) status_tekanan_darah = 'Rendah';
      else if (sis <= 120 && dias <= 80) status_tekanan_darah = 'Normal';
      else if (sis <= 139 || dias <= 89) status_tekanan_darah = 'Pra Hipertensi';
      else if (sis <= 159 || dias <= 99) status_tekanan_darah = 'Hipertensi Tahap 1';
      else status_tekanan_darah = 'Hipertensi Tahap 2';
    }

    // Gabungkan semuanya ke body
    const newData = await DataKesehatan.create({
      ...rest,
      tinggi_badan,
      berat_badan,
      gula_darah,
      tipe_gula_darah,
      tekanan_sistolik,
      tekanan_diastolik,
      status_bmi,
      status_gula_darah,
      status_tekanan_darah
    });

    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
      
      // Update data
exports.update = async (req, res) => {
        try {
    const id = req.params.id;
    const {
      tinggi_badan,
      berat_badan,
      gula_darah,
      tipe_gula_darah,
      tekanan_sistolik,
      tekanan_diastolik,
      ...rest
    } = req.body;

    // Hitung BMI
    let bmi = null;
    if (tinggi_badan && berat_badan) {
      const tinggi_m = parseFloat(tinggi_badan) / 100;
      bmi = berat_badan / (tinggi_m * tinggi_m);
    }

    // Status BMI
    let status_bmi = null;
    if (bmi) {
      if (bmi < 18.5) status_bmi = 'Kurus';
      else if (bmi < 25) status_bmi = 'Normal';
      else if (bmi < 30) status_bmi = 'Gemuk';
      else status_bmi = 'Obesitas';
    }

    // Status Gula Darah
    let status_gula_darah = null;
    if (gula_darah && tipe_gula_darah) {
      const gd = parseFloat(gula_darah);
      switch (tipe_gula_darah) {
        case 'puasa':
          if (gd < 70) status_gula_darah = 'Hipoglikemia';
          else if (gd <= 100) status_gula_darah = 'Normal';
          else if (gd <= 125) status_gula_darah = 'Pradiabetes';
          else status_gula_darah = 'Diabetes';
          break;
        case '2_jam_pp':
          if (gd < 140) status_gula_darah = 'Normal';
          else if (gd <= 199) status_gula_darah = 'Pradiabetes';
          else status_gula_darah = 'Diabetes';
          break;
        case 'sewaktu':
          if (gd < 200) status_gula_darah = 'Normal';
          else status_gula_darah = 'Diabetes';
          break;
      }
    }

    // Status Tekanan Darah
    let status_tekanan_darah = null;
    if (tekanan_sistolik && tekanan_diastolik) {
      const sis = parseInt(tekanan_sistolik);
      const dias = parseInt(tekanan_diastolik);

      if (sis < 90 || dias < 60) status_tekanan_darah = 'Rendah';
      else if (sis <= 120 && dias <= 80) status_tekanan_darah = 'Normal';
      else if (sis <= 139 || dias <= 89) status_tekanan_darah = 'Pra Hipertensi';
      else if (sis <= 159 || dias <= 99) status_tekanan_darah = 'Hipertensi Tahap 1';
      else status_tekanan_darah = 'Hipertensi Tahap 2';
    }

    const updated = await DataKesehatan.update(
      {
        ...rest,
        tinggi_badan,
        berat_badan,
        gula_darah,
        tipe_gula_darah,
        tekanan_sistolik,
        tekanan_diastolik,
        status_bmi,
        status_gula_darah,
        status_tekanan_darah,
      },
      { where: { id }, returning: true }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json(updated[1][0]); // updated[1] is the array of updated rows
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
      
      // Hapus data
exports.destroy = async (req, res) => {
        try {
          await DataKesehatan.destroy({ where: { id: req.params.id } });
          res.json({ message: "Data berhasil dihapus" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      };