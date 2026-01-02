import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import PrivateRoute from './components/PrivateRoute'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <Login />}
      />
      <Route
        path="/teacher"
        element={
          <PrivateRoute>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  )
}

export default App

