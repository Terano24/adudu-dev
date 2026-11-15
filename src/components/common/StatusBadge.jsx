import React from 'react'

const BADGE_MAP = {
  // Roles
  'Admin/PO': 'badge-purple',
  'Anggota Tim': 'badge-cyan',
  'Alumni Reviewer': 'badge-yellow',

  // MoSCoW Priority
  Must: 'badge-purple',
  Should: 'badge-yellow',
  Could: 'badge-cyan',
  "Won't": 'badge-muted',

  // Divisions
  Chassis: 'badge-cyan',
  'Body & Frame': 'badge-cyan',
  'Vehicle Dynamics': 'badge-cyan',
  Powertrain: 'badge-purple',
  'Powertrain & Electrical': 'badge-purple',
  Electrical: 'badge-yellow',
  Programming: 'badge-purple',
  Telemetry: 'badge-cyan',
  Managerial: 'badge-muted',
  'Fuel Cell': 'badge-yellow',
  Product: 'badge-muted',
}

const StatusBadge = React.memo(function StatusBadge({
  type,
  label,
  points,
  variant,
  className = '',
}) {
  const text = label || type || ''
  const badgeClass = variant ? `badge-${variant}` : (BADGE_MAP[text] || 'badge-muted')
  const pointSuffix = points !== undefined ? ` · ${points}pt` : ''

  return (
    <span className={`badge ${badgeClass} font-mono ${className}`.trim()}>
      {text}{pointSuffix}
    </span>
  )
})

export default StatusBadge
