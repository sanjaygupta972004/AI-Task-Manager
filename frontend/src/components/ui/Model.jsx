import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnClickOutside = true,
}) => {
  const modalRef = useRef(null)
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    const handleClickOutside = (e) => {
      if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnClickOutside])
  
  if (!isOpen) return null
  
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal