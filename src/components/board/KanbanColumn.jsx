import React from 'react'
import KanbanCard from './KanbanCard.jsx'

const KanbanColumn = React.memo(function KanbanColumn({
  colName,
  colCards,
  conf,
  totalPoints,
  canMove,
  canDelete,
  onMove,
  onDelete,
}) {
  return (
    <div className="kanban-column gt-stage-column">
      {/* Visual Header Banner per Kolom */}
      <div className="stage-banner-wrap">
        <img
          src={conf.image}
          alt={conf.title}
          className="stage-banner-img"
          style={{ objectPosition: conf.objectPosition }}
          loading="lazy"
          decoding="async"
        />
        <div className="stage-banner-scrim" />

        {/* Top Stage Bar: Pill & Code */}
        <div className="stage-banner-top">
          <span className="stage-pill">
            <span className="stage-pill-dot" />
            <span>{conf.stage}</span>
          </span>
          <span className="stage-code-tag font-mono">{conf.code}</span>
        </div>

        {/* Big Stage Title & Class-Style Card Counter */}
        <div className="stage-banner-body">
          <div className="stage-banner-title-wrap">
            <span className="stage-sub-status font-mono">{conf.statusText}</span>
            <h2 className="stage-title">{conf.title}</h2>
          </div>
          <div className="stage-class-counter">
            <span className="stage-counter-val font-mono">
              {colCards.length < 10 ? `0${colCards.length}` : colCards.length}
            </span>
            <span className="stage-counter-unit font-mono">CRD</span>
          </div>
        </div>
      </div>

      {/* Telemetry Spec Row Kolom (border-y) */}
      <div className="stage-spec-row font-mono">
        <div className="stage-spec-item">
          <span className="stage-spec-label">TOTAL LOAD</span>
          <span className="stage-spec-val font-bold">{totalPoints} PT</span>
        </div>
        <div className="stage-spec-divider" />
        <div className="stage-spec-item">
          <span className="stage-spec-label">TASKS</span>
          <span className="stage-spec-val font-bold">{colCards.length}</span>
        </div>
      </div>

      {/* Column Header fallback for compatibility */}
      <div className="column-header visually-hidden">
        <div className="column-title">
          <span>{colName}</span>
          <span className="column-count">{colCards.length}</span>
        </div>
      </div>

      {/* Cards List */}
      <div className="column-cards-list gt-cards-list">
        {colCards.length === 0 ? (
          <div className="empty-column-box gt-empty-box">
            <span className="empty-box-icon">--</span>
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
            />
          ))
        )}
      </div>
    </div>
  )
})

export default KanbanColumn
