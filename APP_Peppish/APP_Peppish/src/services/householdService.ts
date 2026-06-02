import { householdServiceLocal } from './householdService.local'
import { householdServiceApi } from './householdService.api'

// Use API when REACT_APP_API_URL is set; otherwise fall back to local
export const householdService = import.meta.env.VITE_API_URL ? householdServiceApi : householdServiceLocal
