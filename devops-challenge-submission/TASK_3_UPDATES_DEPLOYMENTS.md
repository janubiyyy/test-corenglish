# Task 3: Updates & Deployments

## OS Package Updates (Ubuntu)

```bash
sudo apt update
apt list --upgradable | cat
sudo apt upgrade -y
sudo apt full-upgrade -y     # plan window if kernel/firmware
sudo apt autoremove -y

# Optional: security auto-updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

Considerations:
- Communicate maintenance windows; reboot if `/var/run/reboot-required` exists.
- Post-update validation: `systemctl status`, health checks, smoke tests.

## Backend Application Update (systemd-managed NestJS)

Assumptions: service `nestjs.service`, install path `/opt/nest-app`, artifact at `/tmp/release.tgz`.

```bash
SERVICE=nestjs.service
APP_DIR=/opt/nest-app
RELEASE=/tmp/release.tgz

sudo systemctl stop "$SERVICE"

# Backup current version
sudo tar -C "$APP_DIR" -czf "/opt/bak_$(date -Iseconds).tgz" .

# Deploy new build
sudo rm -rf "$APP_DIR"/*
sudo tar -C "$APP_DIR" -xzf "$RELEASE"

cd "$APP_DIR"
sudo npm ci --only=production
sudo npm run migration:run || true

sudo systemctl daemon-reload
sudo systemctl start "$SERVICE"
sudo systemctl status "$SERVICE" --no-pager

curl -fsS http://127.0.0.1:3000/health || true
```

Rollback: stop service, restore last backup tarball, start service, investigate root cause.

## Frontend Deployment (Next.js on Vercel)

- Git push triggers builds; PRs create preview deployments; merge to `main` promotes to production.
- Manage env vars in Vercel by environment (Dev/Preview/Prod).
- One-click rollback to a previous deployment.
- Inspect build, function/edge logs directly in Vercel.
