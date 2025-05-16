# Kubernetes Deployment Guide for Food Delivery System

This guide provides step-by-step instructions for deploying the Food Delivery System microservices architecture on Kubernetes.

## Prerequisites

- Kubernetes cluster (Minikube, EKS, GKE, AKS, or any other Kubernetes cluster)
- kubectl CLI installed and configured
- Docker images built and pushed to a container registry
- Docker Hub account (or other container registry)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd food-delivery-system
```

## Step 2: Build and Push Docker Images

Each microservice has a Dockerfile in its directory. Build and push these images:

```bash
# Navigate to backend directory
cd backend

# Build and push images for each service
# User Service
cd user-service
docker build -t <your-dockerhub-username>/fds-user-service:latest .
docker push <your-dockerhub-username>/fds-user-service:latest
cd ..

# Restaurant Service
cd restaurant-service
docker build -t <your-dockerhub-username>/fds-restaurant-service:latest .
docker push <your-dockerhub-username>/fds-restaurant-service:latest
cd ..

# Notification Service
cd notification-service
docker build -t <your-dockerhub-username>/fds-notification-service:latest .
docker push <your-dockerhub-username>/fds-notification-service:latest
cd ..

# Order Service
cd order-service
docker build -t <your-dockerhub-username>/fds-order-service:latest .
docker push <your-dockerhub-username>/fds-order-service:latest
cd ..

# API Gateway
cd api-gateway
docker build -t <your-dockerhub-username>/fds-api-gateway:latest .
docker push <your-dockerhub-username>/fds-api-gateway:latest
cd ..
```

## Step 3: Update Image Names in Deployment Files (if necessary)

If you've used different image names or tags than the ones specified in the deployment files, update them:

- Update the image name in each service's deployment.yaml file
- Example:
  ```yaml
  containers:
  - name: user-service
    image: <your-dockerhub-username>/fds-user-service:latest
  ```

## Step 4: Deploy the Application

### 1. Create the Namespace and ConfigMaps/Secrets

```bash
# Navigate to k8s folder
cd backend/k8s

# Apply common configurations
kubectl apply -f common/namespace.yaml
kubectl apply -f common/configmap.yaml
kubectl apply -f common/secrets.yaml
```

### 2. Deploy Backend Services

```bash
# Deploy User Service
kubectl apply -f user-service/deployment.yaml
kubectl apply -f user-service/service.yaml

# Deploy Restaurant Service
kubectl apply -f restaurant-service/deployment.yaml
kubectl apply -f restaurant-service/service.yaml

# Deploy Order Service
kubectl apply -f order-service/deployment.yaml
kubectl apply -f order-service/service.yaml

# Deploy Notification Service
kubectl apply -f notification-service/deployment.yaml
kubectl apply -f notification-service/service.yaml
```

### 3. Deploy API Gateway

```bash
# Deploy API Gateway
kubectl apply -f api-gateway/deployment.yaml
kubectl apply -f api-gateway/service.yaml
```

## Step 5: Verify the Deployment

```bash
# Check pods status
kubectl get pods -n food-delivery-system

# Check services
kubectl get services -n food-delivery-system

# Check deployments
kubectl get deployments -n food-delivery-system
```

## Step 6: Access the Application

Since the API Gateway is exposed with a LoadBalancer service, you can access it using:

```bash
# Get the external IP of the API Gateway
kubectl get service api-gateway -n food-delivery-system
```

Use the EXTERNAL-IP to access the application: http://EXTERNAL-IP

**Note:** If using Minikube, you need to use `minikube service api-gateway -n food-delivery-system` to expose the service.

## Step 7: Monitoring and Logging

```bash
# Check logs for a specific service (e.g., user-service)
kubectl logs -l app=user-service -n food-delivery-system

# Describe a pod to troubleshoot issues
kubectl describe pod <pod-name> -n food-delivery-system
```

## Step 8: Scaling Services

You can scale services up or down based on load:

```bash
# Scale user-service to 3 replicas
kubectl scale deployment user-service --replicas=3 -n food-delivery-system
```

## Step 9: Updating Services (Rolling Updates)

When you have updates to your services:

1. Build and push the new Docker image with a new tag
2. Update the image tag in the deployment file
3. Apply the changes:

```bash
kubectl apply -f user-service/deployment.yaml
```

Kubernetes will perform a rolling update, ensuring zero downtime.

## Step 10: Cleaning Up

If you need to remove the deployment:

```bash
# Delete all resources in the namespace
kubectl delete namespace food-delivery-system
```

## Troubleshooting

### Common Issues:

1. **Pods in Pending State**: Check if there are enough resources in your cluster
   ```bash
   kubectl describe pod <pod-name> -n food-delivery-system
   ```

2. **CrashLoopBackOff**: Check pod logs for application errors
   ```bash
   kubectl logs <pod-name> -n food-delivery-system
   ```

3. **ImagePullBackOff**: Ensure your Docker images are public or you've set up proper credentials
   ```bash
   kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-password>
   ```
   Then add this imagePullSecret to your deployment.

4. **Services Not Communicating**: Ensure service names match what's configured in the environment variables and nginx.conf

### Health Checks:

All services have liveness and readiness probes configured. If services are restarting frequently, check if your health endpoints are responding properly.

## Best Practices for Production Deployment

1. **Use Helm Charts**: Convert these YAML files to Helm charts for easier management
2. **Set Resource Limits**: All deployments have resource requests and limits set
3. **Implement Network Policies**: Restrict communication between services
4. **Set Up Proper Monitoring**: Integrate with Prometheus and Grafana
5. **Use Kubernetes Secrets Management**: Consider solutions like HashiCorp Vault for production secrets
6. **Implement Horizontal Pod Autoscaling**: Scale based on CPU/memory usage
7. **Set Up CI/CD Pipeline**: Automate the build and deployment process
