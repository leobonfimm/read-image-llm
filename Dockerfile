FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run compile

FROM base AS test

USER node

ENTRYPOINT [ "pnpm", "test" ]

FROM base AS runtime

COPY --from=base /app/dist/ ./dist

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --production

CMD [ "pnpm", "start" ]
