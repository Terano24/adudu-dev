"""Membuat laporan Pekan 11 (kunjungan/pertemuan dengan mitra) dalam PDF A4 portrait.

Format dan gaya mengikuti laporan Sprint 0 (cover, Times, tabel gaya paper).
Jalankan dari root repo:  python scripts/gen_lapangan_pdf.py
Output: docs/[MPT A] LAPANGAN PEKAN 11 - Kelompok 06.pdf
"""
import json
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether

d = json.load(open("src/data/backlog.json", encoding="utf-8"))
OUT = "docs/[MPT A] LAPANGAN PEKAN 11 - Kelompok 06.pdf"
LOGO = "docs/assets/logo-its.png"

B = ParagraphStyle("B", fontName="Times-Roman", fontSize=10.5, leading=14)
C = ParagraphStyle("C", parent=B, fontSize=9, leading=11.2)
CH = ParagraphStyle("CH", parent=C, textColor=colors.black, fontName="Times-Bold")
H2 = ParagraphStyle("H2", parent=B, fontName="Times-Bold", fontSize=12.5, spaceBefore=12, spaceAfter=5)
CT = ParagraphStyle("CT", fontName="Times-Bold", fontSize=13, leading=18, alignment=TA_CENTER)
CI = ParagraphStyle("CI", parent=CT, fontName="Times-BoldItalic")
CS = ParagraphStyle("CS", parent=CT, fontSize=11, leading=15)
CN = ParagraphStyle("CN", parent=CT, fontName="Times-Roman", fontSize=10.5, leading=14)
LK = ParagraphStyle("LK", parent=B, fontSize=9.5, leading=12.5)


def esc(t): return str(t).replace("&", "&amp;").replace("<", "&lt;")
def p(t, s=C): return Paragraph(esc(t), s)


def table(rows, widths, highlight=()):
    data = [[p(c, CH if r == 0 else C) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1)
    sty = [("LINEABOVE", (0, 0), (-1, 0), 1.0, colors.black),
           ("LINEBELOW", (0, 0), (-1, 0), 0.6, colors.black),
           ("LINEBELOW", (0, -1), (-1, -1), 1.0, colors.black),
           ("LINEBELOW", (0, 1), (-1, -2), 0.25, colors.HexColor("#bdbdbd")),
           ("VALIGN", (0, 0), (-1, -1), "TOP"),
           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    for r in highlight:
        sty.append(("BACKGROUND", (0, r), (-1, r), colors.HexColor("#e9e9e9")))
    t.setStyle(TableStyle(sty))
    return t


story = []

# ---------------- Cover ----------------
story += [Spacer(1, 2.2*cm),
          Paragraph("Manajemen Proyek Tangkas (MPT)", CT), Spacer(1, 6),
          Paragraph("Pekan 11: Pertemuan dengan Mitra", CI), Spacer(1, 6),
          Paragraph("Laporan Pengujian Rencana Sprint: %s" % d["product"]["name"], CT),
          Paragraph("Mitra: %s" % d["product"]["partner"], CS), Spacer(1, 1.2*cm)]
logo = Image(LOGO, width=6.2*cm, height=6.2*cm)
logo.hAlign = "CENTER"
story += [logo, Spacer(1, 1.2*cm),
          Paragraph("MPT - Kelas A", CT), Paragraph(d["product"]["group"], CT), Spacer(1, 6),
          Paragraph("Disusun Oleh:", ParagraphStyle("DO", parent=CS, fontSize=10.5))]
members = Table([[p(t["name"], CN), p("(%s)" % t["nrp"], CN)] for t in d["team"]], colWidths=[7.5*cm, 3*cm])
members.setStyle(TableStyle([("ALIGN", (0, 0), (0, -1), "RIGHT"), ("ALIGN", (1, 0), (1, -1), "LEFT"),
                             ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
story += [members, Spacer(1, 2.4*cm),
          Paragraph("Program Studi Sarjana Sistem Informasi", CS),
          Paragraph("Fakultas Teknologi Elektro dan Informatika Cerdas", CS),
          Paragraph("INSTITUT TEKNOLOGI SEPULUH NOPEMBER", CS),
          Paragraph("2026", CS), PageBreak()]

# ---------------- Isi ----------------
story += [Paragraph("Laporan Pekan 11: Pengujian Rencana Sprint terhadap Mitra",
                    ParagraphStyle("T", parent=H2, fontSize=15, spaceBefore=0)),
          Paragraph("<b>Mata kuliah:</b> Manajemen Proyek Tangkas (MPT), Kelas A | <b>Kelompok:</b> 6 | <b>Mitra:</b> %s" % esc(d["product"]["partner"]), B),
          Paragraph("<b>Produk:</b> %s. Laporan ini menguji Product Backlog hasil Sprint 0 terhadap masukan mitra dan mencatat dampaknya pada sprint planning." % esc(d["product"]["name"]), B)]

# 1. Identitas pertemuan
story.append(Paragraph("1. Notulensi Pertemuan", H2))
rows = [["Butir", "Keterangan"],
        ["Tanggal", "Selasa, 17 November 2026"],
        ["Tempat", "Online (Zoom). Rekaman Zoom bertanda 21.38 WIB, tangkapan layar peserta pukul 21.59 WIB. Pembahasan inti berlangsung sekitar 10 menit."],
        ["Notulis", "Akbar Ariffianto (Scrum Master)"],
        ["Hadir dari kelompok", "I Nyoman Agung Ananda Terano (Product Owner, pemandu pertanyaan), Akbar Ariffianto (Scrum Master), Aryo Gading Kelana (Developer), Dimas Aryo Aji Putro Dhonny Wibowo (Developer). Muhammad Mazen Ibrahim tidak teridentifikasi dalam rekaman."],
        ["Hadir dari mitra", "Satu perwakilan Antasena Team ITS (nama dan jabatan belum tercatat di rekaman)."],
        ["Pokok pembicaraan", "Initial review Product Backlog: peran pengguna, review dan persetujuan card, data telemetri, Knowledge Vault, kecukupan fitur, migrasi spreadsheet lama, pemeliharaan platform, Definition of Done, harapan mitra, dan prioritas pengerjaan."]]
story.append(table(rows, [3.6*cm, 14.4*cm]))

story.append(Paragraph("Jawaban mitra per pertanyaan", ParagraphStyle("H3", parent=B, fontName="Times-Bold", spaceBefore=8, spaceAfter=3)))
rows = [["No", "Topik", "Pertanyaan tim", "Jawaban mitra"],
        ["1", "Alumni Reviewer", "Apakah alumni bersedia memakai platform?", "Bersedia. Sebagian besar alumni mau ada di aplikasi karena ingin memantau."],
        ["2", "Review dan persetujuan card", "Review memakai rating 1 sampai 5 dengan catatan. Siapa yang berhak menyetujui card di kolom Review?", "Card disetujui oleh manajer."],
        ["3", "Data telemetri", "Apakah data simulasi cukup untuk demo? Adakah batasan kerahasiaan?", "Cukup untuk demo. Tampilkan data utama yang dibutuhkan saja, data yang bersifat confidential dibatasi."],
        ["4", "Knowledge Vault", "Apakah kategori Vault, termasuk fuel cell, sudah mencukupi?", "Sudah cukup."],
        ["5", "Kecukupan fitur", "Apakah ada fitur yang perlu ditambah atau diimprovisasi?", "Cukup, tidak ada tambahan."],
        ["6", "Spreadsheet lama", "Dimigrasi atau mulai dari nol?", "Sebaiknya versi lama ikut ditaruh karena merupakan dokumentasi proyek tahun-tahun sebelumnya."],
        ["7", "Pemeliharaan", "Siapa yang memelihara platform setelah di-hosting?", "Teman-teman developer (tim programming), dipantau manajer."],
        ["8", "Definition of Done", "Apakah DoD 5 poin sesuai standar kualitas Antasena?", "Sudah cukup."],
        ["9", "Harapan mitra", "Bagaimana harapan terhadap proyek ini?", "Dapat diimplementasikan dan membantu merekap serta mengelola data, melihat performa, menginput nilai, menilai kinerja divisi, dan memperbaikinya ke depan."],
        ["10", "Prioritas pengerjaan", "Data mobil, Knowledge Vault, atau workflow yang didahulukan?", "Pekerjaan utama ada di mobil, jadi data mobil lebih dulu, baru riset. Posisi workflow (Kanban) tidak disebut secara eksplisit."]]
story.append(table(rows, [1.0*cm, 2.7*cm, 5.9*cm, 8.4*cm]))

# 2. Temuan
story.append(Paragraph("2. Temuan", H2))
rows = [["No", "Temuan (apa adanya)", "Benturan dengan rencana Sprint 0"],
        ["T1", "Mitra ingin spreadsheet lama dan dokumentasi tahun-tahun sebelumnya ikut masuk ke platform.", "Backlog 22 item tidak memuat item migrasi atau impor data lama."],
        ["T2", "Mitra mengutamakan data mobil (telemetri) sebelum riset.", "Telemetri direncanakan di Sprint 3, setelah Kanban dan review di Sprint 1 dan 2."],
        ["T3", "Card di kolom Review disetujui oleh manajer.", "Backlog hanya memiliki tiga peran (Admin/PO, Anggota Tim, Alumni Reviewer) dan menyebut persetujuan oleh PO atau mitra."],
        ["T4", "Data telemetri yang tampil dibatasi pada data utama, data confidential dibatasi.", "Rencana memakai data simulasi sudah sejalan, tetapi acceptance criteria belum menyebut batas parameter."],
        ["T5", "Alumni bersedia memakai platform.", "Asumsi Sprint 0 terkonfirmasi."],
        ["T6", "Mitra menjawab cukup untuk fitur, Knowledge Vault, dan DoD tanpa masukan rinci.", "Belum ada validasi mendalam. Risiko: masukan baru muncul setelah fitur dibangun."],
        ["T7", "Pemeliharaan setelah hosting dipegang tim programming Antasena dan dipantau manajer.", "Tim belum memiliki kontak atau pemilik tetap untuk serah terima."],
        ["T8", "Koneksi mitra tidak stabil, suara terputus, dan beberapa pertanyaan harus diulang. Jawaban soal Knowledge Vault tidak tertulis di notulensi dan baru terdapat di rekaman.", "Pencatatan notulensi belum menjamin satu jawaban per pertanyaan."]]
story.append(table(rows, [0.9*cm, 8.6*cm, 8.5*cm]))

# 3. Respon
story.append(Paragraph("3. Respon", H2))
rows = [["Temuan", "Respon tim (keputusan atau penyesuaian)", "Diputuskan oleh"],
        ["T1", "Menerima permintaan. Menambah item baru PBI-023 (impor data spreadsheet lama dan arsip dokumentasi) di Sprint 4.", "Product Owner"],
        ["T2", "Memajukan simulator dan dashboard telemetri (PBI-013, PBI-014) ke Sprint 2, dan menggeser item lain untuk menjaga beban sprint.", "Product Owner, disepakati Developer"],
        ["T3", "Menambah peran Manajer pada PBI-001 dan menjadikan Manajer penyetuju card pada PBI-009.", "Product Owner"],
        ["T4", "Menambah acceptance criteria pada PBI-013 dan PBI-014: hanya parameter utama yang ditampilkan.", "Product Owner"],
        ["T5", "Tidak ada perubahan. Asumsi dipertahankan.", "Product Owner"],
        ["T6", "Memvalidasi ulang prioritas dan fitur di setiap Sprint Review dengan demo, bukan hanya pertanyaan.", "Scrum Master dan Product Owner"],
        ["T7", "Meminta nama kontak pemeliharaan dari mitra pada Sprint Review berikutnya. Serah terima dimasukkan ke panduan di PBI-022.", "Product Owner"],
        ["T8", "Menyusun transkrip rekaman sebagai pelengkap notulensi, dan menetapkan format notulensi satu jawaban per pertanyaan.", "Scrum Master"]]
story.append(table(rows, [1.5*cm, 12.3*cm, 4.2*cm]))

# 4. Change request
story.append(Paragraph("4. Change Request", H2))
rows = [["No", "Permintaan mitra", "Item backlog terdampak", "Keputusan"],
        ["CR-01", "Data spreadsheet lama dan dokumentasi tahun-tahun sebelumnya ikut masuk platform.", "PBI-018 (Knowledge Vault), PBI-019 (data contoh), item baru PBI-023", "Diterima. Item baru PBI-023, 5 poin, Sprint 4."],
        ["CR-02", "Data mobil (telemetri) dikerjakan lebih dulu dibanding riset.", "PBI-013, PBI-014, PBI-015 (dimajukan). PBI-009, PBI-010, PBI-011, PBI-012 (digeser)", "Diterima. Urutan dan sprint disesuaikan (lihat bagian 5)."],
        ["CR-03", "Persetujuan card di kolom Review dilakukan manajer.", "PBI-001 (peran), PBI-009 (persetujuan)", "Diterima. Peran Manajer ditambahkan, acceptance criteria diubah, estimasi tetap."],
        ["CR-04", "Telemetri hanya menampilkan data utama, data confidential dibatasi.", "PBI-013, PBI-014", "Diterima sebagai batasan. Acceptance criteria diperjelas, estimasi tetap."]]
story.append(table(rows, [1.4*cm, 5.6*cm, 5.6*cm, 5.4*cm]))
story.append(Paragraph("Tidak ada permintaan penambahan fitur lain dari mitra. Mitra menyatakan fitur yang dirancang sudah cukup.", B))

# 5. Dampak
story.append(Paragraph("5. Dampak terhadap Sprint Planning", H2))
story.append(Paragraph("Penyesuaian prioritas (priority adjustment)", ParagraphStyle("H3b", parent=B, fontName="Times-Bold", spaceAfter=3)))
rows = [["Item", "Sebelum (sprint, no.)", "Sesudah (sprint, no.)", "Alasan"],
        ["PBI-013 Simulator MQTT telemetri", "Sprint 3, no. 13", "Sprint 2, no. 9", "CR-02: data mobil didahulukan"],
        ["PBI-014 Dashboard telemetri", "Sprint 3, no. 14", "Sprint 2, no. 10", "CR-02: data mobil didahulukan"],
        ["PBI-010 Checklist DoD", "Sprint 2, no. 9", "Sprint 2, no. 11", "Diturunkan di bawah telemetri"],
        ["PBI-011 Gatekeeper Done", "Sprint 2, no. 10", "Sprint 2, no. 12", "Mengikuti PBI-010"],
        ["PBI-015 Review hasil run telemetri", "Sprint 3, no. 15", "Sprint 3, no. 13", "Mengikuti PBI-014"],
        ["PBI-009 Persetujuan di kolom Review", "Sprint 2, no. 11", "Sprint 3, no. 14", "Digeser untuk menjaga beban Sprint 2. Penyetuju: manajer"],
        ["PBI-012 Dependensi antar card", "Sprint 2, no. 12", "Sprint 3, no. 15", "Digeser untuk menjaga beban Sprint 2"],
        ["PBI-023 Impor data lama dan arsip (baru)", "Belum ada", "Sprint 4, no. 19", "CR-01: permintaan mitra"]]
story.append(table(rows, [5.6*cm, 3.2*cm, 3.2*cm, 6.0*cm], highlight=(1, 2, 8)))
story.append(Paragraph("Item lain tidak berubah sprint-nya. Nomor urut item Sprint 4 yang sudah ada bergeser satu karena item baru.", B))

story.append(Paragraph("Estimasi dan total poin", ParagraphStyle("H3c", parent=B, fontName="Times-Bold", spaceBefore=8, spaceAfter=3)))
rows = [["Sprint", "Poin sebelum", "Poin sesudah", "Keterangan"],
        ["Sprint 1", "34", "34", "Tidak berubah"],
        ["Sprint 2", "36", "36", "Masuk PBI-013 dan PBI-014 (13 poin), keluar PBI-009 dan PBI-012 (13 poin)"],
        ["Sprint 3", "26", "26", "Masuk PBI-009 dan PBI-012 (13 poin), keluar PBI-013 dan PBI-014 (13 poin)"],
        ["Sprint 4", "26", "31", "Masuk PBI-023 (5 poin)"],
        ["Total", "122", "127", "Satu item baru, estimasi item lain tidak berubah"]]
story.append(table(rows, [2.2*cm, 2.6*cm, 2.6*cm, 10.6*cm]))
story.append(Paragraph("<b>Definition of Done:</b> tidak berubah. Mitra menyatakan DoD 5 poin sudah cukup. <b>Acceptance criteria:</b> berubah pada PBI-001 (peran Manajer), PBI-009 (penyetuju manajer), PBI-013 dan PBI-014 (hanya data utama).", ParagraphStyle("Bs", parent=B, spaceBefore=6)))

# 6. Pembelajaran
story.append(Paragraph("6. Pembelajaran", H2))
rows = [["No", "Perbaikan yang akan diuji pada sprint berikutnya", "Cara menguji"],
        ["1", "Uji koneksi dan audio 10 menit sebelum pertemuan, catat nama dan jabatan peserta mitra, dan tulis jawaban satu per satu di bawah tiap pertanyaan.", "Notulensi Sprint Review berikutnya memuat daftar hadir lengkap dan semua pertanyaan memiliki jawaban tertulis."],
        ["2", "Validasi prioritas dengan demo dan meminta konfirmasi tertulis mitra (balasan pesan) atas notulensi dan change request.", "Pada Sprint Review, mitra memberi tanggapan atas demo telemetri dan membalas ringkasan notulensi."]]
story.append(table(rows, [0.9*cm, 9.6*cm, 7.5*cm]))

# 7. Konfirmasi
story.append(Paragraph("7. Konfirmasi Mitra", H2))
story.append(Paragraph("Belum ada tanda tangan, paraf, atau balasan pesan tertulis dari mitra yang membenarkan isi notulensi dan change request. Sebagai rekaman yang dapat ditelusuri tersedia rekaman audio dan video Zoom, catatan chat, tangkapan layar, dan notulensi tertulis (lihat Dokumentasi).", B))

# 8. Dokumentasi (tautan di bagian paling bawah)
doc = [Paragraph("8. Dokumentasi", H2),
       Paragraph("Seluruh bukti tersimpan di Google Drive kelompok.", B), Spacer(1, 3)]
links = [("Folder dokumentasi Sprint 1 (notulensi, tangkapan layar, video)", "https://drive.google.com/drive/folders/1F9rs3wpp2XFrHoO51Uv_qANagDjz6ypo"),
         ("Notulensi Sprint 1 (Google Docs)", "https://docs.google.com/document/d/1m4_fbfmwU-W2BKy1SuhNJJdMp-xkCV1SfbyG2RqCIGE/edit"),
         ("Rekaman Zoom 17 November 2026 (audio, video, chat)", "https://drive.google.com/drive/folders/1BuOoIAEGiHTXpf8WGCCfX-_UMtg-rnNd"),
         ("Board Trello", d["product"]["boardUrl"])]
for name, url in links:
    doc.append(Paragraph("%s:<br/><a href=\"%s\"><u>%s</u></a>" % (esc(name), url, url), LK))
    doc.append(Spacer(1, 3))
story.append(KeepTogether(doc))

SimpleDocTemplate(OUT, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.8*cm, bottomMargin=1.8*cm,
                  title="[MPT A] LAPANGAN PEKAN 11 - Kelompok 06", author="Kelompok 6 MPT A").build(story)
print("ok", OUT)
