import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import UserDashboard from './pages/UserDashboard'
import ProjectDetails from './pages/ProjectDetails'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes - Common Layout, but verified inside */}
                <Route element={<Layout />}>
                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/projects" element={<ManagerDashboard />} />
                    </Route>

                    {/* Manager Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
                        <Route path="/manager" element={<ManagerDashboard />} />
                        <Route path="/manager/projects/:id" element={<ProjectDetails />} />
                    </Route>

                    {/* User Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['user', 'manager', 'admin']} />}>
                        <Route path="/" element={<UserDashboard />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
