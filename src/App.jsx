import { AuthProvider, useAuth } from './context/AuthContext'
import { TicketProvider } from './context/TicketContext'
import LoginPage from './components/auth/LoginPage'
import AdminDashboard from './components/admin/AdminDashboard'
import SupervisorDashboard from './components/supervisor/SupervisorDashboard'

function AppContent() {
  const { auth } = useAuth()

  if (!auth.isAuthenticated) return <LoginPage />
  if (auth.user.role === 'admin') return <AdminDashboard />
  return <SupervisorDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <AppContent />
      </TicketProvider>
    </AuthProvider>
  )
}
