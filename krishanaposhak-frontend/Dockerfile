# ==========================================
# Stage 1: Build the React/Vite Frontend
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for optimal layer caching
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full frontend source code
COPY . ./

# Accept build argument for dynamic API endpoint configuration
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build static production assets into /app/dist
RUN npm run build

# ==========================================
# Stage 2: Serve static production bundle with Nginx
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx configuration for React SPA routing (try_files fallback to /index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff|woff2)$ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        access_log off; \
        add_header Cache-Control "public, max-age=31536000, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
