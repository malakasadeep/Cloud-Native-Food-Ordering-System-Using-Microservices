# Food Delivery System Deployment Guide

This guide provides step-by-step instructions to deploy the Food Delivery System project using Docker and Kubernetes.

## Prerequisites

1. Install [Docker](https://www.docker.com/).
2. Install [Kubernetes](https://kubernetes.io/) and set up a cluster (e.g., using Minikube or a cloud provider).
3. Install [kubectl](https://kubernetes.io/docs/tasks/tools/).
4. Install [Helm](https://helm.sh/) for managing Kubernetes applications.
5. Clone the repository to your local machine.

## Deployment Steps

### 1. Start Services with Docker Compose

Navigate to the `backend` folder and start all services using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This command will build and start all the services defined in the `docker-compose.yml` file.

### 2. Deploy to Kubernetes

Navigate to the `k8s` folder and apply the Kubernetes manifests:

```bash
cd ../k8s
kubectl apply -f .
```

This will deploy all services, including their configurations, to the Kubernetes cluster.

### 3. Verify Deployment

Check the status of the pods to ensure all services are running:

```bash
kubectl get pods
```

### 4. Access the Application

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