FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

RUN npm install -g pnpm@latest-10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run prisma:generate && pnpm run build

EXPOSE 4200

CMD ["sh", "-c", "pnpm run prisma:migrate-deploy && pnpm run start:prod"]