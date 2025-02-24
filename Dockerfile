FROM node:18

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
