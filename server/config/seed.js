const { User, Project, Task } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('Database already seeded.');
            return;
        }

        console.log('Seeding database...');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password_hash: passwordHash,
            role: 'admin'
        });

        // Create Manager
        const manager = await User.create({
            name: 'Manager User',
            email: 'manager@example.com',
            password_hash: passwordHash,
            role: 'manager'
        });

        // Create User
        const user = await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password_hash: passwordHash,
            role: 'user'
        });

        // Create Sample Project
        const project = await Project.create({
            name: 'TaskFlow Development',
            description: 'Development of the TaskFlow application.',
            manager_id: manager.id
        });

        // Create Sample Task
        await Task.create({
            title: 'Initial Setup',
            description: 'Setup the project structure.',
            status: 'done',
            project_id: project.id,
            assigned_to: user.id,
            due_date: new Date()
        });

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedDatabase;
