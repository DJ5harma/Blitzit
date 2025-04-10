FROM node:22.14.0

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev  # Install devDependencies
COPY . .
EXPOSE 4000

CMD ["npx", "nodemon", "src/main.js"]
