import React, { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { getDodStatus, getBlockers, getApprovalState } from '../../utils/index.js'
import DodChecklist from '../dod/DodChecklist.jsx'
import DependencyPanel from '../dependencies/DependencyPanel.jsx'
import CommentThread from './CommentThread.jsx'
import ReviewPanel from './ReviewPanel.jsx'

/**
 * Panel kolaborasi Sprint 2 di modal detail card:
 * Checklist DoD (PBI-010/011), Review & Persetujuan (PBI-008/009),
 * Komentar (PBI-007), Dependensi (PBI-012).
 * Selalu membaca versi card terbaru dari DataContext.
 */
export default function CardCollabPanel({ cardId, initialTab }) {
  const { boardCards, dodTemplate } = useData()
  const card = boardCards.find((c) => c.id === cardId)
  const [tab, setTab] = useState(initialTab || (card?.column === 'Review' ? 'review' : 'dod'))

  if (!card) return null

  const dod = getDodStatus(card, dodTemplate)
  const blockers = getBlockers(card, boardCards)
  const approval = getApprovalState(card)

  const tabs = [
    { id: 'dod', label: 'Checklist DoD', badge: `${dod.done}/${dod.total}`, tone: dod.complete ? 'ok' : '' },
    {
      id: 'review',
      label: 'Review & Persetujuan',
      badge: approval === 'pending' ? '!' : (card.reviews || []).length || null,
      tone: approval === 'pending' ? 'warn' : '',
    },
    { id: 'comments', label: 'Komentar', badge: (card.comments || []).length || null },
    {
      id: 'deps',
      label: 'Dependensi',
      badge: blockers.length ? 'Blok' : (card.dependsOn || []).length || null,
      tone: blockers.length ? 'danger' : '',
    },
  ]

  return (
    <div className="collab-panel">
      <div className="collab-tabs" role="tablist" aria-label="Kolaborasi card">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`collab-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            {t.badge !== null && t.badge !== undefined && (
              <span className={`collab-tab-badge ${t.tone ? `is-${t.tone}` : ''}`}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="collab-tab-panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'dod' && <DodChecklist card={card} />}
        {tab === 'review' && <ReviewPanel card={card} />}
        {tab === 'comments' && <CommentThread card={card} />}
        {tab === 'deps' && <DependencyPanel card={card} />}
      </div>
    </div>
  )
}
