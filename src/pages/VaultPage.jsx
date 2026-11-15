import React, { useState, useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'

const CATEGORIES = [
  'All',
  'Vehicle Dynamics',
  'Body & Frame (CFD)',
  'Powertrain & Electrical',
  'Programming & Telemetry',
  'Fuel Cell Hidrogen',
  'Riset Lainnya',
]

export default function VaultPage() {
  const { vaultDocs } = useData()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocs = useMemo(() => {
    return vaultDocs.filter((doc) => {
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = doc.title.toLowerCase().includes(q)
        const tagMatch = doc.tags.some((t) => t.toLowerCase().includes(q))
        const authorMatch = doc.author.toLowerCase().includes(q)
        return titleMatch || tagMatch || authorMatch
      }
      return true
    })
  }, [vaultDocs, selectedCategory, searchQuery])

  return (
    <div className="wrap page-container board-paddock-root">
      {/* Header */}
      <div className="page-header board-hud-header">
        <div className="board-header-left">
          <div className="board-header-tagline">
            <span className="paddock-tag">ENGINEERING ARCHIVE</span>
            <span className="font-mono text-muted">//</span>
            <span className="font-mono text-muted">KNOWLEDGE VAULT HUD</span>
          </div>
          <h1 className="page-title board-main-title">
            Knowledge Vault Antasena
          </h1>
          <p className="page-subtitle">
            Repositori riset teknologi mobil hemat energi, dokumentasi teknis sasis &amp; fuel cell, dan arsip transfer pengetahuan regenerasi tim.
          </p>
        </div>

        {/* Search Input */}
        <div className="board-controls-wrap" style={{ maxWidth: '340px', width: '100%' }}>
          <input
            type="search"
            className="input-field hud-select font-mono"
            placeholder="Cari riset, kata kunci, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', minHeight: '40px' }}
          />
        </div>
      </div>

      {/* Paddock Vault Quick Stats */}
      <div className="backlog-metrics-row paddock-hud-metrics" style={{ marginBottom: '24px' }}>
        <div className="metric-box">
          <span className="metric-label font-mono">DOKUMEN RISET</span>
          <span className="metric-value font-mono tabular-nums">{vaultDocs.length}</span>
          <span className="metric-sub font-mono">PAPERS ARCHIVED</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">BIDANG REKAYASA</span>
          <span className="metric-value font-mono tabular-nums">{CATEGORIES.length - 1}</span>
          <span className="metric-sub font-mono">DISCIPLINES</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">TAHUN TERAKHIR</span>
          <span className="metric-value font-mono tabular-nums">2025</span>
          <span className="metric-sub font-mono">LUSAIL SEM CYCLE</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">STATUS ARSIP</span>
          <span className="metric-value font-mono" style={{ color: '#22c55e', fontSize: '1.25rem' }}>VERIFIED</span>
          <span className="metric-sub font-mono">PEER REVIEWED</span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="vault-categories-bar gt-categories-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill gt-cat-pill font-mono ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="vault-docs-grid gt-vault-grid">
        {filteredDocs.length === 0 ? (
          <div className="empty-column-box gt-empty-box" style={{ gridColumn: '1 / -1', padding: '40px' }}>
            <span className="empty-box-icon">--</span>
            <span>Tidak ada dokumen riset yang cocok dengan kategori atau kata kunci pencarian Anda.</span>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="card vault-doc-card gt-doc-card">
              <div className="doc-topline">
                <span className="badge badge-purple font-mono" style={{ fontSize: '0.675rem' }}>
                  {doc.category}
                </span>
                <span className="font-mono text-muted tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  YEAR {doc.year}
                </span>
              </div>

              <h2 className="doc-title">{doc.title}</h2>
              <p className="doc-summary">{doc.summary}</p>

              <div className="doc-tags">
                {doc.tags.map((tag) => (
                  <span key={tag} className="tag-chip font-mono">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="doc-footer">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>PENELITI</span>
                  <span className="doc-author font-bold">{doc.author}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm font-mono gt-read-btn"
                  onClick={() => alert(`Membuka berkas riset ${doc.id}: "${doc.title}"`)}
                >
                  BACA RISET →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '32px', padding: '14px', background: 'rgba(55, 59, 71, 0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Catatan Sistem: Seluruh dokumen Knowledge Vault pada modul ini merupakan data riset rekayasa kendaraan hemat energi Antasena ITS (PBI-019 compliant).
      </div>
    </div>
  )
}
