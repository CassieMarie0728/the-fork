# Quick Start Guide - The Fork

A comprehensive guide to get The Fork running in your local development environment.

## Prerequisites

- **Node.js** 18+ (with Yarn)
- **Python** 3.11+
- **Docker & Docker Compose** (optional, for containerized setup)
- **MongoDB** (optional, if not using Docker)

---

## Option 1: Local Development (Recommended)

### 1. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Update .env with your settings
# (EMERGENT_LLM_KEY is required for chat to work)
nano .env

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Start server
uvicorn server:app --reload
# Server runs at http://localhost:8000
# API docs at http://localhost:8000/api/docs
```

### 2. Frontend Setup

```bash
cd frontend

# Copy environment template
cp .env.example .env

# Install dependencies
yarn install

# Run tests
yarn test:e2e

# Start development server
yarn start
# App runs at http://localhost:3000
```

### 3. MongoDB Setup (Local)

```bash
# Start MongoDB locally (if not using Docker)
mongod --dbpath ./data

# Or use Docker for MongoDB only:
docker run -d -p 27017:27017 --name fork-mongo mongo:7.0
```

---

## Option 2: Docker Compose (Quick Start)

### Start Everything

```bash
# From project root
docker-compose up --build
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs
- MongoDB: localhost:27017

### Stop Services

```bash
docker-compose down

# Also remove database volume
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

---

## Project Structure

```
the-fork/
├── backend/
│   ├── server.py                 # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example              # Environment template
│   ├── Dockerfile                # Docker image definition
│   └── API_DOCUMENTATION.md      # API reference
│
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # Utilities
│   │   ├── pages/                # Page components
│   │   ├── App.js                # Router
│   │   ├── index.js              # Entry point
│   │   ├── App.css               # Styling
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── e2e/                      # Playwright tests
│   ├── package.json              # Dependencies
│   ├── .env.example              # Environment template
│   ├── playwright.config.js      # Test configuration
│   └── Dockerfile                # Docker image
│
├── tests/
│   ├── unit/test_server.py       # Unit tests
│   ├── integration/test_api.py   # Integration tests
│   ├── conftest.py               # Pytest configuration
│   └── README.md                 # Testing guide
│
├── .github/workflows/            # CI/CD workflows
│   ├── backend-tests.yml
│   ├── frontend-tests.yml
│   ├── docker-build.yml
│   ├── code-quality.yml
│   └── docs.yml
│
├── docker-compose.yml            # Multi-service setup
├── DOCKER_GUIDE.md               # Docker documentation
├── ENHANCEMENT_SUMMARY.md        # What was added
└── README.md                     # Project overview
```

---

## Key Files to Know

### Frontend Components

All React components are in `frontend/src/components/`:

- **Pill.js** - Badge/label component
- **IntensityToggle.js** - Intensity selector
- **ForkSetup.js** - Initial fork input screen
- **ForkSummaryBar.js** - Sticky summary bar
- **ChatWindow.js** - Chat interface
- **MessageBubble.js** - Message display
- **ResetModal.js** - Reset confirmation

### Backend Routes

Main endpoint: `POST /api/chat`

Other endpoints:
- `GET /api/` - Health check
- `GET /api/docs` - Interactive API docs
- `GET /api/status` - Template endpoint

---

## Development Workflow

### Making Changes

#### Frontend
```bash
cd frontend
# Edit files in src/
# Hot reload automatically
# Run tests: yarn test:e2e
```

#### Backend
```bash
cd backend
# Edit server.py
# Server reloads automatically (with --reload flag)
# Run tests: pytest
```

### Running Tests

```bash
# Backend tests
cd backend && pytest

# Frontend E2E tests
cd frontend && yarn test:e2e

# Frontend E2E with UI
cd frontend && yarn test:e2e:ui

# Frontend E2E headed (visible browser)
cd frontend && yarn test:e2e:headed
```

### Code Quality

```bash
# Backend linting
cd backend
flake8 server.py
black --check server.py

# Frontend linting
cd frontend
npx eslint src
```

---

## API Integration

### Backend Configuration

The backend requires these environment variables in `.env`:

```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="fork_database"
EMERGENT_LLM_KEY="your_api_key_here"  # Required!
CORS_ORIGINS="*"
```

### Testing the API

```bash
# Health check
curl http://localhost:8000/api/

# Send a chat message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "forkStatement": "I chose engineering instead of art.",
    "intensity": "mild",
    "messages": [],
    "sessionId": "test-123"
  }'
```

### API Documentation

Interactive documentation available at: `http://localhost:8000/api/docs`

Full reference: `backend/API_DOCUMENTATION.md`

---

## Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip list | grep fastapi

# Check environment variables
cat backend/.env

# Check port
lsof -i :8000
```

### Frontend Won't Start

```bash
# Check Node version
node --version  # Should be 18+

# Check yarn
yarn --version

# Clear cache
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# Check port
lsof -i :3000
```

### Database Connection Issues

```bash
# Check MongoDB running
mongosh

# Check credentials
echo "mongodb://admin:password@localhost:27017" | mongodb-uri-parser

# View Docker logs
docker-compose logs mongo
```

### CORS Issues

Update `backend/.env`:
```
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| MONGO_URL | Yes | - | MongoDB connection string |
| DB_NAME | Yes | - | Database name |
| EMERGENT_LLM_KEY | Yes | - | LLM API key |
| CORS_ORIGINS | No | * | Allowed origins |
| SERVER_HOST | No | 0.0.0.0 | Server host |
| SERVER_PORT | No | 8000 | Server port |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| REACT_APP_BACKEND_URL | Yes | - | Backend API URL |
| WDS_SOCKET_PORT | No | 443 | WebSocket port |
| ENABLE_HEALTH_CHECK | No | false | Health check enabled |

---

## Documentation

- **API Reference:** `backend/API_DOCUMENTATION.md`
- **Docker Guide:** `DOCKER_GUIDE.md`
- **Testing Guide:** `tests/README.md`
- **CI/CD Guide:** `.github/workflows/README.md`
- **Enhancement Summary:** `ENHANCEMENT_SUMMARY.md`

---

## Common Commands

### Development

```bash
# Start backend (local)
cd backend && uvicorn server:app --reload

# Start frontend (local)
cd frontend && yarn start

# Start everything (Docker)
docker-compose up

# Run all tests
cd backend && pytest && cd ../frontend && yarn test:e2e
```

### Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean everything
docker-compose down -v
```

### Testing

```bash
# Backend
pytest                    # All tests
pytest -v               # Verbose
pytest --cov=server     # With coverage
pytest tests/unit/      # Unit only

# Frontend
yarn test:e2e           # Run tests
yarn test:e2e:ui        # Interactive UI
yarn test:e2e:headed    # Visible browser
```

---

## Next Steps

1. **Copy environment templates:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Update EMERGENT_LLM_KEY** with your actual API key

3. **Start development:**
   ```bash
   docker-compose up
   ```

4. **Open in browser:**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/api/docs

5. **Run tests:**
   ```bash
   cd backend && pytest
   cd frontend && yarn test:e2e
   ```

---

## Support

For detailed information:
- API docs: http://localhost:8000/api/docs (when running)
- Backend guide: `backend/API_DOCUMENTATION.md`
- Docker guide: `DOCKER_GUIDE.md`
- Testing guide: `tests/README.md`

---

**Happy coding! 🚀**
