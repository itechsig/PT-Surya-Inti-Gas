# Dashboard Admin & Unmanned Agent - Setup Guide

## Overview
Sistem dashboard admin dan unmanned agent telah berhasil dibuat untuk monitoring pesan dari ContactForm dan tracking pengunjung website.

## Fitur yang Tersedia

### 1. Dashboard Admin
- Overview statistik (kontak, pengunjung, page views)
- Monitoring pesan kontak dari ContactForm
- Tracking pengunjung website (IP, browser, OS, device)
- Analytics dan statistik lengkap
- Filter berdasarkan tanggal dan status

### 2. Unmanned Agent
- Monitoring kontak pending (otomatis setiap jam)
- Monitoring aktivitas pengunjung (otomatis setiap jam)
- Generate analytics harian (otomatis setiap hari pukul 00:01)
- Kirim laporan harian ke admin (otomatis setiap hari pukul 08:00)
- Cleanup data lama (otomatis setiap minggu)
- Deteksi aktivitas mencurigakan
- Alert untuk kontak yang pending lebih dari 24 jam

### 3. Visitor Tracking
- Tracking otomatis pengunjung website
- Session management
- Tracking page views
- Deteksi device type (mobile, desktop, tablet)
- Tracking browser dan OS
- Deteksi returning visitors

## Setup yang Sudah Dilakukan

### Database Migrations
✅ Menjalankan `php artisan migrate` untuk membuat tabel:
- `contacts` - menyimpan pesan dari ContactForm
- `website_visitors` - menyimpan data pengunjung website
- `dashboard_analytics` - menyimpan statistik harian

### Backend Changes
✅ Membuat models:
- Contact.php
- WebsiteVisitor.php
- DashboardAnalytics.php

✅ Membuat controllers:
- DashboardController.php - API endpoints untuk dashboard
- VisitorTrackingController.php - tracking pengunjung

✅ Membuat command:
- RunDashboardAgent.php - unmanned agent untuk monitoring

✅ Update files:
- ContactController.php - menyimpan pesan ke database
- api.php - tambah routes untuk dashboard dan visitor tracking
- AppServiceProvider.php - setup scheduling untuk unmanned agent

### Frontend Changes
✅ Membuat komponen:
- AdminDashboard.tsx - UI dashboard admin
- visitorTracking.ts - utility untuk tracking pengunjung

✅ Update files:
- api.ts - tambah endpoint untuk dashboard
- App.tsx - integrasi visitor tracking

## Cara Penggunaan

### 1. Testing Dashboard Agent (Manual)
```bash
cd Backend
php artisan dashboard:agent                  # Jalankan semua task
php artisan dashboard:agent monitor-contacts # Monitor kontak saja
php artisan dashboard:agent monitor-visitors # Monitor pengunjung saja
php artisan dashboard:agent generate-analytics # Generate analytics
php artisan dashboard:agent cleanup         # Cleanup data lama
php artisan dashboard:agent send-reports    # Kirim laporan admin
```

### 2. Testing API Endpoints
Untuk testing API endpoints, Anda perlu login dan mendapatkan token auth:

```bash
# Login untuk mendapatkan token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Testing dashboard overview (ganti TOKEN dengan token dari login)
curl -X GET "http://localhost:8000/api/v1/admin/dashboard/overview?date_range=today" \
  -H "Authorization: Bearer TOKEN"

# Testing contacts list
curl -X GET "http://localhost:8000/api/v1/admin/dashboard/contacts" \
  -H "Authorization: Bearer TOKEN"

# Testing visitors list
curl -X GET "http://localhost:8000/api/v1/admin/dashboard/visitors" \
  -H "Authorization: Bearer TOKEN"
```

### 3. Testing Visitor Tracking
Visitor tracking sudah otomatis terintegrasi di frontend. Untuk testing:
1. Buka website frontend
2. Navigasi ke berbagai halaman
3. Cek dashboard admin untuk melihat data pengunjung

### 4. Mengakses Dashboard Admin
Frontend dashboard UI sudah dibuat di `Frontend/src/app/components/Dashboard/AdminDashboard.tsx`. Untuk menggunakannya:
1. Import komponen di route yang sesuai
2. Pastikan user sudah login dan memiliki token auth
3. Component akan otomatis fetch data dari API

## Scheduling Otomatis

Unmanned agent sudah dikonfigurasi untuk berjalan otomatis:

```php
// Di AppServiceProvider.php
- monitor-contacts: setiap jam
- monitor-visitors: setiap jam  
- generate-analytics: setiap hari pukul 00:01
- send-reports: setiap hari pukul 08:00
- cleanup: setiap minggu
```

Untuk mengaktifkan scheduling, pastikan Laravel scheduler berjalan di server:
```bash
# Tambahkan ke crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## Fitur Alert dan Notification

### 1. Pending Contact Alert
- Jika ada kontak pending > 24 jam, agent akan kirim email ke admin
- Jika ada kontak pending > 48 jam, critical alert akan dibuat

### 2. Visitor Anomaly Detection
- Detect jika traffic drop > 50% dari kemarin
- Detect jika traffic spike > 200% (potensi bot attack)
- Detect jika ada IP yang mengunjungi > 10 kali dalam 1 jam

### 3. Daily Report
- Email otomatis ke admin setiap hari pukul 08:00
- Berisi: total visitors, page views, new contacts, pending contacts, dll

## Data Cleanup

Agent akan otomatis cleanup data lama:
- Visitor data > 90 hari
- Analytics data > 1 tahun
- Soft-deleted contacts > 180 days

## Troubleshooting

### Dashboard agent tidak berjalan
```bash
# Clear cache
php artisan config:clear
php artisan cache:clear

# Test manual
php artisan dashboard:agent
```

### Visitor tracking tidak bekerja
- Pastikan visitorTracking sudah di-import di App.tsx
- Check browser console untuk error
- Pastikan backend endpoint `/api/visitor/track` accessible

### API endpoints mengembalikan 401
- Pastikan token auth valid
- Check middleware configuration
- Verify user role has admin access

## Security Notes

1. **IP Whitelist**: Dashboard routes menggunakan IP whitelist middleware
2. **Authentication**: Semua admin routes memerlukan Sanctum token
3. **Rate Limiting**: API endpoints dilindungi dengan rate limiting
4. **CSRF Protection**: Contact form menggunakan CSRF token
5. **Input Sanitization**: Semua input disanitasi sebelum disimpan

## Next Steps

1. **Frontend Integration**: Integrasikan AdminDashboard.tsx ke dalam routing admin
2. **Authentication Setup**: Pastikan sistem auth berfungsi dengan benar
3. **Email Configuration**: Setup mail config untuk notification dan reports
4. **Geolocation**: Optional: integrasi dengan geolocation API untuk lokasi pengunjung
5. **Real-time**: Optional: implement WebSocket untuk real-time dashboard updates

## Testing Checklist

- [ ] Migrations berhasil dijalankan
- [ ] Dashboard agent berjalan manual tanpa error
- [ ] Contact form menyimpan ke database
- [ ] Visitor tracking berfungsi di frontend
- [ ] API endpoints dapat diakses dengan auth
- [ ] Dashboard UI menampilkan data dengan benar
- [ ] Scheduling berjalan otomatis
- [ ] Email notifications berfungsi (jika diaktifkan)

## Status Implementation

✅ **COMPLETED**: Semua komponen backend dan frontend sudah dibuat
✅ **TESTED**: Database migrations, dashboard agent command
⚠️ **REQUIRES**: Integration ke admin routing, testing auth, email setup
