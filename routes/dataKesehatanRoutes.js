const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataKesehatanController");
// Get All Data Kesehatan
router.get("/", controller.getAll);
// Get all untuk user
router.get("/by-user", controller.getAllByUser);
// Get Data Kesehatan by ID 
// Admin
router.get('/bymonth', controller.getByMonth);
// User
router.get('/byyear', controller.getByYear);

// Tambahan untuk filter berdasarkan user_id
// GET /data_kesehatan?user_id=1

// Tambahan
router.get("/filter/bmi", controller.getBMI);
router.get("/filter/gula_darah", controller.getGulaDarah);
router.get("/filter/tekanan_darah", controller.getTekananDarah);

router.get("/:id", controller.getById);

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
