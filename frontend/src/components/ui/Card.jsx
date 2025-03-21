import React, { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input