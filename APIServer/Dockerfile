FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# ----------------------------
# Builder stage
# ----------------------------
FROM base AS builder

# Install build tools (only if you need native deps)
# RUN apk add --no-cache python3 make g++

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build:linux

# Prune to production deps
RUN pnpm prune --prod

# ----------------------------
# Runner stage
# ----------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only built artifacts + pruned node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /app/logs && chown -R node:node /app
USER node

EXPOSE 9999
CMD ["node", "dist/src/index.js"]
