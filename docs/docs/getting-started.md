# Getting Started

Welcome to The Fork! This guide will help you get started with the project.

## Project Overview

The Fork is a collaborative project consisting of:

- **Frontend**: React-based web application for the user interface
- **Backend**: Python Flask server providing the API
- **Tests**: Comprehensive integration and unit tests

## Prerequisites

- Node.js 18+
- Python 3.8+
- Docker (optional, for containerized development)

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python server.py
```

The backend will be available at `http://localhost:5000`

## Next Steps

- Read the [Architecture](./architecture.md) guide to understand the project structure
- Check the [API Documentation](./api.md) for endpoint details
- Run the tests: `python -m pytest tests/`
