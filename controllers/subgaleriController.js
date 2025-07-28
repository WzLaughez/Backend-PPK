const Subgaleri = require("../models/subgaleri");

exports.getAll = async (req, res) => {
  const data = await Subgaleri.findAll({ order: [["createdAt", "DESC"]] });
  res.json(data);
};
// get limit 5
exports.getLatest = async (req, res) => {
  const data = await Subgaleri.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
  });
  res.json(data);
};

exports.getByGaleriId = async (req, res) => {
  const data = await Subgaleri.findAll({
    where: { galeri_id: req.params.galeri_id },
    order: [["createdAt", "DESC"]],
  });
  res.json(data);
};

exports.create = async (req, res) => {
  const { galeri_id, title } = req.body;
  const image_url = req.file ? `/uploads/subgaleri/${req.file.filename}` : null;
  const data = await Subgaleri.create({ galeri_id, title, image_url });
  res.status(201).json(data);
};

exports.update = async (req, res) => {
  const { title } = req.body;
  const subgaleri = await Subgaleri.findByPk(req.params.id);
  if (!subgaleri) return res.status(404).json({ message: "Data tidak ditemukan" });

  const image_url = req.file ? `/uploads/subgaleri/${req.file.filename}` : subgaleri.image_url;
  await subgaleri.update({ title, image_url });
  res.json(subgaleri);
};

exports.remove = async (req, res) => {
  const subgaleri = await Subgaleri.findByPk(req.params.id);
  if (!subgaleri) return res.status(404).json({ message: "Data tidak ditemukan" });

  await subgaleri.destroy();
  res.json({ message: "Data berhasil dihapus" });
};
