#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/var/www/basketball-team-website}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/basketball-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
INCLUDE_WEB_VIDEOS="${INCLUDE_WEB_VIDEOS:-1}"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Project directory not found: $PROJECT_DIR" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

LOCK_DIR="$BACKUP_DIR/.backup-runtime.lock"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Another backup is already running: $LOCK_DIR" >&2
  exit 1
fi
trap 'rm -rf "$LOCK_DIR"' EXIT

TIMESTAMP="$(date +%F-%H%M%S)"
ARCHIVE="$BACKUP_DIR/basketball-auto-runtime-$TIMESTAMP.tar.gz"
MANIFEST="$(mktemp)"
trap 'rm -f "$MANIFEST"; rm -rf "$LOCK_DIR"' EXIT

add_path() {
  local relative_path="$1"
  if [ -e "$PROJECT_DIR/$relative_path" ]; then
    printf '%s\n' "$relative_path" >> "$MANIFEST"
  else
    echo "Skip missing path: $relative_path" >&2
  fi
}

add_path "data/site-data.json"
add_path "public/assets/uploads"

if [ "$INCLUDE_WEB_VIDEOS" = "1" ] && [ -d "$PROJECT_DIR/public/assets/gallery" ]; then
  (
    cd "$PROJECT_DIR"
    find public/assets/gallery -type f -name '*-web.mp4' | sort
  ) >> "$MANIFEST"
fi

if [ ! -s "$MANIFEST" ]; then
  echo "Nothing to back up." >&2
  exit 1
fi

tar -czf "$ARCHIVE" -C "$PROJECT_DIR" -T "$MANIFEST"
tar -tzf "$ARCHIVE" >/dev/null

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$ARCHIVE" > "$ARCHIVE.sha256"
fi

if [ "$RETENTION_DAYS" -gt 0 ] 2>/dev/null; then
  find "$BACKUP_DIR" -type f -name 'basketball-auto-runtime-*.tar.gz' -mtime +"$RETENTION_DAYS" -delete
  find "$BACKUP_DIR" -type f -name 'basketball-auto-runtime-*.tar.gz.sha256' -mtime +"$RETENTION_DAYS" -delete
fi

echo "Backup created: $ARCHIVE"
ls -lh "$ARCHIVE"
if [ -f "$ARCHIVE.sha256" ]; then
  echo "Checksum: $ARCHIVE.sha256"
fi
