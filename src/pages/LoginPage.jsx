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
      className="modern-login-viewport lp-root"
      style={{ backgroundImage: `url(${falconBg})` }}
    >
      {/* Background scrim overlay with smooth vignette */}
      <div className="modern-login-scrim lp-scrim" aria-hidden="true" />

      {/* Top Header Bar */}
      <header className="login-top-bar" aria-label="Header Login">
        <div className="login-top-left">
          {/* SenaFlow Brand Logo */}
          <div className="login-brand-group">
            <img
              src="/images/senaflow-mark.png"
              alt="SenaFlow"
              className="login-brand-icon-img"
              style={{ width: '30px', height: 'auto', objectFit: 'contain' }}
            />
            <div className="login-brand-col">
              <span className="login-brand-name">SenaFlow</span>
              <span className="login-brand-tagline">Agile &amp; Telemetry</span>
            </div>
          </div>

          <span className="login-top-divider" aria-hidden="true" />

          {/* System Online Status */}
          <div className="login-system-online font-mono">
            <span className="system-online-dot" aria-hidden="true" />
            <span>System Online</span>
          </div>
        </div>

        <div className="login-top-right">
          {/* Theme Toggle Button: Minimal Round Icon Button */}
          <button
            type="button"
            className="login-round-theme-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Two-Column Container */}
      <main className="login-main-container">
        {/* Left: Circuit and Vehicle Hero Branding */}
        <div className="login-hero-left">
          {/* Eyebrow Line */}
          <div className="circuit-eyebrow">
            <span className="eyebrow-accent-line" aria-hidden="true" />
            <span className="eyebrow-text font-mono">ENGINEERING PLATFORM</span>
          </div>

          {/* Headline */}
          <h1 className="circuit-headline">
            Lusail International<br />
            Circuit, <span className="headline-blue-year">2025</span>
          </h1>

          {/* Subtitle */}
          <p className="circuit-subtitle">
            Engineering for a more sustainable tomorrow.
          </p>

          {/* 3 Specs Badges Row */}
          <div className="vehicle-specs-row">
            {/* Card 1: Vehicle #211 */}
            <div className="spec-clean-card">
              <div className="spec-clean-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="spec-clean-info">
                <span className="spec-val-primary font-mono font-bold">#211</span>
                <span className="spec-label-muted font-mono">Vehicle</span>
              </div>
            </div>

            {/* Card 2: Urban Concept */}
            <div className="spec-clean-card">
              <div className="spec-clean-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="spec-clean-info">
                <span className="spec-val-primary font-bold">Urban Concept</span>
                <span className="spec-label-muted font-mono">Class</span>
              </div>
            </div>

            {/* Card 3: Falcon 2.0 */}
            <div className="spec-clean-card">
              <div className="spec-clean-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="spec-clean-info">
                <span className="spec-val-primary font-bold">Falcon 2.0</span>
                <span className="spec-label-muted font-mono">Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphic Floating Login Card */}
        <div className="login-card-right">
          <LoginForm
            onLogin={handleLogin}
            staticCredentials={staticCredentials}
          />
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="login-bottom-bar">
        <span className="login-copyright">© 2025 SenaFlow. All rights reserved.</span>
        <span className="login-team-tag font-mono">
          <span className="team-purple-dot" aria-hidden="true" />
          <span>ITS RACING TEAM</span>
        </span>
      </footer>
    </div>
  )
}
