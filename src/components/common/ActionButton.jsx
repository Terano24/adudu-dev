import React from 'react'

const ActionButton = React.memo(function ActionButton({
  children,
  variant = 'primary', // primary | secondary | danger
  size = 'md', // sm | md | lg
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
  const variantClass = `btn-${variant}`

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

export default ActionButton
