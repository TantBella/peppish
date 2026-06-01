import axios, { AxiosInstance } from 'axios'
import { ApiError } from '../types'

let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
}

const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config) => {
    if (authToken) {
      config.headers = config.headers || {}
      ;(config.headers as any).Authorization = `Bearer ${authToken}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear in-memory token and redirect to login; AuthContext should handle cleanup
        authToken = null
        try {
          window.location.href = '/login'
        } catch (e) {
          // ignore in non-browser environments
        }
      }
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      }
      return Promise.reject(apiError)
    }
  )

  return instance
}

export const apiClient = createApiClient()
