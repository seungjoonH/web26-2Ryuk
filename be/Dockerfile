# Backend Development Dockerfile
FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm@9.12.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY be/package.json ./be/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code (will be overridden by volume mount in docker-compose)
COPY be ./be

# Expose port
EXPOSE 3000

# Start development server
WORKDIR /app/be
CMD ["pnpm", "dev"]

