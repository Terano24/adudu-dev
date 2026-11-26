import React, { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import {
  SEED_BACKLOG,
  SEED_BOARD_CARDS,
  SEED_TELEMETRY_RUNS,
  SEED_VAULT_DOCUMENTS,
} from '../data/seedData.js'
import { useAuth } from './AuthContext.jsx'
import { canMoveToDone, wouldCreateCycle, DONE_COLUMN, REVIEW_COLUMN } from '../utils/index.js'

// Template DoD awal: 5 poin Definition of Done dari Product Backlog (PBI-010)
const SEED_DOD_TEMPLATE = (SEED_BACKLOG.dod || []).map((text, i) => ({
  id: `dod-${i + 1}`,
  text,
}))

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function formatGateError(reasons) {
  return 'Card tidak dapat dipindahkan ke Done. ' + reasons.join(' ')
}

const DataContext = createContext()

export function DataProvider({ children }) {
  const { can, user } = useAuth()

  // 1. Board Cards State (Persisted in LocalStorage)
  const [boardCards, setBoardCards] = useLocalStorage(
    'antasena_board_cards',
    SEED_BOARD_CARDS
  )

  // 2. Backlog Items & Epics (from backlog.json)
  const [backlogItems, setBacklogItems] = useLocalStorage(
    'antasena_backlog_items',
    SEED_BACKLOG.items || []
  )
  const [epics] = useState(SEED_BACKLOG.epics || [])

  // 3. Telemetry Runs
  const [telemetryRuns, setTelemetryRuns] = useLocalStorage(
    'antasena_telemetry_runs',
    SEED_TELEMETRY_RUNS
  )

  // 4. Knowledge Vault Documents
  const [vaultDocs, setVaultDocs] = useLocalStorage(
    'antasena_vault_docs',
    SEED_VAULT_DOCUMENTS
  )

  // 5. Template Checklist DoD global (PBI-010)
  const [dodTemplate, setDodTemplate] = useLocalStorage(
    'antasena_dod_template',
    SEED_DOD_TEMPLATE
  )

  const actor = () => ({
    username: user?.username || 'anon',
    name: user?.name || 'Pengguna',
    role: user?.role || '-',
  })

  const patchCard = (cardId, patchFn) => {
    setBoardCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, ...patchFn(card) } : card))
    )
  }

  const findCard = (cardId) => boardCards.find((c) => c.id === cardId)

  // Mutasi: Tambah Card (dengan validasi RBAC PBI-001)
  const addCard = (newCardData) => {
    if (!can('create', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Peran Anda (Alumni Reviewer) tidak diizinkan untuk membuat card baru.',
      }
    }

    const card = {
      id: 'CARD-' + String(Date.now()).slice(-4),
      title: newCardData.title || 'Judul Card Baru',
      description: newCardData.description || '',
      column: newCardData.column || 'To Do',
      division: newCardData.division || 'Programming',
      assignee: newCardData.assignee || 'Belum Ditugaskan',
      points: Number(newCardData.points) || 5,
      priority: newCardData.priority || 'Must',
      deadline: newCardData.deadline || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }

    setBoardCards((prev) => [card, ...prev])
    return { success: true, card }
  }

  // Mutasi: Hapus Card (dengan validasi RBAC PBI-001)
  const deleteCard = (cardId) => {
    if (!can('delete', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Peran Anda (Alumni Reviewer) tidak diizinkan untuk menghapus card.',
      }
    }

    setBoardCards((prev) => prev.filter((c) => c.id !== cardId))
    return { success: true }
  }

  // Mutasi: Update Card (PBI-002: Card dapat dibuat, diubah, dan dihapus)
  const updateCard = (cardId, updatedData) => {
    if (!can('edit', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Peran Anda (Alumni Reviewer) tidak diizinkan untuk mengubah card.',
      }
    }

    const current = findCard(cardId)
    if (current && updatedData.column && updatedData.column !== current.column) {
      return moveCardThenUpdate(current, updatedData)
    }

    setBoardCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : card
      )
    )
    return { success: true }
  }

  // Perpindahan kolom dengan gatekeeper Done (PBI-011) & persetujuan (PBI-009)
  const applyMove = (card, targetColumn) => {
    const now = new Date().toISOString()
    const leavingReview = card.column === REVIEW_COLUMN && targetColumn !== DONE_COLUMN
    return {
      column: targetColumn,
      updatedAt: now,
      // Persetujuan berlaku untuk satu siklus Review; keluar Review (selain ke Done) meresetnya
      approval: leavingReview ? null : card.approval || null,
      history: [
        ...(card.history || []),
        { from: card.column, to: targetColumn, movedAt: now, by: actor().name },
      ],
    }
  }

  const validateMove = (card, targetColumn) => {
    if (targetColumn === DONE_COLUMN && card.column !== DONE_COLUMN) {
      const gate = canMoveToDone(card, dodTemplate)
      if (!gate.allowed) {
        return { success: false, gate: true, reasons: gate.reasons, error: formatGateError(gate.reasons) }
      }
    }
    return { success: true }
  }

  // Mutasi: Pindahkan Kolom Card
  const moveCard = (cardId, targetColumn) => {
    if (!can('move', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Alumni Reviewer tidak dapat memindahkan card.',
      }
    }

    const card = findCard(cardId)
    if (!card || card.column === targetColumn) return { success: true }

    const check = validateMove(card, targetColumn)
    if (!check.success) return check

    patchCard(cardId, (c) => applyMove(c, targetColumn))
    return { success: true }
  }

  const moveCardThenUpdate = (card, updatedData) => {
    const check = validateMove(card, updatedData.column)
    if (!check.success) return check
    patchCard(card.id, (c) => ({
      ...updatedData,
      ...applyMove(c, updatedData.column),
    }))
    return { success: true }
  }

  // ---------------- PBI-007: Komentar ----------------
  const addComment = (cardId, text) => {
    const clean = (text || '').trim()
    if (!user) return { success: false, error: 'Silakan login untuk berkomentar.' }
    if (!clean) return { success: false, error: 'Komentar tidak boleh kosong.' }
    const comment = { id: newId('cmt'), ...actor(), text: clean, createdAt: new Date().toISOString() }
    patchCard(cardId, (c) => ({ comments: [...(c.comments || []), comment] }))
    return { success: true, comment }
  }

  const deleteComment = (cardId, commentId) => {
    const card = findCard(cardId)
    const comment = card?.comments?.find((c) => c.id === commentId)
    if (!comment) return { success: false, error: 'Komentar tidak ditemukan.' }
    if (comment.username !== user?.username) {
      return { success: false, error: 'Anda hanya dapat menghapus komentar milik sendiri.' }
    }
    patchCard(cardId, (c) => ({ comments: (c.comments || []).filter((x) => x.id !== commentId) }))
    return { success: true }
  }

  // ---------------- PBI-008: Review alumni ----------------
  const upsertReview = (cardId, rating, note) => {
    if (!can('review', 'card')) {
      return { success: false, error: 'Hanya Alumni Reviewer atau PO yang dapat memberi review.' }
    }
    const card = findCard(cardId)
    if (!card || ![REVIEW_COLUMN, DONE_COLUMN].includes(card.column)) {
      return { success: false, error: 'Review hanya dapat dibuat pada card berstatus Review atau Done.' }
    }
    const value = Number(rating)
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return { success: false, error: 'Rating wajib dipilih (1-5).' }
    }
    const cleanNote = (note || '').trim()
    if (!cleanNote) return { success: false, error: 'Catatan review wajib diisi.' }

    const me = actor()
    const now = new Date().toISOString()
    patchCard(cardId, (c) => {
      const reviews = c.reviews || []
      const existing = reviews.find((r) => r.username === me.username)
      const next = existing
        ? reviews.map((r) =>
            r.username === me.username ? { ...r, rating: value, note: cleanNote, updatedAt: now } : r
          )
        : [...reviews, { ...me, rating: value, note: cleanNote, createdAt: now }]
      return { reviews: next }
    })
    return { success: true, updated: !!card.reviews?.some((r) => r.username === me.username) }
  }

  // ---------------- PBI-009: Persetujuan PO / mitra ----------------
  const decideApproval = (cardId, decision, reason) => {
    if (!can('approve', 'card')) {
      return { success: false, error: 'Hanya PO atau mitra (Alumni Reviewer) yang dapat memberi persetujuan.' }
    }
    const card = findCard(cardId)
    if (!card || card.column !== REVIEW_COLUMN) {
      return { success: false, error: 'Persetujuan hanya dapat diberikan pada card di kolom Review.' }
    }
    if (!['approved', 'revision'].includes(decision)) {
      return { success: false, error: 'Keputusan tidak dikenal.' }
    }
    const cleanReason = (reason || '').trim()
    if (!cleanReason) return { success: false, error: 'Alasan keputusan wajib diisi.' }

    const entry = { decision, reason: cleanReason, ...actor(), at: new Date().toISOString() }
    patchCard(cardId, (c) => ({
      approval: entry,
      approvalLog: [...(c.approvalLog || []), entry],
    }))
    return { success: true }
  }

  // ---------------- PBI-010/011: Checklist DoD ----------------
  const toggleDodItem = (cardId, itemId) => {
    if (!can('check', 'dod')) {
      return { success: false, error: 'Hanya anggota tim atau PO yang dapat mencentang checklist DoD.' }
    }
    const me = actor()
    patchCard(cardId, (c) => {
      const checks = { ...(c.dodChecks || {}) }
      if (checks[itemId]) delete checks[itemId]
      else checks[itemId] = { by: me.name, role: me.role, at: new Date().toISOString() }
      return { dodChecks: checks }
    })
    return { success: true }
  }

  const requireDodManager = () =>
    can('manage', 'dod') ? null : { success: false, error: 'Hanya Product Owner yang dapat mengubah isi checklist DoD.' }

  const addDodItem = (text) => {
    const denied = requireDodManager()
    if (denied) return denied
    const clean = (text || '').trim()
    if (!clean) return { success: false, error: 'Teks poin DoD tidak boleh kosong.' }
    setDodTemplate((prev) => [...prev, { id: newId('dod'), text: clean }])
    return { success: true }
  }

  const updateDodItem = (itemId, text) => {
    const denied = requireDodManager()
    if (denied) return denied
    const clean = (text || '').trim()
    if (!clean) return { success: false, error: 'Teks poin DoD tidak boleh kosong.' }
    setDodTemplate((prev) => prev.map((i) => (i.id === itemId ? { ...i, text: clean } : i)))
    return { success: true }
  }

  const removeDodItem = (itemId) => {
    const denied = requireDodManager()
    if (denied) return denied
    setDodTemplate((prev) => prev.filter((i) => i.id !== itemId))
    return { success: true }
  }

  // ---------------- PBI-012: Dependensi antar card ----------------
  const addDependency = (cardId, dependsOnId) => {
    if (!can('edit', 'card')) {
      return { success: false, error: 'Peran Anda tidak diizinkan mengubah dependensi card.' }
    }
    const card = findCard(cardId)
    const target = findCard(dependsOnId)
    if (!card || !target) return { success: false, error: 'Card dependensi tidak ditemukan.' }
    if ((card.dependsOn || []).includes(dependsOnId)) {
      return { success: false, error: `${cardId} sudah bergantung pada ${dependsOnId}.` }
    }
    if (wouldCreateCycle(cardId, dependsOnId, boardCards)) {
      return {
        success: false,
        error: `Dependensi melingkar ditolak: ${dependsOnId} sudah (langsung atau tidak langsung) bergantung pada ${cardId}.`,
      }
    }
    patchCard(cardId, (c) => ({ dependsOn: [...(c.dependsOn || []), dependsOnId] }))
    return { success: true }
  }

  const removeDependency = (cardId, dependsOnId) => {
    if (!can('edit', 'card')) {
      return { success: false, error: 'Peran Anda tidak diizinkan mengubah dependensi card.' }
    }
    patchCard(cardId, (c) => ({ dependsOn: (c.dependsOn || []).filter((id) => id !== dependsOnId) }))
    return { success: true }
  }

  // Mutasi: Update Prioritas User Story (Hanya Product Owner / Admin - PBI-005)
  const updateBacklogPriority = (itemId, newPriority) => {
    if (user?.role !== 'Admin/PO') {
      return {
        success: false,
        error:
          'Akses Ditolak: Hanya Product Owner (Admin/PO) yang berhak mengubah prioritas User Story (Kriteria PBI-005).',
      }
    }

    setBacklogItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, priority: newPriority } : item
      )
    )
    return { success: true }
  }

  // Mutasi: Tambah User Story ke Backlog
  const addBacklogItem = (newItemData) => {
    if (!can('create', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Peran Anda (Alumni Reviewer) tidak diizinkan menambahkan User Story baru.',
      }
    }

    const nextIndex = backlogItems.length + 1
    const newId = `PBI-${String(nextIndex).padStart(3, '0')}`

    const item = {
      id: newId,
      epic: newItemData.epic || 'EPIC-1',
      title: newItemData.title || 'User Story Baru',
      priority: newItemData.priority || 'Must',
      points: Number(newItemData.points) || 5,
      sprint: Number(newItemData.sprint) || 1,
      status: newItemData.status || 'To Do',
      division: newItemData.division || 'Tim Product',
      owner: newItemData.owner || 'Tim SenaFlow',
      acceptance: newItemData.acceptance || [
        'Kriteria penerimaan awal telah didefinisikan oleh tim pengembang.',
      ],
      dependsOn: newItemData.dependsOn || [],
      rank: nextIndex,
    }

    setBacklogItems((prev) => [item, ...prev])
    return { success: true, item }
  }

  // Mutasi: Tambah Dokumen Vault
  const addVaultDoc = (newDocData) => {
    if (!can('create', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Peran Anda (Alumni Reviewer) tidak diizinkan menambahkan dokumen riset baru.',
      }
    }
    const nextIndex = vaultDocs.length + 1
    const newDoc = {
      id: `DOC-${String(nextIndex).padStart(3, '0')}`,
      title: newDocData.title || 'Dokumen Riset Baru',
      category: newDocData.category || 'Vehicle Dynamics',
      author: newDocData.author || 'Tim Riset SenaFlow',
      date:
        newDocData.date ||
        new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      year: Number(newDocData.year) || new Date().getFullYear(),
      status: 'Verified',
      tags: newDocData.tags || ['Research'],
      summary:
        newDocData.summary ||
        'Abstrak riset teknologi rekayasa kendaraan SenaFlow.',
      thumbType: newDocData.thumbType || 'suspension',
    }
    setVaultDocs((prev) => [newDoc, ...prev])
    return { success: true, doc: newDoc }
  }

  // Mutasi: Hapus Dokumen Vault
  const deleteVaultDoc = (docId) => {
    if (!can('delete', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Alumni Reviewer dilarang menghapus dokumen riset.',
      }
    }
    setVaultDocs((prev) => prev.filter((d) => d.id !== docId))
    return { success: true }
  }

  // Reset data ke default seed
  const resetToSeed = () => {
    setBoardCards(SEED_BOARD_CARDS)
    setBacklogItems(SEED_BACKLOG.items || [])
    setTelemetryRuns(SEED_TELEMETRY_RUNS)
    setVaultDocs(SEED_VAULT_DOCUMENTS)
    setDodTemplate(SEED_DOD_TEMPLATE)
    localStorage.removeItem('antasena_dod_template')
    localStorage.removeItem('antasena_board_cards')
    localStorage.removeItem('antasena_backlog_items')
    localStorage.removeItem('antasena_telemetry_runs')
    localStorage.removeItem('antasena_vault_docs')
  }

  return (
    <DataContext.Provider
      value={{
        boardCards,
        backlogItems,
        epics,
        telemetryRuns,
        vaultDocs,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        dodTemplate,
        addComment,
        deleteComment,
        upsertReview,
        decideApproval,
        toggleDodItem,
        addDodItem,
        updateDodItem,
        removeDodItem,
        addDependency,
        removeDependency,
        addBacklogItem,
        updateBacklogPriority,
        addVaultDoc,
        deleteVaultDoc,
        resetToSeed,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
