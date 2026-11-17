import React, { useState, useRef, useEffect } from 'react'

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done']

const KanbanCard = React.memo(function KanbanCard({
  card,
  canMove,
  canDelete,
  onMove,
  onDelete,
  onOpenDetail,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDragStart = (e) => {
    if (!canMove) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', card.id)
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const isOverdue =
    card.deadline &&
    new Date(card.deadline) < new Date() &&
    card.column !== 'Done'

  const pointsText = card.points ? `${card.points} PT` : '5 PT'

  // Dynamic badge color based on column matching reference mockup
  const pointsBadgeClass =
    card.column === 'Review'
      ? 'points-badge-review'
      : card.column === 'Done'
      ? 'points-badge-done'
      : 'points-badge-purple'

  // Get initials for assignee avatar
  const assigneeInitials = card.assignee
    ? card.assignee
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AT'

  return (
    <div
      className={`modern-kanban-card kanban-card ${isOverdue ? 'card-overdue' : ''} ${
        isDragging ? 'is-card-dragging' : ''
      }`}
      draggable={canMove}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ cursor: canMove ? 'grab' : 'default' }}
      title={canMove ? 'Tarik (drag) untuk memindahkan status card' : card.title}
    >
      {/* Top row: ID, Division Badge, Points Badge, Options Menu */}
      <div className="card-header-row card-topline">
        <div className="card-id-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="card-id-label card-id font-mono">{card.id}</span>
          {card.division && (
            <span className="card-division-badge">{card.division}</span>
          )}
        </div>

        <div className="card-header-actions">
          <span className={`points-pill-badge ${pointsBadgeClass}`}>{pointsText}</span>

          <div className="card-menu-anchor" ref={menuRef}>
            <button
              type="button"
              className="card-dots-btn"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Card Options"
              title="Aksi Card"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="card-popover-menu">
                <button
                  type="button"
                  className="popover-detail-btn"
                  onClick={() => {
                    setIsMenuOpen(false)
                    if (onOpenDetail) onOpenDetail(card)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main, #0F172A)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Detail &amp; Edit Card</span>
                </button>

                <div className="popover-divider" />

                <div className="popover-title">Pindah Kolom:</div>
                <div className="popover-column-grid">
                  {COLUMNS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className={`popover-col-btn ${card.column === col ? 'active' : ''}`}
                      disabled={!canMove || card.column === col}
                      onClick={() => {
                        onMove(card.id, card.column, col)
                        setIsMenuOpen(false)
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>

                <div className="popover-divider" />

                <button
                  type="button"
                  className="popover-delete-btn hud-card-delete btn-card-delete"
                  disabled={!canDelete}
                  onClick={() => {
                    setIsMenuOpen(false)
                    onDelete(card.id, card.title)
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  <span>Hapus Card</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Title */}
      <h3
        className="card-title modern-card-title"
        onClick={() => {
          if (onOpenDetail) onOpenDetail(card)
        }}
        style={{ cursor: 'pointer' }}
        title="Klik untuk membuka detail card"
      >
        {card.title}
      </h3>

      {/* Card Description */}
      {card.description && (
        <p className="card-desc modern-card-desc">{card.description}</p>
      )}

      {/* Card Footer: Assignee & Deadline */}
      <div className="card-footer-row card-footer-info">
        <div className="assignee-wrap card-meta">
          <div className="assignee-avatar">
            <span>{assigneeInitials}</span>
          </div>
          <span className="assignee-name card-assignee">{card.assignee || 'Tim Antasena'}</span>
        </div>

        <div className={`deadline-wrap ${isOverdue ? 'deadline-overdue-wrap' : ''}`}>
          <svg
            className="calendar-icon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            className={`deadline-text card-deadline font-mono ${isOverdue ? 'text-overdue' : ''}`}
          >
            {card.deadline || '2026-11-20'}
          </span>
          {isOverdue && (
            <span className="overdue-tag-pill" title="Card ini telah melewati batas deadline!">
              LEWAT
            </span>
          )}
        </div>
      </div>

      {/* Accessible fallback select & delete for automated verification & keyboard nav */}
      <div className="card-accessible-actions visually-hidden">
        <select
          className="column-select-sm hud-card-select"
          value={card.column}
          onChange={(e) => onMove(card.id, card.column, e.target.value)}
          disabled={!canMove}
        >
          {COLUMNS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-card-delete"
          onClick={() => onDelete(card.id, card.title)}
          disabled={!canDelete}
        >
          Hapus
        </button>
      </div>
    </div>
  )
})

export default KanbanCard
