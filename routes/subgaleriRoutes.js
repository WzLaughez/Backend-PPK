const express = require("express");
const router = express.Router();
const controller = require("../controllers/subgaleriController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/subgaleri",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });
router.get("/", controller.getAll);
router.get("/:galeri_id", controller.getByGaleriId);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
