import React, { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import {
  SEED_BACKLOG,
  SEED_BOARD_CARDS,
  SEED_TELEMETRY_RUNS,
  SEED_VAULT_DOCUMENTS,
} from '../data/seedData.js'
import { useAuth } from './AuthContext.jsx'

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

  // Mutasi: Pindahkan Kolom Card
  const moveCard = (cardId, targetColumn) => {
    if (!can('move', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Alumni Reviewer tidak dapat memindahkan card.',
      }
    }

    const now = new Date().toISOString()
    setBoardCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              column: targetColumn,
              updatedAt: now,
              history: [
                ...(card.history || []),
                {
                  from: card.column,
                  to: targetColumn,
                  movedAt: now,
                },
              ],
            }
          : card
      )
    )
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
      owner: newItemData.owner || 'Tim Antasena',
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
      author: newDocData.author || 'Tim Riset Antasena',
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
        'Abstrak riset teknologi rekayasa kendaraan Antasena.',
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
