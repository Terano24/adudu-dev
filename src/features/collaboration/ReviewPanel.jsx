import React, { useEffect, useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getAverageRating, getApprovalState } from '../../utils/index.js'
import { formatDateTime } from './format.js'

function Stars({ value, size = 14 }) {
  return (
    <span className="star-row" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={n <= Math.round(value) ? 'star is-on' : 'star'}
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

const APPROVAL_COPY = {
  approved: { label: 'Disetujui', cls: 'is-ok' },
  revision: { label: 'Perlu Revisi', cls: 'is-blocked' },
  pending: { label: 'Menunggu Persetujuan', cls: 'is-pending' },
}

/**
 * PBI-009: Persetujuan PO / mitra di kolom Review
 */
function ApprovalBox({ card }) {
  const { decideApproval } = useData()
  const { can } = useAuth()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const state = getApprovalState(card)
  const canApprove = can('approve', 'card')
  const inReview = card.column === 'Review'
  const log = card.approvalLog || []

  const decide = (decision) => {
    const r = decideApproval(card.id, decision, reason)
    setError(r.success ? '' : r.error)
    if (r.success) {
      setReason('')
      setInfo(
        decision === 'approved'
          ? 'Disetujui. Card dapat dipindah ke Done setelah checklist DoD lengkap.'
          : 'Revisi diminta. Tim perlu memperbaiki lalu mengajukan ulang ke Review.'
      )
    }
  }

  return (
    <div className="approval-box">
      <div className="collab-section-head">
        <div>
          <p className="collab-kicker">Persetujuan PO / Mitra</p>
          <p className="collab-help">Card di kolom Review menunggu persetujuan sebelum dapat menjadi Done.</p>
        </div>
        {state && <span className={`status-chip ${APPROVAL_COPY[state].cls}`}>{APPROVAL_COPY[state].label}</span>}
      </div>

      {inReview && canApprove && (
        <div className="approval-form">
          <label htmlFor={`approval-${card.id}`} className="form-label">
            Alasan keputusan (wajib)
          </label>
          <textarea
            id={`approval-${card.id}`}
            rows={2}
            className="modern-input"
            placeholder="Misal: Fungsi sesuai AC dan sudah diuji di lingkungan uji."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setInfo('')
            }}
          />
          <div className="approval-actions">
            <button type="button" className="btn-approve" onClick={() => decide('approved')}>
              Setujui
            </button>
            <button type="button" className="btn-revise" onClick={() => decide('revision')}>
              Minta Revisi
            </button>
          </div>
        </div>
      )}
      {inReview && !canApprove && (
        <p className="collab-note">Hanya PO atau mitra (Alumni Reviewer) yang dapat menyetujui card ini.</p>
      )}
      {!inReview && (
        <p className="collab-note">Tombol persetujuan muncul saat card berada di kolom Review.</p>
      )}
      {info && <p className="collab-success" role="status">{info}</p>}
      {error && <p className="collab-error" role="alert">{error}</p>}

      {log.length > 0 && (
        <>
          <p className="collab-subhead">Riwayat keputusan</p>
          <ul className="approval-log">
            {[...log].reverse().map((entry, i) => (
              <li key={i} className="approval-log-item">
                <span className={`status-chip ${entry.decision === 'approved' ? 'is-ok' : 'is-blocked'}`}>
                  {entry.decision === 'approved' ? 'Disetujui' : 'Revisi'}
                </span>
                <div className="approval-log-body">
                  <p className="comment-text">“{entry.reason}”</p>
                  <span className="dep-meta">
                    {entry.name} ({entry.role}) · {formatDateTime(entry.at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

/**
 * PBI-008: Review alumni (rating 1-5 + catatan wajib), satu review per reviewer, dapat diedit
 */
export default function ReviewPanel({ card }) {
  const { upsertReview } = useData()
  const { can, user } = useAuth()
  const reviews = card.reviews || []
  const mine = reviews.find((r) => r.username === user?.username)
  const [rating, setRating] = useState(mine?.rating || 0)
  const [hover, setHover] = useState(0)
  const [note, setNote] = useState(mine?.note || '')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    setRating(mine?.rating || 0)
    setNote(mine?.note || '')
  }, [mine?.rating, mine?.note])

  const avg = getAverageRating(card)
  const canReview = can('review', 'card')
  const reviewable = ['Review', 'Done'].includes(card.column)

  const handleSubmit = (e) => {
    e.preventDefault()
    const r = upsertReview(card.id, rating, note)
    setError(r.success ? '' : r.error)
    setInfo(r.success ? (r.updated ? 'Review diperbarui.' : 'Review tersimpan.') : '')
  }

  return (
    <div className="collab-section">
      <ApprovalBox card={card} />

      <div className="collab-divider" />

      <div className="collab-section-head">
        <div>
          <p className="collab-kicker">Review Alumni</p>
          <p className="collab-help">Rating 1–5 dan catatan untuk hasil card berstatus Review atau Done.</p>
        </div>
        {avg !== null && (
          <span className="rating-summary">
            <Stars value={avg} />
            <strong className="tabular-nums">{avg.toFixed(1)}</strong>
            <span className="dep-meta">({reviews.length})</span>
          </span>
        )}
      </div>

      {canReview && reviewable && (
        <form className="review-form" onSubmit={handleSubmit}>
          <span className="form-label">{mine ? 'Ubah review Anda' : 'Beri review'}</span>
          <div className="star-picker" role="radiogroup" aria-label="Pilih rating" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} bintang`}
                className={`star-btn ${(hover || rating) >= n ? 'is-on' : ''}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => {
                  setRating(n)
                  setInfo('')
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
            <span className="dep-meta tabular-nums">{rating ? `${rating}/5` : 'Belum dipilih'}</span>
          </div>
          <textarea
            rows={3}
            className="modern-input"
            placeholder="Catatan review (wajib): apa yang sudah baik, apa yang perlu ditingkatkan…"
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              setInfo('')
            }}
            aria-label="Catatan review"
          />
          <div className="comment-form-foot">
            <span className="collab-note">Satu review per reviewer — mengirim ulang akan memperbarui review Anda.</span>
            <button type="submit" className="btn-submit-primary">
              {mine ? 'Perbarui Review' : 'Kirim Review'}
            </button>
          </div>
        </form>
      )}
      {canReview && !reviewable && (
        <p className="collab-note">Review dapat diberikan setelah card masuk kolom Review atau Done.</p>
      )}
      {!canReview && <p className="collab-note">Review diberikan oleh Alumni Reviewer atau PO.</p>}
      {info && <p className="collab-success" role="status">{info}</p>}
      {error && <p className="collab-error" role="alert">{error}</p>}

      {reviews.length > 0 ? (
        <ul className="comment-list">
          {reviews.map((r) => (
            <li key={r.username} className="review-item">
              <div className="comment-head">
                <span className="comment-author">{r.name}</span>
                <span className="role-chip">{r.role}</span>
                <Stars value={r.rating} size={12} />
                <span className="comment-time">
                  {formatDateTime(r.updatedAt || r.createdAt)}
                  {r.updatedAt ? ' (diedit)' : ''}
                </span>
              </div>
              <p className="comment-text">{r.note}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="collab-empty">Belum ada review.</p>
      )}
    </div>
  )
}
