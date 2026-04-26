# ============================================================================
# Dockerfile - Backend API Node.js
# ============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ============================================================================
# Production stage
# ============================================================================

FROM node:20-alpine

WORKDIR /app

RUN corepack enable && \
    corepack prepare pnpm@latest --activate

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY src/db/*.sql ./dist/db/

RUN mkdir -p /app/uploads && \
    chown -R node:node /app

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
