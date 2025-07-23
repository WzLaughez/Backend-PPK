const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {verifyToken} = require('../middlewares/verifyToken');
const {verifyAdmin} = require('../middlewares/verifyAdmin');
const { verifyAccessOrAdmin } = require('../middlewares/verifyAccessOrAdmin');

router.get('/',verifyAdmin, controller.getAllUsers);
router.get('/:id',verifyToken,verifyAccessOrAdmin,controller.getUserById); // GET by ID
router.post('/',verifyAdmin, controller.createUser);
router.put('/:id',verifyAdmin, controller.updateUser);      // Edit user
router.delete('/:id',verifyAdmin, controller.deleteUser);   // Hapus user

module.exports = router;
