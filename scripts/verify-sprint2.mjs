import {
  checkPermission,
  ROLES,
  getDodStatus,
  canMoveToDone,
  getBlockers,
  isBlocked,
  wouldCreateCycle,
  getAverageRating,
  getApprovalState,
} from '../src/utils/index.js'
import { SEED_BACKLOG } from '../src/data/seedData.js'

console.log('=================================================================')
console.log('   VERIFIKASI SPRINT 2: PBI-007 s.d. PBI-012                     ')
console.log('=================================================================')

let passed = 0
function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`)
    passed++
  } else {
    console.error(`❌ [FAIL] ${message}`)
    process.exit(1)
  }
}

const { ADMIN_PO: PO, TEAM_MEMBER: TEAM, ALUMNI_REVIEWER: ALUMNI } = ROLES
const template = (SEED_BACKLOG.dod || []).map((text, i) => ({ id: `dod-${i + 1}`, text }))
const allChecked = Object.fromEntries(template.map((t) => [t.id, { by: 'Tester', at: '2026-11-26T00:00:00Z' }]))

console.log('\n--- PBI-007: Komentar ---')
assert([PO, TEAM, ALUMNI].every((r) => checkPermission(r, 'comment', 'card')), 'Semua peran login dapat berkomentar')

console.log('\n--- PBI-008: Review alumni ---')
assert(checkPermission(ALUMNI, 'review', 'card') && checkPermission(PO, 'review', 'card'), 'Alumni Reviewer & PO dapat mereview')
assert(!checkPermission(TEAM, 'review', 'card'), 'Anggota Tim tidak mereview hasil kerjanya sendiri')
assert(getAverageRating({ reviews: [{ rating: 4 }, { rating: 5 }] }) === 4.5, 'Rata-rata rating dihitung (4,5)')
assert(getAverageRating({}) === null, 'Tanpa review, rata-rata kosong')

console.log('\n--- PBI-009: Persetujuan PO / mitra ---')
assert(checkPermission(PO, 'approve', 'card') && checkPermission(ALUMNI, 'approve', 'card'), 'PO & mitra (Alumni Reviewer) dapat menyetujui')
assert(!checkPermission(TEAM, 'approve', 'card'), 'Anggota Tim tidak dapat menyetujui')
assert(getApprovalState({ column: 'Review' }) === 'pending', 'Card di Review tanpa keputusan = Menunggu Persetujuan')
const unapproved = canMoveToDone({ dodChecks: allChecked }, template)
assert(!unapproved.allowed && unapproved.reasons.some((r) => r.includes('disetujui')), 'Done ditolak jika belum disetujui')

console.log('\n--- PBI-010: Checklist DoD ---')
assert(template.length === 5, 'Template DoD umum berisi 5 poin dari Product Backlog')
assert(getDodStatus({}, template).total === 5, 'Checklist DoD otomatis tersedia di setiap card')
assert(checkPermission(TEAM, 'check', 'dod') && checkPermission(PO, 'check', 'dod'), 'Anggota tim & PO dapat mencentang DoD')
assert(!checkPermission(ALUMNI, 'check', 'dod'), 'Alumni tidak mencentang DoD')
assert(checkPermission(PO, 'manage', 'dod') && !checkPermission(TEAM, 'manage', 'dod') && !checkPermission(ALUMNI, 'manage', 'dod'), 'Hanya PO yang dapat mengubah isi checklist DoD')

console.log('\n--- PBI-011: Gatekeeper Done ---')
const partial = { dodChecks: { 'dod-1': allChecked['dod-1'] }, approval: { decision: 'approved' } }
const gate = canMoveToDone(partial, template)
assert(!gate.allowed, 'Perpindahan ke Done ditolak jika ada checklist belum dicentang')
assert(gate.reasons[0].includes(template[1].text) && gate.reasons[0].includes('1/5'), 'Pesan penolakan menyebut item yang belum terpenuhi')
assert(canMoveToDone({ dodChecks: allChecked, approval: { decision: 'approved' } }, template).allowed, 'DoD lengkap + disetujui = boleh Done')
assert(getDodStatus({ dodChecks: allChecked }, template).items[0].check.by === 'Tester', 'Siapa yang mencentang & kapan tercatat')

console.log('\n--- PBI-012: Dependensi ---')
const cards = [
  { id: 'A', column: 'In Progress', dependsOn: ['B'] },
  { id: 'B', column: 'To Do', dependsOn: ['C'] },
  { id: 'C', column: 'Done' },
]
assert(isBlocked(cards[0], cards) && getBlockers(cards[0], cards)[0].id === 'B', 'Card yang menunggu card belum-Done ditandai Terblokir')
assert(!isBlocked(cards[1], cards), 'Card yang menunggu card Done tidak terblokir')
assert(wouldCreateCycle('C', 'A', cards), 'Dependensi melingkar tidak langsung (C→A→B→C) ditolak')
assert(wouldCreateCycle('A', 'A', cards), 'Dependensi ke diri sendiri ditolak')
assert(!wouldCreateCycle('C', 'D', [...cards, { id: 'D', column: 'To Do' }]), 'Dependensi valid diterima')

console.log(`\n🎉 Semua ${passed} pengujian Sprint 2 lulus.`)
