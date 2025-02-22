FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "dev", "start:prod"]
