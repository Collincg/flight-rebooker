import { useAuth } from '../../contexts/AuthContext'
import AuthForm from '../Auth/AuthForm'
import LoadingSpinner from '../LoadingSpinner'
import './ProtectedRoute.css'

const ProtectedRoute = ({ children, fallback = null }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner />
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="protected-route-auth">
        <AuthForm 
          mode="signin" 
          onToggleMode={() => {}} 
          onSuccess={() => window.location.reload()} 
        />
      </div>
    )
  }

  return children
}

export default ProtectedRoute