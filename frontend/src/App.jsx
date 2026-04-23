import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadSyllabus from './pages/UploadSyllabus'
import Planner from './pages/Planner'
import ProtectedRoute from './components/ProtectedRoute'
import PYQAnalyzer from './pages/PYQAnalyzer'
import Progress from './pages/Progress'
import DoubtBot from './pages/DoubtBot'
import StudyHub from './pages/StudyHub'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/upload-syllabus" element={
            <ProtectedRoute><UploadSyllabus /></ProtectedRoute>
          } />
          <Route path="/planner" element={
            <ProtectedRoute><Planner /></ProtectedRoute>
          } />
          <Route path="/pyq-analyzer" element={
            <ProtectedRoute>
              <PYQAnalyzer />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/doubt-bot" element={
            <ProtectedRoute>
              <DoubtBot />
            </ProtectedRoute>
          } />
          <Route path="/study-hub" element={
            <ProtectedRoute>
              <StudyHub />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App