"""Shared pytest fixtures for backend API tests.
Import path resolution is handled by root pytest.ini (pythonpath = ./backend),
so this module intentionally avoids any sys.path mutation.

"""

import pytest
from fastapi.testclient import TestClient
from server import app

@pytest.fixture
def client():

    """Provide a test client for the FastAPI app."""

    return TestClient(app)
@pytest.fixture
def valid_fork_request():

    """Provide a valid fork chat request."""

    return {
        "forkStatement": "I chose to become a software engineer instead of a musician.",
        "intensity": "mild",
        "messages": [],
        "sessionId": "test-session-123",
    }