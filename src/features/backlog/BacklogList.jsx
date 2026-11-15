import React, { useState, useMemo, useCallback } from 'react'
import { useData } from '../../context/DataContext.jsx'
import BacklogEpicSection from '../../components/backlog/BacklogEpicSection.jsx'
import HudPanel from '../../components/common/HudPanel.jsx'

const PRIORITY_ORDER = {
  Must: 1,
  Should: 2,
  Could: 3,
  "Won't": 4,
}

export default function BacklogList() {
  const { backlogItems, epics } = useData()
  const [sprintFilter, setSprintFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [expandedItemId, setExpandedItemId] = useState(null)

  // Filter items (useMemo)
  const filteredItems = useMemo(() => {
    return backlogItems.filter((item) => {
      if (sprintFilter !== 'All' && String(item.sprint) !== sprintFilter) return false
      if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false
      return true
    })
  }, [backlogItems, sprintFilter, priorityFilter])

  // Sort by MoSCoW Priority strictly (useMemo)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const prioA = PRIORITY_ORDER[a.priority] || 99
      const prioB = PRIORITY_ORDER[b.priority] || 99
      if (prioA !== prioB) return prioA - prioB
      return a.id.localeCompare(b.id)
    })
  }, [filteredItems])

  // Total Story Points (useMemo)
  const totalPoints = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + (curr.points || 0), 0)
  }, [filteredItems])

  // Group items by Epic (useMemo)
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
        items: otherItems,
        totalPoints: otherItems.reduce((sum, item) => sum + (item.points || 0), 0),
      })
    }

    return groups
  }, [epics, sortedItems])

  const toggleExpand = useCallback((id) => {
    setExpandedItemId((prev) => (prev === id ? null : id))
  }, [])

  return (
<<<<<<< Updated upstream
    <table>
      <thead>
        <tr><th>ID</th><th>Epic</th><th>User Story</th><th>Prioritas</th><th>Poin</th><th>Sprint</th><th>Pemegang</th><th>Status</th><th>Dependensi</th></tr>
      </thead>
      <tbody>
        {items.map(i => (
          <tr key={i.id} style={i.sprint === 1 ? { background: '#e5e5e5' } : undefined}>
            <td>{i.id}</td><td>{i.epic}</td><td>{i.title}</td><td>{i.priority}</td>
            <td>{i.points}</td><td>{i.sprint}{i.sprint === 1 ? ' (dipilih)' : ''}</td>
            <td>{i.owner}</td><td>{i.status}</td><td>{i.dependsOn.join(', ') || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
=======
    <div className="backlog-container">
      {/* Metric Cards Row : Paddock HUD Style */}
      <div className="backlog-metrics-row paddock-hud-metrics">
        <div className="metric-box">
          <span className="metric-label font-mono">TOTAL USER STORIES</span>
          <span className="metric-value font-mono tabular-nums">{backlogItems.length}</span>
          <span className="metric-sub font-mono">ITEMS REGISTERED</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">TOTAL STORY POINTS</span>
          <span className="metric-value font-mono tabular-nums">{totalPoints}</span>
          <span className="metric-sub font-mono">PTS PLANNED LOAD</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">EPICS CAKUPAN</span>
          <span className="metric-value font-mono tabular-nums">{epics.length}</span>
          <span className="metric-sub font-mono">SYSTEM MODULES</span>
        </div>
        <div className="metric-box">
          <span className="metric-label font-mono">TARGET SPRINT</span>
          <span className="metric-value font-mono tabular-nums">4</span>
          <span className="metric-sub font-mono">PHASES (SPRINT 1 ACTIVE)</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <HudPanel className="backlog-controls-bar hud-controls-bar">
        <div className="controls-left">
          <div className="filter-item">
            <label htmlFor="sprintSelect" className="font-mono">
              SPRINT:
            </label>
            <select
              id="sprintSelect"
              className="input-field-sm font-mono"
              value={sprintFilter}
              onChange={(e) => setSprintFilter(e.target.value)}
            >
              <option value="All">Semua Sprint</option>
              <option value="1">Sprint 1 (Aktif)</option>
              <option value="2">Sprint 2</option>
              <option value="3">Sprint 3</option>
              <option value="4">Sprint 4</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="prioritySelect" className="font-mono">
              PRIORITAS:
            </label>
            <select
              id="prioritySelect"
              className="input-field-sm font-mono"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">Semua Prioritas</option>
              <option value="Must">Must Have</option>
              <option value="Should">Should Have</option>
              <option value="Could">Could Have</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <span className="badge badge-cyan font-mono">{filteredItems.length} Item Ditampilkan</span>
        </div>
      </HudPanel>

      {/* Data Table : Telemetry HUD Paddock Table Grouped by Epic */}
      <div className="table-responsive">
        <table className="technical-table gt-paddock-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }} className="font-mono">ID</th>
              <th style={{ width: '100px' }} className="font-mono">Epic</th>
              <th>User Story &amp; Deskripsi</th>
              <th style={{ width: '110px' }} className="font-mono">Prioritas</th>
              <th style={{ width: '80px', textAlign: 'center' }} className="font-mono">Poin</th>
              <th style={{ width: '90px', textAlign: 'center' }} className="font-mono">Sprint</th>
              <th style={{ width: '120px' }} className="font-mono">Divisi</th>
              <th style={{ width: '100px' }} className="font-mono">Status</th>
              <th style={{ width: '80px', textAlign: 'center' }} className="font-mono">Detail</th>
            </tr>
          </thead>
          <tbody>
            {epicGroups.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                  Tidak ada user story yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              epicGroups.map((group) => (
                <BacklogEpicSection
                  key={group.id}
                  group={group}
                  expandedItemId={expandedItemId}
                  onToggleExpand={toggleExpand}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
>>>>>>> Stashed changes
  )
}
