import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AccessDenied from '../components/common/AccessDenied.jsx'
import KanbanColumn from '../components/board/KanbanColumn.jsx'
import CardCollabPanel from '../features/collaboration/CardCollabPanel.jsx'
import { getDodStatus, getBlockers, getAverageRating, getApprovalState } from '../utils/index.js'

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done']
// Card baru tidak boleh langsung dibuat di Done (PBI-009/011).
const CREATE_COLUMNS = COLUMNS.filter((col) => col !== 'Done')

export default function BoardPage() {
  const {
    boardCards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    decideApproval,
    resetToSeed,
    dodTemplate,
  } = useData()
  const { can, user } = useAuth()

  // Modal / Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [detailCard, setDetailCard] = useState(null)
  const [isEditingCard, setIsEditingCard] = useState(false)
  const [editCardForm, setEditCardForm] = useState({})
  const [deniedActionMessage, setDeniedActionMessage] = useState(null)
  const [divisionFilter, setDivisionFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [selectedSprintOverview, setSelectedSprintOverview] = useState('Sprint 1')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // Notifikasi singkat (dipakai saat gatekeeper Done menolak perpindahan - PBI-011)
  const showToast = useCallback((next) => {
    setToast(next)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 9000)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Form input state
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColumn, setNewColumn] = useState('To Do')
  const [newDivision, setNewDivision] = useState('Programming')
  const [newAssignee, setNewAssignee] = useState('')
  const [newPoints, setNewPoints] = useState(5)
  const [newPriority, setNewPriority] = useState('Must')
  const [newDeadline, setNewDeadline] = useState('')

  // Handle Klik Tambah Card
  const handleOpenAddModal = () => {
    if (!can('create', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Membuat Card',
        message:
          'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer hanya memiliki hak baca, komentar, dan review teknis. Anda tidak diizinkan membuat card pekerjaan baru.',
        requiredPermission: 'create:card',
      })
      return
    }
    setIsAddModalOpen(true)
  }

  // Handle Submit Form Card
  const handleCreateCardSubmit = (e) => {
    e.preventDefault()
    const result = addCard({
      title: newTitle,
      description: newDesc,
      column: newColumn,
      division: newDivision,
      assignee: newAssignee || user?.name || 'Anggota Tim',
      points: Number(newPoints),
      priority: newPriority,
      deadline: newDeadline || new Date().toISOString().split('T')[0],
    })

    if (!result.success) {
      setDeniedActionMessage({
        title: 'Gagal Menambahkan Card',
        message: result.error,
        requiredPermission: 'create:card',
      })
      setIsAddModalOpen(false)
      return
    }

    // Reset Form
    setNewTitle('')
    setNewDesc('')
    setIsAddModalOpen(false)
  }

  // Handle Hapus Card
  const handleDeleteCard = useCallback(
    (cardId, cardTitle) => {
      if (!can('delete', 'card')) {
        setDeniedActionMessage({
          title: 'Izin Ditolak: Tidak Dapat Menghapus Card',
          message: `Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer dilarang menghapus card ("${cardTitle}").`,
          requiredPermission: 'delete:card',
        })
        return
      }

      if (window.confirm(`Hapus card "${cardTitle}"?`)) {
        deleteCard(cardId)
      }
    },
    [can, deleteCard]
  )

  // Handle Pindah Kolom
  const handleMoveColumn = useCallback(
    (cardId, currentColumn, nextColumn) => {
      if (!can('move', 'card')) {
        setDeniedActionMessage({
          title: 'Izin Ditolak: Tidak Dapat Memindahkan Card',
          message: 'Peran Alumni Reviewer tidak diizinkan memindahkan kolom status card.',
          requiredPermission: 'move:card',
        })
        return
      }
      const result = moveCard(cardId, nextColumn)
      if (!result.success) {
        showToast({
          title: `${cardId} belum bisa dipindah ke ${nextColumn}`,
          reasons: result.reasons || [result.error],
          cardId,
        })
      }
    },
    [can, moveCard, showToast]
  )

  // Keputusan persetujuan langsung dari card di kolom Review (PBI-009)
  const handleApprovalDecision = useCallback(
    (cardId, decision, reason) => decideApproval(cardId, decision, reason),
    [decideApproval]
  )

  // Handle Buka Modal Detail Card (PBI-004)
  const handleOpenDetailCard = useCallback((card, initialTab) => {
    setDetailCard(initialTab ? { ...card, initialTab } : card)
    setEditCardForm({
      title: card.title || '',
      description: card.description || '',
      column: card.column || 'To Do',
      division: card.division || 'Programming',
      assignee: card.assignee || 'Tim SenaFlow',
      points: card.points || 5,
      priority: card.priority || 'Must',
      deadline: card.deadline || '',
    })
    setIsEditingCard(false)
  }, [])

  const handleCloseDetailCard = useCallback(() => {
    setDetailCard(null)
    setIsEditingCard(false)
  }, [])

  // Handle Simpan Perubahan Card (PBI-002: Card dapat diubah)
  const handleSaveCardEdit = (e) => {
    e.preventDefault()
    if (!can('edit', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Mengubah Card',
        message:
          'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer hanya memiliki akses lihat dan tidak diizinkan mengubah card.',
        requiredPermission: 'edit:card',
      })
      return
    }

    if (detailCard && updateCard) {
      const result = updateCard(detailCard.id, {
        title: editCardForm.title,
        description: editCardForm.description,
        column: editCardForm.column,
        division: editCardForm.division,
        assignee: editCardForm.assignee,
        points: Number(editCardForm.points),
        priority: editCardForm.priority,
        deadline: editCardForm.deadline,
      })

      if (result.success) {
        setDetailCard((prev) => ({
          ...prev,
          ...editCardForm,
          points: Number(editCardForm.points),
        }))
        setIsEditingCard(false)
      } else if (result.gate) {
        showToast({
          title: `${detailCard.id} belum bisa dipindah ke Done`,
          reasons: result.reasons,
          cardId: detailCard.id,
        })
      } else {
        setDeniedActionMessage({
          title: 'Gagal Mengubah Card',
          message: result.error,
          requiredPermission: 'edit:card',
        })
      }
    }
  }

  // Filter Cards (PBI-004: Filter card berdasarkan divisi dan assignee berfungsi)
  const filteredCards = useMemo(() => {
    return boardCards.filter((card) => {
      if (divisionFilter !== 'All' && card.division !== divisionFilter) return false
      if (assigneeFilter !== 'All' && card.assignee !== assigneeFilter) return false
      return true
    })
  }, [boardCards, divisionFilter, assigneeFilter])

  // Unique divisions for filter
  const divisions = useMemo(() => {
    return ['All', ...new Set(boardCards.map((c) => c.division).filter(Boolean))]
  }, [boardCards])

  // Unique assignees for filter
  const assignees = useMemo(() => {
    return ['All', ...new Set(boardCards.map((c) => c.assignee).filter(Boolean))]
  }, [boardCards])

  // Pre-calculated Column Data
  const columnData = useMemo(() => {
    return COLUMNS.map((colName) => {
      const colCards = filteredCards.filter((c) => c.column === colName)
      const totalPoints = colCards.reduce((acc, c) => acc + (Number(c.points) || 0), 0)
      return {
        colName,
        colCards,
        totalPoints,
      }
    })
  }, [filteredCards])

  // Summary Metrics calculations
  const totalUserStories = 22 // As defined in Backlog & Reference Image
  const totalStoryPoints = 122 // As defined in Backlog & Reference Image
  const totalEpics = 5
  const totalTargetSprint = 4

  // Indikator Sprint 2 untuk muka card (DoD, terblokir, komentar, rating, persetujuan)
  const cardMeta = useMemo(() => {
    const meta = {}
    boardCards.forEach((card) => {
      const dod = getDodStatus(card, dodTemplate)
      meta[card.id] = {
        dodDone: dod.done,
        dodTotal: dod.total,
        blockers: getBlockers(card, boardCards).map((b) => b.id),
        comments: (card.comments || []).length,
        avgRating: getAverageRating(card),
        approval: getApprovalState(card),
      }
    })
    return meta
  }, [boardCards, dodTemplate])

  const liveDetail = detailCard
    ? boardCards.find((c) => c.id === detailCard.id) || detailCard
    : null

  const canMove = can('move', 'card')
  const canDelete = can('delete', 'card')

  return (
    <div className="board-page-wrapper">
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

      {/* 1. Hero Blue Banner (Keep Building Better) */}
      <section className="dashboard-hero-banner" aria-label="Welcome Banner">
        <div className="hero-banner-content">
          <div className="hero-badge-pill">Welcome back,</div>
          <h1 className="hero-main-title">Keep Building Better</h1>
          <p className="hero-subtitle">
            Track your progress, manage your sprint, and achieve more together.
          </p>
        </div>

        <div className="hero-banner-visual">
          <div className="hero-illustration-wrap">
            {/* Rocket & Space launch graphic */}
            <svg
              className="rocket-illustration-svg"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rocket body and scaffolding silhouette */}
              <defs>
                <linearGradient id="rocketGrad" x1="100" y1="20" x2="100" y2="140" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="0.6" stopColor="#E2E8F0" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#94A3B8" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="glowPlume" x1="100" y1="110" x2="100" y2="155" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" stopOpacity="0.8" />
                  <stop offset="0.5" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Tower Scaffolding */}
              <path d="M72 50L68 140H80L82 50H72Z" fill="#CBD5E1" fillOpacity="0.35" />
              <path d="M128 50L132 140H120L118 50H128Z" fill="#CBD5E1" fillOpacity="0.35" />
              <line x1="72" y1="70" x2="128" y2="70" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="70" y1="95" x2="130" y2="95" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="68" y1="120" x2="132" y2="120" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Rocket Main Fuselage */}
              <path
                d="M100 15C95 35 91 60 91 105C91 112 109 112 109 105C109 60 105 35 100 15Z"
                fill="url(#rocketGrad)"
              />
              {/* Nose cone tip */}
              <path d="M100 12L98 25H102L100 12Z" fill="#FFFFFF" />
              {/* Left Booster */}
              <path d="M84 75C81 85 81 105 81 114H90V75H84Z" fill="#E2E8F0" fillOpacity="0.75" />
              {/* Right Booster */}
              <path d="M116 75C119 85 119 105 119 114H110V75H116Z" fill="#E2E8F0" fillOpacity="0.75" />
              {/* Wings */}
              <path d="M77 105L81 114H75L77 105Z" fill="#94A3B8" />
              <path d="M123 105L119 114H125L123 105Z" fill="#94A3B8" />
              {/* Exhaust plume glow */}
              <polygon points="94,115 106,115 100,152" fill="url(#glowPlume)" />
              {/* Stars & dust */}
              <circle cx="45" cy="40" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="155" cy="35" r="1.5" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="35" cy="85" r="1" fill="#FFFFFF" fillOpacity="0.5" />
              <circle cx="165" cy="75" r="1.5" fill="#FFFFFF" fillOpacity="0.6" />
              <circle cx="50" cy="120" r="1" fill="#FFFFFF" fillOpacity="0.4" />
              <circle cx="150" cy="115" r="1" fill="#FFFFFF" fillOpacity="0.5" />
            </svg>
          </div>

          <a
            href="/backlog"
            className="hero-doc-btn"
            title="Buka dokumentasi Product Backlog"
          >
            <span>View Documentation</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </section>

      {/* 2. Four Metrics Cards Row */}
      <section className="metrics-cards-grid" aria-label="Sprint Summary Metrics">
        {/* Metric 1: Total User Stories */}
        <div className="metric-overview-card card-theme-blue">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="8" height="8" x="3" y="3" rx="1.5" />
                <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                <rect width="8" height="8" x="13" y="13" rx="1.5" />
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
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

        {/* Metric 3: Epic Cakupan */}
        <div className="metric-overview-card card-theme-green">
          <div className="metric-left-content">
            <div className="metric-icon-bubble bubble-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.439 7.85c0-1.57.876-2.5 2.122-2.5.5 0 .939.5 1.439 1V2a1 1 0 0 0-1-1H17c-.5 0-.877.5-1.439 1-1.246 1.05-2.122 1-2.122-.5V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9.439c1.57 0 2.5.876 2.5 2.122 0 .5-.5.939-1 1.439H2a1 1 0 0 0-1 1V21a1 1 0 0 0 1 1h9.439c0-1.57.876-2.5 2.122-2.5.5 0 .939.5 1.439 1H21a1 1 0 0 0 1-1v-9.439c-1.57 0-2.5-.876-2.5-2.122 0-.5.5-.939 1-1.439V2a1 1 0 0 0-1-1h-9.439" />
              </svg>
            </div>
            <div className="metric-info-text">
              <span className="metric-card-title">Epic Cakupan</span>
              <span className="metric-big-number">{totalEpics}</span>
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
              <span className="metric-big-number">{totalTargetSprint}</span>
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

      {/* 3. Papan Kanban Section */}
      <section className="dashboard-kanban-section" aria-label="Papan Kanban Sprint 1">
        <div className="kanban-section-container">
          {/* Header Bar */}
          <div className="kanban-section-header">
            <div className="kanban-title-wrap">
              <div className="kanban-header-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="6" height="18" x="3" y="3" rx="1.5" />
                  <rect width="6" height="14" x="11" y="3" rx="1.5" />
                  <rect width="6" height="10" x="19" y="3" rx="1.5" />
                </svg>
              </div>
              <div className="kanban-title-text">
                <h2 className="kanban-main-heading">Papan Kanban Sprint 1</h2>
                <span className="kanban-sub-heading">Alur eksekusi komponen</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="kanban-controls-wrap">
              {/* Filter Divisi (PBI-004) */}
              <div className="division-select-box">
                <label htmlFor="boardDivSelect" className="div-select-label">
                  Divisi:
                </label>
                <select
                  id="boardDivSelect"
                  className="modern-select-input"
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                >
                  {divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Assignee (PBI-004) */}
              <div className="division-select-box">
                <label htmlFor="boardAssigneeSelect" className="div-select-label">
                  Assignee:
                </label>
                <select
                  id="boardAssigneeSelect"
                  className="modern-select-input"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  {assignees.map((a) => (
                    <option key={a} value={a}>
                      {a === 'All' ? 'Semua Assignee' : a}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-add-card-primary hud-add-btn"
                onClick={handleOpenAddModal}
                title={
                  can('create', 'card')
                    ? 'Buat card tugas baru'
                    : 'Alumni Reviewer dilarang membuat card'
                }
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tambah Card</span>
              </button>

              <button
                type="button"
                className="btn-reset-seed-secondary hud-reset-btn"
                onClick={resetToSeed}
                title="Kembalikan data card ke bawaan awal"
              >
                <span>Reset Seed</span>
              </button>
            </div>
          </div>

          {/* Kanban 4 Columns Grid (Always 4 in a row, side-by-side) */}
          <div className="kanban-board-scroll-wrap">
            <div className="modern-kanban-grid kanban-grid">
              {columnData.map(({ colName, colCards, totalPoints }) => (
                <KanbanColumn
                  key={colName}
                  colName={colName}
                  colCards={colCards}
                  totalPoints={totalPoints}
                  canMove={canMove}
                  canDelete={canDelete}
                  onMove={handleMoveColumn}
                  onDelete={handleDeleteCard}
                  onOpenDetail={handleOpenDetailCard}
                  cardMeta={cardMeta}
                  canApprove={can('approve', 'card')}
                  onApprovalDecision={handleApprovalDecision}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Section: Recent Activity & Sprint Overview */}
      <section className="dashboard-bottom-grid" aria-label="Aktivitas dan Ringkasan Sprint">
        {/* Left: Recent Activity */}
        <div className="dashboard-subcard recent-activity-card">
          <div className="subcard-header">
            <div className="subcard-title-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <h3 className="subcard-title">Recent Activity</h3>
            </div>
            <a href="/backlog" className="subcard-link">
              <span>Lihat Semua</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <div className="activity-content">
                <h4 className="activity-title">Card baru ditambahkan</h4>
                <p className="activity-desc">
                  Kerangka Aplikasi &amp; Navigasi Responsif oleh Tim Frontend
                </p>
              </div>
              <span className="activity-time">2 jam lalu</span>
            </div>

            <div className="activity-item">
              <div className="activity-avatar-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div className="activity-content">
                <h4 className="activity-title">Review selesai</h4>
                <p className="activity-desc">
                  Autentikasi 3 Peran &amp; Kontrol Akses (RBAC) oleh Ir. Ahmad Reza
                </p>
              </div>
              <span className="activity-time">5 jam lalu</span>
            </div>

            <div className="activity-item">
              <div className="activity-avatar-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <h4 className="activity-title">Komentar teknis baru</h4>
                <p className="activity-desc">
                  "Pastikan pengujian telemetri Lusail siap sebelum tes sasis."
                </p>
              </div>
              <span className="activity-time">1 hari lalu</span>
            </div>
          </div>
        </div>

        {/* Right: Sprint Overview */}
        <div className="dashboard-subcard sprint-overview-card">
          <div className="subcard-header">
            <div className="subcard-title-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <h3 className="subcard-title">Sprint Overview</h3>
            </div>

            <div className="sprint-dropdown-wrap">
              <select
                className="modern-select-input-sm"
                value={selectedSprintOverview}
                onChange={(e) => setSelectedSprintOverview(e.target.value)}
              >
                <option value="Sprint 1">Sprint 1</option>
                <option value="Sprint 2">Sprint 2</option>
                <option value="Sprint 3">Sprint 3</option>
                <option value="Sprint 4">Sprint 4</option>
              </select>
            </div>
          </div>

          <div className="sprint-chart-container">
            {/* Smooth SVG Spline Area Chart */}
            <svg
              className="sprint-overview-chart"
              viewBox="0 0 500 160"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />

              {/* Area fill */}
              <path
                d="M 0 140 C 70 145, 120 110, 180 120 C 240 130, 280 85, 350 95 C 420 105, 450 70, 500 65 L 500 160 L 0 160 Z"
                fill="url(#chartAreaGradient)"
              />

              {/* Spline curve line */}
              <path
                d="M 0 140 C 70 145, 120 110, 180 120 C 240 130, 280 85, 350 95 C 420 105, 450 70, 500 65"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Chart data points */}
              <circle cx="180" cy="120" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="350" cy="95" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="500" cy="65" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            {/* Floating Point Tag: 122 SP */}
            <div className="chart-highlight-badge">
              <span>122 SP</span>
            </div>

            {/* Bottom X-Axis Days */}
            <div className="chart-x-labels">
              <span>Day 1</span>
              <span>Day 4</span>
              <span>Day 8</span>
              <span>Day 11</span>
              <span>Day 14</span>
            </div>
          </div>
        </div>
      </section>

      {/* Toast gatekeeper Done (PBI-011 / PBI-009) */}
      {toast && (
        <div className="board-toast" role="alert" aria-live="assertive">
          <div className="board-toast-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="board-toast-body">
            <p className="board-toast-title">{toast.title}</p>
            <ul className="board-toast-reasons">
              {toast.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            {toast.cardId && boardCards.some((c) => c.id === toast.cardId) && (
              <button
                type="button"
                className="board-toast-action"
                onClick={() => {
                  const target = boardCards.find((c) => c.id === toast.cardId)
                  setToast(null)
                  handleOpenDetailCard(target, 'dod')
                }}
              >
                Buka checklist card
              </button>
            )}
          </div>
          <button type="button" className="board-toast-close" onClick={() => setToast(null)} aria-label="Tutup notifikasi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Modal Dialog Tambah Card Baru */}
      {isAddModalOpen && (
        <div className="modern-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modern-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3 className="modal-title">Tambah Card Pekerjaan Baru</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateCardSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Judul Card:</label>
                <input
                  type="text"
                  required
                  className="modern-input"
                  placeholder="Misal: Desain Suspensi Double Wishbone..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi / Acceptance Criteria:</label>
                <textarea
                  rows={3}
                  className="modern-input"
                  placeholder="Uraikan detail pekerjaan dan kriteria selesai..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Kolom Awal:</label>
                  <select
                    className="modern-input"
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                  >
                    {CREATE_COLUMNS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <span className="form-hint">
                    Card baru tidak dapat langsung dibuat di Done.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Divisi:</label>
                  <select
                    className="modern-input"
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Fuel Cell">Fuel Cell</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Poin Fibonacci:</label>
                  <select
                    className="modern-input"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                  >
                    {[1, 2, 3, 5, 8, 13, 21].map((p) => (
                      <option key={p} value={p}>
                        {p} PT
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prioritas:</label>
                  <select
                    className="modern-input"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Must">Must</option>
                    <option value="Should">Should</option>
                    <option value="Could">Could</option>
                    <option value="Won't">Won't</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tenggat Waktu:</label>
                  <input
                    type="date"
                    className="modern-input"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Penanggung Jawab (Assignee):</label>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="Misal: Tim Mechanical / Budi Santoso"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit-primary">
                  Simpan Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Detail & Edit Card (PBI-004, PBI-002, PBI-003) */}
      {detailCard && (
        <div className="modern-modal-backdrop" onClick={handleCloseDetailCard}>
          <div
            className="modern-modal-card card-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detailCardTitle"
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="card-id-label font-mono font-bold" style={{ fontSize: '1rem' }}>
                  {detailCard.id}
                </span>
                <span className="card-division-badge">{detailCard.division}</span>
                <span className={`points-pill-badge points-badge-${detailCard.column === 'Done' ? 'done' : detailCard.column === 'Review' ? 'review' : 'purple'}`}>
                  {detailCard.points || 5} PT
                </span>
                <span className="sprint-pill-badge">{detailCard.column}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseDetailCard}
                aria-label="Tutup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Overdue Warning Alert */}
            {detailCard.deadline &&
              new Date(detailCard.deadline) < new Date() &&
              detailCard.column !== 'Done' && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    margin: '12px 0',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Perhatian: Card ini telah melewati batas tenggat waktu ({detailCard.deadline})!</span>
                </div>
              )}

            {isEditingCard ? (
              /* Edit Form */
              <form onSubmit={handleSaveCardEdit} className="modal-form" style={{ marginTop: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Judul Card:</label>
                  <input
                    type="text"
                    required
                    className="modern-input"
                    value={editCardForm.title}
                    onChange={(e) =>
                      setEditCardForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi / Acceptance Criteria:</label>
                  <textarea
                    rows={3}
                    className="modern-input"
                    value={editCardForm.description}
                    onChange={(e) =>
                      setEditCardForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Kolom / Status:</label>
                    <select
                      className="modern-input"
                      value={editCardForm.column}
                      onChange={(e) =>
                        setEditCardForm((prev) => ({ ...prev, column: e.target.value }))
                      }
                    >
                      {COLUMNS.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Divisi:</label>
                    <select
                      className="modern-input"
                      value={editCardForm.division}
                      onChange={(e) =>
                        setEditCardForm((prev) => ({ ...prev, division: e.target.value }))
                      }
                    >
                      <option value="Programming">Programming</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Fuel Cell">Fuel Cell</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Story Points:</label>
                    <select
                      className="modern-input"
                      value={editCardForm.points}
                      onChange={(e) =>
                        setEditCardForm((prev) => ({ ...prev, points: Number(e.target.value) }))
                      }
                    >
                      {[1, 2, 3, 5, 8, 13, 21].map((p) => (
                        <option key={p} value={p}>
                          {p} PT
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prioritas:</label>
                    <select
                      className="modern-input"
                      value={editCardForm.priority}
                      onChange={(e) =>
                        setEditCardForm((prev) => ({ ...prev, priority: e.target.value }))
                      }
                    >
                      <option value="Must">Must</option>
                      <option value="Should">Should</option>
                      <option value="Could">Could</option>
                      <option value="Won't">Won't</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tenggat Waktu:</label>
                    <input
                      type="date"
                      className="modern-input"
                      value={editCardForm.deadline}
                      onChange={(e) =>
                        setEditCardForm((prev) => ({ ...prev, deadline: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Penanggung Jawab (Assignee):</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={editCardForm.assignee}
                    onChange={(e) =>
                      setEditCardForm((prev) => ({ ...prev, assignee: e.target.value }))
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditingCard(false)}
                  >
                    Batal Edit
                  </button>
                  <button type="submit" className="btn-submit-primary">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              /* View Detail Mode */
              <div className="detail-view-container" style={{ marginTop: '12px' }}>
                <h3 id="detailCardTitle" style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px' }}>
                  {detailCard.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {detailCard.description || 'Tidak ada deskripsi detail tambahan.'}
                </p>

                <div className="detail-meta-grid" style={{ marginBottom: '16px' }}>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Divisi:</span>
                    <span className="detail-meta-val font-bold">{detailCard.division}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Assignee:</span>
                    <span className="detail-meta-val font-bold text-primary">{detailCard.assignee}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Deadline:</span>
                    <span
                      className={`detail-meta-val font-mono font-bold ${detailCard.deadline &&
                          new Date(detailCard.deadline) < new Date() &&
                          detailCard.column !== 'Done'
                          ? 'text-overdue'
                          : ''
                        }`}
                    >
                      {detailCard.deadline || 'Tidak ditentukan'}
                    </span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Status Kolom:</span>
                    <span className="detail-meta-val font-bold">{detailCard.column}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Prioritas:</span>
                    <span className={`prio-pill prio-${detailCard.priority?.toLowerCase()}`}>
                      {detailCard.priority || 'Must'}
                    </span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Story Points:</span>
                    <span className="detail-meta-val font-mono font-bold">{detailCard.points || 5} PT</span>
                  </div>
                </div>

                {/* Sprint 2: DoD, Review & Persetujuan, Komentar, Dependensi */}
                <CardCollabPanel key={detailCard.id} cardId={detailCard.id} initialTab={detailCard.initialTab} />

                {/* Status Movement History (PBI-003 Criteria #2: Status baru tersimpan dan tercatat waktunya) */}
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Riwayat Perpindahan Status
                  </h4>
                  {liveDetail.history && liveDetail.history.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {liveDetail.history.map((h, i) => (
                        <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#2563EB', fontWeight: 'bold' }}>•</span>
                          <span>
                            Dari <strong>{h.from}</strong> ke <strong>{h.to}</strong>
                          </span>
                          <span className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>
                            ({new Date(h.movedAt).toLocaleString('id-ID')}{h.by ? ` · ${h.by}` : ''})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Belum ada perpindahan status yang tercatat sejak card dibuat.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="modal-actions" style={{ marginTop: '20px' }}>
                  {can('edit', 'card') && (
                    <button
                      type="button"
                      className="btn-submit-primary"
                      onClick={() => setIsEditingCard(true)}
                    >
                      Ubah Data Card
                    </button>
                  )}
                  {can('delete', 'card') && (
                    <button
                      type="button"
                      className="btn-card-delete"
                      onClick={() => {
                        handleCloseDetailCard()
                        handleDeleteCard(detailCard.id, detailCard.title)
                      }}
                      style={{ padding: '8px 14px', borderRadius: '8px' }}
                    >
                      Hapus Card
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseDetailCard}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
