import { AuthResponse, User } from '../types'
import { authServiceLocal } from './authService.local'
import { authServiceApi } from './authService.api'

// Use API-backed service when REACT_APP_API_URL is set; otherwise keep local fallback
export const authService = process.env.REACT_APP_API_URL ? authServiceApi : authServiceLocal
