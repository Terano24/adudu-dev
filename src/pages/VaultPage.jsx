import React, { useState, useMemo, useCallback } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AccessDenied from '../components/common/AccessDenied.jsx'
import VaultThumbnail from '../components/vault/VaultThumbnail.jsx'

const CATEGORY_COLORS = {
  'Vehicle Dynamics': { bg: 'vault-cat-blue', label: 'Vehicle Dynamics' },
  'Body & Frame (CFD)': { bg: 'vault-cat-purple', label: 'Body & Frame (CFD)' },
  'Fuel Cell Hydrogen': { bg: 'vault-cat-green', label: 'Fuel Cell Hydrogen' },
  'Powertrain': { bg: 'vault-cat-orange', label: 'Powertrain' },
  'Thermal Management': { bg: 'vault-cat-teal', label: 'Thermal Management' },
  'Control System': { bg: 'vault-cat-indigo', label: 'Control System' },
}

export default function VaultPage() {
  const { vaultDocs, addVaultDoc, deleteVaultDoc } = useData()
  const { can, user } = useAuth()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Modals & Menu state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [readingDoc, setReadingDoc] = useState(null)
  const [activeMenuDocId, setActiveMenuDocId] = useState(null)
  const [deniedActionMessage, setDeniedActionMessage] = useState(null)

  // Add Doc Form State
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Vehicle Dynamics')
  const [newYear, setNewYear] = useState(2025)
  const [newAuthor, setNewAuthor] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newTags, setNewTags] = useState('')

  // Unique lists for filters
  const categoriesList = useMemo(() => {
    return ['All', ...new Set(vaultDocs.map((d) => d.category).filter(Boolean))]
  }, [vaultDocs])

  const yearsList = useMemo(() => {
    return ['All', ...new Set(vaultDocs.map((d) => String(d.year)).filter(Boolean))]
  }, [vaultDocs])

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return vaultDocs.filter((doc) => {
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false
      if (selectedYear !== 'All' && String(doc.year) !== selectedYear) return false
      if (selectedStatus !== 'All' && doc.status !== selectedStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = doc.title.toLowerCase().includes(q)
        const matchSummary = doc.summary?.toLowerCase().includes(q)
        const matchAuthor = doc.author?.toLowerCase().includes(q)
        const matchTag = doc.tags?.some((t) => t.toLowerCase().includes(q))
        return matchTitle || matchSummary || matchAuthor || matchTag
      }
      return true
    })
  }, [vaultDocs, selectedCategory, selectedYear, selectedStatus, searchQuery])

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedYear('All')
    setSelectedStatus('All')
  }, [])

  // Handle Klik Tambah Dokumen
  const handleOpenAddModal = () => {
    if (!can('create', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Menambahkan Dokumen',
        message:
          'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer hanya memiliki hak baca dan review teknis. Anda tidak diizinkan menambahkan dokumen riset baru.',
        requiredPermission: 'create:vault',
      })
      return
    }
    setIsAddModalOpen(true)
  }

  // Handle Submit Form Dokumen
  const handleCreateDocSubmit = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    const catThumbMap = {
      'Vehicle Dynamics': 'suspension',
      'Body & Frame (CFD)': 'cfd',
      'Fuel Cell Hydrogen': 'fuelcell',
      'Powertrain': 'bldc',
      'Thermal Management': 'battery',
      'Control System': 'control',
    }

    if (addVaultDoc) {
      const result = addVaultDoc({
        title: newTitle.trim(),
        category: newCategory,
        year: Number(newYear),
        author: newAuthor.trim() || user?.name || 'Tim SenaFlow',
        summary: newSummary.trim() || 'Dokumentasi teknis riset tim.',
        tags: tagsArray.length > 0 ? tagsArray : ['Research', 'SenaFlow'],
        thumbType: catThumbMap[newCategory] || 'suspension',
      })

      if (!result.success) {
        setDeniedActionMessage({
          title: 'Gagal Menambahkan Dokumen',
          message: result.error,
          requiredPermission: 'create:vault',
        })
        setIsAddModalOpen(false)
        return
      }
    }

    // Reset Form
    setNewTitle('')
    setNewAuthor('')
    setNewSummary('')
    setNewTags('')
    setIsAddModalOpen(false)
  }

  // Handle Delete Dokumen
  const handleDeleteDoc = (docId, docTitle) => {
    setActiveMenuDocId(null)
    if (!can('delete', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Menghapus Dokumen',
        message: 'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer dilarang menghapus dokumen riset.',
        requiredPermission: 'delete:vault',
      })
      return
    }

    if (window.confirm(`Hapus dokumen "${docTitle}" dari Knowledge Vault?`)) {
      if (deleteVaultDoc) {
        deleteVaultDoc(docId)
      }
    }
  }

  return (
    <div className="vault-page-wrapper">
      {/* Access Denied Alert Banner */}
      {deniedActionMessage && (
        <div className="denied-alert-container">
          <AccessDenied
            title={deniedActionMessage.title}
            message={deniedActionMessage.message}
            requiredPermission={deniedActionMessage.requiredPermission}
            onClose={() => setDeniedActionMessage(null)}
          />
        </div>
      )}

      {/* 1. Hero Blue Banner (Knowledge Vault SenaFlow) */}
      <section className="dashboard-hero-banner vault-hero-banner" aria-label="Knowledge Vault Banner">
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '6px', verticalAlign: '-1px' }}
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
            <span>Knowledge Repository</span>
          </div>

          <h1 className="hero-main-title">Knowledge Vault SenaFlow</h1>
          <p className="hero-subtitle">
            Repositori riset teknologi mobil hemat energi, dokumentasi teknis sasis &amp; fuel cell, dan arsip transfer pengetahuan regenerasi tim.
          </p>
        </div>

        <div className="hero-banner-visual">
          <div className="vault-blueprint-wrap">
            {/* Technical Race Car Blueprint Graphic */}
            <svg
              className="vault-blueprint-svg"
              viewBox="0 0 380 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="blueprintGrad" x1="0" y1="0" x2="380" y2="140" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="0.6" stopColor="#60A5FA" stopOpacity="0.7" />
                  <stop offset="1" stopColor="#93C5FD" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Blueprint Grid Lines */}
              <line x1="20" y1="20" x2="360" y2="20" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
              <line x1="20" y1="50" x2="360" y2="50" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
              <line x1="20" y1="80" x2="360" y2="80" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
              <line x1="20" y1="110" x2="360" y2="110" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />

              {/* Rear Wing Structure */}
              <rect x="42" y="24" width="34" height="12" rx="2" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="42" y1="24" x2="42" y2="80" stroke="#38BDF8" strokeWidth="2" />
              <line x1="76" y1="24" x2="76" y2="80" stroke="#38BDF8" strokeWidth="2" />
              <line x1="42" y1="42" x2="76" y2="42" stroke="#93C5FD" strokeWidth="1" strokeDasharray="4 2" />

              {/* Engine Cover Fin */}
              <path d="M76 42 Q 130 40, 165 58 L 76 74 Z" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="100" y1="42" x2="165" y2="58" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 2" />

              {/* Cockpit / Halo */}
              <ellipse cx="180" cy="62" rx="18" ry="7" stroke="#60A5FA" strokeWidth="1.5" />
              <path d="M165 62 C 170 52, 190 52, 195 62" stroke="#38BDF8" strokeWidth="2" fill="none" />
              {/* Helmet */}
              <circle cx="178" cy="58" r="6" stroke="#93C5FD" strokeWidth="1.5" />

              {/* Car Body Monocoque Wireframe */}
              <path
                d="M58 92 L 76 74 Q 140 68, 205 76 L 315 92 Q 340 94, 355 97 L 350 102 L 68 102 Z"
                stroke="#60A5FA"
                strokeWidth="1.8"
              />

              {/* Sidepod Intake Outline */}
              <path d="M125 76 Q 165 74, 180 84 L 170 98 L 120 98 Z" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="130" y1="84" x2="175" y2="84" stroke="#93C5FD" strokeWidth="1" strokeDasharray="4 2" />

              {/* Front Nose & Wing */}
              <path d="M305 92 Q 338 95, 355 97 L 352 104 L 300 104 Z" stroke="#38BDF8" strokeWidth="1.5" />
              <rect x="330" y="98" width="38" height="6" rx="2" stroke="#60A5FA" strokeWidth="1.5" />
              <rect x="364" y="88" width="4" height="22" rx="1.5" stroke="#93C5FD" strokeWidth="1.5" />

              {/* Front Wishbones */}
              <line x1="280" y1="86" x2="308" y2="94" stroke="#93C5FD" strokeWidth="1.8" />
              <line x1="280" y1="96" x2="308" y2="99" stroke="#93C5FD" strokeWidth="1.8" />

              {/* Rear Wheel Wireframe */}
              <circle cx="85" cy="94" r="24" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="85" cy="94" r="16" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="4 2" />
              <circle cx="85" cy="94" r="7" stroke="#93C5FD" strokeWidth="1.5" />
              <line x1="61" y1="94" x2="109" y2="94" stroke="#38BDF8" strokeWidth="1" />
              <line x1="85" y1="70" x2="85" y2="118" stroke="#38BDF8" strokeWidth="1" />

              {/* Front Wheel Wireframe */}
              <circle cx="305" cy="97" r="21" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="305" cy="97" r="14" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="4 2" />
              <circle cx="305" cy="97" r="6" stroke="#93C5FD" strokeWidth="1.5" />
              <line x1="284" y1="97" x2="326" y2="97" stroke="#38BDF8" strokeWidth="1" />
              <line x1="305" y1="76" x2="305" y2="118" stroke="#38BDF8" strokeWidth="1" />

              {/* Ground line */}
              <line x1="40" y1="120" x2="360" y2="120" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Four Metrics Cards Row (Matching Reference) */}
      <section className="metrics-cards-grid" aria-label="Knowledge Vault Summary Metrics">
        {/* Metric 1: Dokumen Riset */}
        <div className="metric-overview-card card-theme-blue">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-big-number">{vaultDocs.length}</span>
              <span className="metric-card-title">Dokumen Riset</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>+1 dari tahun lalu</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path d="M2 32 Q 25 28, 45 32 T 88 12" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 2: Bidang Rekayasa */}
        <div className="metric-overview-card card-theme-purple">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-purple">
              {/* Flask / Chemistry Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.31L4.17 18.5A2 2 0 0 0 5.86 21.5h12.28a2 2 0 0 0 1.69-3L14 9.31V2" />
                <line x1="8.5" y1="2" x2="15.5" y2="2" />
                <path d="M14 9.31a8.87 8.87 0 0 0-4 0" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-big-number">6</span>
              <span className="metric-card-title">Bidang Rekayasa</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>+1 dari tahun lalu</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path d="M2 35 Q 25 32, 50 30 T 88 14" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 3: Tahun Terakhir */}
        <div className="metric-overview-card card-theme-green">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-green">
              {/* Calendar Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-big-number">2025</span>
              <span className="metric-card-title">Tahun Terakhir</span>
              <span className="metric-trend trend-status">
                <span className="status-green-dot" />
                <span>Aktif</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path d="M2 30 Q 30 35, 55 25 T 88 12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Metric 4: Status Arsip */}
        <div className="metric-overview-card card-theme-green">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-green">
              {/* Checkmark Shield */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-big-number font-bold text-emerald-600" style={{ color: '#10B981', fontSize: '1.45rem', letterSpacing: '0.04em' }}>
                VERIFIED
              </span>
              <span className="metric-card-title">Status Arsip</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>100% tervalidasi</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path d="M2 32 Q 35 32, 60 22 T 88 10" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* 3. Filter Controls Bar */}
      <section className="vault-controls-section" aria-label="Filter Dokumen Riset">
        <div className="vault-filter-card">
          <div className="vault-filter-left">
            {/* Search Input */}
            <div className="vault-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="vault-search-input"
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Cari dokumen riset"
              />
            </div>

            {/* Selects Row: Bidang, Tahun, Status side-by-side */}
            <div className="vault-selects-row">
              {/* Bidang Select */}
              <div className="vault-select-wrap">
                <select
                  className="vault-modern-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter Bidang"
                >
                  <option value="All">Semua Bidang</option>
                  {categoriesList
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
                <svg
                  className="vault-select-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Tahun Select */}
              <div className="vault-select-wrap">
                <select
                  className="vault-modern-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Filter Tahun"
                >
                  <option value="All">Semua Tahun</option>
                  {yearsList
                    .filter((y) => y !== 'All')
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
                <svg
                  className="vault-select-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

                {/* Status Select */}
                <div className="vault-select-wrap">
                  <select
                    className="vault-modern-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    aria-label="Filter Status"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Verified">Verified</option>
                    <option value="In Review">In Review</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <svg
                    className="vault-select-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="vault-filter-right">
              {/* Button Tambah Dokumen */}
              <button
                type="button"
                className="btn-add-vault-primary"
                onClick={handleOpenAddModal}
                title={
                  can('create', 'card')
                    ? 'Tambah dokumen riset baru ke Knowledge Vault'
                    : 'Alumni Reviewer tidak diizinkan menambahkan dokumen'
                }
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tambah Dokumen</span>
              </button>

              {/* Button Reset Filter */}
              <button
                type="button"
                className="btn-reset-vault-secondary"
                onClick={handleResetFilters}
                title="Kembalikan semua filter ke pengaturan awal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
      </section>

      {/* 4. Research Documents Grid (2x3 = 6 Cards) */}
      <section className="vault-documents-grid-section" aria-label="Daftar Dokumen Riset">
        {filteredDocs.length === 0 ? (
          <div className="empty-vault-placeholder">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
            <p>Tidak ada dokumen riset yang cocok dengan kata kunci atau filter yang Anda pilih.</p>
            <button type="button" className="btn-reset-vault-secondary" onClick={handleResetFilters}>
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="vault-cards-grid">
            {filteredDocs.map((doc) => {
              const catConfig = CATEGORY_COLORS[doc.category] || {
                bg: 'vault-cat-blue',
                label: doc.category || 'Research',
              }
              const isMenuOpen = activeMenuDocId === doc.id

              return (
                <div key={doc.id} className="vault-document-card">
                  {/* Top Row: Category badge, Year, Options menu */}
                  <div className="doc-card-top-row">
                    <span className={`doc-category-badge ${catConfig.bg}`}>
                      {doc.category}
                    </span>

                    <div className="doc-top-right">
                      <span className="doc-year-label">{doc.year}</span>

                      {/* Options Button ··· */}
                      <div className="doc-menu-anchor">
                        <button
                          type="button"
                          className="doc-dots-menu-btn"
                          onClick={() => setActiveMenuDocId(isMenuOpen ? null : doc.id)}
                          aria-label="Aksi Dokumen"
                          title="Aksi Dokumen"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="19" cy="12" r="1.5" />
                            <circle cx="5" cy="12" r="1.5" />
                          </svg>
                        </button>

                        {isMenuOpen && (
                          <div className="doc-popover-menu">
                            <button
                              type="button"
                              className="popover-action-item"
                              onClick={() => {
                                setActiveMenuDocId(null)
                                setReadingDoc(doc)
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>Baca Dokumen Riset</span>
                            </button>

                            <button
                              type="button"
                              className="popover-action-item"
                              onClick={() => {
                                setActiveMenuDocId(null)
                                navigator.clipboard?.writeText(window.location.href)
                                alert(`Tautan dokumen "${doc.title}" berhasil disalin!`)
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                              <span>Salin Tautan</span>
                            </button>

                            <div className="popover-menu-divider" />

                            <button
                              type="button"
                              className="popover-action-item delete-item"
                              disabled={!can('delete', 'card')}
                              onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                              <span>Hapus Dokumen</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Main Content Row: Left info & Right thumbnail */}
                  <div className="doc-card-body-row">
                    <div className="doc-info-left">
                      <h3
                        className="doc-card-title"
                        onClick={() => setReadingDoc(doc)}
                        title={doc.title}
                      >
                        {doc.title}
                      </h3>

                      <p className="doc-card-summary">{doc.summary}</p>

                      {/* Tags row */}
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="doc-tags-wrap">
                          {doc.tags.map((tag) => (
                            <span key={tag} className="doc-tag-pill">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="doc-thumb-right">
                      <VaultThumbnail
                        type={doc.thumbType || 'suspension'}
                        title={doc.title}
                        onOpen={() => setReadingDoc(doc)}
                      />
                    </div>
                  </div>

                  {/* Bottom Footer Row: Author & Date */}
                  <div className="doc-card-footer-row">
                    <div className="doc-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className="doc-author-name">{doc.author}</span>
                    </div>

                    <div className="doc-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="doc-date-text">{doc.date || `${doc.year}`}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 5. Page Footer: Menampilkan 1-6 dari 6 dokumen */}
        <div className="vault-page-footer">
          <span className="vault-page-info">
            Menampilkan 1-{filteredDocs.length} dari {vaultDocs.length} dokumen
          </span>

          <div className="vault-pagination-controls" aria-label="Navigasi Halaman Vault">
            <button type="button" className="vault-page-btn" disabled aria-label="Halaman Sebelumnya">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button type="button" className="vault-page-btn active" aria-label="Halaman 1">
              1
            </button>

            <button type="button" className="vault-page-btn" disabled aria-label="Halaman Selanjutnya">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Tambah Dokumen Riset */}
      {isAddModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modern-modal-card vault-add-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="addDocModalTitle"
          >
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <div className="modal-header-icon bubble-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <h3 id="addDocModalTitle" className="modal-main-title">
                  Tambah Dokumen Riset Baru
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateDocSubmit} className="modal-form-content">
              {/* Judul Riset */}
              <div className="form-group-field">
                <label htmlFor="docTitleInput" className="form-field-label">
                  Judul Riset / Paper <span className="text-rose-500">*</span>
                </label>
                <input
                  id="docTitleInput"
                  type="text"
                  className="modal-text-input"
                  placeholder="Contoh: Optimasi Sistem Transmisi Rasio Gearbox..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              {/* Bidang & Tahun */}
              <div className="form-two-cols-row">
                <div className="form-group-field">
                  <label htmlFor="docCategorySelect" className="form-field-label">
                    Bidang Rekayasa
                  </label>
                  <select
                    id="docCategorySelect"
                    className="modal-select-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Vehicle Dynamics">Vehicle Dynamics</option>
                    <option value="Body & Frame (CFD)">Body & Frame (CFD)</option>
                    <option value="Fuel Cell Hydrogen">Fuel Cell Hydrogen</option>
                    <option value="Powertrain">Powertrain</option>
                    <option value="Thermal Management">Thermal Management</option>
                    <option value="Control System">Control System</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="docYearSelect" className="form-field-label">
                    Tahun Riset
                  </label>
                  <select
                    id="docYearSelect"
                    className="modal-select-input"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                </div>
              </div>

              {/* Peneliti & Tags */}
              <div className="form-two-cols-row">
                <div className="form-group-field">
                  <label htmlFor="docAuthorInput" className="form-field-label">
                    Nama Peneliti / Tim
                  </label>
                  <input
                    id="docAuthorInput"
                    type="text"
                    className="modal-text-input"
                    placeholder="Contoh: Ahmad Reza / Tim Riset"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                  />
                </div>

                <div className="form-group-field">
                  <label htmlFor="docTagsInput" className="form-field-label">
                    Tags (pisahkan koma)
                  </label>
                  <input
                    id="docTagsInput"
                    type="text"
                    className="modal-text-input"
                    placeholder="Suspension, Geometry, Roll Resistance"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </div>
              </div>

              {/* Abstrak / Ringkasan */}
              <div className="form-group-field">
                <label htmlFor="docSummaryInput" className="form-field-label">
                  Abstrak / Ringkasan Teknis
                </label>
                <textarea
                  id="docSummaryInput"
                  className="modal-textarea-input"
                  placeholder="Ringkasan hasil riset dan kesimpulan teknis..."
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="modal-submit-btn">
                  Simpan Dokumen Riset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Baca Berkas Riset (Document Viewer) */}
      {readingDoc && (
        <div className="modal-backdrop-overlay" onClick={() => setReadingDoc(null)}>
          <div
            className="modern-modal-card vault-read-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="readDocTitle"
          >
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <span className={`doc-category-badge ${CATEGORY_COLORS[readingDoc.category]?.bg || 'vault-cat-blue'}`}>
                  {readingDoc.category}
                </span>
                <span className="doc-year-label">{readingDoc.year}</span>
                <span className="status-pill status-done">
                  <span className="status-dot-bullet" style={{ backgroundColor: '#10B981' }} />
                  <span>Verified</span>
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setReadingDoc(null)}
                aria-label="Tutup berkas"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="vault-read-body">
              <h2 id="readDocTitle" className="read-doc-heading">
                {readingDoc.title}
              </h2>

              <div className="read-meta-strip">
                <div className="read-meta-cell">
                  <span className="read-meta-label">PENELITI:</span>
                  <span className="read-meta-val font-bold">{readingDoc.author}</span>
                </div>
                <div className="read-meta-cell">
                  <span className="read-meta-label">TANGGAL PUBLIKASI:</span>
                  <span className="read-meta-val">{readingDoc.date || `${readingDoc.year}`}</span>
                </div>
                <div className="read-meta-cell">
                  <span className="read-meta-label">NOMOR ARSIP:</span>
                  <span className="read-meta-val font-mono">{readingDoc.id}</span>
                </div>
              </div>

              <div className="read-abstract-box">
                <h4 className="abstract-title font-mono">ABSTRAK &amp; KAJIAN TEKNIS</h4>
                <p className="abstract-text">{readingDoc.summary}</p>
              </div>

              {readingDoc.tags && (
                <div className="read-tags-row">
                  <span className="tags-label">KATA KUNCI:</span>
                  <div className="tags-pill-list">
                    {readingDoc.tags.map((t) => (
                      <span key={t} className="doc-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="read-doc-preview-banner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="m9 15 3 3 3-3" />
                </svg>
                <div className="doc-preview-text">
                  <span className="font-bold">SenaFlow_Engineering_Report_{readingDoc.id}.pdf</span>
                  <span className="text-secondary text-xs">Ukuran Berkas: 4.8 MB · Format Dokumen PDF Terenkripsi</span>
                </div>
                <button
                  type="button"
                  className="btn-download-pdf"
                  onClick={() => alert(`Mengunduh berkas riset ${readingDoc.id} (${readingDoc.title})...`)}
                >
                  Unduh PDF
                </button>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button type="button" className="modal-submit-btn" onClick={() => setReadingDoc(null)}>
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
