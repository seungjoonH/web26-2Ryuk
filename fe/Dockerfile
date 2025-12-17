# Frontend Development Dockerfile
FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm@9.12.0

# Set working directory
WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY fe/package.json ./fe/

# Install dependencies for frontend workspace
RUN pnpm install --frozen-lockfile --filter fe...

# Copy source code (will be overridden by volume mount in docker-compose)
COPY fe ./fe

# Expose port (Next.js default port is 3000)
EXPOSE 3000

# Start development server
# -p 3000: 명시적으로 포트 지정
# -H 0.0.0.0: 모든 네트워크 인터페이스에서 접근 가능하도록 설정
WORKDIR /app/fe
CMD ["pnpm", "dev", "-p", "3000", "-H", "0.0.0.0"]

