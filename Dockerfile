FROM nikolaik/python-nodejs:python3.11-nodejs18-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 4200

CMD ["npm", "run", "dev"]
