#!/bin/bash
# Deploy frontend (React build) ke Hostinger lewat SSH — hanya assets/ + index.html.
# Tidak menyentuh backend, .env, database, index.php, maupun .htaccess.
#
# Pemakaian (dari root project, di Git Bash):
#   REMOTE_PUBLIC=/home/u937704694/domains/suryaintigas.com/public_html bash scripts/deploy-frontend-hostinger.sh
#
# Opsi:
#   SKIP_BUILD=1   pakai Frontend/dist yang sudah ada (tanpa npm run build)
#   DRY_RUN=1      hanya build + tampilkan yang akan dikirim, tanpa koneksi ke server

set -euo pipefail

SSH_HOST="u937704694@153.92.8.109"
SSH_PORT="65002"
REMOTE_PUBLIC="${REMOTE_PUBLIC:-}"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/Frontend/dist"
TS="$(date +%Y%m%d-%H%M%S)"
PACKAGE="frontend-$TS.tar.gz"
LOCAL_PACKAGE="$ROOT_DIR/$PACKAGE"

if [ -z "$REMOTE_PUBLIC" ] && [ "${DRY_RUN:-0}" != "1" ]; then
  echo "❌ REMOTE_PUBLIC belum diisi (folder public Laravel di server, tempat index.php berada)."
  echo "   Cek di server:  ssh -p $SSH_PORT $SSH_HOST 'ls -d ~/domains/*/public_html'"
  exit 1
fi

# 1. Build
if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo "📦 Build frontend..."
  (cd "$ROOT_DIR/Frontend" && npm run build)
fi

[ -f "$DIST_DIR/index.html" ] && [ -d "$DIST_DIR/assets" ] || { echo "❌ Frontend/dist tidak lengkap."; exit 1; }

# 2. Paket hanya assets/ + index.html (kode JS/CSS & teks terjemahan ada di sini)
echo "🗜️  Membuat paket $PACKAGE..."
tar -czf "$LOCAL_PACKAGE" -C "$DIST_DIR" assets index.html
echo "   Ukuran paket: $(du -h "$LOCAL_PACKAGE" | cut -f1)"

if [ "${DRY_RUN:-0}" = "1" ]; then
  echo "🧪 DRY_RUN: isi paket (tidak dikirim):"
  echo "   $(tar -tzf "$LOCAL_PACKAGE" | wc -l) file, contoh:"
  tar -tzf "$LOCAL_PACKAGE" | grep -iE "index.html|Portfolio" || true
  rm -f "$LOCAL_PACKAGE"
  exit 0
fi

# 3. Upload
echo "⬆️  Upload ke server..."
ssh -p "$SSH_PORT" "$SSH_HOST" "mkdir -p ~/deploy-tmp ~/deploy-backups"
scp -P "$SSH_PORT" "$LOCAL_PACKAGE" "$SSH_HOST:~/deploy-tmp/$PACKAGE"

# 4. Backup lalu pasang di server
echo "🚀 Backup & pasang di server..."
ssh -p "$SSH_PORT" "$SSH_HOST" bash -s -- "$REMOTE_PUBLIC" "$PACKAGE" "$TS" <<'REMOTE'
set -euo pipefail
PUB="$1"; PACKAGE="$2"; TS="$3"
STAGE="$HOME/deploy-tmp/$TS"

# Pengaman: pastikan ini benar folder public Laravel
[ -f "$PUB/index.php" ] || { echo "❌ $PUB/index.php tidak ada — REMOTE_PUBLIC salah, dibatalkan."; exit 1; }

# Backup yang akan ditimpa
cd "$PUB"
tar -czf "$HOME/deploy-backups/frontend-before-$TS.tar.gz" index.html assets
echo "   Backup: ~/deploy-backups/frontend-before-$TS.tar.gz"

# Ekstrak ke folder sementara
mkdir -p "$STAGE"
tar -xzf "$HOME/deploy-tmp/$PACKAGE" -C "$STAGE"

# File JS/CSS baru dulu (nama ber-hash, tidak bentrok dengan yang lama),
# index.html terakhir supaya pengunjung tidak pernah memuat file yang belum ada.
mkdir -p "$PUB/assets"
cp -R "$STAGE/assets/." "$PUB/assets/"
cp "$STAGE/index.html" "$PUB/index.html.new"
mv -f "$PUB/index.html.new" "$PUB/index.html"

rm -rf "$STAGE" "$HOME/deploy-tmp/$PACKAGE"

# Simpan hanya 5 backup terakhir
ls -1t "$HOME"/deploy-backups/frontend-before-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -f

echo "✅ Terpasang di $PUB"
REMOTE

rm -f "$LOCAL_PACKAGE"

echo ""
echo "✅ Deploy selesai. Cek: https://suryaintigas.com/id/portofolio (hard refresh: Ctrl+Shift+R)"
echo "↩️  Rollback bila perlu:"
echo "   ssh -p $SSH_PORT $SSH_HOST 'cd $REMOTE_PUBLIC && tar -xzf ~/deploy-backups/frontend-before-$TS.tar.gz'"
