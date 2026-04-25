# ===== Stage 1: Build frontend =====
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Stage 2: Python backend + static files =====
FROM python:3.12-slim

WORKDIR /app

# Copy dist (static files from frontend build)
COPY --from=frontend-build /app/dist ./dist

# Copy production server (handles both API + static serving)
COPY src/backend/server_production.py ./server.py

# Copy data directory (empty - will be created at runtime)
COPY data/ ./data/

# Create data directory if not exists (SQLite will create on first run)
RUN mkdir -p /app/data

EXPOSE 8000

CMD ["python3", "server.py"]