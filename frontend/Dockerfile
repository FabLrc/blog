FROM node:20-bullseye-slim
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy sources
COPY . .

# Build Next app
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
