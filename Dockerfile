FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm i -g sequelize-cli && npm i mysql2

COPY . .

EXPOSE 3000

CMD sleep 5 && npx sequelize db:migrate --url mysql://root:root@mysql:3306/file_service_db && npm run start