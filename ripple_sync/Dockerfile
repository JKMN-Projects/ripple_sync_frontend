# Stage 1: Build the Angular application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./ripple_sync/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./ripple_sync ./

# Build the application in production mode
RUN npm run build --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/ripple_sync/browser /usr/share/nginx/html/

# Copy custom Nginx configuration (if you have one)
COPY ./ripple_sync/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

