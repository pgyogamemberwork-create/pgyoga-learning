import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import { useTheme } from './hooks/useTheme.js'

function RequireAuth({ children }) {
  const userId = localStorage.getItem('quiz_user')
  return userId ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const userId = localStorage.getItem('quiz_user')
  return userId ? <Navigate to="/" replace /> : children
}

export default function App() {
  useTheme()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
