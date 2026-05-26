# API Documentation - PT Surya Inti Gas

Base URL: `http://localhost:8000/api`

## Note

This API is divided into two sections:
- **Public Endpoints**: Accessible without authentication for website visitors
- **Admin Endpoints**: Require authentication via Laravel Sanctum for admin panel access (prefixed with `/admin/`)

## Table of Contents
- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
  - [Projects](#projects)
  - [Team Members](#team-members)
  - [Certifications](#certifications)
  - [Contact Form](#contact-form)
  - [Chatbot - Public Features](#chatbot---public-features)
- [Admin Endpoints (Requires Authentication)](#admin-endpoints-requires-authentication)
  - [Chatbot Analytics](#chatbot-analytics)
  - [Chatbot Monitoring](#chatbot-monitoring)
  - [Chatbot Language Support](#chatbot-language-support)
  - [Chatbot Sentiment Analysis](#chatbot-sentiment-analysis)
  - [Chatbot A/B Testing](#chatbot-ab-testing)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Register User
**POST** `/auth/register`

Register a new user and receive an API token.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "1|xxxxxxxxxxxxx"
  }
}
```

**Validation Errors (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Login
**POST** `/auth/login`

Authenticate a user and receive an API token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "1|xxxxxxxxxxxxx"
  }
}
```

### Logout (Protected)
**POST** `/auth/logout`

Logout the authenticated user and revoke the token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User (Protected)
**GET** `/auth/me`

Get the authenticated user's information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## Projects

### Get All Projects
**GET** `/projects`

Retrieve all active projects with optional category filtering.

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "Industrial", "Commercial")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Project Name",
      "category": "Industrial",
      "location": "Jakarta",
      "year": 2023,
      "image": "project-image.jpg",
      "desc": "Project description",
      "icon": "project-icon.png",
      "stats": {
        "clients": 50,
        "projects": 100
      }
    }
  ],
  "categories": ["All", "Industrial", "Commercial"],
  "message": "Projects retrieved successfully"
}
```

### Get Single Project
**GET** `/projects/{id}`

Retrieve a specific project by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Project Name",
    "category": "Industrial",
    "location": "Jakarta",
    "year": 2023,
    "image": "project-image.jpg",
    "desc": "Project description",
    "icon": "project-icon.png",
    "stats": {
      "clients": 50,
      "projects": 100
    }
  },
  "message": "Project retrieved successfully"
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

---

## Team Members

### Get All Team Members
**GET** `/team`

Retrieve all active team members.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "role": "CEO",
      "experience": "10+ years",
      "expertise": "Gas Industry",
      "image": "team-member.jpg",
      "bio": "Team member biography",
      "icon": "member-icon.png",
      "stats": {
        "projects": 50,
        "awards": 5
      }
    }
  ],
  "message": "Team members retrieved successfully"
}
```

### Get Single Team Member
**GET** `/team/{id}`

Retrieve a specific team member by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "role": "CEO",
    "experience": "10+ years",
    "expertise": "Gas Industry",
    "image": "team-member.jpg",
    "bio": "Team member biography",
    "icon": "member-icon.png",
    "stats": {
      "projects": 50,
      "awards": 5
    }
  },
  "message": "Team member retrieved successfully"
}
```

---

## Certifications

### Get All Certifications
**GET** `/certifications`

Retrieve all active certifications.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "ISO 9001:2015",
      "desc": "Quality Management System",
      "icon": "iso-icon.png",
      "color": "#FF0000",
      "bg": "#FFEEEE",
      "details": "Certification details",
      "valid": "2025-12-31",
      "scope": "Quality Management"
    }
  ],
  "message": "Certifications retrieved successfully"
}
```

### Get Single Certification
**GET** `/certifications/{id}`

Retrieve a specific certification by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "ISO 9001:2015",
    "desc": "Quality Management System",
    "icon": "iso-icon.png",
    "color": "#FF0000",
    "bg": "#FFEEEE",
    "details": "Certification details",
    "valid": "2025-12-31",
    "scope": "Quality Management"
  },
  "message": "Certification retrieved successfully"
}
```

---

## Contact Form

### Submit Contact Form
**POST** `/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "no_hp": "+628123456789",
  "pesan": "I would like to inquire about your services",
  "csrf_token": "security-token-string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim. Kami akan segera menghubungi Anda.",
  "data": {
    "nama": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation Errors (422):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Format email tidak valid"],
    "no_hp": ["No HP wajib diisi"]
  }
}
```

---

## Chatbot

### Send Message to Chatbot
**POST** `/chatbot`

Send a message to the chatbot and receive a response.

**Request Body:**
```json
{
  "message": "Halo, saya ingin bertanya tentang layanan Anda",
  "history": []
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu?",
    "source": "local",
    "timestamp": "2026-05-22T10:03:00.000000Z"
  },
  "message": "Response generated successfully"
}
```

### Send Chatbot Feedback
**POST** `/chatbot/feedback`

Submit feedback about a chatbot interaction.

**Request Body:**
```json
{
  "user_message": "What services do you offer?",
  "bot_response": "We offer gas supply, consultation, and maintenance services",
  "source": "local",
  "intent": "services_inquiry",
  "confidence": 0.95,
  "rating": 5,
  "comment": "Very helpful response",
  "helpful": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback recorded successfully"
}
```

### Get Feedback Statistics (Admin Only)
**GET** `/admin/chatbot/feedback/stats`

Get chatbot feedback statistics (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_feedback": 150,
    "average_rating": 4.5,
    "helpful_count": 120,
    "source_distribution": {
      "local": 80,
      "fallback": 20
    }
  }
}
```

### Get Chatbot Analytics (Admin Only)
**GET** `/admin/chatbot/analytics`

Get chatbot usage analytics.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` (optional): Type of analytics (summary, popular, by_source)
- `limit` (optional): Number of results to return (default: 10)
- `source` (optional): Filter by source for by_source type

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_interactions": 500,
    "unique_questions": 150,
    "source_distribution": {
      "local": 300,
      "fallback": 200
    },
    "avg_similarity": 0.85
  }
}
```

### Chat Stream
**POST** `/chat/stream`

Send a message to the chatbot (streaming endpoint, currently non-streaming).

**Request Body:**
```json
{
  "message": "Tell me about your company",
  "history": []
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "PT Surya Inti Gas adalah perusahaan yang bergerak di bidang...",
    "source": "local",
    "timestamp": "2026-05-22T10:03:00.000000Z"
  },
  "streaming": false
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (in debug mode only)"
}
```

---

## Rate Limiting

All API endpoints are subject to rate limiting to prevent abuse and ensure fair usage.

### Public Endpoints
- **Chatbot Chat**: 30 requests per minute per IP address
  - Endpoints: `/chatbot`, `/chatbot/async`, `/chatbot/feedback`, `/chat/stream`, `/chat/stream/legacy`
- **Content Endpoints** (projects, team, certifications): 100 requests per minute per IP address
  - Endpoints: `/projects`, `/team`, `/certifications`, `/contact`
- **Authentication** (login, register): 100 requests per minute per IP address
  - Endpoints: `/auth/register`, `/auth/login`

### Admin Endpoints (Requires Authentication)
- **All Admin Endpoints**: 120 requests per minute per authenticated user
  - Endpoints: All endpoints prefixed with `/admin/`

### Rate Limit Headers
When you make requests, the API returns the following headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `Retry-After`: Seconds until you can make another request (when rate limited)

### Response When Rate Limited
**Status Code**: 429 Too Many Requests

**Response Body:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retry_after": 45
}
```

**Headers:**
- `Retry-After`: Seconds until you can make another request

---

## Notes

- All datetime fields use ISO 8601 format
- Authentication tokens should be included in the `Authorization` header as `Bearer {token}`
- Protected endpoints require valid authentication
- The API uses standard HTTP status codes
- Response format is consistent across all endpoints
