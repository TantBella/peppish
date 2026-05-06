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
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <nav>
        <ul>
          <li>Chores</li>
          <li>Rewards</li>
          <li>Progress</li>
        </ul>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
