# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy frontend files
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
COPY frontend/ ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the frontend
RUN pnpm build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
