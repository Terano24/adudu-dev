// Membuat docs/product-backlog.md dan docs/sprints/sprint-N.md dari src/data/backlog.json
// Jalankan: node scripts/gen-backlog-doc.mjs
import fs from 'fs'

const d = JSON.parse(fs.readFileSync('src/data/backlog.json', 'utf8'))
const items = [...d.items].sort((a, b) => a.rank - b.rank)
const dep = i => i.dependsOn.join(', ') || '-'

let o = `# Product Backlog: ${d.product.name}

**Mitra:** ${d.product.partner}
**Kelompok:** ${d.product.group} (${d.product.class})
**Visi:** ${d.product.vision}

> File ini dibuat otomatis dari src/data/backlog.json. Ubah datanya di JSON, lalu jalankan \`node scripts/gen-backlog-doc.mjs\`.

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
`
for (const t of d.team) o += `| ${t.name} | ${t.nrp} | ${t.role} | ${t.responsibility} |\n`

o += `\n## Definition of Done (berlaku untuk semua item)\n${d.dod.map(x => `- [ ] ${x}`).join('\n')}\n`

o += `\n## Ringkasan Epic\n| ID | Epic | Tujuan |\n|----|------|--------|\n`
for (const e of d.epics) o += `| ${e.id} | ${e.title} | ${e.goal} |\n`

o += `\n## Ringkasan Item (urut prioritas)\n| No | ID | Epic | Prioritas | Poin | Sprint | Pemegang | Status | Dependensi |\n|----|----|------|-----------|------|--------|----------|--------|------------|\n`
for (const i of items) o += `| ${i.rank} | ${i.id} | ${i.epic} | ${i.priority} | ${i.points} | ${i.sprint}${i.sprint === 1 ? ' (dipilih)' : ''} | ${i.owner} | ${i.status} | ${dep(i)} |\n`

const tot = {}, own = {}
for (const i of items) { tot[i.sprint] = (tot[i.sprint] || 0) + i.points; own[i.owner] = (own[i.owner] || 0) + i.points }
o += `\n**Poin per sprint:** ${Object.entries(tot).map(([s, p]) => `Sprint ${s}: ${p}`).join(' | ')}\n`
o += `\n**Poin per Developer:** ${Object.entries(own).map(([s, p]) => `${s}: ${p}`).join(' | ')}\n`

o += `\n## Sprint Goal\n${Object.entries(d.sprintGoals).map(([s, g]) => `- Sprint ${s}: ${g}`).join('\n')}\n`

o += `\n## Rincian Item\n`
for (const e of d.epics) {
  o += `\n### ${e.id}: ${e.title}\n`
  for (const i of items.filter(x => x.epic === e.id)) {
    o += `\n#### No ${i.rank}: ${i.id} (${i.priority}, ${i.points} poin, Sprint ${i.sprint}${i.sprint === 1 ? ', dipilih' : ''})\n${i.title}\n\n- Pemegang: ${i.owner}\n- Dependensi: ${dep(i)}\n- Acceptance criteria:\n`
    o += i.acceptance.map(a => `  - [ ] ${a}`).join('\n') + '\n'
  }
}
fs.writeFileSync('docs/product-backlog.md', o)

for (const n of [1, 2, 3, 4]) {
  const list = items.filter(i => i.sprint === n)
  let s = `# Sprint ${n} (Minggu ${n})\n\nSprint Goal: ${d.sprintGoals[n]}\n\nTotal: ${tot[n]} poin\n\n`
  s += list.map(i => `- [ ] ${i.id} ${i.title} (${i.points} poin, ${i.owner})`).join('\n') + '\n'
  fs.writeFileSync(`docs/sprints/sprint-${n}.md`, s)
}
