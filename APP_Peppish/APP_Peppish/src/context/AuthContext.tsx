import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { authService } from '../services/authService'
import { seedInitialData } from '../utils/seedData'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Seed initial data if first time
    seedInitialData()

    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    } else {
      // Auto-login with default user for MVP testing (bypasses login)
      const defaultUser: User = {
        id: '2',
        email: 'child@example.com',
        name: 'Child',
        role: 'child'
      }
      const defaultToken = `mock-jwt-token-${defaultUser.id}-${Date.now()}`
      localStorage.setItem('token', defaultToken)
      localStorage.setItem('user', JSON.stringify(defaultUser))
      setToken(defaultToken)
      setUser(defaultUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
