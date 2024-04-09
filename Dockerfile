FROM node:18-alpine

WORKDIR /API

COPY package.json package-lock.json ./

COPY . .

EXPOSE 3000

CMD ["npm","start"]