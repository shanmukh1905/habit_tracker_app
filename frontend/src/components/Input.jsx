import React from 'react'
import '../App.css'

const Input = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  error = false,
  className = ''
}) => {
  return (
    <input
      className={`input input-${size} ${fullWidth ? 'input-full-width' : ''} ${error ? 'input-error' : ''} ${className}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}

export default Input 