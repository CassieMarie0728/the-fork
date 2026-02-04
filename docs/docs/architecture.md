# Architecture

## Project Structure

```
the-fork/
├── frontend/          # React web application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Python Flask API
│   ├── server.py
│   ├── tests/
│   └── requirements.txt
├── tests/             # Integration and unit tests
│   ├── unit/
│   ├── integration/
│   └── conftest.py
└── docs/              # Documentation (Docusaurus)
```

## Frontend Architecture

The frontend is a React application built with:
- **Components**: Modular React components
- **Hooks**: Custom React hooks for state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Playwright**: End-to-end testing

### Key Components

- `App.js` - Main application component
- `ChatWindow.js` - Chat interface
- `ForkSetup.js` - Setup wizard
- `IntensityToggle.js` - Intensity control

## Backend Architecture

The backend is a Python Flask API that:
- Provides RESTful endpoints
- Handles business logic
- Manages data persistence
- Supports real-time communication

### Key Files

- `server.py` - Flask application entry point
- `requirements.txt` - Python dependencies

## Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows with Playwright

## Deployment

Both services are containerized with Docker:
- `frontend/Dockerfile` - Production frontend image
- `backend/Dockerfile` - Production backend image
- `docker-compose.yml` - Local development stack
