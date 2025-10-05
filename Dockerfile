# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy frontend files
COPY frontend/package.json frontend/pnpm-lock.yaml ./
COPY frontend/ ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the frontend
RUN pnpm build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE $PORT

# Start the application
CMD ["sh", "-c", "serve -s dist -l $PORT"]
