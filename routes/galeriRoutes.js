const express = require("express");
const router = express.Router();
const controller = require("../controllers/galeriController");
const multer = require("multer");
// Konfigurasi folder upload
const storage = multer.diskStorage({
  destination: "uploads/galeri",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
