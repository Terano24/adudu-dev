import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Sidebar({ isCollapsed, onToggleSidebar }) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const userDisplayName = user?.name?.includes('(')
    ? user.name.split('(')[0].trim()
    : user?.name || 'Admin Antasena'
  const userRoleDisplay = user?.role === 'Admin/PO'
    ? 'Antasena (PO)'
    : user?.role === 'Anggota Tim'
    ? 'Developer'
    : user?.role === 'Alumni Reviewer'
    ? 'Alumni'
    : 'Antasena'

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand">
        <NavLink to="/board" className="sidebar-brand-link">
          <div className="sidebar-logo-icon" aria-hidden="true">
            {/* Origami layered A mark */}
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 4L31 29H23L18 19L13 29H5L18 4Z"
                fill="url(#antasena-blue-grad)"
              />
              <path
                d="M18 10L27 27H22L18 19L14 27H9L18 10Z"
                fill="#2563EB"
                fillOpacity="0.4"
              />
              <path
                d="M18 14L23 25H19L18 22L17 25H13L18 14Z"
                fill="#60A5FA"
              />
              <defs>
                <linearGradient
                  id="antasena-blue-grad"
                  x1="5"
                  y1="4"
                  x2="31"
                  y2="29"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1D4ED8" />
                  <stop offset="0.5" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-title">ANTASENA</span>
            <span className="brand-subtitle">Agile &amp; Telemetry</span>
          </div>
        </NavLink>

        {/* Minimize / Collapse Button to hide sidebar to the left */}
        <button
          type="button"
          className="sidebar-hide-toggle-btn"
          onClick={onToggleSidebar}
          title="Sembunyikan menu ke kiri"
          aria-label="Sembunyikan menu navigasi"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink
              to="/board"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <NavLink
              to="/backlog"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Backlog</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <NavLink
              to="/telemetry"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>Telemetry</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <NavLink
              to="/vault"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="m18 18-2-2" />
                <path d="m6 6 2 2" />
                <path d="m6 18 2-2" />
                <path d="m18 6-2 2" />
              </svg>
              <span>Vault</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Sidebar Lower Controls */}
      <div className="sidebar-lower">
        <div className="sidebar-user-links">
          <div className="sidebar-link-row">
            <svg
              className="lower-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="lower-label">Admin</span>
          </div>

          <div className="sidebar-link-row">
            <svg
              className="lower-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="lower-label">{userRoleDisplay}</span>
          </div>
        </div>

        {/* Theme Toggle Switch */}
        <div className="sidebar-theme-wrap">
          <div className="theme-toggle-row">
            <svg
              className="sun-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>

            <button
              type="button"
              className={`modern-theme-switch ${isDark ? 'active-dark' : 'active-light'}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              title={`Beralih ke mode ${isDark ? 'Light' : 'Dark'}`}
            >
              <span className="switch-thumb" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Wave Gradient SVG (Bottom Left) */}
      <div className="sidebar-decorative-wave" aria-hidden="true">
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="20"
            cy="220"
            r="160"
            fill="url(#wave-grad-1)"
            fillOpacity="0.15"
          />
          <circle
            cx="50"
            cy="250"
            r="130"
            fill="url(#wave-grad-2)"
            fillOpacity="0.2"
          />
          <defs>
            <radialGradient
              id="wave-grad-1"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(20 220) rotate(90) scale(160)"
            >
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="wave-grad-2"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(50 250) rotate(90) scale(130)"
            >
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#1D4ED8" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </aside>
  )
}

