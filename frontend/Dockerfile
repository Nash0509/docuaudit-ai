# ============================================================
# Stage 1: Builder — install deps and build React app
# ============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (leverages Docker layer cache)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build production bundle
RUN npm run build


# ============================================================
# Stage 2: Runtime — serve with nginx
# ============================================================
FROM nginx:1.27-alpine AS runtime

LABEL maintainer="DocuAudit AI <noreply@docuaudit.ai>"
LABEL org.opencontainers.image.title="DocuAudit AI Frontend"
LABEL org.opencontainers.image.version="1.0.0"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy frontend-specific nginx config (SPA routing support)
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

# nginx runs as its own user by default; ensure permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
