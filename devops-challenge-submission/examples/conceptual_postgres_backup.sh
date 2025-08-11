#!/usr/bin/env bash
set -euo pipefail

# Conceptual Postgres logical backup from a Docker container.
# Adjust variables and ensure the container name and credentials are correct.

PG_CONTAINER="postgres"
POSTGRES_USER="app_user"
POSTGRES_DB="app_db"
BACKUP_DIR="/opt/backups/postgres"
TIMESTAMP="$(date -Iseconds)"

mkdir -p "${BACKUP_DIR}"

echo "[INFO] Dumping database ${POSTGRES_DB} from container ${PG_CONTAINER}..."
docker exec -i "${PG_CONTAINER}" bash -lc \
  "pg_dump -U '${POSTGRES_USER}' -d '${POSTGRES_DB}' -F c -Z 9" \
  > "${BACKUP_DIR}/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump"

echo "[INFO] Backup created at ${BACKUP_DIR}/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump"

# Optional: encrypt with OpenSSL AES-256 and remove plaintext
# openssl enc -aes-256-cbc -salt -pbkdf2 \
#   -in "${BACKUP_DIR}/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump" \
#   -out "${BACKUP_DIR}/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump.enc"
# shred -u "${BACKUP_DIR}/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump"


