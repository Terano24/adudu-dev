import React, { useState } from 'react'

export default function LoginForm({
  onLogin,
  staticCredentials = [],
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!username.trim()) {
      setErrorMessage('Silakan masukkan username.')
      return
    }

    if (!password) {
      setErrorMessage('Silakan masukkan password.')
      return
    }

    setIsSubmitting(true)
    const result = onLogin({ username, password, rememberMe })

    if (result && !result.success) {
      setErrorMessage(result.error || 'Username atau password salah.')
      setIsSubmitting(false)
    }
  }

  const handleFill = (u, p) => {
    setUsername(u)
    setPassword(p)
    setErrorMessage('')
  }

  return (
    <section className="lp-card modern-login-card">
      {/* Brand Header inside card */}
      <div className="lp-card-brand-header">
        <img
          src="/images/senaflow-mark.png"
          alt="SenaFlow"
          className="lp-card-logo-img"
          style={{ width: '28px', height: 'auto', objectFit: 'contain' }}
          aria-hidden="true"
        />
        <div className="lp-brand-col">
          <span className="lp-brand-title">SenaFlow</span>
          <span className="lp-brand-tagline">Agile &amp; Telemetry</span>
        </div>
      </div>

      {/* Card Title & Subtitle */}
      <div className="lp-card-header">
        <h2 className="lp-card-title">Login</h2>
        <p className="lp-card-sub">Masuk dengan akun tim Anda.</p>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="lp-error-banner" role="alert">
          <svg
            className="lp-error-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="lp-form" noValidate>
        {/* Username */}
        <div className="lp-field">
          <label className="lp-label visually-hidden" htmlFor="lp-username">
            Username
          </label>
          <div className="lp-input-wrap">
            <span className="lp-input-icon" aria-hidden="true">
              <svg
                width="16"
                height="16"
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
            </span>
            <input
              id="lp-username"
              type="text"
              name="username"
              autoComplete="username"
              className="lp-input"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="lp-field">
          <label className="lp-label visually-hidden" htmlFor="lp-password">
            Password
          </label>
          <div className="lp-input-wrap">
            <span className="lp-input-icon" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="lp-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              className="lp-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
            />
            <button
              type="button"
              className="lp-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="lp-options-row">
          <label className="lp-remember">
            <input
              type="checkbox"
              className="lp-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Ingat sesi di perangkat ini</span>
          </label>

          <a
            href="#forgot-password"
            className="lp-forgot-link"
            onClick={(e) => {
              e.preventDefault()
              alert('Silakan pilih salah satu akun pengujian demo di bagian bawah untuk login.')
            }}
          >
            Lupa password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="lp-submit-btn modern-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span>Login</span>
            </>
          )}
        </button>

        {/* Divider "atau" */}
        <div className="lp-divider-row">
          <span className="lp-divider-line" />
          <span className="lp-divider-text">atau</span>
          <span className="lp-divider-line" />
        </div>

        {/* Login dengan Google */}
        <button
          type="button"
          className="lp-google-btn"
          onClick={() =>
            alert('Fitur Single Sign-On (SSO) Google akan segera aktif. Silakan gunakan akun pengujian.')
          }
        >
          {/* Multi-color Google G icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.2.01 10.05.01 12s.45 3.8 1.26 5.41l4.01-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
          <span>Login dengan Google</span>
        </button>
      </form>

      {/* Clean Quick Demo Accounts */}
      {staticCredentials.length > 0 && (
        <div className="lp-test-accounts-clean">
          <span className="lp-test-hint">Akun pengujian:</span>
          <div className="lp-test-chips">
            {staticCredentials.map((cred) => (
              <button
                key={cred.username}
                type="button"
                className="lp-test-btn lp-test-pill"
                onClick={() => handleFill(cred.username, cred.password)}
                title={`Isi otomatis: ${cred.username} / ${cred.password} (${cred.role})`}
              >
                <span className="font-mono"><strong>{cred.username}</strong></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
