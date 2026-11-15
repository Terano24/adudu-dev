import React from 'react'
import StatusBadge from '../common/StatusBadge.jsx'

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done']

const PRIORITY_BORDER_CLASSES = {
  Must: 'card-priority-must',
  Should: 'card-priority-should',
  Could: 'card-priority-could',
  "Won't": 'card-priority-wont',
}

const KanbanCard = React.memo(function KanbanCard({
  card,
  canMove,
  canDelete,
  onMove,
  onDelete,
}) {
  const isOverdue =
    card.deadline &&
    new Date(card.deadline) < new Date() &&
    card.column !== 'Done'

  const borderClass = PRIORITY_BORDER_CLASSES[card.priority] || 'card-priority-wont'

  return (
    <div
      className={`kanban-card gt-task-card ${borderClass} ${isOverdue ? 'card-overdue' : ''}`}
    >
      <div className="card-topline">
        <span className="card-id font-mono">{card.id}</span>
        <StatusBadge label={card.priority} points={card.points} />
      </div>

      <h3 className="card-title">{card.title}</h3>
      {card.description && <p className="card-desc">{card.description}</p>}

      <div className="card-meta">
        <StatusBadge label={card.division} />
        <span className="card-assignee">{card.assignee}</span>
      </div>

      <div className="card-footer-info">
        <span
          className={`card-deadline font-mono ${isOverdue ? 'text-overdue' : ''}`}
          title={isOverdue ? 'Tugas melewati tenggat waktu!' : 'Tenggat waktu'}
        >
          {card.deadline ? `Tenggat: ${card.deadline}` : 'Tanpa tenggat'}
          {isOverdue && ' (LEWAT)'}
        </span>

        <div className="card-actions-row">
          {/* Pindah Kolom Selector */}
          <select
            className="column-select-sm hud-card-select"
            value={card.column}
            onChange={(e) => onMove(card.id, card.column, e.target.value)}
            disabled={!canMove}
            title={
              canMove
                ? 'Pindahkan ke kolom lain'
                : 'Alumni Reviewer tidak dapat memindahkan card'
            }
          >
            {COLUMNS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Tombol Hapus */}
          <button
            type="button"
            className="btn-card-delete hud-card-delete"
            onClick={() => onDelete(card.id, card.title)}
            title={
              canDelete
                ? 'Hapus card pekerjaan'
                : 'Alumni Reviewer tidak dapat menghapus card'
            }
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
})

export default KanbanCard
