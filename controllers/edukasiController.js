const Edukasi = require("../models/edukasi");

// GET all
exports.getAll = async (req, res) => {
  const data = await Edukasi.findAll({ order: [["createdAt", "DESC"]] });
  res.json(data);
};
exports.get3 = async (req, res) => {
  try {
    const data = await Edukasi.findAll({
      limit: 3, // 🔹 batasi hanya 3 data
      order: [["createdAt", "DESC"]],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data edukasi" });
  }
};

// GET by ID
exports.getById = async (req, res) => {
  const data = await Edukasi.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json(data);
};

// CREATE
exports.create = async (req, res) => {
  const { title, description } = req.body;
  const image_url = req.file ? `/uploads/edukasi/${req.file.filename}` : null;
  const data = await Edukasi.create({ title, description, image_url });
  res.status(201).json(data);
};

// UPDATE
exports.update = async (req, res) => {
  const { title, description } = req.body;
  const edukasi = await Edukasi.findByPk(req.params.id);
  if (!edukasi) return res.status(404).json({ message: "Data tidak ditemukan" });

  const image_url = req.file ? `/uploads/edukasi/${req.file.filename}` : edukasi.image_url;
  await edukasi.update({ title, description, image_url });

  res.json(edukasi);
};

// DELETE
exports.remove = async (req, res) => {
  const edukasi = await Edukasi.findByPk(req.params.id);
  if (!edukasi) return res.status(404).json({ message: "Data tidak ditemukan" });

  await edukasi.destroy();
  res.json({ message: "Data berhasil dihapus" });
};
