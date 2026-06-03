FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --config prisma/prisma.config.ts

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]