FROM docker.io/library/node:18-alpine AS base

WORKDIR /app

# Create the directory and set permissions before copying files
RUN mkdir -p /app && \
    chown -R node:node /app && \
    mkdir -p .next && \
    touch next-env.d.ts && \
    chown -R node:node /app

# Switch to node user
USER node

# Copy package files as node user
COPY --chown=node:node package*.json ./

# Install dependencies as node user
RUN npm install --legacy-peer-deps --prefer-offline

# Copy the rest of the files as node user
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
