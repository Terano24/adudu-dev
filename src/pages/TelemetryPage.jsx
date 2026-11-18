import React, { useState, useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function TelemetryPage() {
  const { telemetryRuns } = useData()
  const [selectedRunId, setSelectedRunId] = useState(telemetryRuns[0]?.id || '')
  const [timeRange, setTimeRange] = useState('1 Min')
  const [activeTab, setActiveTab] = useState('chart')
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const selectedRun = useMemo(() => {
    return telemetryRuns.find((r) => r.id === selectedRunId) || telemetryRuns[0]
  }, [telemetryRuns, selectedRunId])

  // Current system clock for live HUD
  const currentTime = '17:30:24'

  return (
    <div className="telemetry-page-wrapper">
      {/* 1. Hero Blue Banner: Vehicle Telemetry Cockpit Simulator */}
      <section className="telemetry-hero-banner" aria-label="Telemetry Header Banner">
        <div className="telemetry-hero-content">
          <div className="telemetry-eyebrow font-mono">LIVE TELEMETRY HUD</div>
          <h1 className="telemetry-main-title">Vehicle Telemetry Cockpit Simulator</h1>
          <p className="telemetry-subtitle">
            Real-time telemetry data from SenaFlow Falcon 2.0 (#211) during testing session.
          </p>
        </div>

        {/* Live Tracking Glass Pill */}
        <div className="telemetry-hero-badge">
          <div className="live-tracking-pill">
            <div className="live-pulse-indicator">
              <span className="pulse-green-dot" />
              <span className="live-text font-bold">Live Tracking</span>
            </div>
            <div className="wave-pulse-icon" aria-hidden="true">
              <svg width="22" height="16" viewBox="0 0 24 16" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 8h2l2-4 3 8 4-12 3 16 3-8h3" />
              </svg>
            </div>
          </div>
          <span className="last-update-text font-mono">Last Update: {currentTime}</span>
        </div>

        {/* Subtle Checkered Flag Watermark Decor */}
        <div className="hero-checkered-watermark" aria-hidden="true">
          <svg width="280" height="160" viewBox="0 0 280 160" fill="none">
            <path
              d="M30 10 C 90 20, 140 0, 200 15 C 250 30, 260 80, 280 140 L 280 160 L 0 160 L 0 50 Z"
              fill="url(#flagGradient)"
            />
            <defs>
              <linearGradient id="flagGradient" x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* 2. Track Run Selector Bar */}
      <div className="track-run-selector-card">
        <div className="selector-left">
          <div className="car-icon-wrap" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <label htmlFor="trackRunSelect" className="selector-label font-bold">
            Track Run:
          </label>
          <div className="select-dropdown-container">
            <select
              id="trackRunSelect"
              className="track-run-select-input"
              value={selectedRunId}
              onChange={(e) => setSelectedRunId(e.target.value)}
            >
              {telemetryRuns.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn-view-details"
          onClick={() => setIsDetailsOpen((prev) => !prev)}
        >
          <span>{isDetailsOpen ? 'Tutup Ringkasan' : 'View Details'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* 3. Six Telemetry Metric Cards Grid */}
      <section className="telemetry-six-cards-grid" aria-label="Key Telemetry Gauges">
        {/* Metric 1: Kecepatan Rata-rata */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14v-4" />
              <path d="M3.34 17a10 10 0 1 1 17.32 0" />
            </svg>
          </div>
          <span className="tele-label">Kecepatan Rata-rata</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">
              {selectedRun?.avgSpeed || 28.4}
            </span>
            <span className="tele-unit">km/h</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+0.8</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 24 C 30 25, 60 12, 90 20 T 120 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 2: Tegangan Bus */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="tele-label">Tegangan Bus</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">
              {selectedRun?.voltage || 48.2}
            </span>
            <span className="tele-unit">V</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+0.1</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 20 C 30 18, 60 22, 90 14 T 120 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 3: Arus Motor */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span className="tele-label">Arus Motor</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">
              {selectedRun?.current || 14.5}
            </span>
            <span className="tele-unit">A</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+0.2</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 25 C 25 22, 50 16, 85 20 T 120 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 4: Daya Aktif Motor */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M13 6l-3 7h4l-2 5" />
            </svg>
          </div>
          <span className="tele-label">Daya Aktif Motor</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">
              {selectedRun?.power || 698}
            </span>
            <span className="tele-unit">W</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+12</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 26 C 30 24, 60 14, 90 22 T 120 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 5: Aliran Hidrogen */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <span className="tele-label">Aliran Hidrogen</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">12.4</span>
            <span className="tele-unit">NL/min</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+0.1</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 22 C 30 20, 60 18, 90 14 T 120 8" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 6: Efisiensi Sistem */}
        <div className="tele-metric-box">
          <div className="tele-icon-bubble">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <span className="tele-label">Efisiensi Sistem</span>
          <div className="tele-value-row">
            <span className="tele-big-val font-bold tabular-nums">
              {selectedRun?.efficiency ? selectedRun.efficiency.split(' ')[0] : '324'}
            </span>
            <span className="tele-unit">km/m³ H₂</span>
          </div>
          <div className="tele-trend-row">
            <span className="tele-trend-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+1.5</span>
            </span>
          </div>
          <div className="tele-card-sparkline">
            <svg viewBox="0 0 120 30" fill="none" className="sparkline-path">
              <path d="M0 26 C 25 24, 60 20, 90 15 T 120 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* 4. Middle Section: System Status, Circuit Overview & Empty Live View */}
      <section className="telemetry-middle-grid" aria-label="System and Circuit Overview">
        {/* Card 1: System Status */}
        <div className="middle-card system-status-card">
          <div className="middle-card-header">
            <div className="card-title-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h3 className="card-heading">System Status</h3>
            </div>
            <span className="status-pill-normal">Normal</span>
          </div>

          <div className="system-status-list font-mono">
            <div className="status-row">
              <div className="status-name-wrap">
                <span className="status-indicator-green" />
                <span>DC Bus</span>
              </div>
              <span className="status-value-bold">48.2 V</span>
            </div>

            <div className="status-row">
              <div className="status-name-wrap">
                <span className="status-indicator-green" />
                <span>Motor Controller</span>
              </div>
              <span className="status-value-bold">OK</span>
            </div>

            <div className="status-row">
              <div className="status-name-wrap">
                <span className="status-indicator-green" />
                <span>Hydrogen System</span>
              </div>
              <span className="status-value-bold">OK</span>
            </div>

            <div className="status-row">
              <div className="status-name-wrap">
                <span className="status-indicator-green" />
                <span>Cooling System</span>
              </div>
              <span className="status-value-bold">OK</span>
            </div>

            <div className="status-row">
              <div className="status-name-wrap">
                <span className="status-indicator-green" />
                <span>Battery</span>
              </div>
              <span className="status-value-bold">96%</span>
            </div>
          </div>

          {/* Battery level progress bar */}
          <div className="battery-progress-wrap">
            <div className="battery-progress-bar" style={{ width: '96%' }} />
          </div>
        </div>

        {/* Card 2: Circuit Overview */}
        <div className="middle-card circuit-overview-card">
          <div className="middle-card-header">
            <div className="card-title-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
              <h3 className="card-heading">Circuit Overview</h3>
            </div>
          </div>

          <div className="circuit-map-container">
            {/* SVG Lusail Circuit Map */}
            <svg
              className="circuit-track-svg"
              viewBox="0 0 460 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Track Road (Light Blue Tint) */}
              <path
                d="M 60 140 C 20 140 20 60 70 50 C 130 40 200 45 280 45 C 360 45 420 50 435 90 C 445 130 400 150 330 145 C 260 140 220 160 170 160 C 120 160 90 140 60 140 Z"
                stroke="#E0EDFF"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Inner Track Centerline (Royal Blue) */}
              <path
                d="M 60 140 C 20 140 20 60 70 50 C 130 40 200 45 280 45 C 360 45 420 50 435 90 C 445 130 400 150 330 145 C 260 140 220 160 170 160 C 120 160 90 140 60 140 Z"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Start & Finish positions */}
              <circle cx="430" cy="98" r="5" fill="#10B981" />

              {/* Finish checkered mark */}
              <rect x="424" y="112" width="12" height="12" fill="#0F172A" rx="2" />
              <rect x="424" y="112" width="6" height="6" fill="#FFFFFF" />
              <rect x="430" y="118" width="6" height="6" fill="#FFFFFF" />

              {/* Current Vehicle Position Blue Marker */}
              <circle cx="235" cy="50" r="7" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="235" cy="50" r="14" fill="#3B82F6" fillOpacity="0.25" />
            </svg>

            {/* Circuit Map Legend */}
            <div className="circuit-legend-column font-mono">
              <div className="legend-item">
                <span className="legend-dot dot-vehicle" />
                <span>Vehicle</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-track" />
                <span>Track</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-start" />
                <span>Start</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-finish" />
                <span>Finish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Live View (Per request: kosongi dulu aja) */}
        <div className="middle-card live-view-card">
          <div className="middle-card-header">
            <div className="card-title-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <h3 className="card-heading">Live View</h3>
            </div>
            <span className="status-pill-normal">Live</span>
          </div>

          {/* Empty state container as requested by user */}
          <div className="live-view-empty-box">
            <div className="empty-camera-circle" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="#CBD5E1" strokeWidth="2" />
              </svg>
            </div>
            <span className="empty-camera-label font-mono">Video Stream Idle</span>
            <span className="empty-camera-sub">Kamera telemetri paddock dinonaktifkan</span>
          </div>
        </div>
      </section>

      {/* 5. Bottom Section: Telemetry Chart & Performance Summary */}
      <section className="telemetry-bottom-card" aria-label="Telemetry Graphs">
        {/* Card Header & Controls */}
        <div className="bottom-card-header">
          {/* Tabs */}
          <div className="chart-tabs-wrap">
            <button
              type="button"
              className={`chart-tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Telemetry Chart</span>
            </button>

            <button
              type="button"
              className={`chart-tab-btn ${activeTab === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveTab('historical')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Historical Data</span>
            </button>
          </div>

          {/* Time range filter & Export */}
          <div className="chart-controls-right">
            <div className="timerange-buttons-group">
              {['1 Min', '5 Min', '15 Min', '1 Hour'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`timerange-btn ${timeRange === t ? 'active' : ''}`}
                  onClick={() => setTimeRange(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="export-icon-btn"
              title="Unduh Data CSV Telemetri"
              onClick={() => alert(`Mengunduh dataset log telemetri untuk ${selectedRun?.name || 'Sesi Uji'}...`)}
              aria-label="Export"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chart Inner Body Grid */}
        <div className="chart-body-grid">
          {/* Main Chart Canvas */}
          <div className="chart-canvas-area">
            {/* Chart Legend */}
            <div className="chart-legend-row font-mono">
              <div className="chart-legend-item">
                <span className="legend-color-dot dot-speed" />
                <span>Speed (km/h)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-color-dot dot-voltage" />
                <span>Voltage (V)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-color-dot dot-current" />
                <span>Current (A)</span>
              </div>
            </div>

            {/* SVG Multi-Line Chart Canvas */}
            <div className="multiline-chart-svg-wrap">
              <svg
                viewBox="0 0 650 180"
                preserveAspectRatio="none"
                className="multiline-svg"
              >
                {/* Y-Axis Grid Lines */}
                <line x1="30" y1="20" x2="650" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <text x="5" y="24" fill="currentColor" fillOpacity="0.45" fontSize="11" fontFamily="monospace">100</text>

                <line x1="30" y1="90" x2="650" y2="90" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <text x="12" y="94" fill="currentColor" fillOpacity="0.45" fontSize="11" fontFamily="monospace">50</text>

                <line x1="30" y1="160" x2="650" y2="160" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <text x="18" y="164" fill="currentColor" fillOpacity="0.45" fontSize="11" fontFamily="monospace">0</text>

                {/* Line 1: Speed (km/h) - Royal Blue curve */}
                <path
                  d="M 40 75 C 90 70, 140 60, 200 68 C 260 74, 300 55, 360 62 C 420 70, 460 52, 520 60 C 570 66, 610 50, 650 55"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Line 2: Voltage (V) - Orange curve */}
                <path
                  d="M 40 105 C 90 100, 140 98, 200 102 C 260 104, 300 110, 360 104 C 420 98, 460 115, 520 102 C 570 94, 610 98, 650 100"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Line 3: Current (A) - Green curve */}
                <path
                  d="M 40 145 C 90 135, 140 138, 200 142 C 260 145, 300 130, 360 135 C 420 140, 460 125, 520 130 C 570 135, 610 128, 650 130"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* X-Axis Timestamps */}
            <div className="chart-x-timestamps font-mono">
              <span>17:29:00</span>
              <span>17:29:15</span>
              <span>17:29:30</span>
              <span>17:29:45</span>
              <span>17:30:00</span>
              <span>17:30:15</span>
            </div>
          </div>

          {/* Performance Summary Right Widget */}
          <div className="performance-summary-panel">
            <div className="perf-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <h4 className="perf-title">Performance Summary</h4>
            </div>

            <div className="perf-metrics-container">
              {/* Avg Speed Metric */}
              <div className="perf-metric-card">
                <div className="perf-left">
                  <div className="perf-num-row">
                    <span className="perf-big-num font-bold tabular-nums">28.4</span>
                    <span className="perf-unit">km/h</span>
                  </div>
                  <div className="perf-sub-row">
                    <span className="perf-label">Avg Speed</span>
                    <span className="perf-trend-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                      <span>+1.2%</span>
                    </span>
                  </div>
                </div>
                {/* Mini Bars Visual */}
                <div className="perf-bars-visual" aria-hidden="true">
                  <span className="perf-bar" style={{ height: '35%' }} />
                  <span className="perf-bar" style={{ height: '55%' }} />
                  <span className="perf-bar" style={{ height: '80%' }} />
                  <span className="perf-bar active-bar" style={{ height: '100%' }} />
                </div>
              </div>

              {/* Efficiency Metric */}
              <div className="perf-metric-card">
                <div className="perf-left">
                  <div className="perf-num-row">
                    <span className="perf-big-num font-bold tabular-nums">324</span>
                    <span className="perf-unit">km/m³ H₂</span>
                  </div>
                  <div className="perf-sub-row">
                    <span className="perf-label">Efficiency</span>
                    <span className="perf-trend-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                      <span>+2.1%</span>
                    </span>
                  </div>
                </div>
                {/* Mini Bars Visual */}
                <div className="perf-bars-visual" aria-hidden="true">
                  <span className="perf-bar" style={{ height: '40%' }} />
                  <span className="perf-bar" style={{ height: '65%' }} />
                  <span className="perf-bar" style={{ height: '75%' }} />
                  <span className="perf-bar active-bar" style={{ height: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Expandable Run Details & Alumni Reviews Modal / Drawer */}
      {isDetailsOpen && selectedRun && (
        <section className="telemetry-run-details-modal">
          <div className="details-modal-header">
            <h3 className="details-modal-title">
              Detail Uji Lintasan &amp; Umpan Balik: {selectedRun.name}
            </h3>
            <button
              type="button"
              className="details-close-btn"
              onClick={() => setIsDetailsOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="details-modal-body">
            <div className="details-specs-grid font-mono">
              <div className="spec-item">
                <span className="spec-label">ID SESI</span>
                <span className="spec-val font-bold text-cyan">{selectedRun.id}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">KENDARAAN</span>
                <span className="spec-val font-bold">{selectedRun.vehicle}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">DURASI</span>
                <span className="spec-val">{selectedRun.duration}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STATUS REVIEW</span>
                <span className="badge badge-yellow">{selectedRun.reviewStatus}</span>
              </div>
            </div>

            <div className="alumni-reviews-section">
              <h4 className="reviews-heading">Umpan Balik Alumni Reviewer</h4>
              {selectedRun.reviews && selectedRun.reviews.length > 0 ? (
                <div className="reviews-list">
                  {selectedRun.reviews.map((rev) => (
                    <div key={rev.id} className="review-item-card">
                      <div className="review-top">
                        <span className="reviewer-name font-bold">{rev.reviewer}</span>
                        <span className="badge badge-cyan font-mono">Skor: {rev.rating}/5</span>
                      </div>
                      <p className="review-text">"{rev.note}"</p>
                      <span className="review-timestamp font-mono text-muted">
                        {new Date(rev.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted" style={{ fontSize: '0.825rem' }}>
                  Belum ada catatan review untuk sesi ini. Sesi dalam antrean peninjauan.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
