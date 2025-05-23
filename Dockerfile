FROM node:20-alpine

WORKDIR '/app'

RUN apk add --no-cache openssl

COPY .env .env

COPY package.json .

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start:migrate:prod"]