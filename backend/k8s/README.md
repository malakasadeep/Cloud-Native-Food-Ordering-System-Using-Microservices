# Kubernetes Configuration for Food Delivery System

This directory contains all the Kubernetes configuration files for deploying the Food Delivery System microservices.

## Directory Structure

- **api-gateway/**: Kubernetes configurations for the API gateway service
- **common/**: Shared configurations (namespace, configmaps, secrets)
- **notification-service/**: Kubernetes configurations for notification service
- **order-service/**: Kubernetes configurations for order service
- **restaurant-service/**: Kubernetes configurations for restaurant service
- **user-service/**: Kubernetes configurations for user service

## Services Architecture

![Microservices Architecture](https://miro.medium.com/max/1400/1*I9-QEOqCQgvE-g0Jn1TwaQ.png)

The Food Delivery System consists of the following microservices:

- **API Gateway**: NGINX-based gateway that routes requests to appropriate services
- **User Service**: Handles user registration, authentication, and user management
- **Restaurant Service**: Manages restaurant data, food menus, and categories
- **Order Service**: Processes food orders, cart management, and payments
- **Notification Service**: Sends email and SMS notifications to users

## Deployment Guide

For detailed deployment instructions, refer to the [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) file.

## ConfigMaps and Secrets

The application uses the following ConfigMaps and Secrets:

### ConfigMaps
- **mongodb-config**: Contains MongoDB connection strings for each service
- **service-config**: Contains service URLs and shared config like JWT secret

### Secrets
- **email-sms-secrets**: Contains credentials for email and SMS services
- **stripe-secrets**: Contains Stripe API key for payment processing

## Health Endpoints

Each service exposes a `/health` endpoint that returns the service status. These endpoints are used by Kubernetes for liveness and readiness probes.

## Resource Management

Each service has resource requests and limits defined to ensure proper resource allocation in the Kubernetes cluster.

## Network Communication

Services communicate with each other using Kubernetes service discovery:
- Service-to-service calls use the service name as the hostname
- The API Gateway routes external requests to the appropriate internal service

## Scaling

Services can be scaled individually based on load:

```bash
kubectl scale deployment <service-name> --replicas=<count> -n food-delivery-system
```
