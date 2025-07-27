const Galeri = require("../models/galeri");

exports.getAll = async (req, res) => {
  const data = await Galeri.findAll({ order: [["createdAt", "DESC"]] });
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await Galeri.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json(data);
};

exports.create = async (req, res) => {
  const { title, tanggal_kegiatan } = req.body;
  const image_url = req.file ? `/uploads/galeri/${req.file.filename}` : null;
  const data = await Galeri.create({ title, image_url, tanggal_kegiatan });
  res.status(201).json(data);
};

exports.update = async (req, res) => {
  const { title, tanggal_kegiatan } = req.body;
  const galeri = await Galeri.findByPk(req.params.id);
  if (!galeri) return res.status(404).json({ message: "Data tidak ditemukan" });

  const image_url = req.file ? `/uploads/galeri/${req.file.filename}` : galeri.image_url;
  await galeri.update({ title, image_url, tanggal_kegiatan });
  res.json(galeri);
};

exports.remove = async (req, res) => {
  const galeri = await Galeri.findByPk(req.params.id);
  if (!galeri) return res.status(404).json({ message: "Data tidak ditemukan" });

  await galeri.destroy();
  res.json({ message: "Data berhasil dihapus" });
};
