const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'user'),
        defaultValue: 'user'
    }
});

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
    // manager_id will be added via association
});

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('todo', 'in-progress', 'done'),
        defaultValue: 'todo'
    },
    due_date: {
        type: DataTypes.DATE
    }
    // project_id and assigned_to will be added via association
});

// Relationships
User.hasMany(Project, { foreignKey: 'manager_id', as: 'managedProjects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// Many-to-Many: Users assigned to Projects (Project Members)
const ProjectMembers = sequelize.define('ProjectMembers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
}, { timestamps: false });

Project.belongsToMany(User, { through: ProjectMembers, as: 'members' });
User.belongsToMany(Project, { through: ProjectMembers, as: 'projects' });

module.exports = { User, Project, Task, ProjectMembers };
