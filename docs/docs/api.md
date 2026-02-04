# API Documentation

The backend provides a RESTful API for interacting with the application.

## Base URL

```
http://localhost:5000
```

Or on production:
```
https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via bearer token in the Authorization header.

## Endpoints

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy"
}
```

### Example Endpoint

**GET** `/api/resource`

Retrieve a list of resources.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [],
  "status": "success"
}
```

## Error Handling

All errors return a consistent error response:

```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## Rate Limiting

API calls are rate-limited to prevent abuse. Check the `X-RateLimit-*` headers in responses.

## For More Details

See [API_DOCUMENTATION.md](https://github.com/CassieMarie0728/the-fork/blob/main/backend/API_DOCUMENTATION.md) in the backend directory.
