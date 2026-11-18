import React from 'react'

export default function LoadingScreen({ message = 'Memuat modul sistem...' }) {
  return (
    <div className="antasena-loading-screen hud-suspense-container" role="status" aria-live="polite">
      {/* Background ambient lighting */}
      <div className="loading-ambient-glow" aria-hidden="true" />

      <div className="loading-card-box">
        {/* Animated Brand Logo with Dual Spinning Halo */}
        <div className="loading-logo-wrap">
          <img
            src="/images/senaflow-mark.png"
            alt="SenaFlow"
            className="loading-brand-img"
            style={{ width: '48px', height: 'auto', objectFit: 'contain' }}
            aria-hidden="true"
          />
          <div className="loading-ring-spinner hud-loading-spinner" aria-hidden="true" />
        </div>

        {/* Title & Tagline */}
        <div className="loading-text-group">
          <h2 className="loading-brand-title">SenaFlow</h2>
          <span className="loading-brand-tag">AGILE &amp; TELEMETRY PLATFORM</span>
        </div>

        {/* Progress Bar with Shimmer */}
        <div className="loading-progress-track">
          <div className="loading-progress-bar" />
        </div>

        {/* Dynamic Status message */}
        <p className="loading-status-message hud-suspense-label font-mono">
          <span className="loading-dot-pulse" aria-hidden="true" />
          <span>{message}</span>
        </p>
      </div>
    </div>
  )
}

