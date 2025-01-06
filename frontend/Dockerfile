FROM docker.io/library/node:18-alpine AS base

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Build the project
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
