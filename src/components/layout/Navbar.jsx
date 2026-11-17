import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import StatusBadge from '../common/StatusBadge.jsx'

export default function Navbar({
  onOpenMobileMenu,
  isSidebarCollapsed,
  onToggleSidebar,
}) {
  const { user, logout, loginWithCredentials, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AA'

  const displayName = user?.name || 'Admin Antasena'

  return (
    <header className="app-topbar" aria-label="Top Navigation Bar">
      <div className="topbar-inner">
        {/* Left: Desktop sidebar toggle / Mobile hamburger & Global Search */}
        <div className="topbar-left">
          {/* Desktop Sidebar Toggle (Collapse / Reveal) */}
          <button
            type="button"
            className="desktop-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? 'Tampilkan menu navigasi' : 'Sembunyikan menu navigasi'}
            title={isSidebarCollapsed ? 'Tampilkan menu navigasi (Sidebar)' : 'Sembunyikan menu navigasi (Sidebar)'}
          >
            <svg
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
              <path d="M9 3v18" />
              {isSidebarCollapsed ? (
                <path d="m14 9 3 3-3 3" />
              ) : (
                <path d="m16 15-3-3 3-3" />
              )}
            </svg>
          </button>

          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={onOpenMobileMenu}
            aria-label="Buka Menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          <div className="topbar-search-box">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              aria-label="Search"
            />
            <kbd className="search-shortcut">⌘ K</kbd>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="topbar-right">
          {/* Notification Bell */}
          <button
            type="button"
            className="notif-btn"
            aria-label="Notifications"
            title="Pemberitahuan Sistem"
            onClick={() => alert('Tidak ada notifikasi baru.')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="notif-dot" aria-hidden="true" />
          </button>

          {/* User Profile Pill with Dropdown */}
          <div className="user-profile-menu-wrap" ref={dropdownRef}>
            <button
              type="button"
              className="user-profile-pill"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="avatar-circle">
                <span>{initials}</span>
              </div>
              <span className="profile-name">{displayName}</span>
              <svg
                className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="profile-dropdown-card">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar">{initials}</div>
                  <div className="dropdown-user-text">
                    <span className="dropdown-user-name">{displayName}</span>
                    <span className="dropdown-user-role">
                      <StatusBadge label={user?.role || 'Admin/PO'} />
                    </span>
                    <span className="dropdown-user-div">{user?.division}</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <div className="dropdown-section-title">GANTI PERAN CEPAT</div>
                <div className="dropdown-role-buttons">
                  <button
                    type="button"
                    className="role-switch-btn"
                    onClick={() => {
                      loginWithCredentials('admin', 'admin')
                      setIsDropdownOpen(false)
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Admin / PO</span>
                  </button>
                  <button
                    type="button"
                    className="role-switch-btn"
                    onClick={() => {
                      loginWithCredentials('anggota', 'anggota')
                      setIsDropdownOpen(false)
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>Developer</span>
                  </button>
                  <button
                    type="button"
                    className="role-switch-btn"
                    onClick={() => {
                      loginWithCredentials('alumni', 'alumni')
                      setIsDropdownOpen(false)
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    <span>Alumni Reviewer</span>
                  </button>
                </div>

                <div className="dropdown-divider" />

                <div className="dropdown-actions">
                  <button
                    type="button"
                    className="hud-theme-toggle theme-toggle-btn dropdown-theme-btn"
                    onClick={toggleTheme}
                  >
                    {isDark ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                        <span>Mode Terang</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        <span>Mode Gelap</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="hud-logout-btn logout-btn dropdown-logout-btn"
                    onClick={() => {
                      logout()
                      setIsDropdownOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
