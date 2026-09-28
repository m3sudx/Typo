
```text
docs/api-design.md
```

````md
# Typo AI API Documentation

Base URL:

```text
http://localhost:3003/api
````

---

## API Overview

| Method | Endpoint                      | Description                               |
| ------ | ----------------------------- | ----------------------------------------- |
| POST   | `/auth/register`              | Create a user account                     |
| POST   | `/auth/login`                 | Log in a user                             |
| GET    | `/conversations`              | Get the current user's conversations      |
| POST   | `/conversations`              | Create a new conversation                 |
| GET    | `/conversations/:id/messages` | Get messages in a conversation            |
| POST   | `/conversations/:id/messages` | Send a message and receive an AI response |
| DELETE | `/conversations/:id`          | Delete a conversation                     |

---

# Authentication

## 1. Register

### Request

```http
POST /api/auth/register
```

### Body

```json
{
  "email": "mesud@example.com",
  "password": "your-password"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "mesud@example.com"
  }
}
```


---

## 2. Login

### Request

```http
POST /api/auth/login
```

### Body

```json
{
  "email": "mesud@example.com",
  "password": "your-password"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "mesud@example.com"
  },
  "token": "example-access-token"
}
```


---

# Conversations

## 3. Get Conversations

Returns conversations belonging to the authenticated user.

### Request

```http
GET /api/conversations
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "conversations": [
    {
      "id": 12,
      "title": "Learning JavaScript",
      "created_at": "2026-09-25T06:00:00.000Z",
      "updated_at": "2026-09-25T06:15:00.000Z"
    },
    {
      "id": 13,
      "title": "Express middleware",
      "created_at": "2026-09-25T07:00:00.000Z",
      "updated_at": "2026-09-25T07:05:00.000Z"
    }
  ]
}
```

> The backend must determine the user from the authentication token. The client should not provide a `user_id` and expect the server to trust it.

---

## 4. Create Conversation

Creates a new conversation for the authenticated user.

### Request

```http
POST /api/conversations
```

### Body

```json
{
  "title": "Learning JavaScript"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "conversation": {
    "id": 14,
    "title": "Learning JavaScript",
    "created_at": "2026-09-25T08:00:00.000Z"
  }
}
```

The server determines the `user_id` from the authenticated user.

---

# Messages

## 5. Get Conversation Messages

Returns all messages belonging to a conversation.

### Request

```http
GET /api/conversations/:id/messages
```

### Example

```http
GET /api/conversations/14/messages
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "messages": [
    {
      "id": 101,
      "role": "user",
      "content": "Explain JavaScript closures",
      "created_at": "2026-09-25T08:01:00.000Z"
    },
    {
      "id": 102,
      "role": "assistant",
      "content": "A closure is a function that remembers variables from its outer scope.",
      "created_at": "2026-09-25T08:01:03.000Z"
    }
  ]
}
```

The backend must verify that the conversation belongs to the authenticated user.

---

## 6. Send Message

Sends a user message and generates an AI response.

### Request

```http
POST /api/conversations/:id/messages
```

### Example

```http
POST /api/conversations/14/messages
```

### Body

```json
{
  "content": "Explain JavaScript closures"
}
```

### Server Flow

The backend should:

1. Authenticate the user.
2. Verify that the conversation belongs to the user.
3. Validate the message.
4. Save the user's message.
5. Get the relevant conversation history.
6. Send the conversation context to Gemini.
7. Receive the AI response.
8. Save the AI response.
9. Return the messages to the client.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "userMessage": {
    "id": 101,
    "role": "user",
    "content": "Explain JavaScript closures"
  },
  "assistantMessage": {
    "id": 102,
    "role": "assistant",
    "content": "A closure is a function that remembers variables from its outer scope."
  }
}
```

---

# Delete Conversation

## 7. Delete Conversation

Deletes a conversation belonging to the authenticated user.

### Request

```http
DELETE /api/conversations/:id
```

### Example

```http
DELETE /api/conversations/14
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

The backend must verify that the conversation belongs to the authenticated user before deleting it.

---

# Error Responses

All API errors should follow a consistent structure.

## 400 Bad Request

Used when the client sends invalid data.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "content",
      "message": "Message content is required"
    }
  ]
}
```

---

## 401 Unauthorized

Used when authentication is required but the user is not authenticated.

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## 404 Not Found

Used when the requested resource does not exist.

```json
{
  "success": false,
  "message": "Conversation not found"
}
```

---

## 500 Internal Server Error

Used when an unexpected server error occurs.

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# Database Relationships

The API is based on these relationships:

```text
User
 │
 │ 1
 │
 │ many
 ▼
Conversation
 │
 │ 1
 │
 │ many
 ▼
Message
```

### Users

```text
users
├── id
├── email
├── password_hash
└── created_at
```

### Conversations

```text
conversations
├── id
├── user_id
├── title
├── created_at
└── updated_at
```

### Messages

```text
messages
├── id
├── conversation_id
├── role
├── content
└── created_at
```

---

# Frontend → Backend Flow

```text
React
  │
  │ HTTP Request
  ▼
Express API
  │
  ├── Authentication
  │
  ├── Validation
  │
  ├── PostgreSQL
  │
  └── Gemini API
  │
  ▼
JSON Response
  │
  ▼
React
```

---

# Chat Message Flow

When a user sends a message:

```text
User
 │
 ▼
React ChatInput
 │
 │ POST /api/conversations/:id/messages
 ▼
Express
 │
 ├── Verify authentication
 │
 ├── Verify conversation ownership
 │
 ├── Validate message
 │
 ├── Save user message
 │
 ├── Get conversation history
 │
 ├── Send context to Gemini
 │
 ├── Save AI response
 │
 └── Return response
 │
 ▼
React ChatWindow
 │
 ├── UserMessage
 │
 └── AIMessage
```

---

# Development Order

The API will be implemented in this order:

1. Create conversation routes
2. Connect routes to PostgreSQL
3. Create conversation controllers
4. Create message routes
5. Save and retrieve messages
6. Add request validation
7. Add authentication
8. Add authorization/ownership checks
9. Integrate Gemini
10. Connect React to the API
11. Test the complete chat flow
12. Prepare the API for the future Flutter client

````

