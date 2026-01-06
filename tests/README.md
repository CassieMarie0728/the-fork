"""
Backend testing README

## Running Tests

### All tests
```bash
pytest
```

### Unit tests only
```bash
pytest tests/unit/
```

### Integration tests only
```bash
pytest tests/integration/
```

### With coverage report
```bash
pytest --cov=backend tests/
```

### Specific test file
```bash
pytest tests/unit/test_server.py
```

### Specific test class
```bash
pytest tests/unit/test_server.py::TestTruncate
```

### Specific test
```bash
pytest tests/unit/test_server.py::TestTruncate::test_truncate_short_text
```

### With verbose output
```bash
pytest -v
```

### Stop on first failure
```bash
pytest -x
```

## Test Structure

- `tests/unit/` - Unit tests for individual functions
- `tests/integration/` - Integration tests for API endpoints
- `tests/conftest.py` - Pytest fixtures and configuration

## Required Environment Variables

Before running tests, ensure `.env` is properly configured:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
EMERGENT_LLM_KEY=your_key_here
CORS_ORIGINS="*"
```

## Notes

- Integration tests require the FastAPI application to be importable
- Some tests may fail if LLM API keys are not valid (expected behavior)
- Database tests assume MongoDB is available at the configured URL
