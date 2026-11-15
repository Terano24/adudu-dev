import React from 'react'

const FormInput = React.forwardRef(function FormInput(
  { label, error, className = '', id, size = 'md', ...props },
  ref
) {
  const sizeClass = size === 'sm' ? 'input-field-sm' : 'input-field'
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label font-mono">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`${sizeClass} ${error ? 'border-rose' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="form-error-text font-mono">{error}</span>}
    </div>
  )
})

export default FormInput
