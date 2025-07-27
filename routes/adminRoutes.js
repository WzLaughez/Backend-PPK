const express = require('express');
const router = express.Router();
const { loginAdmin, register, getAdminDashboard } = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/verifyAdmin');

router.get('/dashboard',verifyAdmin, getAdminDashboard)
router.post('/login', loginAdmin);
router.post('/register', register);

module.exports = router;
