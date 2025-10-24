const TanyaJawab = require("../models/tanyaJawab");
const Admin = require("../models/Admin");

// GET all Q&A (public only)
exports.getAll = async (req, res) => {
  try {
    const data = await TanyaJawab.findAll({
      where: { is_public: true },
      order: [["createdAt", "DESC"]]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data tanya jawab" });
  }
};

// GET all Q&A for admin (including private)
exports.getAllForAdmin = async (req, res) => {
  try {
    const data = await TanyaJawab.findAll({
      include: [{
        model: Admin,
        as: "admin",
        attributes: ["nama"]
      }],
      order: [["createdAt", "DESC"]]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data tanya jawab" });
  }
};

// GET by ID
exports.getById = async (req, res) => {
  try {
    const data = await TanyaJawab.findByPk(req.params.id, {
      include: [{
        model: Admin,
        as: "admin",
        attributes: ["nama"]
      }]
    });
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data tanya jawab" });
  }
};

// POST - Ask question (anonymous)
exports.askQuestion = async (req, res) => {
  try {
    const { pertanyaan, nama_penanya, email_penanya } = req.body;
    
    if (!pertanyaan) {
      return res.status(400).json({ message: "Pertanyaan harus diisi" });
    }

    const data = await TanyaJawab.create({
      pertanyaan,
      nama_penanya: nama_penanya || null,
      email_penanya: email_penanya || null,
      status: 'pending'
    });
    
    res.status(201).json({
      message: "Pertanyaan berhasil dikirim",
      data: {
        id: data.id,
        pertanyaan: data.pertanyaan,
        status: data.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim pertanyaan" });
  }
};

// PUT - Answer question (admin only)
exports.answerQuestion = async (req, res) => {
  try {
    const { jawaban, is_public, yangMenjawab } = req.body;
    const adminId = req.admin.id; // From verifyAdmin middleware
    
    if (!jawaban) {
      return res.status(400).json({ message: "Jawaban harus diisi" });
    }
    console.log(req.body);
    const tanyaJawab = await TanyaJawab.findByPk(req.params.id);
    if (!tanyaJawab) {
      return res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
    }

    await tanyaJawab.update({
      jawaban,
      answered_by: adminId,
      yangMenjawab: yangMenjawab || null,
      answered_at: new Date(),
      status: 'answered',
      is_public: is_public || false
    });

    res.json({
      message: "Jawaban berhasil disimpan",
      data: tanyaJawab
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal menyimpan jawaban" });
  }
};

// PUT - Update Q&A (admin only)
exports.update = async (req, res) => {
  try {
    const { pertanyaan, jawaban, is_public, status, yangMenjawab } = req.body;
    
    const tanyaJawab = await TanyaJawab.findByPk(req.params.id);
    if (!tanyaJawab) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await tanyaJawab.update({
      pertanyaan: pertanyaan || tanyaJawab.pertanyaan,
      jawaban: jawaban || tanyaJawab.jawaban,
      yangMenjawab: yangMenjawab !== undefined ? yangMenjawab : tanyaJawab.yangMenjawab,
      is_public: is_public !== undefined ? is_public : tanyaJawab.is_public,
      status: status || tanyaJawab.status
    });

    res.json({
      message: "Data berhasil diperbarui",
      data: tanyaJawab
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data" });
  }
};

// DELETE - Delete Q&A (admin only)
exports.delete = async (req, res) => {
  try {
    const tanyaJawab = await TanyaJawab.findByPk(req.params.id);
    if (!tanyaJawab) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await tanyaJawab.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data" });
  }
};

// GET - Get pending questions (admin only)
exports.getPending = async (req, res) => {
  try {
    const data = await TanyaJawab.findAll({
      where: { status: 'pending' },
      order: [["createdAt", "ASC"]]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil pertanyaan pending" });
  }
};

