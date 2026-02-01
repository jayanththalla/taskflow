import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, deleteProject } from '../features/projects/projectSlice';
import { Plus, Folder, Trash2, Edit2, Users } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { Link } from 'react-router-dom';
// import TaskModal from '../components/TaskModal';

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const { projects, isLoading } = useSelector((state) => state.projects);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    // const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            dispatch(deleteProject(id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Project Management</h2>
                {/* Only Manager can create projects */}
                {/* Actually requirement says: "Admin Dashboard: View all projects". Doesn't explicitly say create.
            "Manager Dashboard: Create, update, delete projects". 
            So Admin likely read-only or full access? Usually Admin has full access. 
            But let's stick to spec? "Create / Edit / Delete users" is Admin. 
            Let's allow Admin to create too for convenience, or hide it if strictly following "Manager Dashboard" feature list.
            Let's allow it for now or check role.
        */}
                <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    New Project
                </button>
            </div>

            {isLoading ? (
                <div className="text-gray-400">Loading projects...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Folder size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Users size={16} />
                                    <span>{project.tasks?.length || 0} Tasks</span>
                                </div>
                                <Link to={`/manager/projects/${project.id}`} className="text-sm font-medium text-blue-400 hover:text-blue-300">
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isProjectModalOpen && <ProjectModal onClose={() => setIsProjectModalOpen(false)} />}
        </div>
    );
};

export default ManagerDashboard;
