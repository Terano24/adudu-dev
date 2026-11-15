# Sprint 1 Foundation: PBI-006 (Kerangka Aplikasi) & PBI-001 (Auth & RBAC) Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Membangun kerangka aplikasi Antasena Unified Agile & Telemetry Platform yang responsif (laptop & HP), bernuansa technical racing anti-slop (Dual Theme), navigasi 4 halaman utama (Board, Backlog, Telemetry, Vault), autentikasi 3 peran dengan Quick Login, serta kontrol akses berbasis peran (RBAC) di mana Alumni Reviewer tidak dapat membuat atau menghapus card dan aksi terlarang memunculkan pesan Akses Ditolak yang jelas.

**Architecture:** Memakai React Context terpusat dan modular (`ThemeContext`, `AuthContext`, `DataContext`) dengan persistensi `localStorage`. Routing terproteksi menggunakan React Router v6 dengan `ProtectedRoute` dan kemampuan RBAC granular melalui helper `can(action, resource)`. Tampilan dirancang mematuhi aturan *design-taste-frontend* (high-contrast engineering palette, equal edges, responsive drawer, tap target min 44px, tanpa slop).

**Tech Stack:** React 18, React Router DOM v6, Vite, Vanilla CSS modern (CSS custom properties, flexbox, CSS grid).

---

### Task 1: Theme & Taste-Skill Design System Tokens & Base Styles
**Files:**
- Create: `src/context/ThemeContext.jsx`
- Modify: `src/index.css`

**Step 1:** Implementasi `ThemeContext.jsx` untuk mengelola tema `dark` (default) dan `light`, tersimpan di `localStorage`.
**Step 2:** Konfigurasi variabel CSS custom properties di `src/index.css` untuk Dark & Light mode (slate/cyan/emerald racing palette, tanpa warna terlarang violet/lavender), reset CSS modern, utilitas layout responsif, dan animasi mikro.
**Step 3:** Verifikasi sintaks dan CSS token.

---

### Task 2: Auth Context, Roles, Capabilities (RBAC) & Access Denied Component
**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/components/common/AccessDenied.jsx`
- Create: `src/components/common/ProtectedRoute.jsx`

**Step 1:** Buat `AuthContext.jsx` dengan definisi 3 peran (`Admin/PO`, `Anggota Tim`, `Alumni Reviewer`), status login user di `localStorage`, fungsi `login(role, username)`, `logout()`, dan evaluator izin `can(action, resource)`.
- Aturan izin:
  - `Admin/PO`: can create, edit, delete card, manage backlog.
  - `Anggota Tim`: can create card, edit card, move card, comment. Cannot delete others' critical assets.
  - `Alumni Reviewer`: READ-ONLY untuk card board: **TIDAK BISA** membuat card (`can('create', 'card') === false`) dan **TIDAK BISA** menghapus card (`can('delete', 'card') === false`).
**Step 2:** Buat komponen `AccessDenied.jsx` bergaya warning telemetry cockpit untuk menampilkan pesan penolakan yang jelas saat hak akses tidak mencukupi beserta tombol navigasi kembali.
**Step 3:** Buat wrapper `ProtectedRoute.jsx` yang memeriksa status autentikasi dan izin akses.

---

### Task 3: Responsive Application Shell (Header, Navigation & Mobile Drawer)
**Files:**
- Create: `src/components/layout/Navbar.jsx`
- Create: `src/components/layout/MobileNav.jsx`
- Create: `src/components/layout/AppShell.jsx`

**Step 1:** Buat `Navbar.jsx` untuk desktop/laptop: Brandmark Antasena, 4 link navigasi (`/board`, `/backlog`, `/telemetry`, `/vault`), Theme Toggle icon, User Role badge, dan tombol Logout.
**Step 2:** Buat `MobileNav.jsx`: Hamburger menu dan drawer slide-out responsif dengan touch target minimum 44px.
**Step 3:** Satukan dalam `AppShell.jsx` yang membungkus konten aplikasi dengan container responsif (`.wrap`) dan footer teknis anti-slop.

---

### Task 4: Login Page with 3-Role Quick Login
**Files:**
- Create: `src/pages/LoginPage.jsx`

**Step 1:** Rancang `LoginPage.jsx` bertema telemetry racing Antasena ITS.
**Step 2:** Sediakan 3 tombol **Quick Login** 1-klik:
  - 🛠️ Masuk sebagai **Admin / PO**
  - 🏎️ Masuk sebagai **Anggota Tim**
  - 🎓 Masuk sebagai **Alumni Reviewer**
**Step 3:** Sediakan opsi input nama kustom dan pemilihan peran.
**Step 4:** Redirect otomatis ke halaman sebelumnya atau ke `/board` setelah login berhasil.

---

### Task 5: Data Seeding & Unified Data Service
**Files:**
- Create: `src/data/seedData.js`
- Create: `src/context/DataContext.jsx`
- Modify: `src/services/backlogService.js`

**Step 1:** Buat `seedData.js` yang memuat item awal dari `src/data/backlog.json` untuk Backlog dan Kanban Board, seed data telemetri fiktif (`runs` dengan parameter kecepatan, tegangan, arus, daya, efisiensi), dan seed Knowledge Vault (dokumen riset per kategori).
**Step 2:** Buat `DataContext.jsx` yang menginisialisasi state dari `localStorage` atau `seedData.js` dan menyediakan fungsi mutasi data (tambah, ubah, hapus card) yang diproteksi oleh validasi peran.
**Step 3:** Hubungkan `backlogService.js` agar membaca data dari `DataContext`.

---

### Task 6: Empat Halaman Modul Utama (Board, Backlog, Telemetry, Vault)
**Files:**
- Create: `src/pages/BoardPage.jsx`
- Modify: `src/pages/BacklogPage.jsx`
- Create: `src/pages/TelemetryPage.jsx`
- Create: `src/pages/VaultPage.jsx`

**Step 1:** Implementasi `BoardPage.jsx`: Papan Kanban 4 kolom (`To Do`, `In Progress`, `Review`, `Done`) memuat card awal. Tombol "Tambah Card Baru" dan tombol hapus card pada kartu: jika diklik oleh Alumni Reviewer, tampilkan dialog/banner `AccessDenied` yang jelas.
**Step 2:** Perbarui `BacklogPage.jsx`: Menampilkan Product Backlog terstruktur per Epic dengan poin dan prioritas MoSCoW.
**Step 3:** Implementasi `TelemetryPage.jsx`: Ringkasan status kendaraan simulasi (kecepatan, tegangan bus, arus, daya, km/kWh per run) dengan visualisasi kartu telemetri.
**Step 4:** Implementasi `VaultPage.jsx`: Repositori riset tim Antasena terstruktur berdasarkan 6 kategori utama.

---

### Task 7: Routing Assembly, App.jsx Integration & Build Verification
**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Step 1:** Bungkus root app dengan `ThemeProvider`, `AuthProvider`, `DataProvider`, dan `BrowserRouter`.
**Step 2:** Definisikan rute `/login`, `/board`, `/backlog`, `/telemetry`, `/vault`, serta redirect default `*` ke `/board`.
**Step 3:** Jalankan `npm run build` untuk memverifikasi tidak ada error build pada Vite.
**Step 4:** Verifikasi seluruh acceptance criteria PBI-006 dan PBI-001.
