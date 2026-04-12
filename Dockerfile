FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY drizzle ./drizzle
COPY tsconfig.json drizzle.config.ts ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/index.js"]
