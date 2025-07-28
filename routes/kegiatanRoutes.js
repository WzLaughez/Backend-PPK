const express = require("express");
const router = express.Router();
const kegiatanController = require("../controllers/kegiatanController");

// GET semua kegiatan
router.get("/", kegiatanController.getAll);

// GET kegiatan berdasarkan ID
router.get("/:id", kegiatanController.getById);

// POST buat kegiatan baru
router.post("/", kegiatanController.create);

// PUT update kegiatan
router.put("/:id", kegiatanController.update);

// DELETE hapus kegiatan
router.delete("/:id", kegiatanController.remove);

module.exports = router;
