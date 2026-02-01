import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import TaskModal from '../components/TaskModal';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // We fetch project details including tasks directly via API or store
    // Since we need tasks specifically for THIS project, and our store fetchProjects gets all,
    // we can find it in store OR fetch fresh. 
    // Let's fetch fresh to ensure we get tasks included (if our API returns them).
    // My projectController `getProjectById` includes tasks!

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/projects/${id}`);
            setProject(data);
        } catch (error) {
            console.error('Failed to fetch project', error);
            // navigate('/manager');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [id, isTaskModalOpen]); // Refetch when task modal closes (task added)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="text-green-500" />;
            case 'in-progress': return <Clock className="text-yellow-500" />;
            default: return <Circle className="text-gray-500" />;
        }
    };

    if (loading) return <div className="text-gray-400">Loading project details...</div>;
    if (!project) return <div className="text-red-400">Project not found</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Back to Projects
            </button>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                        <p className="text-gray-400">{project.description}</p>
                    </div>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        Add Task
                    </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">Project Tasks</h3>

                <div className="space-y-3">
                    {project.tasks?.length === 0 ? (
                        <p className="text-gray-500">No tasks in this project yet.</p>
                    ) : (
                        project.tasks?.map((task) => (
                            <div key={task.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                                    <div>
                                        <h4 className="font-semibold text-white">{task.title}</h4>
                                        <p className="text-sm text-gray-400">{task.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                                Assigned: {task.assignee?.name || 'Unassigned'}
                                            </span>
                                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <span className={`px-2 py-1 rounded font-medium capitalize
                     ${task.status === 'done' ? 'text-green-400 bg-green-500/10' :
                                            task.status === 'in-progress' ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 bg-gray-500/10'}
                   `}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isTaskModalOpen && (
                <TaskModal
                    projectId={project.id}
                    onClose={() => setIsTaskModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
