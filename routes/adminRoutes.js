const express = require('express');
const router = express.Router();
const { loginAdmin, register } = require('../controllers/adminController');

router.post('/login', loginAdmin);
router.post('/register', register);
module.exports = router;
