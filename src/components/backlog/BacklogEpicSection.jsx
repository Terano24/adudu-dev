import React from 'react'
import StatusBadge from '../common/StatusBadge.jsx'

const BacklogEpicSection = React.memo(function BacklogEpicSection({
  group,
  expandedItemId,
  onToggleExpand,
}) {
  return (
    <>
      {/* Epic Section Group Header */}
      <tr className="epic-group-header-row">
        <td colSpan={9}>
          <div className="epic-group-badge-wrap font-mono">
            <span className="epic-tag">{group.id}</span>
            <span className="epic-name">{group.name}</span>
            <span className="epic-stat">
              {group.items.length} Stories · {group.totalPoints} Story Points
            </span>
          </div>
        </td>
      </tr>

      {/* Stories inside Epic */}
      {group.items.map((item) => {
        const isExpanded = expandedItemId === item.id

        return (
          <React.Fragment key={item.id}>
            <tr className={`story-row ${isExpanded ? 'row-expanded' : ''}`}>
              <td className="font-mono font-bold text-cyan" style={{ fontSize: '0.8rem' }}>
                {item.id}
              </td>
              <td>
                <span className="badge badge-muted font-mono" style={{ fontSize: '0.7rem' }}>
                  {item.epic}
                </span>
              </td>
              <td className="story-title-cell">
                <span className="story-text font-bold">{item.title}</span>
              </td>
              <td>
                <StatusBadge label={item.priority} />
              </td>
              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
                <strong>{item.points}</strong>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge badge-cyan font-mono" style={{ fontSize: '0.7rem' }}>
                  S-{item.sprint}
                </span>
              </td>
              <td>
                <span className="text-secondary" style={{ fontSize: '0.775rem' }}>
                  {item.division}
                </span>
              </td>
              <td>
                <span className="badge badge-muted font-mono" style={{ fontSize: '0.7rem' }}>
                  {item.status}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn-toggle-expand"
                  onClick={() => onToggleExpand(item.id)}
                  aria-label="Toggle Acceptance Criteria"
                >
                  {isExpanded ? '▲' : '▼'}
                </button>
              </td>
            </tr>

            {/* Expandable Acceptance Criteria Row */}
            {isExpanded && (
              <tr className="criteria-expansion-row">
                <td colSpan={9}>
                  <div className="criteria-content">
                    <div className="criteria-title font-mono">
                      ACCEPTANCE CRITERIA ({item.id}):
                    </div>
                    {item.acceptance && item.acceptance.length > 0 ? (
                      <ul className="criteria-list">
                        {item.acceptance.map((crit, idx) => (
                          <li key={idx}>
                            <span className="criteria-bullet font-mono">›</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">Tidak ada kriteria tertulis.</div>
                    )}
                    {item.dependsOn && item.dependsOn.length > 0 && (
                      <div className="criteria-deps font-mono">
                        DEPENDS ON: <code>{item.dependsOn.join(', ')}</code>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
})

export default BacklogEpicSection
