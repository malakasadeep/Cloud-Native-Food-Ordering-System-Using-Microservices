# Use the official Nginx image
FROM nginx:alpine

# Install bash for better shell scripts
RUN apk add --no-cache bash

# Remove the default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Create logs directory and ensure proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/log/nginx

# Create a healthcheck script
RUN echo '#!/bin/bash\n\
nginx -t && curl -s http://localhost:80/health || exit 1' > /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Ensure nginx can write to the logs directory
RUN touch /var/log/nginx/access.log /var/log/nginx/error.log && \
    chown nginx:nginx /var/log/nginx/access.log /var/log/nginx/error.log

# Expose port 80
EXPOSE 80

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD /healthcheck.sh

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]