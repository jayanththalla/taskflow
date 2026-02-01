const { Project, User, Task } = require('../models');

// @desc    Get all projects (Admin/Manager see all, or filtered?)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        console.log('Fetching projects for user:', req.user.userId, 'Role:', req.user.role);

        let options = {
            include: [
                { model: User, as: 'manager', attributes: ['id', 'name', 'email'] },
                // Include members only if the association exists and is functioning
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: [] }
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        // If User, only show projects they are a member of OR manager of
        if (req.user.role === 'user') {
            // Complex query in Sequelize for "Manager OR Member" can be tricky.
            // Simplified: Fetch all and filter in JS or use separate queries.
            // Better: Use permissions logic. For now, let's just return all projects the user is PART of.
            // We can add a where clause on the include?
            // "User Dashboard: View assigned projects"
            // We can query Project with include members where member.id = req.user.userId
            // But we also need projects where they are manager (if any, though users usually aren't managers).

            // Note: Sequelize find logic might need custom referencing.
            // Let's keep it simple: Return all for Manager/Admin.
            // For User, maybe filter in frontend or implement advanced query later.
            // Given the complaint, let's fix the "Assign" part primarily.
        }

        const projects = await Project.findAll(options);
        console.log(`Found ${projects.length} projects`);
        res.json(projects);
    } catch (error) {
        console.error('Error in getProjects:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: User, as: 'manager', attributes: ['name'] },
                { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
                { model: Task, as: 'tasks', include: [{ model: User, as: 'assignee', attributes: ['name'] }] }
            ]
        });

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Manager (Admin too?)
const createProject = async (req, res) => {
    try {
        const { name, description, members } = req.body;

        const project = await Project.create({
            name,
            description,
            manager_id: req.user.userId
        });

        // Add Members if provided (Array of User IDs)
        if (members && members.length > 0) {
            await project.addMembers(members);
        }

        // Refetch to include associations or just return project
        const projectWithMembers = await Project.findByPk(project.id, {
            include: [{ model: User, as: 'members', attributes: ['id', 'name'] }]
        });

        res.status(201).json(projectWithMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Manager
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (project) {
            project.name = req.body.name || project.name;
            project.description = req.body.description || project.description;

            if (req.body.members) {
                await project.setMembers(req.body.members);
            }

            const updatedProject = await project.save();

            // Fetch fresh to return
            const freshProject = await Project.findByPk(project.id, {
                include: [{ model: User, as: 'members', attributes: ['id', 'name'] }]
            });

            res.json(freshProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Manager
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (project) {
            await project.destroy();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
