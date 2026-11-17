import React from 'react'

export default function LoadingScreen({ message = 'Memuat modul sistem...' }) {
  return (
    <div className="antasena-loading-screen hud-suspense-container" role="status" aria-live="polite">
      {/* Background ambient lighting */}
      <div className="loading-ambient-glow" aria-hidden="true" />

      <div className="loading-card-box">
        {/* Animated Brand Logo with Dual Spinning Halo */}
        <div className="loading-logo-wrap">
          <svg
            className="loading-brand-svg"
            width="44"
            height="44"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <path d="M20 4L4 32H13L20 18L27 32H36L20 4Z" fill="#2563EB" />
            <path d="M20 18L15 28H25L20 18Z" fill="#60A5FA" />
          </svg>
          <div className="loading-ring-spinner hud-loading-spinner" aria-hidden="true" />
        </div>

        {/* Title & Tagline */}
        <div className="loading-text-group">
          <h2 className="loading-brand-title">ANTASENA</h2>
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

