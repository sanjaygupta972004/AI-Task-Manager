import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  
  const [errors, setErrors] = useState({})
  const { register, loading } = useAuth()
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
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm your password'
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }
    
    const success = await register(userData)
    
    if (success) {
      navigate('/dashboard')
    }
  }
  
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="text-gray-600 mt-1">Get started with AI Task Manager</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.name}
          required
        />
        
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
        
        <Input
          label="Confirm Password"
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.passwordConfirm}
          required
        />
        
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
          >
            Sign up
          </Button>
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  )
}

export default RegisterForm