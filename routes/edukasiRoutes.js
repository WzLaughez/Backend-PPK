const express = require("express");
const router = express.Router();
const edukasiController = require("../controllers/edukasiController");
const multer = require("multer");

// Konfigurasi folder upload
const storage = multer.diskStorage({
  destination: "uploads/edukasi",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", edukasiController.getAll);
router.get("/limit3", edukasiController.get3);
router.get("/:id", edukasiController.getById);
router.post("/", upload.single("image"), edukasiController.create);
router.put("/:id", upload.single("image"), edukasiController.update);
router.delete("/:id", edukasiController.remove);

module.exports = router;
