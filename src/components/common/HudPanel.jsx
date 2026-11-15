import React from 'react'

const HudPanel = React.memo(function HudPanel({
  children,
  className = '',
  solid = false,
  as: Component = 'div',
  ...props
}) {
  const baseClass = solid ? 'hud-panel-solid' : 'hud-panel'
  return (
    <Component className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
})

export default HudPanel
