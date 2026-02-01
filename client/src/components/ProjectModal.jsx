import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../features/projects/projectSlice';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';

const ProjectModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/users');
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
        await dispatch(createProject({ name, description, members: selectedMembers }));
        setLoading(false);
        onClose();
    };

    const toggleMember = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
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

                <h3 className="text-xl font-bold text-white mb-6">Create New Project</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Project Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Description</label>
                        <textarea
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Assign Team Members</label>
                        <div className="max-h-40 overflow-y-auto space-y-2 bg-gray-800/30 p-2 rounded-lg border border-gray-700">
                            {users.filter(u => u.role !== 'admin').map(user => (
                                <div key={user.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        checked={selectedMembers.includes(user.id)}
                                        onChange={() => toggleMember(user.id)}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`user-${user.id}`} className="text-sm text-gray-300 cursor-pointer select-none">
                                        {user.name} <span className="text-xs text-gray-500">({user.email})</span>
                                    </label>
                                </div>
                            ))}
                            {users.length === 0 && <p className="text-sm text-gray-500">No users found.</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Project'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
