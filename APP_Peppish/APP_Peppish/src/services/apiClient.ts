import axios, { AxiosInstance } from 'axios'
import { ApiError } from '../types'

const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
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
