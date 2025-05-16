#!/bin/bash
# Script to build and push updated Docker images

# Set your Docker Hub username
DOCKER_USERNAME="malakasadeep"

# Build and push user service
echo "Building and pushing user-service image..."
cd ../user-service
docker build -t $DOCKER_USERNAME/fds-user-service:latest .
docker push $DOCKER_USERNAME/fds-user-service:latest

# Build and push restaurant service
echo "Building and pushing restaurant-service image..."
cd ../restaurant-service
docker build -t $DOCKER_USERNAME/fds-restaurent-service:latest .
docker push $DOCKER_USERNAME/fds-restaurent-service:latest

# Build and push order service
echo "Building and pushing order-service image..."
cd ../order-service
docker build -t $DOCKER_USERNAME/fds-order-service-v2:latest .
docker push $DOCKER_USERNAME/fds-order-service-v2:latest

# Build and push notification service
echo "Building and pushing notification-service image..."
cd ../notification-service
docker build -t $DOCKER_USERNAME/fds-notification-service-v2:latest .
docker push $DOCKER_USERNAME/fds-notification-service-v2:latest

# Build and push API gateway
echo "Building and pushing api-gateway image..."
cd ../api-gateway
docker build -t $DOCKER_USERNAME/fds-gateway-v2:latest .
docker push $DOCKER_USERNAME/fds-gateway-v2:latest

echo "All images have been built and pushed successfully!"
