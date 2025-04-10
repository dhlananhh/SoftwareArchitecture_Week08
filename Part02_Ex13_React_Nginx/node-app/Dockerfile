FROM node:18-alpine

WORKDIR /node-app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start
