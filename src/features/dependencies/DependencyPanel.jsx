import React, { useMemo, useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getBlockers, wouldCreateCycle } from '../../utils/index.js'

/**
 * PBI-012: Dependensi antar card
 * - Card dapat diberi dependensi ke card lain
 * - Card yang menunggu card belum-Done ditandai Terblokir
 * - Dependensi melingkar ditolak
 */
export default function DependencyPanel({ card }) {
  const { boardCards, addDependency, removeDependency } = useData()
  const { can } = useAuth()
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')

  const canEdit = can('edit', 'card')
  const deps = (card.dependsOn || [])
    .map((id) => boardCards.find((c) => c.id === id))
    .filter(Boolean)
  const blockers = getBlockers(card, boardCards)
  const dependents = boardCards.filter((c) => (c.dependsOn || []).includes(card.id))

  const options = useMemo(
    () =>
      boardCards
        .filter((c) => c.id !== card.id && !(card.dependsOn || []).includes(c.id))
        .map((c) => ({ card: c, cyclic: wouldCreateCycle(card.id, c.id, boardCards) })),
    [boardCards, card]
  )

  const handleAdd = (e) => {
    e.preventDefault()
    if (!selected) return
    const result = addDependency(card.id, selected)
    setError(result.success ? '' : result.error)
    if (result.success) setSelected('')
  }

  return (
    <div className="collab-section">
      <div className="collab-section-head">
        <div>
          <p className="collab-kicker">Dependensi</p>
          <p className="collab-help">
            Card ini <strong>Terblokir</strong> selama ada card yang ditunggu belum berstatus Done.
          </p>
        </div>
        {blockers.length > 0 ? (
          <span className="status-chip is-blocked">Terblokir</span>
        ) : deps.length > 0 ? (
          <span className="status-chip is-ok">Siap jalan</span>
        ) : null}
      </div>

      <p className="collab-subhead">Menunggu card</p>
      {deps.length === 0 ? (
        <p className="collab-empty">Tidak bergantung pada card lain.</p>
      ) : (
        <ul className="dep-list">
          {deps.map((d) => {
            const done = d.column === 'Done'
            return (
              <li key={d.id} className="dep-row">
                <span className={`dep-dot ${done ? 'is-done' : 'is-waiting'}`} aria-hidden="true" />
                <div className="dep-info">
                  <span className="dep-title">
                    <span className="font-mono dep-id">{d.id}</span> {d.title}
                  </span>
                  <span className="dep-meta">
                    {d.division} · {d.column}
                  </span>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    className="collab-link-btn is-danger"
                    onClick={() => {
                      const r = removeDependency(card.id, d.id)
                      setError(r.success ? '' : r.error)
                    }}
                    aria-label={`Hapus dependensi ke ${d.id}`}
                  >
                    Lepas
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {canEdit && (
        <form className="collab-inline-form" onSubmit={handleAdd}>
          <select
            className="modern-input"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value)
              setError('')
            }}
            aria-label="Pilih card yang ditunggu"
          >
            <option value="">Pilih card yang ditunggu…</option>
            {options.map(({ card: c, cyclic }) => (
              <option key={c.id} value={c.id}>
                {c.id} · {c.title} ({c.division}){cyclic ? ' — melingkar' : ''}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-submit-primary" disabled={!selected}>
            Tambah
          </button>
        </form>
      )}

      {dependents.length > 0 && (
        <>
          <p className="collab-subhead">Ditunggu oleh</p>
          <ul className="dep-list">
            {dependents.map((d) => (
              <li key={d.id} className="dep-row">
                <span className="dep-dot is-neutral" aria-hidden="true" />
                <div className="dep-info">
                  <span className="dep-title">
                    <span className="font-mono dep-id">{d.id}</span> {d.title}
                  </span>
                  <span className="dep-meta">
                    {d.division} · {d.column}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {error && <p className="collab-error" role="alert">{error}</p>}
    </div>
  )
}
