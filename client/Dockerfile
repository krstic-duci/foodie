FROM node:16.16-alpine

WORKDIR /app

COPY . /app

RUN npm install --silent

COPY . .

EXPOSE 3000

CMD ["npm","start"]