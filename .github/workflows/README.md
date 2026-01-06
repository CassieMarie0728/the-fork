# GitHub Actions Workflows Guide

## Overview

This directory contains automated CI/CD workflows for The Fork project.

## Workflows

### backend-tests.yml

**Trigger:** Push/PR to main/develop affecting backend or tests

**Actions:**

- Sets up Python 3.11 environment
- Starts MongoDB service
- Installs backend dependencies
- Runs linting (flake8)
- Runs formatting checks (black)
- Runs type checking (mypy)
- Executes unit and integration tests
- Uploads coverage reports to Codecov

**Success Criteria:**

- All tests pass
- Code follows style guidelines
- No linting errors

---

### frontend-tests.yml

**Trigger:** Push/PR to main/develop affecting frontend

**Actions:**

- Sets up Node.js 18 environment
- Installs dependencies
- Runs linting (ESLint)
- Runs unit tests
- Installs Playwright browsers
- Runs end-to-end tests
- Uploads test results as artifacts

**Success Criteria:**

- All tests pass
- Linting passes
- E2E tests complete

---

### docker-build.yml

**Trigger:** Push/PR to main/develop

**Actions:**

- Sets up Docker Buildx
- Builds backend Docker image
- Builds frontend Docker image
- Validates docker-compose configuration
- Uploads images as artifacts for deployment

**Success Criteria:**

- Both images build successfully
- docker-compose.yml is valid

---

### code-quality.yml

**Trigger:** Push/PR to main/develop

**Actions:**

- Backend: flake8, black, isort, bandit
- Frontend: ESLint, npm audit
- Uploads security reports
- All checks are non-blocking (continue on error)

**Success Criteria:**

- Code quality metrics reported
- Security vulnerabilities identified

---

### docs.yml

**Trigger:** Push to main affecting markdown files

**Actions:**

- Validates markdown files
- Checks API documentation exists
- Verifies README files
- Non-blocking checks

**Success Criteria:**

- Documentation is valid

---

## Status Badges

Add to README.md:

```markdown
![Backend Tests](https://github.com/CassieMarie0728/the-fork/workflows/Backend%20Tests/badge.svg)
![Frontend Tests](https://github.com/CassieMarie0728/the-fork/workflows/Frontend%20Tests/badge.svg)
![Docker Build](https://github.com/CassieMarie0728/the-fork/workflows/Build%20Docker%20Images/badge.svg)
![Code Quality](https://github.com/CassieMarie0728/the-fork/workflows/Code%20Quality/badge.svg)
```

## Configuration

### Secrets

Add these to GitHub repository secrets (Settings → Secrets):

```
CODECOV_TOKEN         # For Codecov integration
DOCKER_REGISTRY_TOKEN # For pushing to Docker registry (optional)
```

### Branch Protection

Recommended settings for `main` branch:

- ✓ Require status checks to pass
  - Backend Tests
  - Frontend Tests
  - Docker Build
- ✓ Require code reviews before merging
- ✓ Dismiss stale PR approvals on new pushes
- ✓ Require branches to be up to date before merging

### Environment Variables

Workflows use environment variables from `.env` files in each service directory. For CI:

- Backend: `backend/.env` (mocked in CI with test values)
- Frontend: `frontend/.env` (uses provided defaults)

## Artifacts

### Generated Artifacts

- **backend-image.tar** - Built backend Docker image (1 day retention)
- **frontend-image.tar** - Built frontend Docker image (1 day retention)
- **playwright-report** - E2E test results (7 days retention)
- **security-reports** - Bandit and npm audit reports

### Accessing Artifacts

1. Go to Actions tab
2. Select workflow run
3. Scroll to "Artifacts" section
4. Download desired artifact

## Debugging

### View Workflow Logs

1. Go to Actions tab
2. Select the failed workflow
3. Click the job name
4. Expand failed step for details

### Common Issues

**Python dependencies not found:**

- Check `backend/requirements.txt` is valid
- Verify Python version compatibility

**Node dependencies not found:**

- Check `frontend/yarn.lock` exists
- Verify Node version compatibility

**MongoDB connection fails:**

- Service may not be ready; add health checks
- Verify username/password in workflow

**Tests timeout:**

- Increase timeout in workflow
- Check for infinite loops in code

## Customization

### Adding New Workflows

1. Create `.github/workflows/my-workflow.yml`
2. Define trigger event (push, pull_request, schedule)
3. Add jobs with steps
4. Commit and push to GitHub

Example:

```yaml
name: My New Workflow

on:
  push:
    branches: [main]

jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hello from workflow"
```

### Scheduling Workflows

Run on schedule (e.g., daily tests):

```yaml
on:
  schedule:
    - cron: "0 2 * * *" # 2 AM UTC daily
```

### Matrix Strategy

Test multiple versions:

```yaml
strategy:
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
    node-version: ["16", "18", "20"]
```

## Performance Tips

- Use `cache: pip` and `cache: yarn` to speed up dependency installation
- Limit concurrency with `concurrency` key
- Use `paths` filters to run workflows only when relevant files change
- Cache Docker layers with `cache-from: type=gha`

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
