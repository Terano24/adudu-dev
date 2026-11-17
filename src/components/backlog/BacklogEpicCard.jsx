import React, { useState, useMemo } from 'react'

const PRIORITY_BADGES = {
  Must: { bgClass: 'prio-must', label: 'Must' },
  Should: { bgClass: 'prio-should', label: 'Should' },
  Could: { bgClass: 'prio-could', label: 'Could' },
  "Won't": { bgClass: 'prio-wont', label: "Won't" },
}

const STATUS_CONFIGS = {
  'To Do': { dotColor: '#10B981', bgClass: 'status-todo', label: 'To Do' },
  'In Progress': { dotColor: '#2563EB', bgClass: 'status-inprogress', label: 'In Progress' },
  'Review': { dotColor: '#F59E0B', bgClass: 'status-review', label: 'Review' },
  'Done': { dotColor: '#10B981', bgClass: 'status-done', label: 'Done' },
}

// Epic display titles & goals matching design
const EPIC_METADATA = {
  'EPIC-1': {
    title: 'Fitur Inti Kendaraan',
    subtitle: 'Pengembangan fitur utama untuk mendukung performa dan monitoring kendaraan.',
  },
  'EPIC-2': {
    title: 'Review & Komentar Alumni/Mitra',
    subtitle: 'Alumni dan mitra dapat mengomentari dan mereview hasil setiap objektif yang selesai.',
  },
  'EPIC-3': {
    title: 'DoD Gatekeeper & Dependensi',
    subtitle: 'Memastikan kepatuhan Definition of Done dan keterkaitan komponen antar divisi.',
  },
  'EPIC-4': {
    title: 'Telemetry Dashboard & Cockpit',
    subtitle: 'Pemantauan data telemetri real-time hasil uji run kendaraan secara komprehensif.',
  },
  'EPIC-5': {
    title: 'Knowledge Vault & Dokumentasi',
    subtitle: 'Arsip modul riset teknis, paper kompetisi, dan evaluasi berkelanjutan tim.',
  },
}

export default function BacklogEpicCard({
  group,
  expandedItemId,
  onToggleExpand,
  onOpenDetail,
  onChangePriority,
  isPO,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6) // Default 6 agar seluruh 6 item Sprint 1 langsung tampil
  const [editingPriorityId, setEditingPriorityId] = useState(null)

  const meta = EPIC_METADATA[group.id] || {
    title: group.name || group.title || group.id,
    subtitle: group.goal || 'Pengembangan fitur sistem Antasena Team ITS.',
  }

  const totalStories = group.items.length
  const totalPoints = group.totalPoints
  const effectivePageSize = pageSize === 'All' ? totalStories : pageSize
  const totalPages = Math.ceil(totalStories / effectivePageSize) || 1

  // Safe pagination slice
  const paginatedItems = useMemo(() => {
    if (pageSize === 'All') return group.items
    const start = (currentPage - 1) * effectivePageSize
    return group.items.slice(start, start + effectivePageSize)
  }, [group.items, currentPage, pageSize, effectivePageSize])

  const shownCount = paginatedItems.length

  const handlePriorityClick = (e, item) => {
    e.stopPropagation()
    if (!isPO) {
      if (onChangePriority) {
        onChangePriority(item.id, null) // Trigger denied message
      }
      return
    }
    setEditingPriorityId((prev) => (prev === item.id ? null : item.id))
  }

  return (
    <div className={`epic-card-container ${isCollapsed ? 'epic-collapsed' : ''}`}>
      {/* Epic Card Header */}
      <div
        className="epic-card-header"
        onClick={() => setIsCollapsed((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsCollapsed((prev) => !prev)
          }
        }}
        aria-expanded={!isCollapsed}
      >
        <div className="epic-header-left">
          {/* Collapse Chevron Icon */}
          <span className="epic-chevron-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>

          {/* Epic Tag Badge */}
          <span className="epic-pill-badge">{group.id}</span>

          {/* Title & Subtitle */}
          <div className="epic-title-wrap">
            <h2 className="epic-main-title">{meta.title}</h2>
            <p className="epic-sub-title">{meta.subtitle}</p>
          </div>
        </div>

        <div className="epic-header-right">
          {/* Stories & Points Badge */}
          <span className="epic-stories-stat-pill">
            {totalStories} Stories · {totalPoints} Story Points
          </span>

          {/* Up/Down Arrow button */}
          <button
            type="button"
            className="epic-collapse-toggle-btn"
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed((prev) => !prev)
            }}
            aria-label={isCollapsed ? 'Perluas Epic' : 'Ciutkan Epic'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Epic Card Body: Table & Pagination */}
      {!isCollapsed && (
        <div className="epic-card-body">
          <div className="table-responsive-container">
            <table className="backlog-modern-table" aria-label={`Daftar User Story ${group.id}`}>
              <thead>
                <tr>
                  <th style={{ width: '85px' }}>ID</th>
                  <th style={{ width: '90px' }}>Epic</th>
                  <th>User Story &amp; Deskripsi</th>
                  <th style={{ width: '115px' }}>Prioritas</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Poin</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Sprint</th>
                  <th style={{ width: '130px' }}>Pemegang / Divisi</th>
                  <th style={{ width: '115px' }}>Status</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => {
                  const prio = PRIORITY_BADGES[item.priority] || {
                    bgClass: 'prio-must',
                    label: item.priority || 'Must',
                  }
                  const statusConfig = STATUS_CONFIGS[item.status] || {
                    dotColor: '#10B981',
                    bgClass: 'status-todo',
                    label: item.status || 'To Do',
                  }
                  const isExpanded = expandedItemId === item.id
                  const isEditingThisPriority = editingPriorityId === item.id

                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`story-data-row ${isExpanded ? 'row-active-expanded' : ''}`}>
                        {/* ID */}
                        <td className="story-id-cell">
                          <button
                            type="button"
                            className="story-id-link"
                            onClick={() => onOpenDetail(item)}
                            title={`Lihat detail lengkap ${item.id}`}
                          >
                            {item.id}
                          </button>
                        </td>

                        {/* Epic Badge */}
                        <td>
                          <span className="table-epic-badge">{item.epic}</span>
                        </td>

                        {/* User Story & Deskripsi */}
                        <td className="story-text-cell">
                          <span
                            className="story-main-text"
                            onClick={() => onToggleExpand(item.id)}
                            style={{ cursor: 'pointer' }}
                            title="Klik untuk melihat Acceptance Criteria"
                          >
                            {item.title}
                          </span>
                        </td>

                        {/* Prioritas (MoSCoW) - PBI-005: Hanya PO yang dapat mengubah prioritas */}
                        <td className="story-priority-cell">
                          <div className="priority-badge-anchor" style={{ position: 'relative' }}>
                            <button
                              type="button"
                              className={`prio-pill ${prio.bgClass}`}
                              onClick={(e) => handlePriorityClick(e, item)}
                              title={
                                isPO
                                  ? 'Klik untuk mengubah prioritas (Khusus Product Owner)'
                                  : 'Hanya Product Owner yang berhak mengubah prioritas (PBI-005)'
                              }
                            >
                              <span>{prio.label}</span>
                              {isPO && (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginLeft: '4px' }}
                                  aria-hidden="true"
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              )}
                            </button>

                            {/* Dropdown pilihan prioritas untuk PO */}
                            {isEditingThisPriority && isPO && (
                              <div className="prio-select-popover">
                                {['Must', 'Should', 'Could', "Won't"].map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    className={`prio-popover-item ${item.priority === p ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingPriorityId(null)
                                      if (onChangePriority) {
                                        onChangePriority(item.id, p)
                                      }
                                    }}
                                  >
                                    <span className={`prio-pill prio-${p.toLowerCase()}`}>{p}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Poin */}
                        <td className="story-point-cell font-mono tabular-nums">
                          {item.points}
                        </td>

                        {/* Sprint */}
                        <td className="story-sprint-cell font-mono">
                          <span className="sprint-pill-badge">S-{item.sprint}</span>
                        </td>

                        {/* Pemegang / Divisi */}
                        <td className="story-division-cell">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="font-bold text-primary" style={{ fontSize: '0.8rem' }}>
                              {item.owner || 'Tim Antasena'}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                              {item.division || 'Tim Product'}
                            </span>
                          </div>
                        </td>

                        {/* Status with dot */}
                        <td>
                          <span className={`status-pill ${statusConfig.bgClass}`}>
                            <span
                              className="status-dot-bullet"
                              style={{ backgroundColor: statusConfig.dotColor }}
                              aria-hidden="true"
                            />
                            <span>{statusConfig.label}</span>
                          </span>
                        </td>

                        {/* Detail Eye Button */}
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn-story-eye"
                            onClick={() => onToggleExpand(item.id)}
                            title="Tampilkan Acceptance Criteria"
                            aria-label={`Lihat Acceptance Criteria ${item.id}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Acceptance Criteria Row */}
                      {isExpanded && (
                        <tr className="criteria-expansion-row">
                          <td colSpan={9}>
                            <div className="criteria-container-box">
                              <div className="criteria-header-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span className="criteria-title-label font-mono">
                                    ACCEPTANCE CRITERIA ({item.id})
                                  </span>
                                  <span className="criteria-owner-badge font-mono">
                                    Pemegang: <strong>{item.owner || 'Tim Antasena'}</strong>
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  className="btn-open-full-modal"
                                  onClick={() => onOpenDetail(item)}
                                >
                                  <span>Buka Modal Penuh</span>
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginLeft: '5px' }}
                                    aria-hidden="true"
                                  >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </button>
                              </div>

                              {item.acceptance && item.acceptance.length > 0 ? (
                                <ul className="criteria-check-list">
                                  {item.acceptance.map((crit, idx) => (
                                    <li key={idx} className="criteria-check-item">
                                      <span className="criteria-num-badge font-mono font-bold">
                                        {idx + 1}.
                                      </span>
                                      <span>{crit}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="criteria-empty-text">
                                  Tidak ada kriteria tertulis.
                                </p>
                              )}

                              {item.dependsOn && item.dependsOn.length > 0 && (
                                <div className="criteria-dependency-box">
                                  <span className="font-bold">DEPENDS ON:</span>{' '}
                                  <span className="deps-list font-mono">
                                    {item.dependsOn.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Card Footer: Info, Page Size Toggle & Pagination */}
          <div className="epic-card-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span className="pagination-info-text">
                Menampilkan {shownCount} dari {totalStories} story di Epic ini
              </span>

              {/* Page size toggle */}
              <div className="page-size-toggle" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Tampilkan:</span>
                {[3, 6, 'All'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`page-size-btn ${pageSize === sz ? 'active' : ''}`}
                    onClick={() => {
                      setPageSize(sz)
                      setCurrentPage(1)
                    }}
                  >
                    {sz === 'All' ? 'Semua' : sz}
                  </button>
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="epic-pagination-controls" aria-label="Navigasi Halaman Story">
                {/* Prev Button */}
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Halaman Sebelumnya"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-btn pagination-num ${
                      currentPage === pageNum ? 'active' : ''
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Halaman Selanjutnya"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
