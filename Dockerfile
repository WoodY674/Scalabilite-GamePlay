FROM node:latest

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app

RUN npm install
RUN npm run build

COPY . /app
EXPOSE 4200

CMD ["npm", "run", "start"]
