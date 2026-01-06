import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from server import app


client = TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json()["message"] == "The Fork API is alive."


def test_chat_response_model():
    """Test ChatResponse model structure"""
    from server import ChatResponse
    
    resp = ChatResponse(reply="Test response")
    assert resp.reply == "Test response"


def test_chat_request_model():
    """Test ChatRequest model validation"""
    from server import ChatRequest, ChatMessage
    
    req = ChatRequest(
        forkStatement="Test decision",
        intensity="mild",
        sessionId="test-session-id",
        messages=[
            ChatMessage(role="user", content="Hello"),
        ]
    )
    assert req.forkStatement == "Test decision"
    assert req.intensity == "mild"
    assert len(req.messages) == 1
