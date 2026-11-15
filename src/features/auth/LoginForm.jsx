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
    <section className="lp-card">
      {/* Card header */}
      <div className="lp-card-header">
        <span className="lp-card-eyebrow">ANTASENA // ACCESS GATEWAY</span>
        <h2 className="lp-card-title">Login</h2>
        <p className="lp-card-sub">Masuk menggunakan akun tim Anda.</p>
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
          <label className="lp-label" htmlFor="lp-username">
            Username
          </label>
          <div className="lp-input-wrap">
            <span className="lp-input-icon" aria-hidden="true">
              <svg
                width="15"
                height="15"
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
              placeholder="admin"
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
          <label className="lp-label" htmlFor="lp-password">
            Password
          </label>
          <div className="lp-input-wrap">
            <span className="lp-input-icon" aria-hidden="true">
              <svg
                width="15"
                height="15"
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
              placeholder="password"
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
                  width="15"
                  height="15"
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
                  width="15"
                  height="15"
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

        {/* Remember me */}
        <label className="lp-remember">
          <input
            type="checkbox"
            className="lp-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Ingat sesi di perangkat ini</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="lp-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memverifikasi...' : 'Login'}
        </button>
      </form>

      {/* Test accounts footer */}
      {staticCredentials.length > 0 && (
        <div className="lp-test-accounts">
          <span className="lp-test-label">AKUN PENGUJIAN</span>
          <div className="lp-test-list">
            {staticCredentials.map((cred) => (
              <button
                key={cred.username}
                type="button"
                className="lp-test-btn"
                onClick={() => handleFill(cred.username, cred.password)}
                title={`Isi ${cred.username} / ${cred.password}`}
              >
                <span className="lp-test-cred">
                  <strong>{cred.username}</strong>
                  <span className="lp-test-sep">/</span>
                  <span>{cred.password}</span>
                </span>
                <span className="lp-test-role">{cred.role}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
