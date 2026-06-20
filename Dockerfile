FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json vitest.config.ts ./
COPY apps ./apps
COPY packages ./packages
COPY scripts ./scripts

RUN pnpm install --frozen-lockfile

# Smoke command used by docs and tests: pnpm --filter iptv-doctor doctor
ENTRYPOINT ["pnpm", "--filter", "iptv-doctor", "doctor"]
CMD ["--help"]
