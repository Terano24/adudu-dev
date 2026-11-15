import React from 'react'
import StatusBadge from './StatusBadge.jsx'

const DivisionBadge = React.memo(function DivisionBadge({ division, className = '' }) {
  return <StatusBadge label={division} className={className} />
})

export default DivisionBadge
