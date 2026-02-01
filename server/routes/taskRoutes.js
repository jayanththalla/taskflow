const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);
router.post('/', protect, authorize('manager', 'admin'), createTask);
router.put('/:id', protect, updateTask); // User can update too

module.exports = router;
