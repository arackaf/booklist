FROM node:20-bookworm

WORKDIR /app

ENV NODE_ENV="production"

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

COPY . .

CMD [ "npx", "tsx", "index" ]
