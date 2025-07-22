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
        attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'tinggi_badan', 'berat_badan', 'lingkar_lengan', 'lingkar_pinggang'],
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
        attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'hba1c', 'gd_puasa', 'gd_2_jam_pp', 'gd_sewaktu'],
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
      attributes: ['id', 'user_id', 'tanggal_pemeriksaan', 'tekanan_sistolik', 'tekanan_diastolik'],
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
          const created = await DataKesehatan.create(req.body);
          res.status(201).json(created);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      };
      
      // Update data
exports.update = async (req, res) => {
        try {
          const updated = await DataKesehatan.update(req.body, {
            where: { id: req.params.id }
          });
          res.json({ message: "Data berhasil diperbarui" }, req.body );
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