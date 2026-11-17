import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import MobileNav from './MobileNav.jsx'

export default function MainLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('antasena_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('antasena_sidebar_collapsed', String(isSidebarCollapsed))
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed])

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div
      className={`app-shell-root ${
        isSidebarCollapsed ? 'sidebar-is-collapsed' : ''
      }`}
    >
      {/* Fixed Modern Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="main-viewport-content">{children}</main>
      </div>

      {/* Floating reveal trigger when sidebar is collapsed/hidden */}
      {isSidebarCollapsed && (
        <button
          type="button"
          className="sidebar-floating-trigger"
          onClick={toggleSidebar}
          title="Tampilkan menu navigasi (Sidebar)"
          aria-label="Tampilkan menu navigasi"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  )
}

