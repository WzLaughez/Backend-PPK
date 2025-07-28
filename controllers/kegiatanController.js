const Kegiatan = require("../models/kegiatan");

// Ambil semua kegiatan
exports.getAll = async (req, res) => {
  try {
    const data = await Kegiatan.findAll({ order: [["date", "ASC"]] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil kegiatan berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const data = await Kegiatan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah kegiatan baru
exports.create = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const data = await Kegiatan.create({ title, description, date });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update kegiatan berdasarkan ID
exports.update = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const kegiatan = await Kegiatan.findByPk(req.params.id);
    if (!kegiatan) return res.status(404).json({ message: "Data tidak ditemukan" });

    await kegiatan.update({ title, description, date });
    res.json(kegiatan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Hapus kegiatan
exports.remove = async (req, res) => {
  try {
    const kegiatan = await Kegiatan.findByPk(req.params.id);
    if (!kegiatan) return res.status(404).json({ message: "Data tidak ditemukan" });

    await kegiatan.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
