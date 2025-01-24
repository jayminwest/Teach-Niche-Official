FROM docker.io/library/node:18-alpine AS base

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --legacy-peer-deps

# Create required Next.js directories
RUN mkdir -p pages app

# Copy the rest of the files
COPY . .

# Build the project
RUN npm run build

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
