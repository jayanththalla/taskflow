import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LogOut, LayoutDashboard, Users, FolderKanban, CheckSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItemClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`;

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-40 w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        TaskFlow
                    </h1>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400">
                        <X />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {user?.role === 'admin' && (
                        <>
                            <NavLink to="/admin" end className={navItemClass}>
                                <Users size={20} />
                                <span>Users & Roles</span>
                            </NavLink>
                            <NavLink to="/admin/projects" className={navItemClass}>
                                <FolderKanban size={20} />
                                <span>All Projects</span>
                            </NavLink>
                        </>
                    )}

                    {user?.role === 'manager' && (
                        <>
                            <NavLink to="/manager" className={navItemClass}>
                                <FolderKanban size={20} />
                                <span>My Projects</span>
                            </NavLink>
                        </>
                    )}

                    {user?.role === 'user' && (
                        <>
                            <NavLink to="/" className={navItemClass}>
                                <CheckSquare size={20} />
                                <span>My Tasks</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-gray-950">
                {/* Mobile Header */}
                <header className="md:hidden p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
                    <h1 className="text-xl font-bold">TaskFlow</h1>
                    <button onClick={toggleSidebar} className="text-gray-400">
                        <Menu />
                    </button>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Layout;
