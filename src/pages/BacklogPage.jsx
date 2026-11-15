import React from 'react'
import BacklogList from '../features/backlog/BacklogList.jsx'

export default function BacklogPage() {
  return (
    <div className="wrap page-container board-paddock-root">
      <div className="page-header board-hud-header">
        <div className="board-header-left">
          <div className="board-header-tagline">
            <span className="paddock-tag">EPIC REPOSITORY</span>
            <span className="font-mono text-muted">//</span>
            <span className="font-mono text-muted">PRODUCT BACKLOG HUD</span>
          </div>
          <h1 className="page-title board-main-title">
            Product Backlog Antasena
          </h1>
          <p className="page-subtitle">
            Daftar User Story dan fitur teknis kendaraan, terstruktur berdasarkan Epic, Sprint terencana, dan Prioritas MoSCoW.
          </p>
        </div>
      </div>

      <BacklogList />
    </div>
  )
}
