// Membuat docs/product-backlog.md dari src/data/backlog.json
// Jalankan: node scripts/gen-backlog-doc.mjs
import fs from 'fs'

const d = JSON.parse(fs.readFileSync('src/data/backlog.json', 'utf8'))

let o = `# Product Backlog

**Product:** Adudu Dev - Unified Agile Platform
**Product Owner:** Terano
**Visi:** Mengganti spreadsheet manual dengan platform terpusat untuk mengelola backlog, dependensi antardivisi, progres otomatis, dan standar Definition of Done.

> File ini dibuat otomatis dari src/data/backlog.json. Ubah datanya di JSON, lalu jalankan \`node scripts/gen-backlog-doc.mjs\`.

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
`
for (const e of d.epics) o += `| ${e.id} | ${e.title} | ${e.goal} | ${e.sprint} |\n`

o += `\n## Ringkasan Item\n| ID | Epic | Prioritas | Poin | Sprint | Status | Dependensi |\n|----|------|-----------|------|--------|--------|------------|\n`
for (const i of d.items) {
  o += `| ${i.id} | ${i.epic} | ${i.priority} | ${i.points} | ${i.sprint} | ${i.status} | ${i.dependsOn.join(', ') || '-'} |\n`
}

const tot = {}
for (const i of d.items) tot[i.sprint] = (tot[i.sprint] || 0) + i.points
o += `\n**Total poin per sprint:** ${Object.entries(tot).map(([s, p]) => `Sprint ${s}: ${p}`).join(' | ')}\n\n## Rincian Item\n`

for (const e of d.epics) {
  o += `\n### ${e.id}: ${e.title}\n`
  for (const i of d.items.filter(x => x.epic === e.id)) {
    o += `\n#### ${i.id} (${i.priority}, ${i.points} poin, Sprint ${i.sprint})\n${i.title}\n\n`
    o += `- Divisi: ${i.division}\n- Dependensi: ${i.dependsOn.join(', ') || '-'}\n- Acceptance criteria:\n`
    o += i.acceptance.map(a => `  - [ ] ${a}`).join('\n') + '\n'
  }
}

o += `\n## Definition of Done (umum)\n- [ ] Acceptance criteria terpenuhi\n- [ ] Kode di-review dan di-merge ke main\n- [ ] Diuji dan tanpa bug kritis\n- [ ] Dokumentasi diperbarui\n- [ ] Disetujui Product Owner\n`

fs.writeFileSync('docs/product-backlog.md', o)
