$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

# Set your Docker Hub username
$DOCKER_USERNAME = "malakasadeep"

# Login to Docker Hub (you'll need to enter your credentials)
docker login

# Build and push user service
Write-Host "Building and pushing user-service image..."
Set-Location -Path "$scriptDir\user-service"
docker build -t "$DOCKER_USERNAME/fds-user-service:latest" .
# docker push "$DOCKER_USERNAME/fds-user-service:latest"

# Build and push restaurant service
Write-Host "Building and pushing restaurant-service image..."
Set-Location -Path "$scriptDir\restaurant-service"
docker build -t "$DOCKER_USERNAME/fds-restaurent-service:latest" .
# docker push "$DOCKER_USERNAME/fds-restaurent-service:latest"

# Build and push order service
Write-Host "Building and pushing order-service image..."
Set-Location -Path "$scriptDir\order-service"
docker build -t "$DOCKER_USERNAME/fds-order-service-v2:latest" .
# docker push "$DOCKER_USERNAME/fds-order-service-v2:latest"

# Build and push notification service
Write-Host "Building and pushing notification-service image..."
Set-Location -Path "$scriptDir\notification-service"
docker build -t "$DOCKER_USERNAME/fds-notification-service-v2:latest" .
# docker push "$DOCKER_USERNAME/fds-notification-service-v2:latest"

# Build and push API gateway
Write-Host "Building and pushing api-gateway image..."
Set-Location -Path "$scriptDir\api-gateway"
docker build -t "$DOCKER_USERNAME/fds-gateway-v2:latest" .
# docker push "$DOCKER_USERNAME/fds-gateway-v2:latest"

# Build and push Delivery-Service 
Write-Host "Building and pushing delivery Service image..."
Set-Location -Path "$scriptDir\delivery-service"
docker build -t "$DOCKER_USERNAME/fds-gateway-v2:latest" .
# docker push "$DOCKER_USERNAME/fds-gateway-v2:latest"

# Return to the original directory
Set-Location -Path $scriptDir

Write-Host "All images have been built and pushed successfully!"
