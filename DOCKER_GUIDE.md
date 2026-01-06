# Docker Deployment Guide

## Overview

This guide covers building and running The Fork application using Docker and Docker Compose.

## Quick Start

### Using Docker Compose (Recommended for Development)

```bash
# Build all images
docker-compose build

# Start all services (mongo, backend, frontend)
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
# MongoDB: localhost:27017
```

### Stop services

```bash
docker-compose down

# Also remove volumes (database data)
docker-compose down -v
```

## Individual Docker Images

### Backend Image

```bash
# Build
docker build -t fork-backend:latest ./backend

# Run
docker run -d \
  -p 8000:8000 \
  -e MONGO_URL="mongodb://mongo:27017" \
  -e DB_NAME="fork_database" \
  -e EMERGENT_LLM_KEY="your_key_here" \
  -e CORS_ORIGINS="*" \
  --name fork-backend \
  fork-backend:latest
```

### Frontend Image

#### Production Build

```bash
# Build
docker build -t fork-frontend:latest ./frontend

# Run
docker run -d \
  -p 3000:3000 \
  -e REACT_APP_BACKEND_URL="http://localhost:8000" \
  --name fork-frontend \
  fork-frontend:latest
```

#### Development Build

```bash
# Build
docker build -f frontend/Dockerfile.dev -t fork-frontend:dev ./frontend

# Run
docker run -d \
  -p 3000:3000 \
  -e REACT_APP_BACKEND_URL="http://localhost:8000" \
  -v "$(pwd)/frontend/src:/app/src" \
  --name fork-frontend-dev \
  fork-frontend:dev
```

## Docker Compose Services

### MongoDB (Database)

- **Image:** mongo:7.0
- **Port:** 27017
- **Default Credentials:** admin/password
- **Database:** fork_database
- **Volume:** mongo_data (persists between restarts)

### Backend API

- **Port:** 8000
- **Health Check:** GET /api/ (every 30s)
- **Environment:** See docker-compose.yml
- **Depends On:** MongoDB

### Frontend

- **Port:** 3000
- **Development Mode:** Hot reload enabled
- **Production Mode:** Optimized build via Nginx
- **Environment:** See docker-compose.yml
- **Depends On:** Backend

## Environment Variables

Create `.env` files in backend and frontend directories:

### backend/.env
```
MONGO_URL=mongodb://admin:password@mongo:27017
DB_NAME=fork_database
EMERGENT_LLM_KEY=your_emergent_llm_key
CORS_ORIGINS=*
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

### frontend/.env
```
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Access Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongo mongosh --username admin --password password
```

### Rebuild After Code Changes

```bash
# Rebuild images
docker-compose build

# Restart services
docker-compose up
```

### Run Tests in Docker

```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests (requires different setup)
docker run -it \
  -v "$(pwd)/frontend:/app" \
  fork-frontend:dev \
  yarn test
```

## Health Checks

All services include health checks configured in docker-compose.yml.

```bash
# Check service status
docker-compose ps

# View detailed health status
docker inspect fork-backend --format='{{json .State.Health}}' | jq
```

## Networking

Services communicate through the `fork-network` bridge network:
- Backend can access MongoDB at `mongodb://mongo:27017`
- Frontend can access Backend at `http://backend:8000`
- From host: Use `localhost` and exposed ports

## Production Considerations

For production deployments:

1. **Update CORS_ORIGINS** to restrict to your domain
2. **Use environment secrets** instead of .env files
3. **Add Nginx reverse proxy** for SSL/TLS
4. **Configure MongoDB** with proper authentication and backups
5. **Set resource limits** in docker-compose.yml
6. **Use separate production Dockerfiles** optimized for size
7. **Implement log aggregation** (ELK, CloudWatch, etc.)
8. **Add container monitoring** (Prometheus, Grafana, etc.)

## Troubleshooting

### MongoDB Connection Error

```bash
# Check MongoDB logs
docker-compose logs mongo

# Verify credentials
docker-compose exec mongo mongosh \
  --username admin \
  --password password \
  --authenticationDatabase admin
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep MONGO

# Test database connection
docker-compose exec backend python -c "import pymongo; print(pymongo.__version__)"
```

### Frontend Can't Connect to Backend

```bash
# Verify backend is running
docker-compose ps backend

# Check REACT_APP_BACKEND_URL
docker-compose exec frontend echo $REACT_APP_BACKEND_URL

# Test from frontend container
docker-compose exec frontend wget http://backend:8000/api/
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :8000
lsof -i :27017

# Change port in docker-compose.yml or use different port
# e.g., change "3000:3000" to "3001:3000"
```

## Docker Best Practices

- Use `.dockerignore` to exclude unnecessary files
- Keep images small (use alpine variants when possible)
- Don't run as root in production
- Use multi-stage builds to minimize final image size
- Pin specific versions instead of "latest"
- Use environment variables for configuration
- Implement proper health checks
- Use restart policies for reliability

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Python Docker Images](https://docs.docker.com/language/python/build-images/)
- [Best Practices for Node.js Docker Images](https://docs.docker.com/language/nodejs/build-images/)
