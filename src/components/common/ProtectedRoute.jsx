import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AccessDenied from './AccessDenied.jsx'

export default function ProtectedRoute({ children, allowedRoles, requiredCapability }) {
  const { isAuthenticated, user, can } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="wrap page-container">
        <AccessDenied
          title="Akses Halaman Dibatasi"
          message={`Halaman ini hanya dapat diakses oleh peran: ${allowedRoles.join(', ')}.`}
          requiredPermission={`Role in [${allowedRoles.join(', ')}]`}
        />
      </div>
    )
  }

  if (requiredCapability && !can(requiredCapability.action, requiredCapability.resource)) {
    return (
      <div className="wrap page-container">
        <AccessDenied
          title="Aksi Dilarang"
          message="Anda tidak memiliki kapabilitas yang diperlukan untuk melihat halaman ini."
          requiredPermission={`${requiredCapability.action}:${requiredCapability.resource}`}
        />
      </div>
    )
  }

  return children
}
