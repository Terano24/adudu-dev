import React, { useState, useMemo, useCallback } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AccessDenied from '../components/common/AccessDenied.jsx'
import KanbanColumn from '../components/board/KanbanColumn.jsx'
import ActionButton from '../components/common/ActionButton.jsx'
import HudPanel from '../components/common/HudPanel.jsx'

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done']

const STAGE_CONFIG = {
  'To Do': {
    stage: 'STAGE 01',
    code: 'SEC-TD',
    title: 'TO DO',
    image: '/images/antasena-falcon.jpg',
    objectPosition: 'center left',
    statusText: 'QUEUE READY',
  },
  'In Progress': {
    stage: 'STAGE 02',
    code: 'SEC-IP',
    title: 'IN PROGRESS',
    image: '/images/Mobil-Antasena-Falcon-2.0-saat-melesat-pada-lintasan-Sirkuit-Internasional-Lusail-di-ajang-Shell-Eco-marathon-SEM-Asia-Pasifik-dan-Timur-Tengah-2025-1.jpg',
    objectPosition: 'center center',
    statusText: 'TRACK ACTIVE',
  },
  'Review': {
    stage: 'STAGE 03',
    code: 'SEC-RV',
    title: 'REVIEW',
    image: '/images/driver-antasena-scaled.jpg',
    objectPosition: 'center 30%',
    statusText: 'TELEMETRY QA',
  },
  'Done': {
    stage: 'STAGE 04',
    code: 'SEC-DN',
    title: 'DONE',
    image: '/images/antasena-tribun-scaled.jpg',
    objectPosition: 'center center',
    statusText: 'VERIFIED',
  },
}

export default function BoardPage() {
  const { boardCards, addCard, deleteCard, moveCard, resetToSeed } = useData()
  const { can, user } = useAuth()

  // Modal / Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deniedActionMessage, setDeniedActionMessage] = useState(null)
  const [divisionFilter, setDivisionFilter] = useState('All')

  // Form input state
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColumn, setNewColumn] = useState('To Do')
  const [newDivision, setNewDivision] = useState('Programming')
  const [newAssignee, setNewAssignee] = useState('')
  const [newPoints, setNewPoints] = useState(5)
  const [newPriority, setNewPriority] = useState('Must')
  const [newDeadline, setNewDeadline] = useState('')

  // Handle Klik Tambah Card
  const handleOpenAddModal = () => {
    if (!can('create', 'card')) {
      setDeniedActionMessage({
        title: 'Izin Ditolak: Tidak Dapat Membuat Card',
        message:
          'Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer hanya memiliki hak baca, komentar, dan review teknis. Anda tidak diizinkan membuat card pekerjaan baru.',
        requiredPermission: 'create:card',
      })
      return
    }
    setIsAddModalOpen(true)
  }

  // Handle Submit Form Card
  const handleCreateCardSubmit = (e) => {
    e.preventDefault()
    const result = addCard({
      title: newTitle,
      description: newDesc,
      column: newColumn,
      division: newDivision,
      assignee: newAssignee || user?.name || 'Anggota Tim',
      points: Number(newPoints),
      priority: newPriority,
      deadline: newDeadline || new Date().toISOString().split('T')[0],
    })

    if (!result.success) {
      setDeniedActionMessage({
        title: 'Gagal Menambahkan Card',
        message: result.error,
        requiredPermission: 'create:card',
      })
      setIsAddModalOpen(false)
      return
    }

    // Reset Form
    setNewTitle('')
    setNewDesc('')
    setIsAddModalOpen(false)
  }

  // Handle Hapus Card (useCallback untuk stabilitas referensi)
  const handleDeleteCard = useCallback(
    (cardId, cardTitle) => {
      if (!can('delete', 'card')) {
        setDeniedActionMessage({
          title: 'Izin Ditolak: Tidak Dapat Menghapus Card',
          message: `Berdasarkan aturan sistem (PBI-001), peran Alumni Reviewer dilarang menghapus card ("${cardTitle}").`,
          requiredPermission: 'delete:card',
        })
        return
      }

      if (window.confirm(`Hapus card "${cardTitle}"?`)) {
        deleteCard(cardId)
      }
    },
    [can, deleteCard]
  )

  // Handle Pindah Kolom (useCallback untuk stabilitas referensi)
  const handleMoveColumn = useCallback(
    (cardId, currentColumn, nextColumn) => {
      if (!can('move', 'card')) {
        setDeniedActionMessage({
          title: 'Izin Ditolak: Tidak Dapat Memindahkan Card',
          message: 'Peran Alumni Reviewer tidak diizinkan memindahkan kolom status card.',
          requiredPermission: 'move:card',
        })
        return
      }
      moveCard(cardId, nextColumn)
    },
    [can, moveCard]
  )

  // Filter Cards (useMemo)
  const filteredCards = useMemo(() => {
    if (divisionFilter === 'All') return boardCards
    return boardCards.filter((card) => card.division === divisionFilter)
  }, [boardCards, divisionFilter])

  // Unique divisions for filter (useMemo)
  const divisions = useMemo(() => {
    return ['All', ...new Set(boardCards.map((c) => c.division).filter(Boolean))]
  }, [boardCards])

  // Pre-calculated Column Data & Story Points Load (useMemo)
  const columnData = useMemo(() => {
    return COLUMNS.map((colName) => {
      const colCards = filteredCards.filter((c) => c.column === colName)
      const conf = STAGE_CONFIG[colName]
      const totalPoints = colCards.reduce((acc, c) => acc + (Number(c.points) || 0), 0)
      return {
        colName,
        colCards,
        conf,
        totalPoints,
      }
    })
  }, [filteredCards])

  const canMove = can('move', 'card')
  const canDelete = can('delete', 'card')

  return (
    <div className="wrap page-container board-paddock-root">
      {/* Access Denied Banner jika aksi dilarang */}
      {deniedActionMessage && (
        <div style={{ marginBottom: '24px' }}>
          <AccessDenied
            title={deniedActionMessage.title}
            message={deniedActionMessage.message}
            requiredPermission={deniedActionMessage.requiredPermission}
            onClose={() => setDeniedActionMessage(null)}
          />
        </div>
      )}

      {/* Header & Controls HUD */}
      <div className="page-header board-hud-header">
        <div className="board-header-left">
          <div className="board-header-tagline">
            <span className="paddock-tag">PADDOCK OPS</span>
            <span className="font-mono text-muted">//</span>
            <span className="font-mono text-muted">STAGE ENTRY CONTROLLER</span>
          </div>
          <h1 className="page-title board-main-title">
            Papan Kanban Sprint 1
          </h1>
          <p className="page-subtitle">
            Alur eksekusi komponen sasis, powertrain hidrogen, dan telemetri Antasena Falcon 2.0.
          </p>
        </div>

        <div className="board-controls-wrap">
          {/* Filter Divisi */}
          <div className="board-filter-group">
            <label htmlFor="divFilter" className="hud-filter-label font-mono">
              DIVISI:
            </label>
            <select
              id="divFilter"
              className="input-field hud-select"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Tambah Card */}
          <ActionButton
            variant="primary"
            className="hud-add-btn"
            onClick={handleOpenAddModal}
            title={can('create', 'card') ? 'Buat card tugas baru' : 'Alumni Reviewer dilarang membuat card'}
          >
            + Tambah Card
          </ActionButton>

          {/* Tombol Reset Data */}
          <ActionButton
            variant="secondary"
            size="sm"
            className="hud-reset-btn"
            onClick={resetToSeed}
            title="Kembalikan data card ke bawaan awal"
          >
            Reset Seed
          </ActionButton>
        </div>
      </div>

      {/* Board 4 Kolom : Gran Turismo Race Entry Stage Cards */}
      <div className="kanban-grid gt-stage-grid">
        {columnData.map(({ colName, colCards, conf, totalPoints }) => (
          <KanbanColumn
            key={colName}
            colName={colName}
            colCards={colCards}
            conf={conf}
            totalPoints={totalPoints}
            canMove={canMove}
            canDelete={canDelete}
            onMove={handleMoveColumn}
            onDelete={handleDeleteCard}
          />
        ))}
      </div>

      {/* Modal Tambah Card Baru */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <HudPanel className="modal-card hud-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                  PADDOCK DISPATCH // NEW TASK
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>Tambah Card Baru</h2>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCardSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Judul Card:</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Contoh: Analisis Hambatan Aerodinamis Fairing HydroX"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Pekerjaan:</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Detail acceptance criteria atau instruksi pengerjaan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ minHeight: '80px', padding: '8px 12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Kolom Awal:</label>
                  <select
                    className="input-field"
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                  >
                    {COLUMNS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Divisi:</label>
                  <select
                    className="input-field"
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Powertrain & Electrical">Powertrain & Electrical</option>
                    <option value="Body & Frame">Body & Frame</option>
                    <option value="Vehicle Dynamics">Vehicle Dynamics</option>
                    <option value="Fuel Cell">Fuel Cell</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Prioritas (MoSCoW):</label>
                  <select
                    className="input-field"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Must">Must Have</option>
                    <option value="Should">Should Have</option>
                    <option value="Could">Could Have</option>
                    <option value="Won't">Won't Have</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimasi Poin (Fibonacci):</label>
                  <select
                    className="input-field"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                  >
                    <option value={1}>1 pt</option>
                    <option value={2}>2 pt</option>
                    <option value={3}>3 pt</option>
                    <option value={5}>5 pt</option>
                    <option value={8}>8 pt</option>
                    <option value={13}>13 pt</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Penanggung Jawab:</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nama anggota tim..."
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tenggat Waktu (Deadline):</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <ActionButton
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </ActionButton>
                <ActionButton type="submit" variant="primary">
                  Simpan Card
                </ActionButton>
              </div>
            </form>
          </HudPanel>
        </div>
      )}
    </div>
  )
}
