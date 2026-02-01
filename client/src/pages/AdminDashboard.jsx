import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, UserPlus } from 'lucide-react';
import UserModal from '../components/UserModal';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/api/users/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error('Failed to delete user', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleRoleUpdate = async (user) => {
        const newRole = user.role === 'user' ? 'manager' : user.role === 'manager' ? 'admin' : 'user';
        if (window.confirm(`Change role for ${user.name} to ${newRole}?`)) {
            try {
                const { data } = await api.put(`/api/users/${user.id}`, { role: newRole });
                setUsers(users.map(u => u.id === user.id ? data : u));
            } catch (error) {
                console.error('Failed to update role', error);
            }
        }
    };

    const handleUserCreated = (newUser) => {
        setUsers([...users, newUser]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-gray-400">View and manage system users</p>
                </div>
                <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <UserPlus size={18} />
                    New User
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                                                user.role === 'manager' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}
                    `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleRoleUpdate(user)}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                        >
                                            Change Role
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isUserModalOpen && (
                <UserModal
                    onClose={() => setIsUserModalOpen(false)}
                    onUserCreated={handleUserCreated}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
