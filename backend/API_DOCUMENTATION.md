# The Fork API Documentation

## Overview

The Fork API is a FastAPI service that provides an interactive conversation interface with an AI-powered alternate self. All interactions are stateless, with no persistent storage.

**Base URL:** `/api`

## Authentication

No authentication required. All requests are stateless.

## Endpoints

### Health Check

```http
GET /api/
```

Verify that the API is running and responsive.

**Response:**
```json
{
  "message": "The Fork API is alive."
}
```

---

### Chat Endpoint

```http
POST /api/chat
```

Send a message and receive a response from your alternate self.

#### Request

```json
{
  "forkStatement": "I chose engineering instead of art.",
  "intensity": "mild",
  "messages": [
    {
      "role": "user",
      "content": "What would my life look like?"
    },
    {
      "role": "assistant",
      "content": "You'd be in debt with a stable job..."
    }
  ],
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `forkStatement` | string | Yes | The life decision that split your path. Be specific and personal. |
| `intensity` | enum | No | How direct the AI should be: `"mild"` (supportive), `"savage"` (blunt), `"brutal"` (harsh). Default: `"mild"` |
| `messages` | array | No | Conversation history. Each message has `role` ("user" or "assistant") and `content`. Default: `[]` |
| `sessionId` | string | Yes | Unique identifier for the session (UUID format). Used for tracking without storage. |

#### Intensity Levels

- **mild:** Supportive and reflective, but honest. Light profanity allowed.
- **savage:** Blunt and truth-forward. Calls out avoidance. More profanity.
- **brutal:** No comfort or flinching. Extremely direct. Uses profanity freely when appropriate.

#### Response

```json
{
  "reply": "You'd be paying off student loans, sitting in meetings about synergies instead of creating something with your hands. But you'd have healthcare..."
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid fork statement:
```json
{
  "detail": "forkStatement is required"
}
```

**422 Unprocessable Entity** - Invalid request structure:
```json
{
  "detail": [
    {
      "loc": ["body", "intensity"],
      "msg": "value is not a valid enumeration member",
      "type": "type_error.enum"
    }
  ]
}
```

**500 Internal Server Error** - Server or API key issue:
```json
{
  "detail": "LLM request failed: ..."
}
```

#### Safety Features

The endpoint includes safety checks that automatically detect and respond to:
- **Self-harm indicators:** Returns crisis resources (988, Samaritans, etc.)
- **Hate speech:** Returns refusal and redirects to fork discussion

#### Example Usage

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "forkStatement": "I chose to pursue music instead of a stable career.",
    "intensity": "savage",
    "messages": [],
    "sessionId": "user-123-session"
  }'
```

---

## Interactive Documentation

### Swagger UI
```
GET /api/docs
```

Interactive API documentation with "Try It Out" functionality.

### ReDoc
```
GET /api/redoc
```

Alternative, more readable API documentation.

### OpenAPI Schema
```
GET /api/openapi.json
```

Raw OpenAPI 3.0 specification in JSON format.

---

## Session Management

- **sessionId:** A unique identifier (typically UUID) sent with each request
- **Stateless Design:** The server doesn't store conversation history. Clients maintain conversation state.
- **Reset:** To start a new conversation, generate a new sessionId
- **Timeout:** Sessions exist only for the duration of the client's connection

---

## Rate Limiting

Currently no rate limiting is enforced. Production deployments should implement:
- Per-IP rate limiting
- Per-session request throttling
- Daily message limits per session

---

## CORS

By default, CORS is enabled for all origins (`*`). This can be configured via the `CORS_ORIGINS` environment variable.

---

## Errors

All errors follow a standard format:

```json
{
  "detail": "Human-readable error message"
}
```

Common HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Validation error (missing/invalid fields)
- `422 Unprocessable Entity` - Request doesn't conform to schema
- `500 Internal Server Error` - Server error or missing API key

---

## Notes

- All responses are in English
- Messages support newlines and multiline text
- No maximum message length is enforced (but very long messages may be truncated)
- The LLM uses the latest available model
- Conversations are not persisted—they exist only in the client's memory

---

## Environment Variables

The API requires these environment variables to function:

```bash
MONGO_URL=mongodb://localhost:27017          # MongoDB connection (not used by fork endpoint)
DB_NAME=test_database                         # Database name
EMERGENT_LLM_KEY=your_emergent_llm_key       # LLM API key (required for /chat)
CORS_ORIGINS=*                                # CORS configuration
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial release |
