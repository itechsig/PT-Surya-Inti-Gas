FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 755 /app/node_modules
RUN chmod +x /app/node_modules/.bin/vite

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]