import React, { useState, useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function TelemetryPage() {
  const { telemetryRuns } = useData()
  const [selectedRunId, setSelectedRunId] = useState(telemetryRuns[0]?.id || '')

  const selectedRun = useMemo(() => {
    return telemetryRuns.find((r) => r.id === selectedRunId) || telemetryRuns[0]
  }, [telemetryRuns, selectedRunId])

  return (
    <div className="wrap page-container board-paddock-root">
      {/* Header */}
      <div className="page-header board-hud-header">
        <div className="board-header-left">
          <div className="board-header-tagline">
            <span className="paddock-tag">LIVE TELEMETRY HUD</span>
            <span className="font-mono text-muted">//</span>
            <span className="font-mono text-muted">MQTT BROADCAST :1883</span>
            <span className="font-mono text-muted">//</span>
            <span className="hud-status-dot" style={{ display: 'inline-block' }} />
            <span className="font-mono text-yellow" style={{ fontSize: '0.65rem' }}>SIMULATION ONLINE</span>
          </div>
          <h1 className="page-title board-main-title">
            Vehicle Telemetry Cockpit Simulator
          </h1>
          <p className="page-subtitle">
            Telemetri telematika real-time Antasena Falcon 2.0 (#211) pada lintasan Sirkuit Lusail (Kecepatan, Tegangan Bus, Arus Motor, Aliran H₂, dan Efisiensi).
          </p>
        </div>

        {/* Run Selector */}
        <div className="board-controls-wrap">
          <label htmlFor="runSelect" className="hud-filter-label font-mono">
            TRACK RUN:
          </label>
          <select
            id="runSelect"
            className="input-field hud-select"
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
          >
            {telemetryRuns.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} · {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Telemetry Dashboard Gauges (6 Paddock Metric Cards) */}
      {selectedRun && (
        <div className="telemetry-dashboard-grid gt-telemetry-grid">
          {/* Speed Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">KECEPATAN RATA-RATA</span>
              <span className="badge badge-cyan font-mono">GPS VELOCITY</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">{selectedRun.avgSpeed}</span>
              <span className="t-unit font-mono">km/h</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>TOP SPEED: <strong className="tabular-nums">{selectedRun.maxSpeed} km/h</strong></span>
            </div>
          </div>

          {/* Voltage Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">TEGANGAN BUS</span>
              <span className="badge badge-emerald font-mono">DC BUS</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">{selectedRun.voltage}</span>
              <span className="t-unit font-mono">V</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>STATUS: <strong>NOMINAL RANGE (48V)</strong></span>
            </div>
          </div>

          {/* Motor Current Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">ARUS MOTOR</span>
              <span className="badge badge-yellow font-mono">HALL SENSOR</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">{selectedRun.current}</span>
              <span className="t-unit font-mono">A</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>PEAK CURRENT: <strong className="tabular-nums">24.2 A</strong></span>
            </div>
          </div>

          {/* Power Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">DAYA AKTIF MOTOR</span>
              <span className="badge badge-purple font-mono">P = V × I</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">{selectedRun.power}</span>
              <span className="t-unit font-mono">W</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>ENERGY: <strong className="tabular-nums">{selectedRun.energy} kWh</strong></span>
            </div>
          </div>

          {/* H2 Flow Rate Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">ALIRAN HIDROGEN (H₂)</span>
              <span className="badge badge-cyan font-mono">FLOW METER</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">12.4</span>
              <span className="t-unit font-mono">NL/min</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>PRESSURE: <strong className="tabular-nums">0.55 bar</strong></span>
            </div>
          </div>

          {/* Fuel Cell Efficiency Gauge Card */}
          <div className="telemetry-metric-card gt-metric-card">
            <div className="t-card-header">
              <span className="t-label font-mono">EFISIENSI SISTEM</span>
              <span className="badge badge-yellow font-mono">H₂ URBAN</span>
            </div>
            <div className="t-value-display">
              <span className="t-number font-mono tabular-nums">{selectedRun.efficiency}</span>
            </div>
            <div className="t-card-footer font-mono">
              <span>ENERGY INDEX: <strong className="tabular-nums">TOP TIER</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Circuit Sector Map & Telemetry Telematics Panel */}
      <div className="telemetry-track-layout gt-track-panel">
        <div className="gt-track-map-wrap">
          <div className="gt-track-map-header">
            <div className="gt-track-name-wrap">
              <span className="font-mono text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                CIRCUIT TELEMETRY OVERVIEW
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Lusail International Circuit</h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.725rem' }}>
                Panjang: 5.38 km · 16 Tikungan · Sektor 1 &amp; Sektor 2 Telemetri Aktif
              </span>
            </div>
            <span className="stage-pill">
              <span className="stage-pill-dot" />
              <span>LIVE TRACKING</span>
            </span>
          </div>

          {/* Stylized Track Path SVG (GT Sport Telemetry Reference Style) */}
          <div className="gt-track-svg-box">
            <svg
              viewBox="0 0 700 240"
              className="gt-track-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Track Map Vector"
            >
              {/* Glow filter */}
              <defs>
                <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Racetrack Outline */}
              <path
                d="M 60 180 C 40 180 30 160 35 130 C 45 70 80 40 140 45 C 190 50 210 90 260 90 C 310 90 350 50 420 50 C 490 50 540 80 580 70 C 620 60 660 75 670 110 C 680 150 640 190 570 190 C 490 190 440 160 380 160 C 320 160 280 200 210 200 C 140 200 90 180 60 180 Z"
                stroke="rgba(158, 180, 200, 0.25)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 60 180 C 40 180 30 160 35 130 C 45 70 80 40 140 45 C 190 50 210 90 260 90 C 310 90 350 50 420 50 C 490 50 540 80 580 70 C 620 60 660 75 670 110 C 680 150 640 190 570 190 C 490 190 440 160 380 160 C 320 160 280 200 210 200 C 140 200 90 180 60 180 Z"
                stroke="var(--color-antasena-purple)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#purpleGlow)"
              />

              {/* Sector Markers & Car Position Dot */}
              <circle cx="260" cy="90" r="7" fill="var(--color-apex-yellow)" stroke="#14151A" strokeWidth="2" />
              <text x="275" y="94" fill="var(--color-apex-yellow)" fontFamily="monospace" fontSize="11" fontWeight="bold">
                VEHICLE #211 (31.8 km/h)
              </text>

              <circle cx="420" cy="50" r="4" fill="var(--color-glacier-steel)" />
              <text x="428" y="46" fill="var(--color-glacier-steel)" fontFamily="monospace" fontSize="9">
                SECTOR 1 (SPEED TRAP)
              </text>

              <circle cx="580" cy="70" r="4" fill="var(--color-glacier-steel)" />
              <text x="588" y="66" fill="var(--color-glacier-steel)" fontFamily="monospace" fontSize="9">
                SECTOR 2 (EFF CHECK)
              </text>

              <circle cx="60" cy="180" r="4" fill="#22c55e" />
              <text x="70" y="195" fill="#22c55e" fontFamily="monospace" fontSize="9">
                START / FINISH LINE
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Run Summary & Alumni Review Panel */}
      {selectedRun && (
        <div className="telemetry-details-layout gt-details-layout">
          {/* Left: Run Information */}
          <div className="card gt-info-card" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.01em' }}>
              Ringkasan Sesi Uji: {selectedRun.name}
            </h2>
            <div className="run-specs-grid gt-specs-grid">
              <div className="spec-row">
                <span className="spec-name font-mono">ID UJI:</span>
                <span className="spec-val font-mono font-bold text-cyan">{selectedRun.id}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name font-mono">KENDARAAN:</span>
                <span className="spec-val font-bold">{selectedRun.vehicle}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name font-mono">TANGGAL UJI:</span>
                <span className="spec-val font-mono">{selectedRun.date}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name font-mono">DURASI LAP:</span>
                <span className="spec-val font-mono tabular-nums">{selectedRun.duration}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name font-mono">EFISIENSI H₂:</span>
                <span className="spec-val badge badge-yellow font-mono font-bold">
                  {selectedRun.efficiency}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-name font-mono">STATUS REVIEW:</span>
                <span
                  className={`badge ${
                    selectedRun.reviewStatus.includes('Approved')
                      ? 'badge-emerald'
                      : 'badge-yellow'
                  } font-mono`}
                >
                  {selectedRun.reviewStatus}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(55, 59, 71, 0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Catatan Paddock: Seluruh data metrik telematika pada simulator ini disesuaikan dengan profil efisiensi prototipe Antasena Falcon 2.0 (PBI-013 &amp; PBI-014 ready).
            </div>
          </div>

          {/* Right: Alumni Review & Comments */}
          <div className="card gt-info-card" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Umpan Balik Alumni Reviewer</span>
              <span className="badge badge-yellow font-mono">PBI-015 Ready</span>
            </h2>

            {selectedRun.reviews && selectedRun.reviews.length > 0 ? (
              <div className="alumni-reviews-list">
                {selectedRun.reviews.map((rev) => (
                  <div key={rev.id} className="review-box gt-review-box">
                    <div className="review-header">
                      <span className="reviewer-name font-bold">{rev.reviewer}</span>
                      <span className="review-rating font-mono badge badge-cyan">Skor: {rev.rating}/5</span>
                    </div>
                    <p className="review-note">"{rev.note}"</p>
                    <span className="review-time font-mono">{new Date(rev.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-column-box gt-empty-box">
                Belum ada review dari Alumni Reviewer untuk sesi uji ini. Sesi uji berada dalam antrean review.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
