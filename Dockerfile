FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install
RUN npm install -g pm2
RUN npm install -D typescript
ENV PM2_PUBLIC_KEY=2p0cfdtozgnpfh2
ENV PM2_SECRET_KEY=z3nhdf5bpz9o86o

COPY . .

CMD ["npm", "run", "start:prod"]