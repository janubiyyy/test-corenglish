# Task 6: Simple CI/CD for a Dockerized Application

A pragmatic GitHub Actions pipeline; translate easily to GitLab CI.

## Pipeline Trigger

- Push to `main` or semver tag `v*.*.*` for production releases.
- Pull Requests trigger CI (lint, tests, build) and optionally skip pushing images.

## Core Pipeline Stages

1. Checkout code
2. Install deps and run tests
3. Build Docker image (multi-stage, labels with version metadata)
4. Scan image (Trivy/Grype)
5. Push image to registry (GHCR/Docker Hub/ECR)
6. Deploy to server (SSH): pull, replace container, verify health

## Role of Docker & Dockerfile (Build)

- Dockerfile is the build recipe and runtime definition; multi-stage shrinks final image and attack surface.
- Build args and labels provide traceability (commit SHA, build time).

## Purpose of a Docker Image Registry

- Versioned, central storage enabling rollbacks and promotion across environments with access control.

## Deployment on the Server (High-Level)

```bash
APP_IMAGE=ghcr.io/org/app:latest
CONTAINER_NAME=app

docker pull "$APP_IMAGE"
docker rm -f "$CONTAINER_NAME" || true

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /opt/app/.env \
  -v /opt/app/data:/app/data \
  "$APP_IMAGE"

sleep 2
docker logs --tail 200 "$CONTAINER_NAME" | cat
curl -fsS http://127.0.0.1:3000/health || true
```

See the example workflow: [examples/conceptual_ci_cd_pipeline.yml](./examples/conceptual_ci_cd_pipeline.yml).
