FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm check
RUN pnpm build
ARG PUBLIC_APP_URL=""
RUN if [ -n "$PUBLIC_APP_URL" ]; then \
  PUBLIC_APP_URL="$PUBLIC_APP_URL" pnpm launch:sitemap; \
  else \
  echo "Skipping sitemap generation; PUBLIC_APP_URL build arg not set."; \
  fi

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "const port=process.env.PORT||3000; fetch(`http://127.0.0.1:${port}/api/health`).then((response)=>response.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
