import React, { useState } from 'react'
import Navbar from './Navbar.jsx'
import MobileNav from './MobileNav.jsx'

export default function MainLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="app-layout main-layout-root">
      {/* Fixed Full-Screen Background Image (Antasena Team /images/BG.jpeg) */}
      <div
        className="main-layout-bg transform-gpu"
        style={{ backgroundImage: `url('/images/BG.jpeg')` }}
        aria-hidden="true"
      />

      {/* Ambient Overlay Layer for Contrast Balancing */}
      <div className="main-layout-overlay" aria-hidden="true" />

      {/* App Shell Content (Relative z-index above ambient overlay) */}
      <div className="main-layout-content">
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="main-viewport">{children}</main>

        {/* Paddock Telemetry Bottom Ticker Bar */}
        <footer className="app-footer paddock-ticker">
          <div className="ticker-inner">
            <div className="ticker-item ticker-brand">
              <span className="ticker-dot" aria-hidden="true" />
              <span className="ticker-strong">ANTASENA ITS RACING TEAM</span>
              <span className="ticker-sep" aria-hidden="true">//</span>
              <span className="ticker-label">UNIFIED AGILE &amp; TELEMETRY</span>
            </div>

            <div className="ticker-divider" aria-hidden="true" />

            <div className="ticker-item">
              <span className="ticker-key">EVENT</span>
              <span className="ticker-val">SHELL ECO-MARATHON 2025</span>
            </div>

            <div className="ticker-divider" aria-hidden="true" />

            <div className="ticker-item">
              <span className="ticker-key">CIRCUIT</span>
              <span className="ticker-val">LUSAIL INTERNATIONAL</span>
            </div>

            <div className="ticker-divider" aria-hidden="true" />

            <div className="ticker-item">
              <span className="ticker-key">VEHICLE</span>
              <span className="ticker-val font-mono">FALCON 2.0 (#211)</span>
            </div>

            <div className="ticker-divider" aria-hidden="true" />

            <div className="ticker-item ticker-right">
              <span className="ticker-key">SYS STATUS</span>
              <span className="ticker-val ticker-val-live">PADDOCK LIVE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
