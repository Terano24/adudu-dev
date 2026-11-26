import React, { useState } from 'react'
import KanbanCard from './KanbanCard.jsx'

const COLUMN_THEMES = {
  'To Do': {
    slug: 'todo',
    dotColor: '#94A3B8',
  },
  'In Progress': {
    slug: 'inprogress',
    dotColor: '#3B82F6',
  },
  'Review': {
    slug: 'review',
    dotColor: '#F59E0B',
  },
  'Done': {
    slug: 'done',
    dotColor: '#10B981',
  },
}

const KanbanColumn = React.memo(function KanbanColumn({
  colName,
  colCards,
  totalPoints,
  canMove,
  canDelete,
  onMove,
  onDelete,
  onOpenDetail,
  cardMeta,
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const theme = COLUMN_THEMES[colName] || { slug: 'todo', dotColor: '#94A3B8' }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = canMove ? 'move' : 'none'
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const cardId = e.dataTransfer.getData('text/plain')
    if (cardId) {
      onMove(cardId, null, colName)
    }
  }

  return (
    <div
      className={`modern-kanban-column kanban-column col-theme-${theme.slug} ${
        isDragOver ? 'column-drag-over' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="modern-column-header">
        <div className="column-title-left">
          <span
            className="column-dot-indicator"
            style={{ backgroundColor: theme.dotColor }}
            aria-hidden="true"
          />
          <h2 className="column-title-text">{colName}</h2>
        </div>

        <div className="column-count-badge">
          <span>{colCards.length}</span>
        </div>
      </div>

      {/* Column Cards List */}
      <div className="modern-column-body column-cards-list">
        {colCards.length === 0 ? (
          <div className="empty-column-placeholder">
            <span>Belum ada card di tahap ini</span>
          </div>
        ) : (
          colCards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              canMove={canMove}
              canDelete={canDelete}
              onMove={onMove}
              onDelete={onDelete}
              onOpenDetail={onOpenDetail}
              meta={cardMeta ? cardMeta[card.id] : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
})

export default KanbanColumn
