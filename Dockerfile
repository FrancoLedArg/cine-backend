FROM node:20-alpine AS base

RUN npm install -g pnpm@9.0.0

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g turbo
COPY . .
RUN turbo prune web --docker --out-dir=out/api

FROM base as installer

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/out/api/json .
RUN pnpm install --frozen-lockfile

COPY --from=builder /usr/src/app/out/api/full .

RUN pnpm run build

FROM base AS runner

WORKDIR /usr/src/app

RUN addgroup --system --gid 1001 appuser
RUN adduser --system --uid 1001 appuser

USER appuser

COPY --from=installer /usr/src/app .

CMD ["pnpm", "run", "start"]
