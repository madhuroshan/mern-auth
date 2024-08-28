FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]

