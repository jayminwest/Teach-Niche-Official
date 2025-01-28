# Base stage for development
FROM node:18-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm install --force
COPY . .

# Development stage
FROM base AS dev
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=base /app .
RUN npm ci --production && \
    npm run build && \
    rm -rf node_modules && \
    npm install --production
CMD ["node", ".next/standalone/server.js"]
