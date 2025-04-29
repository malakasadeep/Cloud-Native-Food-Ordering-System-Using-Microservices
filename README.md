# Food Delivery System Deployment Guide

This guide provides step-by-step instructions to deploy the Food Delivery System project using Docker and Kubernetes.

## Prerequisites

1. Install [Docker](https://www.docker.com/).
2. Install [Kubernetes](https://kubernetes.io/) and set up a cluster (e.g., using Minikube or a cloud provider).
3. Install [kubectl](https://kubernetes.io/docs/tasks/tools/).
4. Install [Helm](https://helm.sh/) for managing Kubernetes applications.
5. Clone the repository to your local machine.

## Deployment Steps

### 1. Build Docker Images

Navigate to the `backend` folder and build Docker images for each service:

```bash
cd backend

# Build API Gateway
cd api-gateway
docker build -t api-gateway .

# Build Notification Service
cd ../notification-service
docker build -t notification-service .

# Build Restaurant Service
cd ../restaurant-service
docker build -t restaurant-service .

# Build User Service
cd ../user-service
docker build -t user-service .
```

### 2. Push Docker Images to a Registry

Push the built images to a Docker registry (e.g., Docker Hub or a private registry):

```bash
docker tag api-gateway <your-registry>/api-gateway
docker push <your-registry>/api-gateway

# Repeat for other services
docker tag notification-service <your-registry>/notification-service
docker push <your-registry>/notification-service

docker tag restaurant-service <your-registry>/restaurant-service
docker push <your-registry>/restaurant-service

docker tag user-service <your-registry>/user-service
docker push <your-registry>/user-service
```

### 3. Deploy to Kubernetes

Navigate to the `k8s` folder and apply the Kubernetes manifests:

```bash
cd ../k8s
kubectl apply -f .
```

This will deploy all services, including their configurations, to the Kubernetes cluster.

### 4. Verify Deployment

Check the status of the pods to ensure all services are running:

```bash
kubectl get pods
```

### 5. Access the Application

- Use the Kubernetes service to expose the API Gateway.
- Retrieve the external IP of the API Gateway service:

```bash
kubectl get svc api-gateway
```

- Open the external IP in your browser to access the application.

## Notes

- Update the `docker-compose.yml` and Kubernetes manifests as needed to match your environment.
- Ensure proper environment variables are set for database connections and other configurations.

## Troubleshooting

- Check logs for any issues:

```bash
kubectl logs <pod-name>
```

- Verify network configurations and service dependencies.