import React from 'react'

const Button = ({
  children,
  type = 'button',
  variant = 'primary', 
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  ...props
}) => {
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    link: 'bg-transparent text-primary-600 hover:underline px-0 py-0',
  }
  
  const baseClasses = 'btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button