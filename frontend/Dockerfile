FROM docker.io/library/node:18-alpine AS base

WORKDIR /app

# Create the directory and set permissions before copying files
RUN mkdir -p /app && \
    chown -R node:node /app

# Switch to node user
USER node

# Copy package files as node user
COPY --chown=node:node package*.json ./

# Install dependencies as node user
RUN npm install

# Copy the rest of the files as node user
COPY --chown=node:node . .

# Ensure all Next.js directories and files have correct permissions
RUN mkdir -p .next && \
    touch next-env.d.ts

EXPOSE 3000

CMD ["npm", "run", "dev"]
