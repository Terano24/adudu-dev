"""Membuat PDF Product Backlog dari src/data/backlog.json.

Jalankan dari root repo:  python scripts/gen_backlog_pdf.py
Output: docs/Product Backlog - SenaFlow.pdf
"""
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

d = json.load(open("src/data/backlog.json", encoding="utf-8"))
items = sorted(d["items"], key=lambda i: i["rank"])
OUT = "docs/Product Backlog - SenaFlow.pdf"

ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Heading1"], fontSize=16, spaceAfter=6)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], fontSize=12, spaceBefore=10, spaceAfter=4)
H3 = ParagraphStyle("H3", parent=ss["Heading3"], fontSize=10, spaceBefore=8, spaceAfter=2)
B = ParagraphStyle("B", parent=ss["BodyText"], fontSize=9, leading=12)
C = ParagraphStyle("C", parent=B, fontSize=8, leading=10)
CH = ParagraphStyle("CH", parent=C, textColor=colors.white, fontName="Helvetica-Bold")

def esc(t): return str(t).replace("&", "&amp;").replace("<", "&lt;")
def p(t, s=C): return Paragraph(esc(t), s)

def table(rows, widths, shade=None):
    data = [[p(c, CH if r == 0 else C) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1)
    sty = [("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#404040")),
           ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#808080")),
           ("VALIGN", (0, 0), (-1, -1), "TOP"),
           ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f5f5f5")])]
    t.setStyle(TableStyle(sty))
    return t

dep = lambda i: ", ".join(i["dependsOn"]) or "-"
st = []
st += [Paragraph("Product Backlog: %s" % d["product"]["name"], H1),
       Paragraph("Mitra: %s | %s (%s)" % (d["product"]["partner"], d["product"]["group"], d["product"]["class"]), B),
       Spacer(1, 4), Paragraph("<b>Visi:</b> " + esc(d["product"]["vision"]), B)]

st.append(Paragraph("Aturan Backlog", H2))
for r in [
    "Setiap item berbentuk user story: Sebagai (peran), saya ingin (tujuan) agar (manfaat).",
    "Item diurutkan dalam satu daftar (No 1 paling prioritas). Urutan mempertimbangkan nilai bagi pengguna, risiko, dan dependensi.",
    "Kategori MoSCoW melengkapi urutan. Estimasi memakai story points skala Fibonacci.",
    "Setiap item memiliki acceptance criteria yang dapat diuji.",
    "Item dinyatakan Done apabila acceptance criteria dan Definition of Done terpenuhi.",
    "Data telemetri pada platform ini merupakan data simulasi dan bukan data riil tim."]:
    st.append(Paragraph("- " + esc(r), B))

st.append(Paragraph("Tim dan Peran", H2))
st.append(table([["Nama", "NRP", "Peran", "Tanggung jawab"]] + [[t["name"], t["nrp"], t["role"], t["responsibility"]] for t in d["team"]],
                [4.2*cm, 2.3*cm, 2.4*cm, 8.1*cm]))

st.append(Paragraph("Definition of Done (berlaku untuk semua item)", H2))
for x in d["dod"]:
    st.append(Paragraph("- " + esc(x), B))

st.append(Paragraph("Ringkasan Epic", H2))
st.append(table([["ID", "Epic", "Tujuan"]] + [[e["id"], e["title"], e["goal"]] for e in d["epics"]], [1.8*cm, 5.2*cm, 10*cm]))

st.append(Paragraph("Sprint Goal", H2))
for s, g in d["sprintGoals"].items():
    st.append(Paragraph("<b>Sprint %s:</b> %s" % (s, esc(g)), B))

st.append(PageBreak())
st.append(Paragraph("Ringkasan Item (urut prioritas)", H2))
rows = [["No", "ID", "Epic", "Prioritas", "Poin", "Sprint", "Pemegang", "Dependensi"]]
for i in items:
    rows.append([i["rank"], i["id"], i["epic"], i["priority"], i["points"], "%d (dipilih)" % i["sprint"] if i["sprint"] == 1 else i["sprint"], i["owner"], dep(i)])
st.append(table(rows, [1*cm, 1.8*cm, 1.8*cm, 1.8*cm, 1.1*cm, 2.3*cm, 1.9*cm, 5.3*cm]))

tot, own, pri = {}, {}, {}
for i in items:
    tot[i["sprint"]] = tot.get(i["sprint"], 0) + i["points"]
    own[i["owner"]] = own.get(i["owner"], 0) + i["points"]
    pri[i["priority"]] = pri.get(i["priority"], 0) + i["points"]
st.append(Spacer(1, 6))
st.append(Paragraph("Poin per sprint: " + " | ".join("Sprint %d: %d" % kv for kv in sorted(tot.items())), B))
st.append(Paragraph("Poin per Developer: " + " | ".join("%s: %d" % kv for kv in own.items()), B))
st.append(Paragraph("Poin per prioritas: " + " | ".join("%s: %d" % kv for kv in pri.items()), B))

st.append(PageBreak())
st.append(Paragraph("Rincian Item", H2))
for e in d["epics"]:
    st.append(Paragraph("%s: %s" % (e["id"], esc(e["title"])), H3))
    for i in [x for x in items if x["epic"] == e["id"]]:
        head = "No %d | %s | %s | %d poin | Sprint %d%s | Pemegang: %s | Dependensi: %s" % (
            i["rank"], i["id"], i["priority"], i["points"], i["sprint"], " (dipilih)" if i["sprint"] == 1 else "", i["owner"], dep(i))
        blk = [Paragraph("<b>%s</b>" % esc(head), C), Paragraph(esc(i["title"]), B)]
        blk += [Paragraph("[ ] " + esc(a), C) for a in i["acceptance"]]
        blk.append(Spacer(1, 6))
        st.append(KeepTogether(blk))

SimpleDocTemplate(OUT, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=1.8*cm, bottomMargin=1.8*cm,
                  title="Product Backlog SenaFlow").build(st)
print("ok", OUT)
