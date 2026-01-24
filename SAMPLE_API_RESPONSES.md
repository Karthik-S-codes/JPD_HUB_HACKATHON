# Smart URL Generation - Sample API Responses

## 📋 Complete API Response Examples

---

## 1. User Signup (Modified)

### Request:
```http
POST /api/auth/signup HTTP/1.1
Content-Type: application/json

{
  "name": "Anika Sharma",
  "email": "anika@example.com",
  "password": "securepassword123"
}
```

### Response (Success - 201 Created):
```json
{
  "message": "Signup successful",
  "userId": "67a1b2c3d4e5f6g7h8i9j0k1",
  "email": "anika@example.com",
  "hubSlug": "anika-sharma",
  "hubUrl": "/hub/anika-sharma"
}
```

**New Fields:**
- `hubSlug`: Unique slug generated from name
- `hubUrl`: Relative path to public hub

---

## 2. Get Hub by Slug (Success)

### Request:
```http
GET /api/links/hub/anika-sharma HTTP/1.1
```

### Response (Success - 200 OK):
```json
{
  "userName": "Anika Sharma",
  "hubSlug": "anika-sharma",
  "hubTitle": "My Links",
  "hubDescription": "Welcome to my link hub! Find all my important links here.",
  "theme": "dark",
  "accentColor": "#00ff00",
  "visitorCountry": "US",
  "visitorCountryName": "United States",
  "visitorDevice": "desktop",
  "visitorDeviceInfo": {
    "browser": "Chrome",
    "os": "Windows",
    "version": "120.0.0"
  },
  "totalLinks": 5,
  "visibleLinks": 5,
  "links": [
    {
      "_id": "link001",
      "title": "My Portfolio",
      "url": "https://portfolio.aniksharma.com",
      "description": "Check out my latest projects and work",
      "clicks": 145,
      "visits": 320,
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "order": 0,
      "rules": [],
      "allowedCountries": [],
      "allowedDevices": []
    },
    {
      "_id": "link002",
      "title": "LinkedIn Profile",
      "url": "https://linkedin.com/in/aniksharma",
      "description": "Connect with me professionally",
      "clicks": 89,
      "visits": 210,
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "order": 1,
      "rules": [],
      "allowedCountries": [],
      "allowedDevices": []
    },
    {
      "_id": "link003",
      "title": "GitHub",
      "url": "https://github.com/aniksharma",
      "description": "View my open source contributions",
      "clicks": 67,
      "visits": 155,
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "order": 2,
      "rules": [],
      "allowedCountries": [],
      "allowedDevices": []
    },
    {
      "_id": "link004",
      "title": "Twitter",
      "url": "https://twitter.com/aniksharma",
      "description": "Follow me for tech updates",
      "clicks": 45,
      "visits": 98,
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "order": 3,
      "rules": [],
      "allowedCountries": [],
      "allowedDevices": []
    },
    {
      "_id": "link005",
      "title": "Contact Form",
      "url": "https://contact.aniksharma.com",
      "description": "Get in touch with me",
      "clicks": 23,
      "visits": 56,
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "order": 4,
      "rules": [],
      "allowedCountries": [],
      "allowedDevices": []
    }
  ]
}
```

---

## 3. Invalid Slug Format

### Request:
```http
GET /api/links/hub/Invalid@Slug! HTTP/1.1
```

### Response (404 Not Found):
```json
{
  "message": "Invalid hub URL",
  "slug": "Invalid@Slug!"
}
```

**Reason:** Slug contains special characters (@, !)

---

## 4. Slug Not Found

### Request:
```http
GET /api/links/hub/non-existent-user-12345 HTTP/1.1
```

### Response (404 Not Found):
```json
{
  "message": "Hub not found",
  "slug": "non-existent-user-12345"
}
```

**Reason:** No user with this slug exists in database

---

## 5. Duplicate Name Handling

### First User:
**Request:**
```json
{
  "name": "John Doe",
  "email": "john1@example.com",
  "password": "pass123"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "userId": "user001",
  "email": "john1@example.com",
  "hubSlug": "john-doe",
  "hubUrl": "/hub/john-doe"
}
```

### Second User (Same Name):
**Request:**
```json
{
  "name": "John Doe",
  "email": "john2@example.com",
  "password": "pass123"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "userId": "user002",
  "email": "john2@example.com",
  "hubSlug": "john-doe-1",
  "hubUrl": "/hub/john-doe-1"
}
```

### Third User (Same Name):
**Request:**
```json
{
  "name": "John Doe",
  "email": "john3@example.com",
  "password": "pass123"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "userId": "user003",
  "email": "john3@example.com",
  "hubSlug": "john-doe-2",
  "hubUrl": "/hub/john-doe-2"
}
```

---

## 6. Special Characters in Name

### Request:
```json
{
  "name": "Aniká Śhármà",
  "email": "anika.special@example.com",
  "password": "pass123"
}
```

### Response:
```json
{
  "message": "Signup successful",
  "userId": "user004",
  "email": "anika.special@example.com",
  "hubSlug": "anik-shrm",
  "hubUrl": "/hub/anik-shrm"
}
```

**Note:** Special characters are removed, resulting in simplified slug

---

## 7. Name with Numbers and Symbols

### Request:
```json
{
  "name": "User_Name#123!",
  "email": "user123@example.com",
  "password": "pass123"
}
```

### Response:
```json
{
  "message": "Signup successful",
  "userId": "user005",
  "email": "user123@example.com",
  "hubSlug": "user-name-123",
  "hubUrl": "/hub/user-name-123"
}
```

**Note:** Underscores replaced with hyphens, special chars removed

---

## 8. Long Name with Multiple Words

### Request:
```json
{
  "name": "Dr. Rajesh Kumar Sharma PhD MBA",
  "email": "rajesh@example.com",
  "password": "pass123"
}
```

### Response:
```json
{
  "message": "Signup successful",
  "userId": "user006",
  "email": "rajesh@example.com",
  "hubSlug": "dr-rajesh-kumar-sharma-phd-mba",
  "hubUrl": "/hub/dr-rajesh-kumar-sharma-phd-mba"
}
```

---

## 9. Hub with Filtered Links (Device/Location)

### Request:
```http
GET /api/links/hub/anika-sharma HTTP/1.1
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)
X-Forwarded-For: 103.123.45.67 (India)
```

### Response:
```json
{
  "userName": "Anika Sharma",
  "hubSlug": "anika-sharma",
  "hubTitle": "My Links",
  "hubDescription": "Welcome!",
  "theme": "dark",
  "accentColor": "#00ff00",
  "visitorCountry": "IN",
  "visitorCountryName": "India",
  "visitorDevice": "mobile",
  "visitorDeviceInfo": {
    "browser": "Mobile Safari",
    "os": "iOS",
    "version": "16.0"
  },
  "totalLinks": 10,
  "visibleLinks": 7,
  "links": [
    {
      "_id": "link001",
      "title": "Mobile-Friendly Portfolio",
      "url": "https://m.portfolio.com",
      "description": "Optimized for mobile",
      "clicks": 45,
      "visits": 120,
      "allowedDevices": ["mobile"]
    }
    // Only links visible to mobile users in India
  ]
}
```

**Note:** `totalLinks` (10) vs `visibleLinks` (7) shows filtering in action

---

## 10. Empty Hub (New User)

### Request:
```http
GET /api/links/hub/new-user HTTP/1.1
```

### Response:
```json
{
  "userName": "New User",
  "hubSlug": "new-user",
  "hubTitle": "My Links",
  "hubDescription": "",
  "theme": "dark",
  "accentColor": "#00ff00",
  "visitorCountry": "US",
  "visitorCountryName": "United States",
  "visitorDevice": "desktop",
  "visitorDeviceInfo": {
    "browser": "Chrome",
    "os": "Windows"
  },
  "totalLinks": 0,
  "visibleLinks": 0,
  "links": []
}
```

---

## 11. Comparison: Old vs New Route

### Old Route (Still Works):
```http
GET /api/links/public/67a1b2c3d4e5f6g7h8i9j0k1 HTTP/1.1
```

**Response:**
```json
{
  "userName": "Anika Sharma",
  "hubTitle": "My Links",
  // ... (no hubSlug field)
  "links": [...]
}
```

### New Route (Recommended):
```http
GET /api/links/hub/anika-sharma HTTP/1.1
```

**Response:**
```json
{
  "userName": "Anika Sharma",
  "hubSlug": "anika-sharma",
  "hubTitle": "My Links",
  // ... (includes hubSlug field)
  "links": [...]
}
```

---

## 📊 Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `userName` | string | User's display name |
| `hubSlug` | string | Unique URL slug (NEW) |
| `hubTitle` | string | Custom hub title |
| `hubDescription` | string | Hub description |
| `theme` | string | "dark" or "light" |
| `accentColor` | string | Hex color code |
| `visitorCountry` | string | 2-letter country code |
| `visitorCountryName` | string | Full country name |
| `visitorDevice` | string | "mobile", "tablet", or "desktop" |
| `visitorDeviceInfo` | object | Browser, OS details |
| `totalLinks` | number | Total links owned by user |
| `visibleLinks` | number | Links visible to this visitor |
| `links` | array | Array of link objects |

---

---

## 🔗 Additional Notes

- **Backward Compatibility:** Old `/public/:userId` route continues to work
- **Production Ready:** Feature is fully tested and documented
- **Migration:** Use `migrateUserSlugs.js` to add slugs to existing users
- **Validation:** Slugs must match pattern `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

**Created:** January 25, 2026  
**Last Updated:** January 25, 2026  
**Version:** 1.0  
**Feature:** Smart URL Generation
