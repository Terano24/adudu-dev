import React, { useState, useMemo, useCallback } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import AccessDenied from '../../components/common/AccessDenied.jsx'
import BacklogEpicCard from '../../components/backlog/BacklogEpicCard.jsx'

const PRIORITY_ORDER = {
  Must: 1,
  Should: 2,
  Could: 3,
  "Won't": 4,
}

export default function BacklogList() {
  const { backlogItems, epics, addBacklogItem, updateBacklogPriority } = useData()
  const { can, user } = useAuth()

  // Filter state
  const [sprintFilter, setSprintFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [expandedItemId, setExpandedItemId] = useState(null)
  const [detailModalItem, setDetailModalItem] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deniedActionMessage, setDeniedActionMessage] = useState(null)

  // Handle PO Priority Change (Kriteria PBI-005)
  const handleChangePriority = useCallback(
    (itemId, newPriority) => {
      if (user?.role !== 'Admin/PO') {
        setDeniedActionMessage({
          title: 'Izin Ditolak: Hanya Product Owner (PO)',
          message:
            'Berdasarkan aturan sistem (PBI-005), hanya peran Product Owner (Admin/PO) yang berhak mengubah prioritas User Story.',
          requiredPermission: 'edit:priority',
        })
        return
      }

      if (newPriority && updateBacklogPriority) {
        updateBacklogPriority(itemId, newPriority)
        setDetailModalItem((prev) =>
          prev && prev.id === itemId ? { ...prev, priority: newPriority } : prev
        )
      }
    },
    [user, updateBacklogPriority]
  )

  // Form input state for adding user story
  const [newTitle, setNewTitle] = useState('')
  const [newEpic, setNewEpic] = useState('EPIC-1')
  const [newPriority, setNewPriority] = useState('Must')
  const [newPoints, setNewPoints] = useState(5)
  const [newSprint, setNewSprint] = useState(1)
  const [newDivision, setNewDivision] = useState('Programming')
  const [newAcceptanceText, setNewAcceptanceText] = useState('')

  // Filter items
  const filteredItems = useMemo(() => {
    return backlogItems.filter((item) => {
      if (sprintFilter !== 'All' && String(item.sprint) !== sprintFilter) return false
      if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false
      return true
    })
  }, [backlogItems, sprintFilter, priorityFilter])

  // Sort by MoSCoW Priority strictly, then by rank (PBI-006, PBI-001, PBI-002...)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const prioA = PRIORITY_ORDER[a.priority] || 99
      const prioB = PRIORITY_ORDER[b.priority] || 99
      if (prioA !== prioB) return prioA - prioB
      if (a.rank != null && b.rank != null) return a.rank - b.rank
      return a.id.localeCompare(b.id)
    })
  }, [filteredItems])

  // Summary Metrics calculations
  const totalUserStories = backlogItems.length || 22
  const totalStoryPoints = useMemo(() => {
    return backlogItems.reduce((acc, curr) => acc + (curr.points || 0), 0) || 122
  }, [backlogItems])
  const totalEpicsCount = (epics && epics.length) || 5
  const targetSprint = 4

  // Group items by Epic
  const epicGroups = useMemo(() => {
    const groups = (epics || [])
      .map((epic) => {
        const items = sortedItems.filter((item) => item.epic === epic.id)
        const points = items.reduce((sum, item) => sum + (item.points || 0), 0)
        return {
          ...epic,
          items,
          totalPoints: points,
        }
      })
      .filter((g) => g.items.length > 0)

    // Catch any items that belong to unlisted epics
    const knownEpicIds = new Set((epics || []).map((e) => e.id))
    const otherItems = sortedItems.filter((item) => !knownEpicIds.has(item.epic))
    if (otherItems.length > 0) {
      groups.push({
        id: 'OTHER',
        name: 'User Story Tambahan',
        title: 'User Story Tambahan',
        goal: 'Fitur dan perbaikan sistem ad-hoc.',
        items: otherItems,
        totalPoints: otherItems.reduce((sum, item) => sum + (item.points || 0), 0),
      })
    }

    return groups
  }, [epics, sortedItems])

  const handleToggleExpand = useCallback((id) => {
    setExpandedItemId((prev) => (prev === id ? null : id))
  }, [])

  const handleOpenDetailModal = useCallback((item) => {
    setDetailModalItem(item)
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalItem(null)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSprintFilter('All')
    setPriorityFilter('All')
  }, [])

  // Handle Klik Tambah User Story
  const handleOpenAddModal = () => {
    if (!can('create', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Menambah User Story',
        message:
          'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer hanya memiliki hak baca dan review teknis. Anda tidak diizinkan membuat User Story baru.',
        requiredPermission: 'create:backlog',
      })
      return
    }
    setIsAddModalOpen(true)
  }

  // Handle Submit Form User Story
  const handleCreateStorySubmit = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const acceptanceArray = newAcceptanceText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    if (addBacklogItem) {
      const result = addBacklogItem({
        title: newTitle.trim(),
        epic: newEpic,
        priority: newPriority,
        points: Number(newPoints),
        sprint: Number(newSprint),
        division: newDivision,
        owner: user?.name || 'Tim SenaFlow',
        acceptance: acceptanceArray.length > 0 ? acceptanceArray : undefined,
      })

      if (!result.success) {
        setDeniedActionMessage({
          title: 'Gagal Menambahkan User Story',
          message: result.error,
          requiredPermission: 'create:backlog',
        })
        setIsAddModalOpen(false)
        return
      }
    }

    // Reset Form
    setNewTitle('')
    setNewAcceptanceText('')
    setIsAddModalOpen(false)
  }

  return (
    <div className="backlog-feature-wrapper">
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

      {/* 1. Hero Blue Banner (Product Backlog SenaFlow) */}
      <section className="dashboard-hero-banner backlog-hero-banner" aria-label="Product Backlog Banner">
        <div className="hero-banner-content">
          <div className="hero-badge-pill">EPIC REPOSITORY</div>
          <h1 className="hero-main-title">Product Backlog SenaFlow</h1>
          <p className="hero-subtitle">
            Daftar User Story dan fitur teknis kendaraan, terstruktur berdasarkan Epic, Sprint terencana, dan Prioritas MoSCoW.
          </p>
        </div>

        <div className="hero-banner-visual">
          <div className="backlog-racecar-wrap">
            {/* Aerodynamic Formula / Prototype Race Car Silhouette SVG */}
            <svg
              className="backlog-racecar-svg"
              viewBox="0 0 380 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="carGrad" x1="50" y1="20" x2="350" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" stopOpacity="0.95" />
                  <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#1E40AF" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="aeroLines" x1="0" y1="70" x2="300" y2="70" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" stopOpacity="0" />
                  <stop offset="0.6" stopColor="#38BDF8" stopOpacity="0.7" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Aerodynamic stream curves in background */}
              <path d="M10 40 Q 120 35, 230 48 T 370 52" stroke="url(#aeroLines)" strokeWidth="1.5" strokeDasharray="6 4" />
              <path d="M40 70 Q 150 65, 250 78 T 375 75" stroke="url(#aeroLines)" strokeWidth="2" />
              <path d="M20 95 Q 110 90, 200 98 T 360 92" stroke="url(#aeroLines)" strokeWidth="1.5" strokeDasharray="8 6" />

              {/* Rear Wing Endplate & Wing Blade on left (x: 40-75) */}
              <path d="M50 20 H80 L75 35 H45 Z" fill="#93C5FD" fillOpacity="0.85" />
              <rect x="42" y="18" width="6" height="52" rx="3" fill="#60A5FA" />
              <rect x="76" y="18" width="6" height="52" rx="3" fill="#60A5FA" />
              <path d="M45 42 L80 40 L78 48 L44 49 Z" fill="#BFDBFE" />

              {/* Engine Cover & Shark Fin */}
              <path d="M78 40 Q 130 38, 170 55 L 80 72 Z" fill="url(#carGrad)" />
              <path d="M110 38 Q 150 36, 175 52 L 110 52 Z" fill="#BFDBFE" fillOpacity="0.5" />

              {/* Cockpit & Halo Ring */}
              <ellipse cx="185" cy="58" rx="20" ry="8" fill="#1E293B" />
              {/* Helmet */}
              <circle cx="178" cy="54" r="8" fill="#F8FAFC" />
              <path d="M174 53 H 184 L 181 57 H 175 Z" fill="#0284C7" />
              {/* Halo Arch */}
              <path d="M162 60 C 168 50, 195 50, 202 60" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Monocoque Body & Nose Cone tapering forward to right */}
              <path
                d="M60 88 L 78 72 Q 150 68, 210 74 L 320 90 Q 345 93, 355 96 L 350 102 L 290 102 L 230 102 L 70 102 Z"
                fill="url(#carGrad)"
              />
              {/* Yellow & Purple Accent racing stripes */}
              <path d="M120 78 L 310 93 L 305 97 L 115 82 Z" fill="#FACC15" />
              <path d="M110 82 L 280 96 L 275 100 L 105 86 Z" fill="#A855F7" />

              {/* Sidepod Air Intake */}
              <path d="M125 76 Q 165 74, 185 84 L 175 98 L 120 98 Z" fill="#1E3A8A" fillOpacity="0.75" />

              {/* Front Nose & Front Wing (Right, x: 310-365) */}
              <path d="M305 92 Q 338 95, 355 96 L 352 104 L 300 104 Z" fill="#93C5FD" />
              {/* Front Wing Mainplane & Flaps */}
              <rect x="330" y="98" width="40" height="7" rx="3" fill="#60A5FA" />
              <path d="M332 94 L 368 94 L 366 98 L 330 98 Z" fill="#BFDBFE" />
              {/* Front Wing Endplate */}
              <rect x="366" y="86" width="5" height="24" rx="2" fill="#E2E8F0" />

              {/* Front Suspension Wishbones */}
              <line x1="280" y1="84" x2="310" y2="92" stroke="#CBD5E1" strokeWidth="2.5" />
              <line x1="280" y1="94" x2="310" y2="98" stroke="#CBD5E1" strokeWidth="2.5" />

              {/* Rear Wheel (Left, x: 80, y: 96, r: 24) */}
              <circle cx="85" cy="94" r="25" fill="#0F172A" stroke="#334155" strokeWidth="3" />
              <circle cx="85" cy="94" r="16" fill="#1E293B" />
              <circle cx="85" cy="94" r="9" fill="#0284C7" />
              <circle cx="85" cy="94" r="4" fill="#F8FAFC" />

              {/* Front Wheel (Right, x: 300, y: 96, r: 21) */}
              <circle cx="305" cy="97" r="22" fill="#0F172A" stroke="#334155" strokeWidth="3" />
              <circle cx="305" cy="97" r="14" fill="#1E293B" />
              <circle cx="305" cy="97" r="7" fill="#0284C7" />
              <circle cx="305" cy="97" r="3" fill="#F8FAFC" />

              {/* Underfloor Ground Effect & Splitter */}
              <rect x="55" y="102" width="295" height="4" rx="2" fill="#0284C7" fillOpacity="0.8" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Four Metrics Cards Row (Matching Reference) */}
      <section className="metrics-cards-grid" aria-label="Backlog Summary Metrics">
        {/* Metric 1: Total User Stories */}
        <div className="metric-overview-card card-theme-blue">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-card-title">Total User Stories</span>
              <span className="metric-big-number">{totalUserStories}</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>+2 from last sprint</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path
                d="M2 30 Q 25 15, 45 25 T 88 10"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Total Story Points */}
        <div className="metric-overview-card card-theme-purple">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-purple">
              {/* Star Icon as in Backlog Mockup */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-card-title">Total Story Points</span>
              <span className="metric-big-number">{totalStoryPoints}</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>+12 from last sprint</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path
                d="M2 35 Q 25 30, 45 28 T 88 12"
                stroke="#7C3AED"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 3: Epics Cakupan */}
        <div className="metric-overview-card card-theme-green">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.439 7.85c0-1.57.876-2.5 2.122-2.5.5 0 .939.5 1.439 1V2a1 1 0 0 0-1-1H17c-.5 0-.877.5-1.439 1-1.246 1.05-2.122 1-2.122-.5V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9.439c1.57 0 2.5.876 2.5 2.122 0 .5-.5.939-1 1.439H2a1 1 0 0 0-1 1V21a1 1 0 0 0 1 1h9.439c0-1.57.876-2.5 2.122-2.5.5 0 .939.5 1.439 1H21a1 1 0 0 0 1-1v-9.439c-1.57 0-2.5-.876-2.5-2.122 0-.5.5-.939 1-1.439V2a1 1 0 0 0-1-1h-9.439" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-card-title">Epics Cakupan</span>
              <span className="metric-big-number">{totalEpicsCount}</span>
              <span className="metric-trend trend-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>+1 from last sprint</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path
                d="M2 28 Q 30 35, 50 18 T 88 14"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 4: Target Sprint */}
        <div className="metric-overview-card card-theme-orange">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-card-title">Target Sprint</span>
              <span className="metric-big-number">{targetSprint}</span>
              <span className="metric-trend trend-status">
                <span className="status-green-dot" />
                <span>Sprint 1 Active</span>
              </span>
            </div>
          </div>
          <div className="metric-sparkline-wrap">
            <svg className="sparkline-svg" viewBox="0 0 90 40" fill="none">
              <path
                d="M2 32 Q 25 35, 55 25 T 88 12"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* 3. Filter and Action Bar (Matching Reference Mockup) */}
      <section className="backlog-controls-section" aria-label="Filter Backlog Controls">
        <div className="backlog-filter-card">
          <div className="filter-controls-left">
            {/* Sprint Select */}
            <div className="filter-select-group">
              <label htmlFor="sprintFilterSelect" className="filter-select-label">
                Sprint
              </label>
              <select
                id="sprintFilterSelect"
                className="filter-modern-select"
                value={sprintFilter}
                onChange={(e) => setSprintFilter(e.target.value)}
              >
                <option value="All">Semua Sprint</option>
                <option value="1">Sprint 1</option>
                <option value="2">Sprint 2</option>
                <option value="3">Sprint 3</option>
                <option value="4">Sprint 4</option>
              </select>
            </div>

            {/* Prioritas Select */}
            <div className="filter-select-group">
              <label htmlFor="priorityFilterSelect" className="filter-select-label">
                Prioritas
              </label>
              <select
                id="priorityFilterSelect"
                className="filter-modern-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">Semua Prioritas</option>
                <option value="Must">Must Have</option>
                <option value="Should">Should Have</option>
                <option value="Could">Could Have</option>
                <option value="Won't">Won't Have</option>
              </select>
            </div>
          </div>

          <div className="filter-controls-right">
            {/* Item counter */}
            <span className="items-count-display">
              {filteredItems.length} Item Ditemukan
            </span>

            {/* Button Tambah User Story */}
            <button
              type="button"
              className="btn-add-story-primary"
              onClick={handleOpenAddModal}
              title={
                can('create', 'card')
                  ? 'Tambah User Story baru ke Product Backlog'
                  : 'Alumni Reviewer tidak diizinkan membuat User Story'
              }
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Tambah User Story</span>
            </button>

            {/* Button Reset Filter */}
            <button
              type="button"
              className="btn-reset-filter-secondary"
              onClick={handleResetFilters}
              title="Kembalikan filter ke Semua Sprint dan Semua Prioritas"
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

      {/* 4. Epic Accordion Cards Container */}
      <section className="backlog-epics-section" aria-label="Daftar Epic dan User Story">
        {epicGroups.length === 0 ? (
          <div className="empty-backlog-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Tidak ada User Story yang cocok dengan kombinasi filter yang dipilih.</p>
            <button
              type="button"
              className="btn-reset-filter-secondary"
              onClick={handleResetFilters}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          epicGroups.map((group) => (
            <BacklogEpicCard
              key={group.id}
              group={group}
              expandedItemId={expandedItemId}
              onToggleExpand={handleToggleExpand}
              onOpenDetail={handleOpenDetailModal}
              onChangePriority={handleChangePriority}
              isPO={user?.role === 'Admin/PO'}
            />
          ))
        )}
      </section>

      {/* Modal: Tambah User Story */}
      {isAddModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modern-modal-card backlog-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="addStoryModalTitle"
          >
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <div className="modal-header-icon bubble-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <h3 id="addStoryModalTitle" className="modal-main-title">
                  Tambah User Story Baru
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

            <form onSubmit={handleCreateStorySubmit} className="modal-form-content">
              {/* Judul Story */}
              <div className="form-group-field">
                <label htmlFor="storyTitleInput" className="form-field-label">
                  Judul User Story <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="storyTitleInput"
                  className="modal-textarea-input"
                  placeholder="Sebagai [peran], saya ingin [tujuan] agar [manfaat]..."
                  rows={2}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              {/* Epic & Sprint Row */}
              <div className="form-two-cols-row">
                <div className="form-group-field">
                  <label htmlFor="storyEpicSelect" className="form-field-label">
                    Epic Target
                  </label>
                  <select
                    id="storyEpicSelect"
                    className="modal-select-input"
                    value={newEpic}
                    onChange={(e) => setNewEpic(e.target.value)}
                  >
                    {(epics || []).map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        {ep.id} - {ep.title || ep.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="storySprintSelect" className="form-field-label">
                    Sprint Target
                  </label>
                  <select
                    id="storySprintSelect"
                    className="modal-select-input"
                    value={newSprint}
                    onChange={(e) => setNewSprint(e.target.value)}
                  >
                    <option value={1}>Sprint 1 (Aktif)</option>
                    <option value={2}>Sprint 2</option>
                    <option value={3}>Sprint 3</option>
                    <option value={4}>Sprint 4</option>
                  </select>
                </div>
              </div>

              {/* Priority & Points & Division */}
              <div className="form-three-cols-row">
                <div className="form-group-field">
                  <label htmlFor="storyPrioritySelect" className="form-field-label">
                    Prioritas MoSCoW
                  </label>
                  <select
                    id="storyPrioritySelect"
                    className="modal-select-input"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Must">Must Have</option>
                    <option value="Should">Should Have</option>
                    <option value="Could">Could Have</option>
                    <option value="Won't">Won't Have</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="storyPointsSelect" className="form-field-label">
                    Story Points
                  </label>
                  <select
                    id="storyPointsSelect"
                    className="modal-select-input"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                  >
                    <option value={1}>1 Point</option>
                    <option value={2}>2 Points</option>
                    <option value={3}>3 Points</option>
                    <option value={5}>5 Points</option>
                    <option value={8}>8 Points</option>
                    <option value={13}>13 Points</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="storyDivisionSelect" className="form-field-label">
                    Divisi
                  </label>
                  <select
                    id="storyDivisionSelect"
                    className="modal-select-input"
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Tim Product">Tim Product</option>
                  </select>
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div className="form-group-field">
                <label htmlFor="storyAcceptanceInput" className="form-field-label">
                  Acceptance Criteria (1 kriteria per baris)
                </label>
                <textarea
                  id="storyAcceptanceInput"
                  className="modal-textarea-input"
                  placeholder="Kriteria 1&#10;Kriteria 2&#10;Kriteria 3..."
                  rows={3}
                  value={newAcceptanceText}
                  onChange={(e) => setNewAcceptanceText(e.target.value)}
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
                  Simpan User Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail User Story & Acceptance Criteria */}
      {detailModalItem && (
        <div className="modal-backdrop-overlay" onClick={handleCloseDetailModal}>
          <div
            className="modern-modal-card story-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detailStoryModalTitle"
          >
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <span className="story-id-badge font-mono">{detailModalItem.id}</span>
                <span className="table-epic-badge">{detailModalItem.epic}</span>
                <span className="sprint-pill-badge">S-{detailModalItem.sprint}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseDetailModal}
                aria-label="Tutup modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="detail-modal-body">
              <h3 id="detailStoryModalTitle" className="detail-story-title">
                {detailModalItem.title}
              </h3>

              <div className="detail-meta-grid">
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Prioritas:</span>
                  {user?.role === 'Admin/PO' ? (
                    <select
                      className="modal-select-input font-bold"
                      style={{ padding: '2px 8px', fontSize: '0.8rem', height: 'auto', width: 'auto' }}
                      value={detailModalItem.priority}
                      onChange={(e) =>
                        handleChangePriority(detailModalItem.id, e.target.value)
                      }
                      title="Ubah prioritas (Khusus Product Owner - PBI-005)"
                    >
                      <option value="Must">Must</option>
                      <option value="Should">Should</option>
                      <option value="Could">Could</option>
                      <option value="Won't">Won't</option>
                    </select>
                  ) : (
                    <span
                      className={`prio-pill prio-${detailModalItem.priority?.toLowerCase()}`}
                      onClick={() => handleChangePriority(detailModalItem.id, null)}
                      title="Hanya Product Owner yang berhak mengubah prioritas"
                      style={{ cursor: 'pointer' }}
                    >
                      {detailModalItem.priority}
                    </span>
                  )}
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Story Points:</span>
                  <span className="detail-meta-val font-mono font-bold">
                    {detailModalItem.points} PT
                  </span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Pemegang:</span>
                  <span className="detail-meta-val font-bold text-primary">
                    {detailModalItem.owner || 'Tim SenaFlow'}
                  </span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Divisi:</span>
                  <span className="detail-meta-val">{detailModalItem.division || 'Tim Product'}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Status:</span>
                  <span className="detail-meta-val font-bold">{detailModalItem.status}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Sprint:</span>
                  <span className="detail-meta-val font-mono font-bold">Sprint {detailModalItem.sprint}</span>
                </div>
              </div>

              {/* Acceptance Criteria (PBI-006 & PBI-001 s.d PBI-005) */}
              <div className="detail-criteria-section">
                <h4 className="detail-criteria-title font-mono">
                  ACCEPTANCE CRITERIA
                </h4>
                {detailModalItem.acceptance && detailModalItem.acceptance.length > 0 ? (
                  <ul className="criteria-check-list">
                    {detailModalItem.acceptance.map((crit, idx) => (
                      <li key={idx} className="criteria-check-item">
                        <span className="criteria-num-badge font-mono font-bold" style={{ minWidth: '18px' }}>
                          {idx + 1}.
                        </span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="criteria-empty-text">Tidak ada kriteria tertulis.</p>
                )}
              </div>

              {/* Dependencies */}
              {detailModalItem.dependsOn && detailModalItem.dependsOn.length > 0 && (
                <div className="criteria-dependency-box">
                  <span className="font-bold">DEPENDS ON:</span>{' '}
                  <span className="deps-list font-mono">
                    {detailModalItem.dependsOn.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="modal-submit-btn"
                onClick={handleCloseDetailModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
