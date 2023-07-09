FROM node:16

WORKDIR /highsleep_cloud_server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]