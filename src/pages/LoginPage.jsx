import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { LoginForm } from '../features/auth/index.js'
import falconBg from '../assets/images/Mobil-Antasena-Falcon-2.0-saat-melesat-pada-lintasan-Sirkuit-Internasional-Lusail-di-ajang-Shell-Eco-marathon-SEM-Asia-Pasifik-dan-Timur-Tengah-2025-1.jpg'

export default function LoginPage() {
  const { loginWithCredentials, staticCredentials = [] } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectPath = location.state?.from?.pathname || '/board'

  const handleLogin = ({ username, password }) => {
    const result = loginWithCredentials(username, password)
    if (result && result.success) {
      navigate(redirectPath, { replace: true })
    }
    return result
  }

  return (
    <div
      className="lp-root"
      style={{ backgroundImage: `url(${falconBg})` }}
    >
      {/* Directional gradient scrim: barely-there on left, solid toward right */}
      <div className="lp-scrim" aria-hidden="true" />

      {/* Telemetry status bar: slim strip at top */}
      <div className="lp-statusbar" aria-hidden="true">
        <div className="lp-statusbar-left">
          <span className="lp-statusbar-item">
            <span className="lp-statusbar-dot lp-statusbar-dot--live" />
            <span>SYSTEM</span>
            <span className="lp-statusbar-val">ONLINE</span>
          </span>
          <span className="lp-statusbar-item">
            <span>EVENT</span>
            <span className="lp-statusbar-val">SEM ASIA-PACIFIC 2025</span>
          </span>
          <span className="lp-statusbar-item">
            <span>CIRCUIT</span>
            <span className="lp-statusbar-val">LUSAIL INTL.</span>
          </span>
        </div>
        <span className="lp-statusbar-item">
          <span className="lp-statusbar-dot" />
          <span>ITS RACING TEAM</span>
        </span>
      </div>

      {/* Clean transparent top header */}
      <header className="lp-header">
        <div className="lp-brand">
          <span className="lp-brand-mark">ATNS</span>
          <div className="lp-brand-text">
            <span className="lp-brand-name">ANTASENA</span>
            <span className="lp-brand-tagline">ITS RACING TEAM · URBAN CONCEPT</span>
          </div>
        </div>

        <button
          type="button"
          className="lp-theme-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>
      </header>

      {/* Asymmetric split: left = car visual + telemetry, right = login card */}
      <div className="lp-body">
        {/* Left: car area: event title + telemetry data grid */}
        <div className="lp-left" aria-hidden="true">
          <div className="lp-livery-stripe" />
          <div className="lp-left-event">
            <span className="lp-left-event-label">Shell Eco-Marathon · Asia-Pacific &amp; Middle East</span>
            <span className="lp-left-event-name">Lusail International Circuit, 2025</span>
          </div>
          <div className="lp-spec-panel">
            <div className="lp-spec-cell lp-spec-cell--accent">
              <span className="lp-spec-key">VEHICLE</span>
              <span className="lp-spec-val lp-spec-val--yellow">#211</span>
            </div>
            <div className="lp-spec-cell">
              <span className="lp-spec-key">CLASS</span>
              <span className="lp-spec-val">Urban Concept</span>
            </div>
            <div className="lp-spec-cell">
              <span className="lp-spec-key">MODEL</span>
              <span className="lp-spec-val">Falcon 2.0</span>
            </div>
            <div className="lp-spec-cell">
              <span className="lp-spec-key">ENERGY</span>
              <span className="lp-spec-val">Electric</span>
            </div>
          </div>
        </div>

        {/* Right: floating login card */}
        <div className="lp-right">
          <LoginForm
            onLogin={handleLogin}
            staticCredentials={staticCredentials}
          />
        </div>
      </div>
    </div>
  )
}
