FROM node:22.14.0

WORKDIR /app
COPY package*.json ./
# RUN npm install --include=dev  # Install devDependencies
RUN npm install
COPY . .
EXPOSE 4000

CMD ["node", "src/main.js"]
