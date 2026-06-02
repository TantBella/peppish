import { choreServiceLocal } from './choreService.local'
import { choreServiceApi } from './choreService.api'

// Use API-backed service when REACT_APP_API_URL is set; otherwise fallback to local
export const choreService = import.meta.env.VITE_API_URL ? choreServiceApi : choreServiceLocal
