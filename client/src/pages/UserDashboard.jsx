import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../features/tasks/taskSlice';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleStatusChange = (id, status) => {
        dispatch(updateTaskStatus({ id, status }));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="text-green-500" />;
            case 'in-progress': return <Clock className="text-yellow-500" />;
            default: return <Circle className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Tasks</h2>

            {isLoading ? (
                <p className="text-gray-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
                    <p className="text-gray-400">No tasks assigned to you yet.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${task.status === 'done' ? 'bg-green-500/10 text-green-400' :
                                        task.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-gray-500/10 text-gray-400'
                                    }`}>
                                    {task.status}
                                </span>
                                {getStatusIcon(task.status)}
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                {task.status !== 'todo' && (
                                    <button onClick={() => handleStatusChange(task.id, 'todo')} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-700">
                                        To Do
                                    </button>
                                )}
                                {task.status !== 'in-progress' && (
                                    <button onClick={() => handleStatusChange(task.id, 'in-progress')} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/20">
                                        Start
                                    </button>
                                )}
                                {task.status !== 'done' && (
                                    <button onClick={() => handleStatusChange(task.id, 'done')} className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded hover:bg-green-500/20">
                                        Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
