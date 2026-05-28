import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  role?: string
  submit?: string
}

export const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'adult' | 'child'>('child')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const [households, setHouseholds] = useState<any[]>([])
  const [selectedHousehold, setSelectedHousehold] = useState<string>('')
  const [newHouseholdName, setNewHouseholdName] = useState('')

  useEffect(() => {
    import('../services/householdService').then(({ householdService }) =>
      householdService.getHouseholds().then((h) => setHouseholds(h))
    )
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!role) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // determine householdId: existing or create new
      let householdId: string | undefined = undefined
      if (selectedHousehold === 'create' && newHouseholdName.trim()) {
        const { householdService } = await import('../services/householdService')
        const h = await householdService.createHousehold(newHouseholdName.trim())
        householdId = h.id
      } else if (selectedHousehold && selectedHousehold !== 'create') {
        householdId = selectedHousehold
      }

      const response = await authService.register(name, email, password, role, householdId)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      await login(email, password)
      navigate('/')
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Registration failed. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account in Peppish</h1>

        {errors.submit && (
          <div className="error-message alert alert-error">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              disabled={isLoading}
              className={errors.name ? 'input-error' : ''}
              placeholder="Your name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: undefined })
              }}
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as 'adult' | 'child')
                if (errors.role) setErrors({ ...errors, role: undefined })
              }}
              disabled={isLoading}
              className={errors.role ? 'input-error' : ''}
            >
              <option value="child">Child</option>
              <option value="adult">Adult</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

            <div className="form-group">
              <label htmlFor="household">Household</label>
              <select id="household" value={selectedHousehold} onChange={(e) => setSelectedHousehold(e.target.value)}>
                <option value="">(None)</option>
                {households.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
                <option value="create">Create new household</option>
              </select>
              {selectedHousehold === 'create' && (
                <input value={newHouseholdName} onChange={(e) => setNewHouseholdName(e.target.value)} placeholder="New household name" />
              )}
            </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}
