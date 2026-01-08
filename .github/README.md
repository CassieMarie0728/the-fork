# 🌌 The Fork

> *"One decision split your life in half. This app lets you talk to the version of you who took the other path."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Backend Tests](https://github.com/cassiemarie0728/the-fork/workflows/Backend%20Tests/badge.svg)](https://github.com/cassiemarie0728/the-fork/actions)
[![Frontend Tests](https://github.com/cassiemarie0728/the-fork/workflows/Frontend%20Tests/badge.svg)](https://github.com/cassiemarie0728/the-fork/actions)
[![Docker Build](https://github.com/cassiemarie0728/the-fork/workflows/Build%20Docker%20Images/badge.svg)](https://github.com/cassiemarie0728/the-fork/actions)
[![Code Quality](https://github.com/cassiemarie0728/the-fork/workflows/Code%20Quality/badge.svg)](https://github.com/cassiemarie0728/the-fork/actions)

---

## ✨ What is The Fork?

**The Fork** is a full-stack, single-session chat application that lets you explore what your life might have been like if you had made a different decision. No accounts, no history, no comfort—just pure conversation with your alternate self.

### Key Features:
- **One-time conversations**: Each session exists only for the duration of your interaction
- **Three intensity modes**: Mild, Savage, or Brutal—choose how direct you want your alternate self to be
- **Stateless design**: No data is stored, ensuring complete privacy
- **Minimalist UI**: Designed to feel like crossing a threshold, not using an app
- **Full-stack architecture**: React frontend with FastAPI backend

---

## 🛠️ Tech Stack

### Frontend:
- **Framework**: React (SPA)
- **Styling**: Tailwind CSS
- **Testing**: Playwright (E2E)
- **Build Tool**: Webpack (via Create React App)
- **State Management**: React hooks

### Backend:
- **Framework**: FastAPI
- **Database**: MongoDB (optional, stateless by default)
- **LLM Integration**: Emergent AI
- **Testing**: Pytest

### DevOps:
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Environment**: Cross-platform (Windows, macOS, Linux)

### System Requirements:
- Node.js 18+
- Python 3.11+
- Docker (for containerized deployment)
- MongoDB (optional, for development)

---

## 🚀 Quick Start

### Option 1: Local Development (Recommended)

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env

# Update .env with your settings (especially EMERGENT_LLM_KEY)
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

#### Frontend Setup
```bash
# Navigate to frontend directory
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

#### MongoDB Setup (Optional)
```bash
# Start MongoDB locally
mongod --dbpath ./data
# Or use Docker:
docker run -d -p 27017:27017 --name fork-mongo mongo:7.0
```

---

### Option 2: Docker Compose (Quick Start)

```bash
# From project root directory
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
# MongoDB: localhost:27017

# Stop services when done
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

---

## 📁 Project Structure

```
the-fork/
├── 📄 README.md                          # Project overview (this file)
├── 📄 QUICKSTART.md                      # Quick start guide
├── 📄 ENHANCEMENT_SUMMARY.md             # What was added
├── 📄 IMPLEMENTATION_REPORT.md           # Completion report
├── 📄 DOCKER_GUIDE.md                    # Docker documentation
├── 📄 DOCUMENTATION_INDEX.md             # Complete documentation index
├── 📄 plan.md                            # Original MVP plan
├── 📄 test_result.md                     # Testing protocol
├── 📄 .env.example                       # Environment template
├── 📄 .gitignore                         # Git configuration
├── 📄 docker-compose.yml                # Multi-service orchestration
├── 📄 .dockerignore                     # Docker build optimization
├── 📄 .github/workflows/README.md        # CI/CD guide
│
├── backend/                              # Backend API Service
│   ├── server.py                         # FastAPI application
│   ├── requirements.txt                  # Python dependencies
│   ├── .env                             # Environment variables
│   ├── .env.example                     # Environment template
│   ├── Dockerfile                       # Production image
│   └── API_DOCUMENTATION.md             # API reference
│
├── frontend/                            # Frontend React Application
│   ├── src/                             # Source code
│   │   ├── components/                  # Modular React components
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── utils/                       # Utility functions
│   │   ├── pages/                       # Page components
│   │   ├── App.js                       # Router
│   │   ├── index.js                     # Entry point
│   │   ├── App.css                      # Component styles
│   │   └── index.css                    # Global styles
│   ├── public/                          # Static assets
│   ├── e2e/                             # End-to-end tests
│   ├── package.json                     # Dependencies
│   ├── .env.example                     # Environment template
│   ├── playwright.config.js              # Test configuration
│   ├── Dockerfile                       # Production image
│   └── Dockerfile.dev                  # Development image
│
├── tests/                               # Test suites
│   ├── unit/                            # Unit tests
│   ├── integration/                     # Integration tests
│   └── conftest.py                     # Pytest configuration
│
└── .github/                             # GitHub configuration
    └── workflows/                       # CI/CD workflows
```

---

## 🔧 Configuration

### Environment Variables

#### Backend Configuration (`.env`):
```
# MongoDB Connection
MONGO_URL="mongodb://localhost:27017"
DB_NAME="fork_database"

# CORS Configuration
CORS_ORIGINS="*"

# Emergent LLM Integration
EMERGENT_LLM_KEY=your_emergent_llm_key_here

# Logging (optional)
LOG_LEVEL="INFO"

# Server (optional)
SERVER_HOST="0.0.0.0"
SERVER_PORT=8000
```

#### Frontend Configuration (`.env`):
```
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000

# WebSocket Configuration (for development)
WDS_SOCKET_PORT=443

# Feature Flags
ENABLE_HEALTH_CHECK=false
```

### Intensity Modes

The Fork offers three intensity levels for your conversation:

| Intensity | Description                                                                 | Example Response                                                                 |
|-----------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Mild**  | Supportive, honest, and empathetic                                         | *"I can see why you chose engineering. It's stable, but I wonder what you'd miss."* |
| **Savage**| Direct, truthful, and challenging                                          | *"You gave up art for a job? That's not courage—that's cowardice."*            |
| **Brutal**| No comfort, no flinching, but still non-abusive                            | *"You're a fraud. You're just scared of being bad at something."*              |

---

## 🎯 Usage Examples

### Basic Usage

1. **Enter your fork statement**: Describe the decision that split your life
2. **Select intensity**: Choose how direct you want your alternate self to be
3. **Start conversation**: Begin chatting with your alternate self
4. **End session**: The conversation disappears when you close the tab

```javascript
// Example of how the chat API works (backend)
const response = await axios.post('/api/chat', {
  forkStatement: "I chose to become a software engineer instead of pursuing music professionally.",
  intensity: "savage",
  messages: [
    { role: "user", content: "How do you feel about the choice you made?" }
  ],
  sessionId: "unique-session-uuid"
});

// Example of how the frontend components work
<ForkSetup
  forkStatement={state.forkStatement}
  setForkStatement={setForkStatement}
  intensity={state.intensity}
  setIntensity={setIntensity}
  onStart={startConversation}
/>
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started with Development

1. **Fork the repository** and clone your copy
2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd frontend
   yarn install
   ```

3. **Set up environment variables** (copy `.env.example` to `.env`)

4. **Run tests**:
   ```bash
   # Backend
   pytest

   # Frontend
   yarn test:e2e
   ```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the existing code style

3. **Write tests** for your new functionality

4. **Run the full test suite**:
   ```bash
   docker-compose up --build
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

6. **Push to your fork** and create a pull request

### Code Style Guidelines

- **Frontend**: Follow React best practices and use Tailwind CSS consistently
- **Backend**: Follow FastAPI conventions and use Pydantic models for data validation
- **Testing**: Write comprehensive tests for all new functionality
- **Documentation**: Keep all documentation up-to-date with your changes

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

**Maintainers:**
- [Cassandra Crossno](https://github.com/cassiemarie0728) - Project Lead
- [Emergent Team](https://emergent.sh) - AI Integration

**Special Thanks:**
- All contributors who have helped improve this project
- The open-source community for their invaluable resources

---

## 🐛 Issues & Support

### Reporting Issues

If you encounter any problems or have suggestions for improvement:

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected behavior
   - Any relevant error messages
   - Your environment (OS, Node/Python version, etc.)

### Getting Help

- **Discussions**: Use the GitHub Discussions tab for questions and ideas
- **Email**: For urgent support, contact cmcrossno@gmail.com

---

## 🗺️ Roadmap

### Current Version (v1.0)
- Core functionality complete
- Full test coverage
- Docker support
- CI/CD pipeline

### Planned Features
- [ ] User analytics (anonymous, opt-in)
- [ ] Multiple conversation history (with user consent)
- [ ] Mobile app version
- [ ] More intensity modes
- [ ] Community sharing (with privacy controls)

### Known Issues
- [#12] Docker health checks could be more robust
- [#23] Some edge cases in API error handling
- [#37] Mobile responsiveness improvements

---

## 🌟 Star and Share!

If you find The Fork useful, please consider:

- ⭐ **Starring** this repository to show your support
- 📢 **Sharing** with others who might benefit
- 💬 **Leaving feedback** on what you'd like to see next

The Fork is a tool for exploring the "what if" of life's decisions. Every star and contribution helps us make it better for everyone.

---
