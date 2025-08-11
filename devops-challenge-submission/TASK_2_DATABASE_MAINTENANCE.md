# Task 2: Database Maintenance & Backup

Backups must be reliable, automated, encrypted, and tested via restore drills.

## PostgreSQL Backup (Dockerized)

- Exec into the Postgres container and run `pg_dump` (single DB) or `pg_dumpall` (all DBs), streaming to the host.

Example (single DB, custom format) — see also the script: [examples/conceptual_postgres_backup.sh](./examples/conceptual_postgres_backup.sh)

```bash
PG_CONTAINER=postgres
BACKUP_DIR=./backups
POSTGRES_USER=app_user
POSTGRES_DB=app_db
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date -Iseconds)

docker exec -i "$PG_CONTAINER" bash -lc \
  "pg_dump -U '$POSTGRES_USER' -d '$POSTGRES_DB' -F c -Z 9" \
  > "$BACKUP_DIR/postgres_${POSTGRES_DB}_${TIMESTAMP}.dump"
```

Example (all DBs, SQL)

```bash
PG_CONTAINER=postgres
BACKUP_DIR=./backups
POSTGRES_USER=app_user
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date -Iseconds)

docker exec -i "$PG_CONTAINER" bash -lc \
  "pg_dumpall -U '$POSTGRES_USER'" \
  > "$BACKUP_DIR/postgres_all_${TIMESTAMP}.sql"
```

Restore:

```bash
# pg_dump custom format
pg_restore -h <host> -U <user> -d <db> -v <file.dump>

# pg_dumpall SQL
psql -h <host> -U <user> -f <file.sql>
```

Notes:
- Prefer `-F c` custom format for flexible, parallel restore.
- Align client and server versions.
- Schedule nightly backups; retain with daily/weekly/monthly lifecycle.

## MongoDB Backup (Dockerized)

Example (`mongodump` archive + gzip) — see also the script: [examples/conceptual_mongodb_backup.sh](./examples/conceptual_mongodb_backup.sh)

```bash
MONGO_CONTAINER=mongodb
BACKUP_DIR=./backups
MONGO_DB=app_db
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date -Iseconds)

docker exec "$MONGO_CONTAINER" sh -lc \
  "mongodump --db '$MONGO_DB' --archive --gzip" \
  > "$BACKUP_DIR/mongo_${MONGO_DB}_${TIMESTAMP}.archive.gz"
```

Restore:

```bash
mongorestore --nsInclude ${MONGO_DB}.* --archive=<file.archive.gz> --gzip --drop
```

## Backup Storage (Secure & Durable)

- Object storage with encryption and lifecycle: DigitalOcean Spaces, AWS S3.
- Restrict access (least privilege), enable versioning and MFA-delete.
- Optionally encrypt client-side (OpenSSL/age) and store keys in a secure vault.
- Verify integrity (`sha256sum`) and run quarterly restore drills with documented RTO/RPO.

See `examples/` for conceptual scripts.
