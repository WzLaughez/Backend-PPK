const express = require('express');
const router = express.Router();
const tanyaJawabController = require('../controllers/tanyaJawabController');
const { verifyAdmin } = require('../middlewares/verifyAdmin');

// Public routes (no authentication required)
router.get('/', tanyaJawabController.getAll); // Get all public Q&A
router.get('/:id', tanyaJawabController.getById); // Get specific Q&A by ID
router.post('/', tanyaJawabController.askQuestion); // Ask a question (anonymous)

// Admin routes (require admin authentication)
router.get('/admin/all', verifyAdmin, tanyaJawabController.getAllForAdmin); // Get all Q&A for admin
router.get('/admin/pending', verifyAdmin, tanyaJawabController.getPending); // Get pending questions
router.put('/:id', verifyAdmin, tanyaJawabController.update); // Update Q&A
router.put('/:id/answer', verifyAdmin, tanyaJawabController.answerQuestion); // Answer a question
router.delete('/:id', verifyAdmin, tanyaJawabController.delete); // Delete Q&A

module.exports = router;

