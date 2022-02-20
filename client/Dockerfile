FROM node:16-alpine

WORKDIR /app
COPY package.json .
COPY .env .env
RUN npm i
COPY . .

CMD ["npm", "run", "dev"]
