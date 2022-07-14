FROM node:18.4.0


# Create a directory to store the app in
WORKDIR /usr/src/app


COPY package.json ./


RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]