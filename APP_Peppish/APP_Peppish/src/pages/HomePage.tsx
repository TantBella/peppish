import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="home-content">
        <div className="user-info">
          <p>Role: <strong>{user?.role === 'adult' ? 'Adult' : 'Child'}</strong></p>
        </div>

        <nav className="main-nav">
          <button onClick={() => navigate('/chores')} className="nav-button">
            📋 View Chores
          </button>
          <button onClick={() => navigate('/rewards')} className="nav-button">
            🎁 View Rewards
          </button>
          <button onClick={() => navigate('/progress')} className="nav-button">
            📊 View Progress
          </button>
        </nav>
      </div>
    </div>
  )
}
