import React from 'react'
import StatusBadge from './StatusBadge.jsx'

const PriorityBadge = React.memo(function PriorityBadge({ priority, points, className = '' }) {
  return <StatusBadge label={priority} points={points} className={className} />
})

export default PriorityBadge
