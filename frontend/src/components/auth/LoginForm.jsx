import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState({})
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const success = await login(formData)
    
    if (success) {
      navigate('/dashboard')
    }
  }
  
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 mt-1">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
        />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="#" className="text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={loading}
        >
          Sign in
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  )
}

export default LoginForm