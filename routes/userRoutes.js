const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {verifyToken} = require('../middlewares/verifyToken');
const {verifyAdmin} = require('../middlewares/verifyAdmin');
const { verifyAccessOrAdmin } = require('../middlewares/verifyAccessOrAdmin');

router.get('/',verifyAdmin, controller.getAllUsers);
router.get('/belum-periksa',verifyAdmin, controller.getBelumPeriksaBulanIni);
router.get('/:id',verifyToken,controller.getUserById); // GET by ID
router.post('/',verifyAdmin, controller.createUser);
router.put('/:id',verifyAdmin, controller.updateUser);      // Edit user
router.delete('/:id',verifyAdmin, controller.deleteUser);   // Hapus user

module.exports = router;
