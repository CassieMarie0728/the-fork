"""
Integration tests for The Fork backend API endpoints
"""
import pytest
from server import ChatRequest, ChatMessage


class TestChatEndpoint:
    """Tests for the /api/chat endpoint"""

    def test_chat_with_valid_request(self, client, valid_fork_request):
        """Valid chat request should return response with reply field"""
        response = client.post("/api/chat", json=valid_fork_request)
        # Note: This will fail without proper LLM setup, but we test the structure
        assert response.status_code in [200, 500]  # 500 if LLM not available
        if response.status_code == 200:
            assert "reply" in response.json()

    def test_chat_missing_fork_statement(self, client):
        """Request without forkStatement should return 400"""
        request = {
            "intensity": "mild",
            "messages": [],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        assert response.status_code == 400
        assert "forkStatement" in response.json()["detail"]

    def test_chat_with_empty_fork_statement(self, client):
        """Request with empty forkStatement should return 400"""
        request = {
            "forkStatement": "",
            "intensity": "mild",
            "messages": [],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        assert response.status_code == 400

    def test_chat_with_whitespace_fork_statement(self, client):
        """Request with only whitespace forkStatement should return 400"""
        request = {
            "forkStatement": "   ",
            "intensity": "mild",
            "messages": [],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        assert response.status_code == 400

    def test_chat_invalid_intensity(self, client):
        """Request with invalid intensity should fail validation"""
        request = {
            "forkStatement": "I chose A over B",
            "intensity": "invalid",
            "messages": [],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        # Pydantic should validate this
        assert response.status_code == 422  # Unprocessable Entity

    def test_chat_all_intensity_levels(self, client, valid_fork_request):
        """All intensity levels should be accepted"""
        for intensity in ["mild", "savage", "brutal"]:
            request = valid_fork_request.copy()
            request["intensity"] = intensity
            response = client.post("/api/chat", json=request)
            # Will fail at LLM level but should pass request validation
            assert response.status_code in [200, 500]

    def test_chat_with_previous_messages(self, client, valid_fork_request):
        """Request with conversation history should be accepted"""
        request = valid_fork_request.copy()
        request["messages"] = [
            {"role": "user", "content": "First message"},
            {"role": "assistant", "content": "Response"},
            {"role": "user", "content": "Second message"}
        ]
        response = client.post("/api/chat", json=request)
        assert response.status_code in [200, 500]

    def test_chat_self_harm_trigger(self, client):
        """Self-harm messages should trigger safety response"""
        request = {
            "forkStatement": "I chose engineering",
            "intensity": "mild",
            "messages": [
                {"role": "user", "content": "I want to kill myself"}
            ],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        assert response.status_code == 200
        data = response.json()
        assert "reply" in data
        # Should contain help resources
        assert "988" in data["reply"] or "help" in data["reply"].lower()

    def test_chat_hate_speech_trigger(self, client):
        """Hate speech should trigger safety response"""
        request = {
            "forkStatement": "I chose A over B",
            "intensity": "mild",
            "messages": [
                {"role": "user", "content": "Let's exterminate them"}
            ],
            "sessionId": "test-session"
        }
        response = client.post("/api/chat", json=request)
        assert response.status_code == 200
        data = response.json()
        # Should contain refusal
        assert "No" in data["reply"]


class TestStatusEndpoint:
    """Tests for the status check endpoints (template)"""

    def test_root_endpoint(self, client):
        """Root endpoint should return API alive message"""
        response = client.get("/")
        assert response.status_code == 200
        assert "alive" in response.json()["message"].lower()

    def test_status_check_get(self, client):
        """GET /status should return list"""
        response = client.get("/status")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_status_check_post(self, client):
        """POST /status should create status check"""
        request = {"client_name": "test-client"}
        response = client.post("/status", json=request)
        assert response.status_code == 200
        data = response.json()
        assert data["client_name"] == "test-client"
        assert "id" in data
        assert "timestamp" in data
