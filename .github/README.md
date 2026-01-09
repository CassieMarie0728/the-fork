<img src="./assets/overview-image-one.png-365dm79r.png" alt="The Fork — hero banner" width="100%" />

# The Fork

> One decision split your life in half. This app lets you talk to the version of you who took the other path.

This README is brief where it should be, thorough where it must be. Read it like you're about to open a door you can't close — clearly, without hand-holding, with a map and a few emergency exits.

---

## Quick orientation — what it is (and what it isn't)

- What it is: a stateless, single-session chat that lets you talk to "Other You" — an LLM persona that role-plays the life you didn't choose.
- What it isn't: therapy, a confidant that stores your secrets, or a soft place to land by default.
- Tone: choose an intensity (mild / savage / brutal). The persona stays in-character and reflects lived consequences, tradeoffs, and blunt observations.

Trigger warning: conversations can surface uncomfortable material. If you're in crisis, stop now and seek help.

---

## Demo

<img src="./assets/1.jpeg-s2kvmlqo.jpg" alt="The Fork app UI - chat interface screenshot 1" width="100%">

<img src="./assets/2.jpeg-dvfeoqfm.jpg" alt="The Fork app UI - chat interface screenshot 2" width="100%">

---

## How it works (high level)

1. You provide a fork statement — a single defining decision and the path you didn't take.
2. You pick intensity: mild, savage, or brutal.
3. The frontend posts your session (sessionId + messages + forkStatement + intensity) to the backend.
4. The backend composes a system prompt (the "Other You" persona + safety checks + style mirroring), calls the Emergent LLM, and returns a reply.
5. Conversations are ephemeral — nothing is persisted for user experience. (Mongo exists in the template but is optional.)

---

## Tech stack & requirements

- Frontend: React (Create React App), Tailwind, craco, Playwright (E2E)
- Backend: FastAPI, Uvicorn, Motor/PyMongo (Mongo optional), Pydantic
- LLM: Emergent LLM via emergentintegrations.llm.chat (EMERGENT_LLM_KEY required to enable chat)
- Containerization: Docker, docker-compose
- Tests: Pytest (backend), Playwright (frontend)
- System requirements:
  - Node.js 18+
  - Python 3.11+
  - Docker & Docker Compose (optional)
  - (Optional) MongoDB if you want to run the bundled mongo service

---

## Quick Start — local development (recommended)

Two short paths below. Copy .env.example → .env, add your EMERGENT_LLM_KEY for chat to work.

A. Backend (local)

```bash
# from repo root
cd backend

# copy template and edit
cp .env.example .env
# edit .env -> set EMERGENT_LLM_KEY and MONGO_URL/DB_NAME if you use mongo

# install Python deps
python -m pip install -r requirements.txt

# run tests
pytest

# run server
uvicorn server:app --reload
# Open the API at http://localhost:8000/api/
# Swagger UI: http://localhost:8000/api/docs
```

B. Frontend (local)

```bash
cd frontend

# copy template and edit
cp .env.example .env
# ensure REACT_APP_BACKEND_URL points to your backend (http://localhost:8000)

# install
yarn install

# run E2E tests
yarn test:e2e

# start dev server
yarn start
# App at http://localhost:3000
```

---

## Quick Start — Docker Compose (one-command)

Docker Compose spins up mongo (optional), backend, and frontend dev server.

```bash
# from repo root
docker-compose up --build
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API docs: http://localhost:8000/api/docs
```

Stop and remove services:

```bash
docker-compose down
# To remove volumes (mongo data)
docker-compose down -v
```

View logs:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

---

## Backend — API & configuration (practical)

Core file: backend/server.py — the chat endpoint and safety logic live here.

Main endpoint:
- POST /api/chat — send forkStatement, intensity, messages, sessionId → returns { reply: string }
- GET /api/ — simple health check
- API docs: GET /api/docs

Environment (backend/.env.example):

```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=your_emergent_llm_key_here   # REQUIRED for chat to work
SERVER_HOST="0.0.0.0"
SERVER_PORT=8000
```

Example curl (chat):

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "forkStatement": "I chose engineering instead of art.",
    "intensity": "savage",
    "messages": [
      {"role": "user", "content": "Do you regret it?"}
    ],
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

Error cases:
- 400: missing forkStatement
- 500: missing EMERGENT_LLM_KEY or LLM failures
- Safety responses: self-harm or hate markers return a refusal/help message instead of forwarding to the LLM.

Safety summary (what the server checks):
- Lightweight self-harm cue detection (returns crisis resources like 988 / Samaritans)
- Hate/dehumanizing language triggers a refusal and prompt to redirect conversation
- The backend also constructs a system prompt that forbids slurs or abusive content even at high intensities.

LLM integration:
- Uses emergentintegrations.llm.chat.LlmChat with system message + session id
- Model: configured to "openai", "gpt-5.2" in the code (adapt as needed)
- Keep your EMERGENT_LLM_KEY secret; do not commit .env with real keys.

---

## Frontend — dev, build, test

Key scripts (frontend/package.json):

- yarn start — dev server (craco)
- yarn build — production build
- yarn test — CRA test runner
- yarn test:e2e — playwright tests

Environment (frontend/.env.example):

```
REACT_APP_BACKEND_URL=https://parallel-you-1.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

Development tips:
- Ensure REACT_APP_BACKEND_URL points to your backend during local dev (http://localhost:8000)
- Frontend hot-reloads with the source bind mount in docker-compose for quick iteration

---

## Docker notes & ports

- docker-compose exposes:
  - frontend -> 3000
  - backend -> 8000
  - mongo -> 27017 (optional)
- Backend Dockerfile runs uvicorn on 8000
- Frontend has two Dockerfiles:
  - frontend/Dockerfile.dev — used by docker-compose for dev mode (hot reload)
  - frontend/Dockerfile — production multi-stage build that serves build/ with serve
- Healthchecks are defined for services in docker-compose.yml; check logs if a container repeatedly restarts.

Production considerations:
- Restrict CORS_ORIGINS to your domain(s)
- Use real secrets (Docker secrets / env vars in your platform)
- Add TLS / reverse proxy (Nginx)
- Add rate limiting, monitoring, and a thoughtful content moderation pipeline for public deployments

---

## Testing & CI

- Backend tests:
  - Run from repo root: cd backend && pytest
- Frontend E2E (Playwright):
  - cd frontend && yarn test:e2e
  - Playwright config present at frontend/playwright.config.js

CI:
- GitHub Actions workflows present under .github/workflows (backend-tests.yml, frontend-tests.yml, docker-build.yml, code-quality.yml). The repo ships badges in the original README.

---

## Contributing — short, direct, practical

If you're about to change the voice, rewind and think twice. The persona is deliberate and documented in server.py. That said, we welcome improvements.

Workflow:

1. Fork & clone
2. Create a branch: git checkout -b feature/your-feature
3. Run tests (backend & frontend)
4. Add tests for new behavior
5. Keep changes scoped; document changes in ENHANCEMENT_SUMMARY.md or docs
6. Open a PR with a clear description of intent and design/ethics impacts

Code style:
- Backend: FastAPI/Pydantic idioms; run black/isort/flake8 as in requirements
- Frontend: follow CRA + Tailwind conventions; run ESLint

---

## Troubleshooting (common)

Backend won't start:
- python --version → must be 3.11+
- Check EMERGENT_LLM_KEY in backend/.env
- lsof -i :8000 to inspect port conflicts
- docker-compose logs backend for container issues

Frontend won't start:
- node --version → Node 18+
- yarn install; if issues: rm -rf node_modules yarn.lock && yarn install
- lsof -i :3000 to inspect port conflicts

Mongo connection:
- If using docker-compose, mongo defaults: admin/password, DB fork_database
- Check docker-compose logs mongo

CORS:
- Update backend CORS_ORIGINS (comma-separated) in backend/.env if your frontend is on another host/port.

---

## Safety & ethics (read this)

The app intentionally pushes hard at lived choices. The server implements:
- Self-harm detection with immediate refusal + crisis resources
- A hate/harm refusal for dehumanizing content
- Strict "stay in character" rules but explicit prohibition on slurs, threats, and identity attacks
- Intensity controls that allow profanity but not abuse

If you plan to use this beyond private experiments, get an ethics review, add moderation, and be explicit about limitations to users.

Crisis resources (if you're reading and need them):
- U.S./Canada: 988 (call/text) — immediate help
- U.K. & ROI: Samaritans 116 123
- If elsewhere, check your local emergency resources

---

## Where to look next (docs & files)

- Quick start and expanded guide: QUICKSTART.md
- Docker deep-dive: DOCKER_GUIDE.md
- API reference: backend/API_DOCUMENTATION.md
- Backend entrypoint & safety rules: backend/server.py
- Frontend scripts & E2E: frontend/package.json and frontend/e2e
- CI: .github/workflows/

---

## License & maintainers

- License: MIT (see LICENSE)
- Maintainer / contact: Cassandra Crossno — (repo owner: CassieMarie0728)
- Emergent LLM integration & credits: emergentintegrations, Emergent team

---

If you came here to ask "what if?", do it honestly. The Fork won't make it gentle for you; it will make it real. If you're hacking on it, keep things safe, include tests, and respect the persona rules baked into server.py.

Open the door carefully.
