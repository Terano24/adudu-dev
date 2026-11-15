import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AccessDenied({
  title = 'Akses Ditolak (403 Forbidden)',
  message = 'Peran Anda saat ini tidak memiliki izin untuk melakukan aksi atau membuka halaman ini.',
  requiredPermission,
  onClose,
}) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="access-denied-box" role="alert">
      <div className="access-denied-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </div>
      <h2 className="access-denied-title">{title}</h2>
      <p className="access-denied-desc">{message}</p>
      
      {user && (
        <div style={{ marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Akun aktif: <strong>{user.name}</strong> | Peran: <span className="badge badge-yellow">{user.role}</span>
        </div>
      )}

      {requiredPermission && (
        <div style={{ marginBottom: '20px', fontSize: '0.775rem', fontFamily: 'var(--font-mono)' }}>
          Kebutuhan izin: <code>{requiredPermission}</code>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {onClose ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Tutup Pesan
          </button>
        ) : (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            Kembali
          </button>
        )}
        <Link to="/board" className="btn btn-primary btn-sm">
          Kembali ke Kanban Board
        </Link>
      </div>
    </div>
  )
}
