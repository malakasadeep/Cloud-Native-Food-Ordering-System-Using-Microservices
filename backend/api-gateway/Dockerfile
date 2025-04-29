# Use the official Nginx image
FROM nginx:alpine

# Remove the default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Create logs directory
RUN mkdir -p /var/log/nginx

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
