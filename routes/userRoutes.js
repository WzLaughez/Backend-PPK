const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {verifyToken} = require('../middlewares/verifyToken');

router.get('/', controller.getAllUsers);
router.get('/:id',verifyToken, controller.getUserById); // GET by ID
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);      // Edit user
router.delete('/:id', controller.deleteUser);   // Hapus user

module.exports = router;
