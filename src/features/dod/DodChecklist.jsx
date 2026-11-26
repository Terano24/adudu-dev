import React, { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDodStatus } from '../../utils/index.js'
import { formatDateTime } from '../collaboration/format.js'

/**
 * PBI-010: Checklist DoD di setiap card (template global, centang per card)
 * PBI-011: Siapa yang mencentang & kapan tercatat
 */
export default function DodChecklist({ card }) {
  const { dodTemplate, toggleDodItem, addDodItem, updateDodItem, removeDodItem } = useData()
  const { can } = useAuth()
  const [isManaging, setIsManaging] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [editing, setEditing] = useState({})
  const [error, setError] = useState('')

  const canCheck = can('check', 'dod')
  const canManage = can('manage', 'dod')
  const dod = getDodStatus(card, dodTemplate)
  const percent = dod.total ? Math.round((dod.done / dod.total) * 100) : 0

  const run = (result) => {
    setError(result?.success ? '' : result?.error || '')
    return result?.success
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (run(addDodItem(newItem))) setNewItem('')
  }

  const handleSaveEdit = (id) => {
    if (run(updateDodItem(id, editing[id]))) {
      setEditing((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  return (
    <div className="collab-section">
      <div className="collab-section-head">
        <div>
          <p className="collab-kicker">Definition of Done</p>
          <p className="collab-help">
            Semua poin wajib dicentang sebelum card dapat dipindah ke <strong>Done</strong>.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="collab-ghost-btn"
            onClick={() => {
              setIsManaging((v) => !v)
              setError('')
            }}
            aria-pressed={isManaging}
          >
            {isManaging ? 'Selesai Kelola' : 'Kelola Poin DoD'}
          </button>
        )}
      </div>

      <div className="dod-progress" aria-label={`Progres DoD ${dod.done} dari ${dod.total}`}>
        <div className="dod-progress-track">
          <div
            className={`dod-progress-fill ${dod.complete ? 'is-complete' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="dod-progress-label tabular-nums">
          {dod.done}/{dod.total} terpenuhi
        </span>
      </div>

      {isManaging ? (
        <div className="dod-manage-list">
          <p className="collab-note">
            Perubahan poin berlaku untuk <strong>semua card</strong>. Hanya Product Owner yang dapat mengubahnya.
          </p>
          {dodTemplate.map((item) => {
            const isEditing = item.id in editing
            return (
              <div key={item.id} className="dod-manage-row">
                {isEditing ? (
                  <input
                    className="modern-input"
                    value={editing[item.id]}
                    onChange={(e) => setEditing((p) => ({ ...p, [item.id]: e.target.value }))}
                    aria-label="Ubah teks poin DoD"
                    autoFocus
                  />
                ) : (
                  <span className="dod-manage-text">{item.text}</span>
                )}
                <div className="dod-manage-actions">
                  {isEditing ? (
                    <button type="button" className="collab-link-btn" onClick={() => handleSaveEdit(item.id)}>
                      Simpan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="collab-link-btn"
                      onClick={() => setEditing((p) => ({ ...p, [item.id]: item.text }))}
                    >
                      Ubah
                    </button>
                  )}
                  <button
                    type="button"
                    className="collab-link-btn is-danger"
                    onClick={() => {
                      if (window.confirm(`Hapus poin DoD "${item.text}" dari semua card?`)) {
                        run(removeDodItem(item.id))
                      }
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )
          })}
          <form className="collab-inline-form" onSubmit={handleAdd}>
            <input
              className="modern-input"
              placeholder="Tambah poin DoD baru…"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              aria-label="Poin DoD baru"
            />
            <button type="submit" className="btn-submit-primary">
              Tambah
            </button>
          </form>
        </div>
      ) : (
        <ul className="dod-list">
          {dod.items.map((item) => (
            <li key={item.id} className={`dod-item ${item.check ? 'is-checked' : ''}`}>
              <label className="dod-item-label">
                <input
                  type="checkbox"
                  className="dod-checkbox"
                  checked={!!item.check}
                  disabled={!canCheck}
                  onChange={() => run(toggleDodItem(card.id, item.id))}
                />
                <span className="dod-item-text">{item.text}</span>
              </label>
              {item.check && (
                <span className="dod-item-meta">
                  {item.check.by} · {formatDateTime(item.check.at)}
                </span>
              )}
            </li>
          ))}
          {dod.items.length === 0 && <li className="collab-empty">Belum ada poin DoD.</li>}
        </ul>
      )}

      {!canCheck && !isManaging && (
        <p className="collab-note">Peran Anda hanya dapat melihat checklist DoD.</p>
      )}
      {error && <p className="collab-error" role="alert">{error}</p>}
    </div>
  )
}
