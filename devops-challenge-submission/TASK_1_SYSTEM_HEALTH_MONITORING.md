# Task 1: System Health & Monitoring

Operate with observability first: verify health, inspect logs, validate dependencies, then change state. Assumes Ubuntu on a DigitalOcean Droplet with sudo privileges.

## Backend Service Status (systemd)

- Status and recent logs:

```bash
sudo systemctl status nestjs.service
sudo systemctl is-active nestjs.service
sudo journalctl -u nestjs.service -n 200 --no-pager
```

- Start/enable service:

```bash
sudo systemctl start nestjs.service
sudo systemctl enable nestjs.service
```

- Reload if the unit file changed and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nestjs.service
```

- Confirm listening port (example: 3000):

```bash
sudo ss -lntp | grep 3000 || sudo lsof -iTCP -sTCP:LISTEN -n -P | grep node
```

## Database Container Status (Docker)

- List running containers:

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

- Check container health (requires HEALTHCHECK):

```bash
docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $(docker ps -q)
```

- Focus on Postgres and MongoDB:

```bash
PG_CONTAINER=postgres
MONGO_CONTAINER=mongodb

docker ps --filter name=$PG_CONTAINER --format '{{.Names}}: {{.Status}}'
docker ps --filter name=$MONGO_CONTAINER --format '{{.Names}}: {{.Status}}'

docker logs --tail 200 $PG_CONTAINER | cat
docker logs --tail 200 $MONGO_CONTAINER | cat
```

Tip: Add HEALTHCHECK to images/compose for reliable health signals.

## Server Resource Monitoring

- Key metrics: CPU and memory (disk usage as third). Quick checks:

```bash
htop                     # interactive overview
uptime                   # load averages trend
vmstat 1 5               # CPU run queue, context switches, swap
free -h                  # memory and swap
 df -h                   # disk usage by filesystem
sudo du -xhd1 /var       # largest consumers under /var
sudo ss -lntup           # listening sockets
```

Consider installing: `ncdu`, `iotop`, `iftop`/`nload`. Enable DigitalOcean monitoring and alerts.

## Backend Unresponsive: First Response

1. Service and logs:
   - `systemctl status nestjs.service`
   - `journalctl -u nestjs.service -n 200 -f`
2. Port and local reachability:
   - `ss -lntp | grep <PORT>`
   - `curl -sS http://127.0.0.1:<PORT>/health || true`
3. Server resources:
   - `htop` for CPU/RAM; `dmesg -T | tail -n 50` for OOM kills
4. Databases reachable:
   - Postgres: `docker exec -it <pg> psql -U <user> -d <db> -c 'select 1'`
   - Mongo: `docker exec -it <mongo> mongosh --eval 'db.adminCommand("ping")'`
5. Network & edge:
   - `sudo ufw status numbered` and DO firewall rules
   - Reverse proxy (if any): `systemctl status nginx`; `tail -n 200 /var/log/nginx/error.log`
6. If safe, restore service:
   - `sudo systemctl restart nestjs.service`
7. Post-incident hardening:
   - Investigate root cause; add alerts (CPU/RAM/disk, service down, HTTP 5xx), improve health checks, and document runbooks.
