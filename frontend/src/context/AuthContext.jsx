import { createContext, useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await loginUser(credentials)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Logged in successfully!')
      return true
    } catch (error) {
      toast.error(error.message || 'Failed to login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await registerUser(userData)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Registered successfully!')
      return true
    } catch (error) {
      toast.error(error.message || 'Failed to register')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await logoutUser()
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully!')
    } catch (error) {
      console.error('Logout error:', error)
      // Still remove token and user from state even if server-side logout fails
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        login, 
        register, 
        logout, 
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}