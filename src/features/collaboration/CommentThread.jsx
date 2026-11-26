import React, { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatDateTime, initials } from './format.js'

/**
 * PBI-007: Komentar pada card
 * - Menampilkan nama, peran, dan waktu
 * - Semua peran login dapat berkomentar
 * - Pengguna dapat menghapus komentarnya sendiri
 */
export default function CommentThread({ card }) {
  const { addComment, deleteComment } = useData()
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const comments = card.comments || []

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = addComment(card.id, text)
    setError(result.success ? '' : result.error)
    if (result.success) setText('')
  }

  return (
    <div className="collab-section">
      <p className="collab-kicker">Komentar ({comments.length})</p>

      {comments.length === 0 ? (
        <p className="collab-empty">Belum ada komentar. Jadilah yang pertama memberi masukan.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <span className="comment-avatar" aria-hidden="true">
                {initials(c.name)}
              </span>
              <div className="comment-body">
                <div className="comment-head">
                  <span className="comment-author">{c.name}</span>
                  <span className="role-chip">{c.role}</span>
                  <span className="comment-time">{formatDateTime(c.createdAt)}</span>
                </div>
                <p className="comment-text">{c.text}</p>
                {c.username === user?.username && (
                  <button
                    type="button"
                    className="collab-link-btn is-danger"
                    onClick={() => {
                      if (window.confirm('Hapus komentar ini?')) {
                        const r = deleteComment(card.id, c.id)
                        setError(r.success ? '' : r.error)
                      }
                    }}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor={`comment-${card.id}`} className="visually-hidden">
          Tulis komentar
        </label>
        <textarea
          id={`comment-${card.id}`}
          rows={2}
          className="modern-input"
          placeholder="Tulis komentar atau masukan teknis…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
          }}
        />
        <div className="comment-form-foot">
          <span className="collab-note">
            Sebagai <strong>{user?.name}</strong> ({user?.role}) · Ctrl/⌘ + Enter untuk kirim
          </span>
          <button type="submit" className="btn-submit-primary" disabled={!text.trim()}>
            Kirim
          </button>
        </div>
      </form>
      {error && <p className="collab-error" role="alert">{error}</p>}
    </div>
  )
}
