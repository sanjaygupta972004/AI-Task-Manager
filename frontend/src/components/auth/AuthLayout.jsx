import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth()
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout