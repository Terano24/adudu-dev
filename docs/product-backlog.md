# Product Backlog: SenaFlow

**Mitra:** Antasena Team ITS
**Kelompok:** Kelompok 6 (MPT A)
**Visi:** Platform manajemen proyek Agile untuk Antasena Team ITS. Platform ini menyediakan papan Kanban yang dapat direview oleh alumni dan mitra, dashboard telemetri hasil uji jalan, serta Knowledge Vault untuk menjaga kesinambungan ilmu antargenerasi.

> File ini dibuat otomatis dari src/data/backlog.json. Ubah datanya di JSON, lalu jalankan `node scripts/gen-backlog-doc.mjs`.

## Aturan Backlog
- Setiap item berbentuk user story: "Sebagai <peran>, saya ingin <tujuan> agar <manfaat>".
- Item diurutkan dalam satu daftar (kolom No, 1 adalah yang paling prioritas). Urutan mempertimbangkan nilai bagi pengguna, risiko, dan dependensi.
- Kategori MoSCoW (Must, Should, Could, Won't) melengkapi urutan; estimasi memakai story points skala Fibonacci.
- Setiap item punya acceptance criteria yang dapat diuji.
- Item masuk Sprint hanya jika jelas, terestimasi, dan dependensinya diketahui.
- Item Done hanya jika acceptance criteria dan Definition of Done terpenuhi.
- Data telemetri pada platform ini merupakan data simulasi dan bukan data riil tim.

## Tim dan Peran
| Nama | NRP | Peran | Tanggung jawab |
|------|-----|-------|----------------|
| I Nyoman Agung Ananda Terano | 5026251030 | Product Owner | Menyusun dan memprioritaskan Product Backlog, menulis acceptance criteria, menyetujui hasil item |
| Akbar Ariffianto | 5026251006 | Scrum Master | Memfasilitasi event Scrum, menyingkirkan hambatan, memastikan DoD dijalankan |
| Aryo Gading Kelana | 5026251209 | Developer | Papan Kanban, DoD, simulator MQTT, burndown |
| Muhammad Mazen Ibrahim | 5026251176 | Developer | Detail card, review alumni, telemetry dashboard, Knowledge Vault |
| Dimas Aryo Aji Putro Dhonny Wibowo | 5026251094 | Developer | Auth, komentar, dependensi, review telemetri, notifikasi |

## Definition of Done (berlaku untuk semua item)
- [ ] Fungsi berjalan pada lingkungan uji
- [ ] Seluruh acceptance criteria item terpenuhi
- [ ] Sudah diperiksa oleh anggota tim lain
- [ ] Terdokumentasi dan tercatat di board
- [ ] Disetujui Product Owner atau mitra

## Ringkasan Epic
| ID | Epic | Tujuan |
|----|------|--------|
| EPIC-1 | Kanban Board & Product Backlog | Pekerjaan dan prioritas Antasena tervisualisasi di papan, menggantikan spreadsheet dan broadcast WhatsApp |
| EPIC-2 | Review & Komentar Alumni/Mitra | Alumni dan mitra dapat mengomentari dan mereview hasil setiap objektif yang selesai |
| EPIC-3 | DoD Gatekeeper & Dependensi | Tidak ada task Done sebelum DoD terpenuhi, dan keterkaitan antar divisi terlihat |
| EPIC-4 | Telemetry Dashboard | Hasil run kendaraan tampil sederhana dan dapat direview (memakai data simulasi, bukan data riil tim) |
| EPIC-5 | Knowledge Vault | Arsip modul belajar, paper, dan evaluasi tim agar ilmu tidak hilang saat regenerasi |

## Ringkasan Item (urut prioritas)
| No | ID | Epic | Prioritas | Poin | Sprint | Pemegang | Status | Dependensi |
|----|----|------|-----------|------|--------|----------|--------|------------|
| 1 | PBI-006 | EPIC-1 | Must | 3 | 1 (dipilih) | Dimas | To Do | - |
| 2 | PBI-001 | EPIC-1 | Must | 8 | 1 (dipilih) | Dimas | To Do | - |
| 3 | PBI-002 | EPIC-1 | Must | 8 | 1 (dipilih) | Aryo | To Do | PBI-006 |
| 4 | PBI-003 | EPIC-1 | Must | 5 | 1 (dipilih) | Aryo | To Do | PBI-002 |
| 5 | PBI-004 | EPIC-1 | Must | 5 | 1 (dipilih) | Ibra | To Do | PBI-002 |
| 6 | PBI-005 | EPIC-1 | Should | 5 | 1 (dipilih) | Ibra | To Do | PBI-004 |
| 7 | PBI-007 | EPIC-2 | Must | 5 | 2 | Dimas | To Do | PBI-004 |
| 8 | PBI-008 | EPIC-2 | Must | 8 | 2 | Ibra | To Do | PBI-007 |
| 9 | PBI-010 | EPIC-3 | Must | 5 | 2 | Aryo | To Do | PBI-004 |
| 10 | PBI-011 | EPIC-3 | Must | 5 | 2 | Aryo | To Do | PBI-010 |
| 11 | PBI-009 | EPIC-2 | Should | 5 | 2 | Ibra | To Do | PBI-008 |
| 12 | PBI-012 | EPIC-3 | Should | 8 | 2 | Dimas | To Do | PBI-004 |
| 13 | PBI-013 | EPIC-4 | Must | 5 | 3 | Aryo | To Do | PBI-006 |
| 14 | PBI-014 | EPIC-4 | Must | 8 | 3 | Ibra | To Do | PBI-013 |
| 15 | PBI-015 | EPIC-4 | Must | 5 | 3 | Dimas | To Do | PBI-014, PBI-008 |
| 16 | PBI-016 | EPIC-4 | Should | 5 | 3 | Aryo | To Do | PBI-003 |
| 17 | PBI-017 | EPIC-2 | Could | 3 | 3 | Dimas | To Do | PBI-008 |
| 18 | PBI-018 | EPIC-5 | Must | 8 | 4 | Ibra | To Do | PBI-001 |
| 19 | PBI-020 | EPIC-5 | Should | 5 | 4 | Aryo | To Do | PBI-018 |
| 20 | PBI-019 | EPIC-5 | Should | 5 | 4 | Dimas | To Do | PBI-018 |
| 21 | PBI-021 | EPIC-5 | Must | 5 | 4 | Aryo | To Do | PBI-011, PBI-015, PBI-018 |
| 22 | PBI-022 | EPIC-5 | Should | 3 | 4 | Dimas | To Do | PBI-021 |

**Poin per sprint:** Sprint 1: 34 | Sprint 2: 36 | Sprint 3: 26 | Sprint 4: 26

**Poin per Developer:** Dimas: 40 | Aryo: 43 | Ibra: 39

## Sprint Goal
- Sprint 1: Tim dapat membuat, memindahkan, dan melihat detail card pada papan Kanban setelah login dengan peran masing-masing.
- Sprint 2: Alumni dan mitra dapat berkomentar dan mereview hasil card, dan card tidak dapat menjadi Done sebelum DoD terpenuhi.
- Sprint 3: Hasil run telemetri simulasi tampil pada dashboard dan dapat direview, serta progres sprint terlihat pada burndown chart.
- Sprint 4: Knowledge Vault dapat dipakai, platform lolos uji end-to-end, dan siap diserahkan kepada Antasena.

## Rincian Item

### EPIC-1: Kanban Board & Product Backlog

#### No 1: PBI-006 (Must, 3 poin, Sprint 1, dipilih)
Sebagai Developer, saya ingin kerangka aplikasi (layout, navigasi, data awal) agar fitur lain punya fondasi yang sama

- Pemegang: Dimas
- Dependensi: -
- Acceptance criteria:
  - [ ] Navigasi ke Board, Backlog, Telemetry, dan Vault tersedia
  - [ ] Data contoh awal termuat
  - [ ] Tampilan dapat dipakai di layar laptop dan HP

#### No 2: PBI-001 (Must, 8 poin, Sprint 1, dipilih)
Sebagai anggota tim, saya ingin login dengan peran (Admin/PO, Anggota Tim, Alumni Reviewer) agar akses sesuai tugas saya

- Pemegang: Dimas
- Dependensi: -
- Acceptance criteria:
  - [ ] Pengguna dapat login dan logout dengan akun terdaftar
  - [ ] Tiga peran tersedia: Admin/PO, Anggota Tim, Alumni Reviewer
  - [ ] Alumni Reviewer tidak dapat membuat atau menghapus card
  - [ ] Halaman terlarang menampilkan pesan akses ditolak

#### No 3: PBI-002 (Must, 8 poin, Sprint 1, dipilih)
Sebagai Developer, saya ingin papan Kanban dengan kolom To Do, In Progress, Review, Done agar status pekerjaan dapat dipantau dengan jelas

- Pemegang: Aryo
- Dependensi: PBI-006
- Acceptance criteria:
  - [ ] Papan menampilkan 4 kolom
  - [ ] Card dapat dibuat, diubah, dan dihapus
  - [ ] Data card tetap ada setelah halaman di-refresh
  - [ ] Jumlah card per kolom tampil di header kolom

#### No 4: PBI-003 (Must, 5 poin, Sprint 1, dipilih)
Sebagai anggota tim, saya ingin memindahkan card antar kolom dengan drag and drop agar pembaruan status lebih efisien

- Pemegang: Aryo
- Dependensi: PBI-002
- Acceptance criteria:
  - [ ] Card dapat dipindah ke kolom lain dengan drag and drop
  - [ ] Status baru tersimpan dan tercatat waktunya
  - [ ] Alumni Reviewer tidak dapat memindahkan card

#### No 5: PBI-004 (Must, 5 poin, Sprint 1, dipilih)
Sebagai anggota tim, saya ingin detail card (deskripsi, penanggung jawab, deadline, label divisi) agar tugas jelas

- Pemegang: Ibra
- Dependensi: PBI-002
- Acceptance criteria:
  - [ ] Card memiliki judul, deskripsi, assignee, deadline, dan label divisi
  - [ ] Card lewat deadline diberi tanda merah
  - [ ] Filter card berdasarkan divisi dan assignee berfungsi

#### No 6: PBI-005 (Should, 5 poin, Sprint 1, dipilih)
Sebagai Product Owner, saya ingin halaman Product Backlog berurutan prioritas dengan Epic agar arah pengembangan jelas

- Pemegang: Ibra
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Item dikelompokkan per Epic dan diurutkan prioritas (MoSCoW)
  - [ ] Setiap item menampilkan poin dan sprint
  - [ ] Hanya PO yang dapat mengubah prioritas

### EPIC-2: Review & Komentar Alumni/Mitra

#### No 7: PBI-007 (Must, 5 poin, Sprint 2)
Sebagai anggota tim atau alumni, saya ingin berkomentar pada card atau objektif agar masukan tercatat di tempat pekerjaan

- Pemegang: Dimas
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Komentar menampilkan nama, peran, dan waktu
  - [ ] Semua peran login dapat berkomentar
  - [ ] Pengguna dapat menghapus komentarnya sendiri
  - [ ] Jumlah komentar tampil di card

#### No 8: PBI-008 (Must, 8 poin, Sprint 2)
Sebagai Alumni Reviewer, saya ingin memberi review (rating 1-5 dan catatan) pada hasil card yang selesai agar tim mendapat umpan balik

- Pemegang: Ibra
- Dependensi: PBI-007
- Acceptance criteria:
  - [ ] Review hanya dapat dibuat pada card berstatus Review atau Done
  - [ ] Review berisi rating 1-5 dan catatan wajib
  - [ ] Satu reviewer satu review per card, dapat diedit
  - [ ] Rata-rata rating tampil di card

#### No 11: PBI-009 (Should, 5 poin, Sprint 2)
Sebagai Product Owner, saya ingin kolom Review menunggu persetujuan PO atau mitra sebelum Done agar hasil tervalidasi

- Pemegang: Ibra
- Dependensi: PBI-008
- Acceptance criteria:
  - [ ] Card di kolom Review punya tombol Setujui dan Minta Revisi
  - [ ] Hanya PO atau mitra yang dapat menyetujui
  - [ ] Keputusan beserta alasannya tercatat

#### No 17: PBI-017 (Could, 3 poin, Sprint 3)
Sebagai anggota tim, saya ingin notifikasi saat ada komentar atau review baru agar tidak terlewat

- Pemegang: Dimas
- Dependensi: PBI-008
- Acceptance criteria:
  - [ ] Pemilik card menerima notifikasi untuk komentar dan review baru
  - [ ] Notifikasi dapat ditandai sudah dibaca
  - [ ] Jumlah belum dibaca tampil di navigasi

### EPIC-3: DoD Gatekeeper & Dependensi

#### No 9: PBI-010 (Must, 5 poin, Sprint 2)
Sebagai PO, saya ingin checklist DoD tersedia di setiap card agar standar selesai seragam di seluruh item

- Pemegang: Aryo
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Checklist DoD umum (5 poin) otomatis tersedia di setiap card
  - [ ] Anggota tim dapat mencentang tiap poin checklist
  - [ ] Hanya PO yang dapat mengubah isi checklist DoD

#### No 10: PBI-011 (Must, 5 poin, Sprint 2)
Sebagai Scrum Master, saya ingin card tidak dapat menjadi Done sebelum seluruh checklist DoD terpenuhi agar tidak ada hasil setengah jadi

- Pemegang: Aryo
- Dependensi: PBI-010
- Acceptance criteria:
  - [ ] Perpindahan ke Done ditolak jika ada checklist belum centang
  - [ ] Pesan penolakan menyebut item yang belum terpenuhi
  - [ ] Siapa yang mencentang dan kapan tercatat

#### No 12: PBI-012 (Should, 8 poin, Sprint 2)
Sebagai Developer, saya ingin menandai card bergantung pada card divisi lain agar hambatan terlihat

- Pemegang: Dimas
- Dependensi: PBI-004
- Acceptance criteria:
  - [ ] Card dapat diberi dependensi ke card lain
  - [ ] Card yang menunggu card belum-Done ditandai Terblokir
  - [ ] Dependensi melingkar ditolak

### EPIC-4: Telemetry Dashboard

#### No 13: PBI-013 (Must, 5 poin, Sprint 3)
Sebagai Developer, saya ingin simulator MQTT berbasis Python yang menghasilkan telemetri palsu agar dashboard dapat dikembangkan tanpa menggunakan data rahasia tim

- Pemegang: Aryo
- Dependensi: PBI-006
- Acceptance criteria:
  - [ ] Skrip menghasilkan data simulasi (tegangan, arus, kecepatan, jarak, daya, energi) dan menyimpannya
  - [ ] Seluruh data berlabel simulasi
  - [ ] Tidak ada data riil tim di repo

#### No 14: PBI-014 (Must, 8 poin, Sprint 3)
Sebagai anggota tim atau alumni, saya ingin dashboard telemetri sederhana (kecepatan, tegangan, arus, daya, efisiensi) per run agar hasil mudah dibaca

- Pemegang: Ibra
- Dependensi: PBI-013
- Acceptance criteria:
  - [ ] Grafik garis untuk kecepatan, tegangan, arus, dan daya
  - [ ] Ringkasan per run: jarak, energi, efisiensi km/kWh
  - [ ] Pengguna dapat memilih run yang ingin dilihat

#### No 15: PBI-015 (Must, 5 poin, Sprint 3)
Sebagai Alumni Reviewer, saya ingin mereview dan mengomentari hasil run telemetri agar evaluasi performa mendapat masukan

- Pemegang: Dimas
- Dependensi: PBI-014, PBI-008
- Acceptance criteria:
  - [ ] Setiap run punya kolom review dan komentar
  - [ ] Review run menampilkan rating, catatan, nama, dan waktu
  - [ ] Run baru otomatis muncul sebagai Menunggu Review

#### No 16: PBI-016 (Should, 5 poin, Sprint 3)
Sebagai Scrum Master, saya ingin burndown chart sprint agar progres tim terlihat tanpa rekap manual

- Pemegang: Aryo
- Dependensi: PBI-003
- Acceptance criteria:
  - [ ] Garis ideal dan aktual ditampilkan
  - [ ] Grafik terupdate saat card dipindah ke Done
  - [ ] Sprint dapat dipilih

### EPIC-5: Knowledge Vault

#### No 18: PBI-018 (Must, 8 poin, Sprint 4)
Sebagai anggota tim, saya ingin Knowledge Vault dengan kategori dan pencarian agar dokumen riset mudah ditemukan

- Pemegang: Ibra
- Dependensi: PBI-001
- Acceptance criteria:
  - [ ] Kategori: Vehicle Dynamics, Body & Frame (CFD), Powertrain & Electrical, Programming, Fuel Cell Hidrogen, Riset Lainnya
  - [ ] Dokumen punya judul, penulis, tahun, tag, dan ringkasan
  - [ ] Pencarian berdasarkan judul dan tag berfungsi

#### No 19: PBI-020 (Should, 5 poin, Sprint 4)
Sebagai anggota baru, saya ingin modul onboarding dan arsip evaluasi (retrospective, lessons learned) agar regenerasi ilmu lancar

- Pemegang: Aryo
- Dependensi: PBI-018
- Acceptance criteria:
  - [ ] Halaman modul belajar berurutan per divisi
  - [ ] Catatan retrospective dapat diarsipkan beserta action item
  - [ ] Status action item (Open/Done) dapat diubah

#### No 20: PBI-019 (Should, 5 poin, Sprint 4)
Sebagai anggota baru, saya ingin data contoh Vault (paper, referensi, hasil riset fiktif) agar fitur dapat dicoba

- Pemegang: Dimas
- Dependensi: PBI-018
- Acceptance criteria:
  - [ ] Minimal 3 dokumen contoh per kategori
  - [ ] Termasuk data fuel cell hidrogen fiktif
  - [ ] Seluruh data berlabel fiktif

#### No 21: PBI-021 (Must, 5 poin, Sprint 4)
Sebagai Product Owner, saya ingin uji end-to-end dan perbaikan bug agar platform stabil sebelum dipakai mitra

- Pemegang: Aryo
- Dependensi: PBI-011, PBI-015, PBI-018
- Acceptance criteria:
  - [ ] Alur buat card, DoD, review alumni, Done lulus diuji
  - [ ] Tidak ada bug kritis terbuka
  - [ ] Hasil uji terdokumentasi

#### No 22: PBI-022 (Should, 3 poin, Sprint 4)
Sebagai anggota Antasena, saya ingin panduan pengguna dan rollout agar dapat langsung memakai platform

- Pemegang: Dimas
- Dependensi: PBI-021
- Acceptance criteria:
  - [ ] Panduan per peran tersedia di repo
  - [ ] Demo ke mitra terlaksana pada Sprint Review
  - [ ] Spreadsheet lama diarsipkan
