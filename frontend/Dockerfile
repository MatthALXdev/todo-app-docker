# ==============================
# Stage 1: Build stage
# ==============================
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost/api
ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

# ==============================
# Stage 2: Production with Nginx
# ==============================
FROM nginx:alpine as production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check (use 127.0.0.1 instead of localhost to force IPv4)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
