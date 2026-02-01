const { Task, Project } = require('../models');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        // If user, only assigned?
        // "User Dashboard: View assigned tasks"
        let where = {};
        if (req.user.role === 'user') {
            where = { assigned_to: req.user.userId };
        }

        const tasks = await Task.findAll({ where });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Manager
const createTask = async (req, res) => {
    try {
        const { title, description, status, due_date, project_id, assigned_to } = req.body;

        // Verify project exists?

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            due_date,
            project_id,
            assigned_to
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task (Status or Details)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (task) {
            // User can only update status? 
            // "User Dashboard: Update task status (e.g., Todo -> In Progress -> Done)"
            // Manager can update everything?

            if (req.user.role === 'user') {
                // Enforce only status update?
                // Or check if assigned to them?
                if (task.assigned_to !== req.user.userId) {
                    return res.status(403).json({ message: 'Not authorized to update this task' });
                }
                task.status = req.body.status || task.status;
                // Prevent other updates? 
                // Let's assume body only sends status for user.
            } else {
                // Manager/Admin
                task.title = req.body.title || task.title;
                task.description = req.body.description || task.description;
                task.status = req.body.status || task.status;
                task.assigned_to = req.body.assigned_to || task.assigned_to;
                task.due_date = req.body.due_date || task.due_date;
            }

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask
};
