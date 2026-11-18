import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import StatusBadge from '../common/StatusBadge.jsx'

export default function MobileNav({ isOpen, onClose }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div className="mobile-nav-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-nav-header">
          <div className="brand-text">
            <span className="brand-title">SenaFlow</span>
            <span className="brand-tagline">MOBILE NAVIGATION</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Tutup Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="mobile-user-card">
            <div className="mobile-user-name">{user.name}</div>
            <div className="mobile-user-role">
              <StatusBadge label={user.role} />
              <span className="mobile-user-division">{user.division}</span>
            </div>
          </div>
        )}

        <nav className="mobile-links-list">
          <NavLink
            to="/board"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Board</span>
          </NavLink>
          <NavLink
            to="/backlog"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Backlog</span>
          </NavLink>
          <NavLink
            to="/telemetry"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Telemetry</span>
          </NavLink>
          <NavLink
            to="/vault"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Vault</span>
          </NavLink>
        </nav>

        <div className="mobile-nav-footer">
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={toggleTheme}
          >
            {isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={() => {
                logout()
                onClose()
              }}
            >
              Logout ({user?.username})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
