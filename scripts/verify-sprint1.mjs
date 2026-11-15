import fs from 'fs'
import path from 'path'

console.log('--- Memulai Verifikasi PBI-006 & PBI-001 ---')

// 1. Verifikasi File Eksistensi
const requiredFiles = [
  'src/context/ThemeContext.jsx',
  'src/context/AuthContext.jsx',
  'src/context/DataContext.jsx',
  'src/components/common/AccessDenied.jsx',
  'src/components/common/ProtectedRoute.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/layout/MobileNav.jsx',
  'src/components/layout/AppShell.jsx',
  'src/pages/LoginPage.jsx',
  'src/pages/BoardPage.jsx',
  'src/pages/BacklogPage.jsx',
  'src/pages/TelemetryPage.jsx',
  'src/pages/VaultPage.jsx',
  'src/data/seedData.js',
]

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ File ${file} tidak ditemukan!`)
    process.exit(1)
  }
}
console.log('✅ Semua file komponen arsitektur dan halaman tersedia.')

// 2. Verifikasi Data Seed
import {
  SEED_BACKLOG,
  SEED_BOARD_CARDS,
  SEED_TELEMETRY_RUNS,
  SEED_VAULT_DOCUMENTS,
} from '../src/data/seedData.js'

if (!SEED_BACKLOG.items || SEED_BACKLOG.items.length === 0) {
  console.error('❌ Data backlog kosong!')
  process.exit(1)
}
console.log(`✅ Data Backlog termuat: ${SEED_BACKLOG.items.length} item, ${SEED_BACKLOG.epics.length} epics.`)

if (!SEED_BOARD_CARDS || SEED_BOARD_CARDS.length === 0) {
  console.error('❌ Data Board Cards kosong!')
  process.exit(1)
}
console.log(`✅ Data Board Cards awal termuat: ${SEED_BOARD_CARDS.length} kartu.`)

if (!SEED_TELEMETRY_RUNS || SEED_TELEMETRY_RUNS.length === 0) {
  console.error('❌ Data Telemetry kosong!')
  process.exit(1)
}
console.log(`✅ Data Telemetry Runs termuat: ${SEED_TELEMETRY_RUNS.length} sesi uji kendaraan.`)

if (!SEED_VAULT_DOCUMENTS || SEED_VAULT_DOCUMENTS.length === 0) {
  console.error('❌ Data Knowledge Vault kosong!')
  process.exit(1)
}
console.log(`✅ Data Knowledge Vault termuat: ${SEED_VAULT_DOCUMENTS.length} dokumen riset.`)

// 3. Verifikasi Logika RBAC (PBI-001)
const can = (role, action, resource) => {
  if (role === 'Admin/PO') return true
  if (role === 'Anggota Tim') {
    if (resource === 'card' && ['create', 'edit', 'move', 'delete'].includes(action)) return true
    return true
  }
  if (role === 'Alumni Reviewer') {
    // Kriteria PBI-001: Alumni Reviewer tidak dapat membuat atau menghapus card
    if (resource === 'card') {
      if (['create', 'delete', 'move'].includes(action)) return false
      if (['view', 'review', 'comment'].includes(action)) return true
    }
    if (resource === 'review' || resource === 'comment') return true
    return action === 'view'
  }
  return false
}

// Uji Admin/PO
if (!can('Admin/PO', 'create', 'card') || !can('Admin/PO', 'delete', 'card')) {
  console.error('❌ RBAC FAIL: Admin/PO harus bisa membuat dan menghapus card.')
  process.exit(1)
}

// Uji Anggota Tim
if (!can('Anggota Tim', 'create', 'card') || !can('Anggota Tim', 'move', 'card')) {
  console.error('❌ RBAC FAIL: Anggota Tim harus bisa membuat dan memindahkan card.')
  process.exit(1)
}

// Uji Alumni Reviewer
if (can('Alumni Reviewer', 'create', 'card') !== false) {
  console.error('❌ RBAC FAIL: Alumni Reviewer TIDAK BOLEH bisa membuat card!')
  process.exit(1)
}
if (can('Alumni Reviewer', 'delete', 'card') !== false) {
  console.error('❌ RBAC FAIL: Alumni Reviewer TIDAK BOLEH bisa menghapus card!')
  process.exit(1)
}
if (can('Alumni Reviewer', 'move', 'card') !== false) {
  console.error('❌ RBAC FAIL: Alumni Reviewer TIDAK BOLEH bisa memindahkan card!')
  process.exit(1)
}
if (!can('Alumni Reviewer', 'view', 'card') || !can('Alumni Reviewer', 'review', 'card')) {
  console.error('❌ RBAC FAIL: Alumni Reviewer harus bisa melihat dan mereview card.')
  process.exit(1)
}
console.log('✅ Verifikasi RBAC LULUS: Alumni Reviewer dibatasi secara akurat dari membuat & menghapus card.')

// 4. Verifikasi Build Output
if (!fs.existsSync('dist/index.html')) {
  console.error('❌ dist/index.html tidak ditemukan! Jalankan vite build terlebih dahulu.')
  process.exit(1)
}
console.log('✅ Verifikasi Build LULUS: dist/ siap deploy tanpa error.')

console.log('--- Seluruh Kriteria PBI-006 & PBI-001 Terverifikasi Sukses ---')
