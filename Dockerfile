# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

# Copy hasil build
COPY --from=builder /usr/src/app/dist ./dist

# 👉 jangan copy migrations kalau belum ada
# COPY --from=builder /usr/src/app/src/migrations ./migrations

EXPOSE 3000
CMD ["node", "dist/main.js"]
