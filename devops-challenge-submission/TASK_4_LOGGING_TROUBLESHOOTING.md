# Task 4: Logging & Troubleshooting

## Backend Application Logs (systemd)

```bash
sudo journalctl -u nestjs.service -n 300 --no-pager
sudo journalctl -u nestjs.service -f --no-pager
sudo journalctl -u nestjs.service --since "2025-01-01 00:00:00" --no-pager
```

Recommendations:
- Structured logs (JSON) with correlation IDs.
- Centralize with Loki/Promtail or Elasticsearch/Filebeat; add alerts.

## Database Logs (Docker)

```bash
# PostgreSQL
PG_CONTAINER=postgres
docker logs --tail 200 "$PG_CONTAINER" | cat

docker logs -f "$PG_CONTAINER"

# MongoDB
MONGO_CONTAINER=mongodb
docker logs --tail 200 "$MONGO_CONTAINER" | cat

docker logs -f "$MONGO_CONTAINER"
```

## Full-Stack Troubleshooting (Next.js form error)

1. Frontend (Vercel): build status, function/edge logs, correct env vars, reproduction via preview URL.
2. Browser DevTools: Network (status code, payload), Console errors, timestamps.
3. Backend (Droplet): `journalctl -u nestjs.service -f`, health endpoint, DB connectivity.
4. Databases: check logs for timeouts/auth failures; monitor pool saturation and slow queries.
5. Network & Reverse Proxy: Nginx access/error logs; TLS cert validity; firewall rules (UFW/DO).
6. Mitigate fast (rollback/restart), then fix root cause and add guardrails (tests, monitors).
