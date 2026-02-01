import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';

const TaskModal = ({ projectId, onClose }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch users for assignment
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/api/users');
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await dispatch(createTask({
            title,
            description,
            status,
            due_date: dueDate,
            project_id: projectId,
            assigned_to: assignedTo
        }));
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">Create New Task</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Task Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Description</label>
                        <textarea
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 min-h-[80px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Status</label>
                            <select
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Due Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Assign To</label>
                        <select
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                        >
                            <option value="">Select User</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
