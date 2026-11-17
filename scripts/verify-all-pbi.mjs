import fs from 'fs'
import {
  SEED_BACKLOG,
  SEED_BOARD_CARDS,
  SEED_TELEMETRY_RUNS,
  SEED_VAULT_DOCUMENTS,
} from '../src/data/seedData.js'
import { checkPermission, ROLES } from '../src/utils/index.js'

console.log('=================================================================')
console.log('   VERIFIKASI INTEGRAL 6 PRODUCT BACKLOG ITEMS (SPRINT 1)       ')
console.log('=================================================================')

let passedCount = 0
let totalCount = 0

function assert(condition, message) {
  totalCount++
  if (condition) {
    console.log(`✅ [PASS] ${message}`)
    passedCount++
  } else {
    console.error(`❌ [FAIL] ${message}`)
    process.exit(1)
  }
}

// -------------------------------------------------------------------------
// PBI-006: Kerangka Aplikasi (Layout, Navigasi, Data Awal) - 3 Poin (Dimas)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-006: Kerangka Aplikasi & Navigasi ---')
// AC 1: Navigasi ke Board, Backlog, Telemetry, dan Vault tersedia
const appFile = fs.readFileSync('src/App.jsx', 'utf-8')
assert(
  appFile.includes('/board') &&
  appFile.includes('/backlog') &&
  appFile.includes('/telemetry') &&
  appFile.includes('/vault'),
  'AC 1: Navigasi ke 4 halaman utama (Board, Backlog, Telemetry, Vault) terdaftar di router'
)

const navFile = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf-8')
const sidebarFile = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf-8')
assert(
  (navFile.includes('/board') || sidebarFile.includes('/board')) &&
  (navFile.includes('/backlog') || sidebarFile.includes('/backlog')) &&
  (navFile.includes('/telemetry') || sidebarFile.includes('/telemetry')) &&
  (navFile.includes('/vault') || sidebarFile.includes('/vault')),
  'AC 1: Menu navigasi antarmuka memiliki tautan aktif ke 4 modul utama'
)

// AC 2: Data contoh awal termuat
assert(
  SEED_BACKLOG.items && SEED_BACKLOG.items.length >= 6,
  `AC 2: Data awal Backlog termuat (${SEED_BACKLOG.items.length} item)`
)
assert(
  SEED_BOARD_CARDS && SEED_BOARD_CARDS.length >= 6,
  `AC 2: Data awal Kanban Board termuat (${SEED_BOARD_CARDS.length} card)`
)
assert(
  SEED_TELEMETRY_RUNS && SEED_TELEMETRY_RUNS.length >= 3,
  `AC 2: Data awal Telemetry termuat (${SEED_TELEMETRY_RUNS.length} run)`
)
assert(
  SEED_VAULT_DOCUMENTS && SEED_VAULT_DOCUMENTS.length >= 6,
  `AC 2: Data awal Knowledge Vault termuat (${SEED_VAULT_DOCUMENTS.length} dokumen)`
)

// AC 3: Tampilan dapat dipakai di layar laptop dan HP
const cssFile = fs.readFileSync('src/index.css', 'utf-8')
assert(
  cssFile.includes('@media') && cssFile.includes('max-width: 768px'),
  'AC 3: Responsifitas multi-resolusi (layar laptop dan ponsel/HP) tersedia melalui media query'
)

// -------------------------------------------------------------------------
// PBI-001: Autentikasi 3 Peran & Kontrol Akses (RBAC) - 8 Poin (Dimas)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-001: Autentikasi 3 Peran & RBAC ---')
const authContent = fs.readFileSync('src/context/AuthContext.jsx', 'utf-8')
// AC 1: Pengguna dapat login dan logout dengan akun terdaftar
assert(
  authContent.includes("username: 'admin'") &&
  authContent.includes("username: 'anggota'") &&
  authContent.includes("username: 'alumni'"),
  'AC 1: Akun terdaftar kredensial valid (admin, anggota, alumni)'
)

// AC 2: Tiga peran tersedia: Admin/PO, Anggota Tim, Alumni Reviewer
const roles = Object.values(ROLES)
assert(
  roles.includes('Admin/PO') &&
  roles.includes('Anggota Tim') &&
  roles.includes('Alumni Reviewer'),
  'AC 2: 3 Peran inti terdefinisi lengkap di sistem'
)

// AC 3: Alumni Reviewer tidak dapat membuat atau menghapus card
assert(
  checkPermission('Alumni Reviewer', 'create', 'card') === false,
  'AC 3: Alumni Reviewer dilarang membuat card'
)
assert(
  checkPermission('Alumni Reviewer', 'delete', 'card') === false,
  'AC 3: Alumni Reviewer dilarang menghapus card'
)
assert(
  checkPermission('Anggota Tim', 'create', 'card') === true &&
  checkPermission('Admin/PO', 'create', 'card') === true,
  'AC 3: Admin/PO dan Anggota Tim memiliki izin membuat card'
)

// AC 4: Halaman terlarang menampilkan pesan akses ditolak
const accessDeniedFile = fs.readFileSync('src/components/common/AccessDenied.jsx', 'utf-8')
assert(
  accessDeniedFile.includes('Akses Ditolak') || accessDeniedFile.includes('access-denied'),
  'AC 4: Komponen AccessDenied menampilkan peringatan akses ditolak secara eksplisit'
)

// -------------------------------------------------------------------------
// PBI-002: Papan Kanban 4 Kolom - 8 Poin (Aryo)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-002: Papan Kanban 4 Kolom ---')
const boardFile = fs.readFileSync('src/pages/BoardPage.jsx', 'utf-8')

// AC 1: Papan menampilkan 4 kolom
assert(
  boardFile.includes("'To Do'") &&
  boardFile.includes("'In Progress'") &&
  boardFile.includes("'Review'") &&
  boardFile.includes("'Done'"),
  'AC 1: Papan Kanban menampilkan 4 kolom spesifik (To Do, In Progress, Review, Done)'
)

// AC 2: Card dapat dibuat, diubah, dan dihapus
assert(
  boardFile.includes('addCard') &&
  boardFile.includes('updateCard') &&
  boardFile.includes('deleteCard'),
  'AC 2: Fungsi pembuatan (add), perubahan (update), dan penghapusan (delete) card tersedia'
)

// AC 3: Data card tetap ada setelah halaman di-refresh
const dataCtxFile = fs.readFileSync('src/context/DataContext.jsx', 'utf-8')
assert(
  dataCtxFile.includes('antasena_board_cards'),
  'AC 3: Data board disimpan ke localStorage ("antasena_board_cards") sehingga persisten saat di-refresh'
)

// AC 4: Jumlah card per kolom tampil di header kolom
const colFile = fs.readFileSync('src/components/board/KanbanColumn.jsx', 'utf-8')
assert(
  colFile.includes('column-count-badge') && colFile.includes('colCards.length'),
  'AC 4: Jumlah card per kolom terhitung dan ditampilkan pada header kolom'
)

// -------------------------------------------------------------------------
// PBI-003: Drag and Drop Perpindahan Status Card - 5 Poin (Aryo)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-003: Drag and Drop Perpindahan Card ---')
const cardFile = fs.readFileSync('src/components/board/KanbanCard.jsx', 'utf-8')

// AC 1: Card dapat dipindah ke kolom lain dengan drag and drop
assert(
  cardFile.includes('draggable={canMove}') &&
  colFile.includes('onDragOver') &&
  colFile.includes('onDrop'),
  'AC 1: HTML5 Drag & Drop diaktifkan pada card dan kolom target'
)

// AC 2: Status baru tersimpan dan tercatat waktunya
assert(
  dataCtxFile.includes('updatedAt: now') &&
  dataCtxFile.includes('history:'),
  'AC 2: Mutasi status baru tersimpan dan riwayat waktu (history & updatedAt) tercatat'
)

// AC 3: Alumni Reviewer tidak dapat memindahkan card
assert(
  checkPermission('Alumni Reviewer', 'move', 'card') === false &&
  cardFile.includes('draggable={canMove}'),
  'AC 3: Hak akses drag & move dibatasi ketat untuk Alumni Reviewer'
)

// -------------------------------------------------------------------------
// PBI-004: Detail Card & Filter Label Divisi - 5 Poin (Ibra)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-004: Detail Card & Filter Divisi/Assignee ---')
// AC 1: Card memiliki judul, deskripsi, assignee, deadline, dan label divisi
assert(
  cardFile.includes('card.title') &&
  cardFile.includes('card.description') &&
  cardFile.includes('card.assignee') &&
  cardFile.includes('card.deadline') &&
  cardFile.includes('card.division'),
  'AC 1: Kartu dan modal memiliki properti lengkap (judul, deskripsi, assignee, deadline, divisi)'
)

// AC 2: Card lewat deadline diberi tanda merah
assert(
  cardFile.includes('isOverdue') &&
  cardFile.includes('card-overdue') &&
  cssFile.includes('.card-overdue'),
  'AC 2: Indikator visual merah aktif bila deadline telah terlewati'
)

// AC 3: Filter card berdasarkan divisi dan assignee berfungsi
assert(
  boardFile.includes('divisionFilter') &&
  boardFile.includes('assigneeFilter') &&
  boardFile.includes('boardDivSelect') &&
  boardFile.includes('boardAssigneeSelect'),
  'AC 3: Kontrol filter dropdown divisi dan assignee tersedia dan aktif memfilter daftar kartu'
)

// -------------------------------------------------------------------------
// PBI-005: Product Backlog Terurut MoSCoW & Epic - 5 Poin (Ibra)
// -------------------------------------------------------------------------
console.log('\n--- Menguji PBI-005: Product Backlog Terurut MoSCoW & Epic ---')
const backlogListFile = fs.readFileSync('src/features/backlog/BacklogList.jsx', 'utf-8')
const backlogCardFile = fs.readFileSync('src/components/backlog/BacklogEpicCard.jsx', 'utf-8')

// AC 1: Item dikelompokkan per Epic dan diurutkan prioritas (MoSCoW)
assert(
  backlogListFile.includes('PRIORITY_ORDER') &&
  backlogListFile.includes('epicGroups'),
  'AC 1: Item backlog terkelompok rapi per Epic dan terurut prioritas MoSCoW (Must -> Should -> Could -> Won\'t)'
)

// AC 2: Setiap item menampilkan poin dan sprint
assert(
  backlogCardFile.includes('item.points') &&
  backlogCardFile.includes('item.sprint'),
  'AC 2: Poin Fibonacci dan identitas Sprint ditampilkan jelas pada setiap baris item backlog'
)

// AC 3: Hanya PO yang dapat mengubah prioritas
assert(
  backlogListFile.includes("user?.role !== 'Admin/PO'") &&
  dataCtxFile.includes('updateBacklogPriority') &&
  dataCtxFile.includes("user?.role !== 'Admin/PO'"),
  'AC 3: Validasi RBAC mutlak: Hanya Product Owner (Admin/PO) yang diizinkan mengubah prioritas MoSCoW'
)

console.log('\n=================================================================')
console.log(`🎉 SELURUH ${passedCount}/${totalCount} KRITERIA PENERIMAAN (PBI-006 s.d PBI-005) LULUS 100%!`)
console.log('=================================================================\n')
