# 🏛️ Koperasi Jasa Karyawan — PT. Elsewedy Electric Indonesia

Aplikasi PWA Simpan Pinjam Karyawan  
**Stack:** Next.js 14 · Supabase (PostgreSQL) · Vercel · Tailwind CSS  
**Developer:** CarloTech — The Ecosystem of Innovation

---

## 🗂️ Struktur Fitur

| Dashboard | Role | Fitur Utama |
|-----------|------|-------------|
| **Anggota** | anggota | Saldo simpanan, status pinjaman, tarik simpanan, ajukan pinjaman, info & berita |
| **Pengurus** | sekretaris | Approval L1, manajemen pengumuman, data anggota |
| **Pengurus** | bendahara | Approval L2, approval penarikan, pencairan pinjaman, kas |
| **Pengurus** | ketua | Approval L3 (final), semua laporan, full view |
| **Admin** | admin | Full access, tambah anggota, override transaksi, audit log, konfigurasi |

---

## 🚀 Panduan Deploy (Step by Step)

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Catat: `Project URL`, `anon key`, `service_role key`
3. Buka **SQL Editor** → paste isi file `supabase/schema.sql` → **Run**
4. Tambah fungsi RPC di SQL Editor:
```sql
CREATE OR REPLACE FUNCTION increment_saldo(p_user_id UUID, p_amount BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE saldo_simpanan SET saldo = saldo + p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Clone & Setup Lokal

```bash
git clone <repo-url>
cd koperasi-elsewedy
npm install

# Salin environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=koperasi-elsewedy-secret-key-2025-min32chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=koperasi@elsewedy.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=Koperasi Karyawan Elsewedy <koperasi@elsewedy.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-cron-secret
```

### 3. Seed Database

```bash
node scripts/seed.js
```

Output akan menampilkan semua credential login.

### 4. Run Development

```bash
npm run dev
# Buka http://localhost:3000
```

### 5. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel Dashboard:
# Settings → Environment Variables → tambahkan semua dari .env.example
# PENTING: Set NEXT_PUBLIC_APP_URL ke URL Vercel Anda
```

Atau via GitHub:
1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Tambah semua env variables
4. **Deploy**

---

## ⚙️ Setup Email (Gmail)

1. Buka Google Account → Security → **2-Step Verification** (aktifkan)
2. Cari **App Passwords** → Generate untuk "Mail"
3. Gunakan password 16 karakter sebagai `SMTP_PASS`

---

## 🔄 Auto-Deduct (Cron Job)

Vercel akan otomatis menjalankan cron setiap **tanggal 25 pukul 00:00 WIB** (17:00 UTC).

Konfigurasi di `vercel.json`:
```json
{
  "crons": [{ "path": "/api/auto-deduct", "schedule": "0 17 24 * *" }]
}
```

> Catatan: Vercel Cron memerlukan plan **Pro** ($20/bln) untuk jadwal custom.  
> Alternatif gratis: gunakan [cron-job.org](https://cron-job.org) dengan URL:  
> `POST https://your-app.vercel.app/api/auto-deduct`  
> Header: `x-cron-secret: <CRON_SECRET dari env>`

---

## 📱 PWA (Install di HP)

Di Chrome/Safari mobile:
1. Buka URL aplikasi
2. Tap **"Add to Home Screen"** / **"Install App"**
3. Aplikasi berjalan seperti native app

---

## 🔐 Alur Login & Password

| Kondisi | Behavior |
|---------|----------|
| Login pertama | Redirect ke halaman ganti password |
| NIK + password default | Format: `{NIK}Kop{3 digit terakhir NIK}` |
| Contoh NIK 2024001 | Password: `2024001Kop001` |
| Lupa password | Hubungi Admin → Admin reset via dashboard |

---

## 📊 Alur Approval Pinjaman

```
Anggota ajukan
    ↓
Sekretaris (L1) → approve/tolak
    ↓
Bendahara (L2) → approve/tolak
    ↓
Ketua (L3 FINAL) → approve/tolak
    ↓ (jika approve)
📧 Email otomatis ke Bendahara: "Siap dicairkan"
    ↓
Bendahara transfer manual → konfirmasi di dashboard
    ↓
📧 Email ke Anggota: "Dana sudah cair"
    ↓
Auto-deduct cicilan mulai tgl 25 bulan berikutnya
```

---

## 📅 Auto-Deduct Tgl 25

```
Sistem berjalan otomatis 00:00 WIB tgl 25
    ↓
Potong simpanan bulanan semua anggota
    ↓
Potong cicilan pinjaman yang jatuh tempo
    ↓
Update saldo simpanan & status cicilan
    ↓
📧 Email slip potongan → masing-masing anggota
    ↓
📧 Email laporan rekap → HR & Bendahara
```

---

## 🗄️ Struktur Database

```
users           → semua pengguna (anggota, pengurus, admin)
saldo_simpanan  → saldo real-time per anggota
simpanan        → riwayat setoran simpanan
pinjaman        → pengajuan & data pinjaman
cicilan         → jadwal & status cicilan per bulan
penarikan       → pengajuan penarikan simpanan
pengumuman      → berita & pengumuman koperasi
kas             → buku kas masuk/keluar koperasi
audit_log       → log seluruh aktivitas sistem
email_log       → log pengiriman email
auto_deduct_log → riwayat eksekusi auto-deduct
```

---

## 📁 Struktur Project

```
koperasi-elsewedy/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Halaman login
│   │   ├── (dashboard)/
│   │   │   ├── anggota/           # Dashboard anggota
│   │   │   ├── pengurus/          # Dashboard pengurus + pengumuman
│   │   │   └── admin/             # Dashboard super admin
│   │   └── api/
│   │       ├── auth/              # Login, logout
│   │       ├── pinjaman/          # CRUD + approval pinjaman
│   │       ├── simpanan/          # Riwayat & saldo simpanan
│   │       ├── penarikan/         # Pengajuan & approval penarikan
│   │       ├── pengumuman/        # CRUD pengumuman
│   │       ├── anggota/           # Manajemen user
│   │       └── auto-deduct/       # Trigger auto-deduct
│   ├── components/
│   │   └── layout/AppLayout.tsx   # Sidebar + topbar + footer
│   └── lib/
│       ├── supabase.ts            # Supabase client
│       ├── auth.ts                # JWT, bcrypt
│       ├── email.ts               # Semua template email
│       ├── auto-deduct.ts         # Logika auto-deduct
│       └── utils.ts               # Format, helpers
├── supabase/schema.sql            # DDL lengkap
├── scripts/seed.js                # Seed data awal
├── middleware.ts                  # Auth + route protection
├── vercel.json                    # Cron config
└── public/
    ├── logo-koperasi.jpg          # Logo koperasi
    ├── logo-carlotech.png         # Logo CarloTech
    └── manifest.json              # PWA manifest
```

---

## 📧 Daftar Email Otomatis

| Trigger | Penerima |
|---------|----------|
| Anggota baru ditambahkan | Anggota |
| Pengajuan pinjaman terkirim | Anggota |
| Approval L1/L2/L3 | Anggota |
| L3 approve → notif pencairan | **Bendahara** |
| Pinjaman dicairkan | Anggota |
| Penarikan disetujui | Anggota |
| Transfer penarikan dilakukan | Anggota |
| Auto-deduct tgl 25 | Anggota (slip) + HR & Bendahara (rekap) |
| Perubahan profil | Anggota |
| Pengumuman diterbitkan (opsional) | Semua anggota |

---

## 🛠️ Troubleshooting

**Build error `Cannot find module`**
```bash
npm install
```

**Supabase connection error**
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan key sudah benar di `.env.local`

**Email tidak terkirim**
- Cek App Password Gmail sudah dibuat
- Test kirim via endpoint: `POST /api/test-email` (buat manual jika perlu)

**Cron tidak berjalan**
- Vercel Pro: cek Vercel Dashboard → Cron Jobs
- Alternatif: setup cron-job.org dengan POST + header secret

---

*Developed by CarloTech — The Ecosystem of Innovation*  
*© 2025 Koperasi Jasa Karyawan PT. Elsewedy Electric Indonesia*
