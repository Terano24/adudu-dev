/**
 * Aturan bisnis card Sprint 2 (fungsi murni, mudah diuji):
 * - PBI-010/011: Checklist DoD & gatekeeper status Done
 * - PBI-009: Persetujuan PO/mitra sebelum Done
 * - PBI-012: Dependensi antar card, status Terblokir, tolak dependensi melingkar
 * - PBI-008: Rata-rata rating review
 */

export const DONE_COLUMN = 'Done'
export const REVIEW_COLUMN = 'Review'

/** Jumlah minimal poin DoD umum (PBI-010). */
export const MIN_DOD_ITEMS = 5

/** Status DoD sebuah card terhadap template DoD global. */
export function getDodStatus(card, template = []) {
  const checks = card?.dodChecks || {}
  const items = template.map((item) => ({
    ...item,
    check: checks[item.id] || null,
  }))
  const unchecked = items.filter((i) => !i.check)
  return {
    items,
    total: items.length,
    done: items.length - unchecked.length,
    unchecked,
    // Template kosong tidak boleh dianggap selesai (PBI-010/011).
    complete: items.length > 0 && unchecked.length === 0,
  }
}

/** Card baru tidak boleh langsung dibuat di kolom Done (PBI-009/011). */
export function canCreateCardInColumn(column) {
  return column !== DONE_COLUMN
}

/** PO tidak boleh menghapus poin DoD hingga di bawah 5 poin (PBI-010). */
export function canRemoveDodItem(template = []) {
  return template.length > MIN_DOD_ITEMS
}

/**
 * Approval hanya berlaku untuk satu siklus Review -> Done.
 * Transisi lain (termasuk kembali ke Review) mengosongkan approval lama.
 */
export function nextApproval(card, targetColumn) {
  const isReviewToDone =
    card?.column === REVIEW_COLUMN && targetColumn === DONE_COLUMN
  return isReviewToDone ? card.approval || null : null
}

/** Bersihkan referensi dependensi ke card yang sudah dihapus (PBI-012). */
export function stripCardDependencies(cards = [], removedId) {
  return cards.map((card) => {
    const deps = card.dependsOn || []
    if (!deps.includes(removedId)) return card
    return { ...card, dependsOn: deps.filter((id) => id !== removedId) }
  })
}

/** Card dependensi yang belum Done (penyebab status Terblokir). */
export function getBlockers(card, allCards = []) {
  const deps = card?.dependsOn || []
  return deps
    .map((id) => allCards.find((c) => c.id === id))
    .filter((dep) => dep && dep.column !== DONE_COLUMN)
}

export function isBlocked(card, allCards = []) {
  return getBlockers(card, allCards).length > 0
}

/**
 * True jika menambahkan dependensi `cardId -> dependsOnId` membuat siklus,
 * yaitu `dependsOnId` (langsung atau tidak langsung) sudah bergantung pada `cardId`.
 */
export function wouldCreateCycle(cardId, dependsOnId, allCards = []) {
  if (cardId === dependsOnId) return true
  const byId = new Map(allCards.map((c) => [c.id, c]))
  const stack = [dependsOnId]
  const seen = new Set()
  while (stack.length) {
    const current = stack.pop()
    if (current === cardId) return true
    if (seen.has(current)) continue
    seen.add(current)
    const deps = byId.get(current)?.dependsOn || []
    stack.push(...deps)
  }
  return false
}

/** Rata-rata rating review (null jika belum ada review). */
export function getAverageRating(card) {
  const reviews = card?.reviews || []
  if (reviews.length === 0) return null
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

/**
 * Gatekeeper perpindahan ke Done (PBI-011 + PBI-009).
 * Mengembalikan { allowed, reasons[] } dengan pesan yang menyebut item yang belum terpenuhi.
 */
export function canMoveToDone(card, template = []) {
  const reasons = []
  const dod = getDodStatus(card, template)
  if (dod.total === 0) {
    reasons.push(
      'Checklist DoD belum tersedia. Product Owner perlu menetapkan poin DoD terlebih dahulu.'
    )
  } else if (dod.total < MIN_DOD_ITEMS) {
    reasons.push(
      `Checklist DoD minimal ${MIN_DOD_ITEMS} poin (saat ini ${dod.total}). ` +
        'Product Owner perlu melengkapi checklist DoD.'
    )
  } else if (!dod.complete) {
    reasons.push(
      `Checklist DoD belum terpenuhi (${dod.done}/${dod.total}): ` +
        dod.unchecked.map((i) => `"${i.text}"`).join(', ')
    )
  }
  if (card?.approval?.decision !== 'approved') {
    reasons.push(
      card?.approval?.decision === 'revision'
        ? 'Card sedang diminta revisi oleh PO/mitra dan belum disetujui ulang.'
        : 'Card belum disetujui PO atau mitra di kolom Review.'
    )
  }
  return { allowed: reasons.length === 0, reasons }
}

/** Status persetujuan yang ditampilkan di card. */
export function getApprovalState(card) {
  if (card?.approval?.decision === 'approved') return 'approved'
  if (card?.approval?.decision === 'revision') return 'revision'
  if (card?.column === REVIEW_COLUMN) return 'pending'
  return null
}
