import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error
    
    // Handle token expiration
    if (response && response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    
    return Promise.reject(
      (response && response.data) || { message: 'Something went wrong' }
    )
  }
)

export default api