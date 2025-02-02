FROM mhart/alpine-node:9

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]