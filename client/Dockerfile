FROM node:22-alpine

WORKDIR /app

ENV NEXT_PUBLIC_API_URL="http://localhost:4200"

RUN npm install -g pnpm@latest-10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]