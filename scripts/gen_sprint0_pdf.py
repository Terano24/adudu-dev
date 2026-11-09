"""Membuat laporan Sprint 0 (PDF, A4 portrait, dengan cover) dari src/data/backlog.json.

Jalankan dari root repo:  python scripts/gen_sprint0_pdf.py
Output: docs/[MPT A] SPRINT 0 - Kelompok 06.pdf
"""
import json
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image

d = json.load(open("src/data/backlog.json", encoding="utf-8"))
items = sorted(d["items"], key=lambda i: i["rank"])
OUT = "docs/[MPT A] SPRINT 0 - Kelompok 06.pdf"
LOGO = "docs/assets/logo-its.png"

# Gaya: Times agar formal dan seragam dengan format cover
B = ParagraphStyle("B", fontName="Times-Roman", fontSize=10.5, leading=14)
C = ParagraphStyle("C", parent=B, fontSize=8.5, leading=10.5)
CH = ParagraphStyle("CH", parent=C, textColor=colors.black, fontName="Times-Bold")
H2 = ParagraphStyle("H2", parent=B, fontName="Times-Bold", fontSize=12.5, spaceBefore=12, spaceAfter=5)
# Gaya cover
CT = ParagraphStyle("CT", fontName="Times-Bold", fontSize=13, leading=18, alignment=TA_CENTER)
CI = ParagraphStyle("CI", parent=CT, fontName="Times-BoldItalic")
CS = ParagraphStyle("CS", parent=CT, fontSize=11, leading=15)
CN = ParagraphStyle("CN", parent=CT, fontName="Times-Roman", fontSize=10.5, leading=14)


def esc(t): return str(t).replace("&", "&amp;").replace("<", "&lt;")
def p(t, s=C): return Paragraph(esc(t), s)


def table(rows, widths):
    data = [[p(c, CH if r == 0 else C) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 1.0, colors.black),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, colors.black),
        ("LINEBELOW", (0, -1), (-1, -1), 1.0, colors.black),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


story = []

# ---------------- Cover ----------------
story += [Spacer(1, 2.2*cm),
          Paragraph("Manajemen Proyek Tangkas (MPT)", CT),
          Spacer(1, 6),
          Paragraph("Sprint 0", CI),
          Spacer(1, 6),
          Paragraph("Laporan Sprint 0: %s" % d["product"]["name"], CT),
          Paragraph("Mitra: %s" % d["product"]["partner"], CS),
          Spacer(1, 1.2*cm)]
logo = Image(LOGO, width=6.2*cm, height=6.2*cm)
logo.hAlign = "CENTER"
story += [logo, Spacer(1, 1.2*cm),
          Paragraph("MPT - Kelas A", CT),
          Paragraph("%s" % d["product"]["group"], CT),
          Spacer(1, 6),
          Paragraph("Disusun Oleh:", ParagraphStyle("DO", parent=CS, fontSize=10.5))]
members = Table([[p(t["name"], CN), p("(%s)" % t["nrp"], CN)] for t in d["team"]], colWidths=[7.5*cm, 3*cm])
members.setStyle(TableStyle([("ALIGN", (0, 0), (0, -1), "RIGHT"), ("ALIGN", (1, 0), (1, -1), "LEFT"),
                             ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
story += [members, Spacer(1, 2.4*cm),
          Paragraph("Program Studi Sarjana Sistem Informasi", CS),
          Paragraph("Fakultas Teknologi Elektro dan Informatika Cerdas", CS),
          Paragraph("INSTITUT TEKNOLOGI SEPULUH NOPEMBER", CS),
          Paragraph("2026", CS),
          PageBreak()]

# ---------------- Isi ----------------
story += [Paragraph("Laporan Sprint 0: %s" % d["product"]["name"], ParagraphStyle("T", parent=H2, fontSize=15, spaceBefore=0)),
          Paragraph("<b>Mata kuliah:</b> Manajemen Proyek Tangkas (MPT), Kelas A", B),
          Paragraph("<b>Kelompok:</b> %s | <b>Mitra:</b> %s" % (esc(d["product"]["group"]), esc(d["product"]["partner"])), B),
          Paragraph("<b>Visi produk:</b> " + esc(d["product"]["vision"]), B),
          Paragraph("<b>Tautan board:</b> " + esc(d["product"]["boardUrl"]), B),
          Paragraph("Data telemetri pada platform ini merupakan data simulasi dan bukan data riil tim.", B)]

story.append(Paragraph("1. Identitas Kelompok dan Pembagian Peran", H2))
rows = [["Nama", "NRP", "Peran", "Item yang dipegang", "Status"]]
for t in d["team"]:
    key = {"Aryo": "Aryo", "Muhammad": "Ibra", "Dimas": "Dimas"}.get(t["name"].split()[0])
    mine = [i for i in items if key and i["owner"] == key]
    if t["role"] == "Product Owner":
        held, status = "Penyusunan dan prioritas Product Backlog, persetujuan item", "Backlog Sprint 0 disusun"
    elif t["role"] == "Scrum Master":
        held, status = "Fasilitasi event Scrum, pengawasan DoD", "Belum dimulai (Sprint 1)"
    else:
        held = ", ".join(i["id"] for i in mine) + " (%d poin)" % sum(i["points"] for i in mine)
        status = "Belum dimulai (Sprint 1)"
    rows.append([t["name"], t["nrp"], t["role"], held, status])
story.append(table(rows, [3.6*cm, 2.0*cm, 2.2*cm, 6.4*cm, 3.8*cm]))
story.append(Spacer(1, 4))
story.append(Paragraph("Peran ditetapkan sejak awal dan tidak ditukar di tengah sprint.", B))

story.append(Paragraph("2. Definition of Done (berlaku untuk semua item)", H2))
for x in d["dod"]:
    story.append(Paragraph("- " + esc(x), B))

story.append(PageBreak())
story.append(Paragraph("3. Product Backlog (%d item)" % len(items), ParagraphStyle("H2b", parent=H2, spaceBefore=0)))
story.append(Paragraph("Item diurutkan dalam satu daftar (No 1 paling prioritas) dan dilengkapi kategori MoSCoW. Estimasi memakai story points skala Fibonacci. Item bertanda S1 dipilih untuk Sprint 1 (baris diberi warna latar abu-abu muda).", B))
story.append(Spacer(1, 4))
rows = [["No. ID", "User story", "Acceptance criteria", "Prior.", "Poin", "Sprint", "Pemegang"]]
for i in items:
    ac = Paragraph("<br/>".join("%d. %s" % (n + 1, esc(a)) for n, a in enumerate(i["acceptance"])), C)
    rows.append(["%d. %s" % (i["rank"], i["id"]), i["title"], ac, i["priority"], i["points"],
                 ("%d (S1)" % i["sprint"]) if i["sprint"] == 1 else i["sprint"], i["owner"]])
data = [[(c if hasattr(c, "wrap") else p(c, CH if r == 0 else C)) for c in row] for r, row in enumerate(rows)]
t = Table(data, colWidths=[1.9*cm, 4.9*cm, 6.0*cm, 1.2*cm, 0.9*cm, 1.3*cm, 1.4*cm], repeatRows=1)
sty = [("LINEABOVE", (0, 0), (-1, 0), 1.0, colors.black),
       ("LINEBELOW", (0, 0), (-1, 0), 0.6, colors.black),
       ("LINEBELOW", (0, -1), (-1, -1), 1.0, colors.black),
       ("LINEBELOW", (0, 1), (-1, -2), 0.25, colors.HexColor("#bdbdbd")),
       ("VALIGN", (0, 0), (-1, -1), "TOP"),
       ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
for r, i in enumerate(items, start=1):
    if i["sprint"] == 1:
        sty.append(("BACKGROUND", (0, r), (-1, r), colors.HexColor("#e9e9e9")))
t.setStyle(TableStyle(sty))
story.append(t)

tot = {}
for i in items:
    tot[i["sprint"]] = tot.get(i["sprint"], 0) + i["points"]
story.append(Spacer(1, 6))
story.append(Paragraph("Poin per sprint: " + " | ".join("Sprint %d: %d" % kv for kv in sorted(tot.items())), B))

story.append(Paragraph("4. Item Terpilih untuk Sprint 1", H2))
rows = [["No. ID", "Item", "Poin", "Pemegang"]] + [["%d. %s" % (i["rank"], i["id"]), i["title"], i["points"], i["owner"]] for i in items if i["sprint"] == 1]
story.append(table(rows, [2.2*cm, 12.0*cm, 1.4*cm, 2.4*cm]))

SimpleDocTemplate(OUT, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.8*cm, bottomMargin=1.8*cm,
                  title="[MPT A] SPRINT 0 - Kelompok 06", author="Kelompok 6 MPT A").build(story)
print("ok", OUT)
