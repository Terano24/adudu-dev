import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import StatusBadge from '../common/StatusBadge.jsx'

export default function Navbar({ onOpenMobileMenu }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="navbar-root">
      <div className="hud-navbar-inner">
        {/* Left Section: Brandmark & Active Vehicle Mini-HUD */}
        <div className="hud-nav-section hud-nav-left">
          <NavLink to="/board" className="hud-brand-link">
            <span className="hud-brand-mark">ATNS</span>
            <div className="hud-brand-info">
              <span className="hud-brand-title">ANTASENA</span>
              <span className="hud-brand-sub">AGILE &amp; TELEMETRY</span>
            </div>
          </NavLink>

          <div className="hud-divider vehicle-divider" aria-hidden="true" />

          {/* Vehicle Telemetry HUD Mini-Widget */}
          <div className="hud-vehicle-widget">
            <div className="hud-vehicle-thumb-wrap">
              <img
                src="/images/Mobil-Antasena-Falcon-2.0-saat-melesat-pada-lintasan-Sirkuit-Internasional-Lusail-di-ajang-Shell-Eco-marathon-SEM-Asia-Pasifik-dan-Timur-Tengah-2025-1.jpg"
                alt="Falcon 2.0"
                className="hud-vehicle-thumb"
              />
            </div>
            <div className="hud-vehicle-details">
              <span className="hud-vehicle-name">
                <span className="hud-vehicle-code">#211</span>
                <span className="hud-vehicle-model">FALCON 2.0</span>
              </span>
              <span className="hud-sprint-indicator">
                <span className="hud-status-dot" />
                <span>SPRINT 01 ACTIVE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Telemetry Navigation Tabs */}
        <nav className="hud-nav-section hud-nav-center desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/board"
            className={({ isActive }) => `hud-nav-tab nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="hud-tab-idx">01</span>
            <span className="hud-tab-title">Board</span>
          </NavLink>
          <NavLink
            to="/backlog"
            className={({ isActive }) => `hud-nav-tab nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="hud-tab-idx">02</span>
            <span className="hud-tab-title">Backlog</span>
          </NavLink>
          <NavLink
            to="/telemetry"
            className={({ isActive }) => `hud-nav-tab nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="hud-tab-idx">03</span>
            <span className="hud-tab-title">Telemetry</span>
          </NavLink>
          <NavLink
            to="/vault"
            className={({ isActive }) => `hud-nav-tab nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="hud-tab-idx">04</span>
            <span className="hud-tab-title">Vault</span>
          </NavLink>
        </nav>

        {/* Right Section: Telemetry Quick-Stats, Theme Toggle, Role & Logout */}
        <div className="hud-nav-section hud-nav-right">
          <div className="hud-quick-stat">
            <span className="hud-stat-key">H2 EFF</span>
            <span className="hud-stat-val text-cyan">94.2%</span>
          </div>

          <div className="hud-divider stat-divider" aria-hidden="true" />

          <div className="hud-quick-stat">
            <span className="hud-stat-key">DC BUS</span>
            <span className="hud-stat-val">48.2V</span>
          </div>

          <div className="hud-divider stat-divider" aria-hidden="true" />

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="hud-theme-toggle theme-toggle-btn"
            onClick={toggleTheme}
            title={`Beralih ke tema ${isDark ? 'Light' : 'Dark'}`}
            aria-label="Toggle Theme"
          >
            {isDark ? 'LIGHT' : 'DARK'}
          </button>

          {/* User Profile & Role Pill */}
          {isAuthenticated && user && (
            <div className="hud-user-box user-profile-badge">
              <StatusBadge label={user.role} />
              <span className="hud-user-name user-name-label">{user.name}</span>
              <button
                type="button"
                className="hud-logout-btn logout-btn"
                onClick={logout}
                title="Keluar dari akun"
              >
                LOGOUT
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={onOpenMobileMenu}
            aria-label="Buka Menu Navigasi"
          >
            <span className="hamburger-bars" aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
