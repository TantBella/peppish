import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'adult' | 'child'
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
