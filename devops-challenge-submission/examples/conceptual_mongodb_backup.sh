#!/usr/bin/env bash
set -euo pipefail

# Conceptual MongoDB backup from a Docker container using mongodump archive+gzip.

MONGO_CONTAINER="mongodb"
MONGO_DB="app_db"
BACKUP_DIR="/opt/backups/mongo"
TIMESTAMP="$(date -Iseconds)"

mkdir -p "${BACKUP_DIR}"

echo "[INFO] Dumping MongoDB database ${MONGO_DB} from container ${MONGO_CONTAINER}..."
docker exec "${MONGO_CONTAINER}" sh -lc \
  "mongodump --db '${MONGO_DB}' --archive --gzip" \
  > "${BACKUP_DIR}/mongo_${MONGO_DB}_${TIMESTAMP}.archive.gz"

echo "[INFO] Backup created at ${BACKUP_DIR}/mongo_${MONGO_DB}_${TIMESTAMP}.archive.gz"


