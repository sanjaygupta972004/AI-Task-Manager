import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/auth/AuthLayout'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="tasks" element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App