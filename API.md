# JPD HUB API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400):**
```json
{
  "error": "Email already registered"
}
```

---

### Login
Authenticate user and get JWT token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400):**
```json
{
  "error": "Invalid email or password"
}
```

---

## 🔗 Link Management Endpoints

### Create Link
Create a new link with automatic QR code generation.

**Endpoint:** `POST /link`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My GitHub",
  "url": "https://github.com/johndoe",
  "description": "My GitHub profile"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "My GitHub",
  "url": "https://github.com/johndoe",
  "description": "My GitHub profile",
  "clicks": 0,
  "visits": 0,
  "order": 1,
  "qrCode": "data:image/png;base64,iVBORw0KG...",
  "rules": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### Get All User's Links
Retrieve all links for the authenticated user, sorted by order.

**Endpoint:** `GET /links`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "My GitHub",
    "url": "https://github.com/johndoe",
    "description": "My GitHub profile",
    "clicks": 5,
    "visits": 12,
    "order": 1,
    "qrCode": "data:image/png;base64,iVBORw0KG...",
    "rules": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "title": "My Twitter",
    "url": "https://twitter.com/johndoe",
    "description": "My Twitter profile",
    "clicks": 8,
    "visits": 20,
    "order": 2,
    "qrCode": "data:image/png;base64,iVBORw0KG...",
    "rules": [],
    "createdAt": "2024-01-15T10:31:00Z",
    "updatedAt": "2024-01-15T10:31:00Z"
  }
]
```

---

### Update Link
Update link title, URL, or description. Regenerates QR code if URL changes.

**Endpoint:** `PUT /link/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated GitHub",
  "url": "https://github.com/johndoe",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Updated GitHub",
  "url": "https://github.com/johndoe",
  "description": "Updated description",
  "clicks": 5,
  "visits": 12,
  "order": 1,
  "qrCode": "data:image/png;base64,iVBORw0KG...",
  "rules": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:32:00Z"
}
```

**Error (403):**
```json
{
  "error": "Not authorized to update this link"
}
```

**Error (404):**
```json
{
  "error": "Link not found"
}
```

---

### Delete Link
Delete a link permanently.

**Endpoint:** `DELETE /link/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

**Error (403):**
```json
{
  "error": "Not authorized to delete this link"
}
```

---

### Reorder Links
Update the order of multiple links.

**Endpoint:** `POST /links/reorder`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "links": [
    {
      "linkId": "507f1f77bcf86cd799439012",
      "order": 2
    },
    {
      "linkId": "507f1f77bcf86cd799439013",
      "order": 1
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Links reordered successfully"
}
```

---

## 📊 Analytics Endpoints

### Get Analytics
Retrieve comprehensive analytics about the user's links and hub.

**Endpoint:** `GET /analytics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalVisits": 150,
  "totalClicks": 45,
  "topPerformers": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My GitHub",
      "clicks": 15,
      "percentage": 33.33
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "My Twitter",
      "clicks": 12,
      "percentage": 26.67
    }
  ],
  "allLinks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My GitHub",
      "clicks": 15,
      "visits": 45,
      "ctr": 33.33
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "My Twitter",
      "clicks": 12,
      "visits": 50,
      "ctr": 24.0
    }
  ]
}
```

---

## 👥 Public Hub Endpoints

### Get Public Links
Retrieve a user's links for public viewing (no authentication required).

**Endpoint:** `GET /public/:userId`

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "hubTitle": "John's Links",
    "hubDescription": "All my important links",
    "theme": "dark",
    "accentColor": "cyan"
  },
  "links": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My GitHub",
      "url": "https://github.com/johndoe",
      "description": "My GitHub profile",
      "clicks": 5
    }
  ]
}
```

---

### Track Link Click
Record a click on a public link for analytics.

**Endpoint:** `POST /click/:linkId`

**Request Body:**
```json
{
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "ipAddress": "192.168.1.1"
}
```

**Response (200):**
```json
{
  "message": "Click tracked successfully",
  "clicks": 6
}
```

---

## 🔄 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  hubTitle: String,
  hubDescription: String,
  theme: String, // 'dark' or 'light'
  accentColor: String, // 'cyan', 'blue', etc.
  totalVisits: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Link Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  url: String,
  description: String,
  clicks: Number,
  visits: Number,
  order: Number,
  qrCode: String, // Data URL
  rules: [
    {
      type: String, // 'time', 'device', 'location', 'performance'
      condition: Mixed,
      active: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  linkId: ObjectId,
  timestamp: Date,
  userAgent: String,
  ipAddress: String,
  country: String,
  device: String // 'mobile', 'desktop', 'tablet'
}
```

---

## 🛡️ Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **JWT Authentication**: Protected routes require valid JWT tokens
3. **Authorization Checks**: Users can only modify their own links
4. **Input Validation**: All inputs are validated before processing
5. **CORS Enabled**: Configured for frontend origin

---

## 📝 Rate Limiting (Recommended)

For production deployment, implement rate limiting:
- 5 requests per minute for authentication endpoints
- 100 requests per minute for API endpoints
- 1000 requests per minute for public endpoints

---

## 🚀 Example Workflow

1. **Sign Up**: `POST /signup` → Get token
2. **Create Links**: `POST /link` → Multiple times
3. **Share Public Hub**: Get public URL `/public/:userId`
4. **Users Click Links**: `POST /click/:linkId` → Tracked
5. **View Analytics**: `GET /analytics` → See metrics

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: JPD HUB Team
