import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from server import app

@pytest.fixture
def client():
    """Provide a test client for the FastAPI app"""
    return TestClient(app)

@pytest.fixture
def valid_fork_request():
    """Provide a valid fork chat request"""
    return {
        "forkStatement": "I chose to become a software engineer instead of a musician.",
        "intensity": "mild",
        "messages": [],
        "sessionId": "test-session-123"
    }
