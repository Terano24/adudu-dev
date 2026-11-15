import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'

// React.lazy code-splitting for core pages to optimize initial bundle size
const BoardPage = lazy(() => import('./pages/BoardPage.jsx'))
const BacklogPage = lazy(() => import('./pages/BacklogPage.jsx'))
const TelemetryPage = lazy(() => import('./pages/TelemetryPage.jsx'))
const VaultPage = lazy(() => import('./pages/VaultPage.jsx'))

function TelemetryLoadingFallback() {
  return (
    <div className="hud-suspense-container">
      <div className="hud-loading-spinner" aria-hidden="true" />
      <span className="hud-suspense-label">MEMUAT MODUL TELEMETRI...</span>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Suspense fallback={<TelemetryLoadingFallback />}>
            <Routes>
              {/* Public Auth Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Core Routes (PBI-006 & PBI-001) */}
              <Route
                path="/board"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BoardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backlog"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BacklogPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/telemetry"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TelemetryPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vault"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <VaultPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default & Fallback Redirection */}
              <Route path="/" element={<Navigate to="/board" replace />} />
              <Route path="*" element={<Navigate to="/board" replace />} />
            </Routes>
          </Suspense>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
