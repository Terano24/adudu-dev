# Product Backlog

**Product:** Adudu Dev - Unified Agile Platform
**Product Owner:** Terano
**Visi:** Mengganti spreadsheet manual dengan platform terpusat untuk mengelola backlog, dependensi antardivisi, progres otomatis, dan standar Definition of Done.

> File ini dibuat otomatis dari src/data/backlog.json. Ubah datanya di JSON, lalu jalankan `node scripts/gen-backlog-doc.mjs`.

## Aturan Backlog
- Item diurutkan berdasarkan prioritas (MoSCoW: Must, Should, Could, Won't) dan nilai bisnis.
- Setiap item adalah user story: "Sebagai <peran>, saya ingin <tujuan> agar <manfaat>".
- Setiap item wajib punya acceptance criteria, estimasi story points (Fibonacci), dan Epic.
- Item hanya masuk Sprint jika "Ready": jelas, terestimasi, dan dependensinya diketahui.
- Item dinyatakan Done hanya jika seluruh acceptance criteria dan DoD terpenuhi.
- Status: To Do, In Progress, In Review, Done.

## Ringkasan Epic
| ID | Epic | Tujuan | Sprint |
|----|------|--------|--------|
| EPIC-1 | Core Backlog Architecture & Data Structure | Mengganti spreadsheet manual dengan Product Backlog dan Sprint Backlog terpusat | 1 |
| EPIC-2 | Cross-Division Dependency Visualization | Keterkaitan tugas antardivisi terlihat transparan dan bottleneck bisa dicegah | 2 |
| EPIC-3 | Automated Progress Tracking & Burndown Chart | Progres tim terlacak otomatis tanpa input manual | 3 |
| EPIC-4 | Platform Integration, Testing & Rollout | Platform stabil, data lama termigrasi, dan dipakai seluruh divisi | 4 |
| EPIC-5 | Standardized Definition of Done (DoD) Gatekeeper | Tidak ada tugas Done sebelum kriteria uji teknis terpenuhi | 3 |

## Ringkasan Item
| ID | Epic | Prioritas | Poin | Sprint | Status | Dependensi |
|----|------|-----------|------|--------|--------|------------|
| PBI-001 | EPIC-1 | Must | 8 | 1 | To Do | - |
| PBI-002 | EPIC-1 | Must | 5 | 1 | To Do | PBI-001 |
| PBI-003 | EPIC-1 | Must | 5 | 1 | To Do | PBI-002 |
| PBI-004 | EPIC-1 | Must | 5 | 1 | To Do | PBI-003 |
| PBI-005 | EPIC-1 | Must | 8 | 1 | To Do | PBI-001 |
| PBI-006 | EPIC-1 | Should | 3 | 1 | To Do | PBI-003 |
| PBI-007 | EPIC-2 | Must | 8 | 2 | To Do | PBI-004 |
| PBI-008 | EPIC-2 | Must | 8 | 2 | To Do | PBI-007 |
| PBI-009 | EPIC-2 | Should | 5 | 2 | To Do | PBI-008 |
| PBI-010 | EPIC-3 | Must | 8 | 3 | To Do | PBI-004 |
| PBI-011 | EPIC-3 | Must | 8 | 3 | To Do | PBI-010 |
| PBI-012 | EPIC-3 | Should | 5 | 3 | To Do | PBI-011 |
| PBI-013 | EPIC-5 | Must | 8 | 3 | To Do | PBI-004 |
| PBI-014 | EPIC-5 | Must | 5 | 3 | To Do | PBI-013 |
| PBI-015 | EPIC-4 | Must | 5 | 4 | To Do | PBI-009, PBI-014 |
| PBI-016 | EPIC-4 | Must | 5 | 4 | To Do | PBI-015 |
| PBI-017 | EPIC-4 | Must | 5 | 4 | To Do | PBI-001 |
| PBI-018 | EPIC-4 | Should | 3 | 4 | To Do | PBI-016, PBI-017 |

**Total poin per sprint:** Sprint 1: 34 | Sprint 2: 21 | Sprint 3: 34 | Sprint 4: 18

## Rincian Item

### EPIC-1: Core Backlog Architecture & Data Structure

#### PBI-001 (Must, 8 poin, Sprint 1)
Sebagai PO, saya ingin skema data Product Backlog dan Sprint Backlog agar semua item terstruktur dan tidak tersebar di spreadsheet

- Divisi: Semua
- Dependensi: -
- Acceptance criteria:
  - [ ] ERD mencakup Epic, Story, Task, Sprint, Divisi, User
  - [ ] Relasi Epic > Story > Task terdefinisi
  - [ ] Field wajib: ID, judul, prioritas, estimasi, status, divisi, sprint
  - [ ] Data contoh (seed) tersedia

#### PBI-002 (Must, 5 poin, Sprint 1)
Sebagai PO, saya ingin membuat, mengubah, dan menghapus Epic agar tujuan besar tiap divisi tercatat

- Divisi: Semua
- Dependensi: PBI-001
- Acceptance criteria:
  - [ ] CRUD Epic berfungsi
  - [ ] Epic punya tujuan dan status
  - [ ] Epic yang punya Story tidak bisa dihapus tanpa konfirmasi

#### PBI-003 (Must, 5 poin, Sprint 1)
Sebagai PO, saya ingin mengelola User Story berformat Sebagai-saya ingin-agar beserta acceptance criteria

- Divisi: Semua
- Dependensi: PBI-002
- Acceptance criteria:
  - [ ] CRUD Story berfungsi
  - [ ] Story wajib terhubung ke satu Epic
  - [ ] Acceptance criteria minimal 1 item
  - [ ] Story points memakai skala Fibonacci

#### PBI-004 (Must, 5 poin, Sprint 1)
Sebagai Ketua Divisi, saya ingin memecah Story menjadi Task untuk divisi saya agar pekerjaan bisa dibagi ke anggota

- Divisi: Semua
- Dependensi: PBI-003
- Acceptance criteria:
  - [ ] CRUD Task berfungsi
  - [ ] Task punya penanggung jawab, divisi, dan estimasi jam
  - [ ] Satu Story bisa punya banyak Task lintas divisi

#### PBI-005 (Must, 8 poin, Sprint 1)
Sebagai admin, saya ingin peran dan hak akses per divisi agar data tiap divisi aman

- Divisi: Semua
- Dependensi: PBI-001
- Acceptance criteria:
  - [ ] Peran: Product Owner, Ketua Divisi, Anggota
  - [ ] PO bisa edit semua; Ketua Divisi hanya divisinya; Anggota hanya task miliknya
  - [ ] Akses tanpa izin ditolak dengan pesan jelas

#### PBI-006 (Should, 3 poin, Sprint 1)
Sebagai PO, saya ingin mengurutkan dan memprioritaskan backlog (MoSCoW) agar tim tahu yang dikerjakan lebih dulu

- Divisi: Product
- Dependensi: PBI-003
- Acceptance criteria:
  - [ ] Prioritas Must/Should/Could/Won't
  - [ ] Urutan bisa diubah drag-and-drop atau input nomor
  - [ ] Filter berdasarkan sprint, divisi, dan prioritas

### EPIC-2: Cross-Division Dependency Visualization

#### PBI-007 (Must, 8 poin, Sprint 2)
Sebagai Ketua Divisi, saya ingin Dependency Board agar tahu tugas divisi lain yang memengaruhi divisi saya

- Divisi: Semua
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Papan menampilkan task per divisi dengan penghubung dependensi
  - [ ] Task yang diblokir ditandai jelas
  - [ ] Bisa difilter per sprint dan divisi

#### PBI-008 (Must, 8 poin, Sprint 2)
Sebagai PO, saya ingin pemetaan dependensi dan deteksi bottleneck agar kemacetan ketahuan sebelum terjadi

- Divisi: Product
- Dependensi: PBI-007
- Acceptance criteria:
  - [ ] Dependensi dibuat antar Task (blocks / blocked by)
  - [ ] Dependensi melingkar ditolak
  - [ ] Task yang memblokir 3 atau lebih task ditandai bottleneck

#### PBI-009 (Should, 5 poin, Sprint 2)
Sebagai anggota divisi, saya ingin notifikasi saat status task yang saya tunggu berubah agar bisa segera mulai

- Divisi: Semua
- Dependensi: PBI-008
- Acceptance criteria:
  - [ ] Notifikasi terkirim saat status task yang menjadi dependensi berubah
  - [ ] Hanya divisi terdampak yang menerima
  - [ ] Riwayat notifikasi bisa dilihat

### EPIC-3: Automated Progress Tracking & Burndown Chart

#### PBI-010 (Must, 8 poin, Sprint 3)
Sebagai PO, saya ingin metrik kemajuan dihitung otomatis dari status backlog agar tidak perlu rekap manual

- Divisi: Product
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Menghitung poin selesai, sisa, dan velocity per sprint
  - [ ] Terupdate otomatis saat status task berubah
  - [ ] Akurasi sama dengan hitungan manual pada data uji

#### PBI-011 (Must, 8 poin, Sprint 3)
Sebagai tim, saya ingin Burndown Chart interaktif real-time agar tahu apakah sprint sesuai target

- Divisi: Semua
- Dependensi: PBI-010
- Acceptance criteria:
  - [ ] Garis ideal vs aktual ditampilkan
  - [ ] Update real-time tanpa refresh manual
  - [ ] Tooltip menampilkan detail per hari

#### PBI-012 (Should, 5 poin, Sprint 3)
Sebagai Ketua Divisi, saya ingin dashboard metrik divisi dan individu agar bisa memantau beban kerja

- Divisi: Semua
- Dependensi: PBI-011
- Acceptance criteria:
  - [ ] Tampilan terpisah untuk ketua divisi dan anggota
  - [ ] Menampilkan beban, progres, dan task terlambat
  - [ ] Anggota tidak bisa melihat data divisi lain

### EPIC-4: Platform Integration, Testing & Rollout

#### PBI-015 (Must, 5 poin, Sprint 4)
Sebagai QA, saya ingin uji integrasi end-to-end alur penyerahan tugas antardivisi agar alur terbukti berjalan

- Divisi: QA
- Dependensi: PBI-009, PBI-014
- Acceptance criteria:
  - [ ] Skenario: buat story, pecah task, dependensi, notifikasi, DoD, Done
  - [ ] Semua skenario lulus
  - [ ] Laporan uji terdokumentasi

#### PBI-016 (Must, 5 poin, Sprint 4)
Sebagai PO, saya ingin pengukuran performa dan perbaikan bug agar platform siap dipakai

- Divisi: QA
- Dependensi: PBI-015
- Acceptance criteria:
  - [ ] Halaman utama termuat di bawah 3 detik pada data nyata
  - [ ] Tidak ada bug kritis terbuka
  - [ ] Bug minor tercatat di backlog

#### PBI-017 (Must, 5 poin, Sprint 4)
Sebagai PO, saya ingin data akhir spreadsheet manual dimigrasi ke platform agar riwayat tidak hilang

- Divisi: Product
- Dependensi: PBI-001
- Acceptance criteria:
  - [ ] Seluruh baris spreadsheet ter-impor
  - [ ] Jumlah data sebelum dan sesudah cocok
  - [ ] Spreadsheet lama diarsipkan

#### PBI-018 (Should, 3 poin, Sprint 4)
Sebagai anggota divisi, saya ingin panduan penggunaan dan rollout resmi agar bisa langsung memakai platform

- Divisi: Semua
- Dependensi: PBI-016, PBI-017
- Acceptance criteria:
  - [ ] Panduan pengguna per peran tersedia
  - [ ] Sesi pengenalan untuk seluruh divisi terlaksana
  - [ ] Spreadsheet manual resmi dihentikan

### EPIC-5: Standardized Definition of Done (DoD) Gatekeeper

#### PBI-013 (Must, 8 poin, Sprint 3)
Sebagai PO, saya ingin checklist DoD wajib per jenis output (komponen kendaraan, software, event) agar standar selesai seragam

- Divisi: Semua
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Template checklist per jenis output bisa dikelola PO
  - [ ] Task wajib memilih jenis output
  - [ ] Kriteria uji teknis tertulis jelas per item

#### PBI-014 (Must, 5 poin, Sprint 3)
Sebagai PO, saya ingin status task terkunci dan tidak bisa menjadi Done sebelum seluruh checklist DoD terpenuhi

- Divisi: Semua
- Dependensi: PBI-013
- Acceptance criteria:
  - [ ] Tombol Done nonaktif jika ada item checklist belum centang
  - [ ] Upaya mengubah status lewat cara lain ditolak
  - [ ] Siapa yang mencentang dan kapan tercatat

## Definition of Done (umum)
- [ ] Acceptance criteria terpenuhi
- [ ] Kode di-review dan di-merge ke main
- [ ] Diuji dan tanpa bug kritis
- [ ] Dokumentasi diperbarui
- [ ] Disetujui Product Owner
