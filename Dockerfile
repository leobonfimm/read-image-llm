FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm compile

FROM node:20-slim AS runtime
RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/dist/ ./dist
COPY --from=base /app/prisma ./prisma

RUN npx prisma generate

CMD [ "pnpm", "start:migrate" ]
