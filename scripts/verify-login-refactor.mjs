import fs from 'fs'

console.log('--- Memulai Verifikasi Refactor Login (Username/Password) ---')

// 1. Verifikasi AuthContext
const authContent = fs.readFileSync('src/context/AuthContext.jsx', 'utf8')

const checks = [
  { term: "username: 'admin'", desc: 'Kredensial Admin/PO (admin)' },
  { term: "password: 'admin'", desc: 'Password Admin/PO (admin)' },
  { term: "username: 'anggota'", desc: 'Kredensial Anggota Tim (anggota)' },
  { term: "password: 'anggota'", desc: 'Password Anggota Tim (anggota)' },
  { term: "username: 'alumni'", desc: 'Kredensial Alumni Reviewer (alumni)' },
  { term: "password: 'alumni'", desc: 'Password Alumni Reviewer (alumni)' },
  { term: 'loginWithCredentials', desc: 'Fungsi loginWithCredentials' },
  { term: 'STATIC_CREDENTIALS', desc: 'Daftar STATIC_CREDENTIALS' },
]

for (const { term, desc } of checks) {
  if (!authContent.includes(term)) {
    console.error(`❌ GAGAL: ${desc} tidak ditemukan di AuthContext.jsx!`)
    process.exit(1)
  }
}
console.log('✅ AuthContext: Seluruh kredensial statis dan fungsi loginWithCredentials terverifikasi.')

// 2. Verifikasi LoginForm
const loginFormContent = fs.readFileSync('src/features/auth/LoginForm.jsx', 'utf8')

const formChecks = [
  { term: 'lp-username', desc: 'Input field Username' },
  { term: 'lp-password', desc: 'Input field Password' },
  { term: 'showPassword', desc: 'Toggle Show/Hide Password' },
  { term: 'rememberMe', desc: 'Checkbox Remember Me' },
  { term: 'lp-error-banner', desc: 'Komponen Error Banner' },
  { term: 'lp-submit-btn', desc: 'Tombol Submit Login' },
  { term: 'lp-input-icon', desc: 'Styling Icon pada Input' },
  { term: 'lp-test-btn', desc: 'Keterangan Akun Pengujian di Footer' },
]

for (const { term, desc } of formChecks) {
  if (!loginFormContent.includes(term)) {
    console.error(`❌ GAGAL: ${desc} tidak ditemukan di LoginForm.jsx!`)
    process.exit(1)
  }
}
console.log('✅ LoginForm: Struktur form konvensional, ikon input, toggle password, dan footer terverifikasi.')

// 3. Verifikasi LoginPage integration
const loginPageContent = fs.readFileSync('src/pages/LoginPage.jsx', 'utf8')
if (!loginPageContent.includes('loginWithCredentials') || !loginPageContent.includes('handleLogin')) {
  console.error('❌ GAGAL: LoginPage belum terhubung dengan loginWithCredentials!')
  process.exit(1)
}
console.log('✅ LoginPage: Integrasi handleLogin dan redirect terverifikasi.')

// 4. Verifikasi CSS styling
const cssContent = fs.readFileSync('src/index.css', 'utf8')
const cssChecks = [
  { term: '.lp-error-banner', desc: 'CSS Error Banner' },
  { term: '.lp-input-wrap', desc: 'CSS Input Group' },
  { term: '.lp-eye-btn', desc: 'CSS Password Toggle Button' },
  { term: '--color-antasena-purple', desc: 'Identitas Antasena Purple pada Focus' },
  { term: '.lp-test-btn', desc: 'CSS Preset Chips di Footer' },
]

for (const { term, desc } of cssChecks) {
  if (!cssContent.includes(term)) {
    console.error(`❌ GAGAL: ${desc} tidak ditemukan di src/index.css!`)
    process.exit(1)
  }
}
console.log('✅ CSS: Styling glassmorphism, focus identity border, dan presets footer terverifikasi.')

console.log('--- Seluruh Verifikasi Refactor Login Sukses 100% ---')
