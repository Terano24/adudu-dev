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
  const { can } = useAuth()

  // 1. Board Cards State (Persisted in LocalStorage)
  const [boardCards, setBoardCards] = useLocalStorage(
    'antasena_board_cards',
    SEED_BOARD_CARDS
  )

  // 2. Backlog Items & Epics (from backlog.json)
  const [backlogItems] = useState(SEED_BACKLOG.items || [])
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

  // Mutasi: Pindahkan Kolom Card
  const moveCard = (cardId, targetColumn) => {
    if (!can('move', 'card')) {
      return {
        success: false,
        error: 'Akses Ditolak: Alumni Reviewer tidak dapat memindahkan card.',
      }
    }

    setBoardCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, column: targetColumn, updatedAt: new Date().toISOString() }
          : card
      )
    )
    return { success: true }
  }

  // Reset data ke default seed
  const resetToSeed = () => {
    setBoardCards(SEED_BOARD_CARDS)
    setTelemetryRuns(SEED_TELEMETRY_RUNS)
    setVaultDocs(SEED_VAULT_DOCUMENTS)
    localStorage.removeItem('antasena_board_cards')
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
        deleteCard,
        moveCard,
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
