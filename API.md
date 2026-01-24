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
Create a new user account. Automatically generates a unique slug for the user's public hub.

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
  "message": "Signup successful",
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "hubSlug": "john-doe",
  "hubUrl": "/hub/john-doe"
}
```

**Response Fields:**
- `userId` - Unique user identifier
- `email` - Registered email address
- `hubSlug` - Auto-generated unique slug for public hub (NEW)
- `hubUrl` - Relative URL path to public hub (NEW)

**Error (400):**
```json
{
  "message": "Email already registered"
}
```

**Slug Generation:**
- Automatically generated from user's name
- Lowercase, hyphen-separated format
- Unique across all users
- Duplicate names get numbered suffixes (e.g., "john-doe-1")

**Examples:**
- "Anika Sharma" → `anika-sharma`
- "John's Hub!" → `johns-hub`
- "User_Name#123" → `user-name-123`

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

### Get Public Hub by Slug (Recommended)
Retrieve a user's hub using their unique slug for clean, shareable URLs.

**Endpoint:** `GET /hub/:slug`

**Parameters:**
- `slug` (string) - User's unique hub slug (e.g., "anika-sharma")

**Example:**
```
GET /hub/anika-sharma
```

**Response (200):**
```json
{
  "userName": "Anika Sharma",
  "hubSlug": "anika-sharma",
  "hubTitle": "My Links",
  "hubDescription": "Welcome to my link hub",
  "theme": "dark",
  "accentColor": "#00ff00",
  "visitorCountry": "US",
  "visitorCountryName": "United States",
  "visitorDevice": "desktop",
  "visitorDeviceInfo": {
    "browser": "Chrome",
    "os": "Windows"
  },
  "totalLinks": 5,
  "visibleLinks": 5,
  "links": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My Portfolio",
      "url": "https://portfolio.com",
      "description": "Check out my work",
      "clicks": 45,
      "visits": 120,
      "qrCode": "data:image/png;base64...",
      "order": 0
    }
  ]
}
```

**Error (404) - Invalid Slug:**
```json
{
  "message": "Invalid hub URL",
  "slug": "Invalid@Slug"
}
```

**Error (404) - Not Found:**
```json
{
  "message": "Hub not found",
  "slug": "non-existent-slug"
}
```

---

### Get Public Links by User ID (Legacy)
Retrieve a user's links using their user ID (maintained for backward compatibility).

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

**Note:** Use the `/hub/:slug` endpoint for cleaner, more shareable URLs.

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
  allowedCountries: [String], // ['GLOBAL', 'IN', 'US', etc.]
  allowedDevices: [String], // ['all', 'mobile', 'desktop', 'tablet']
  createdAt: Date,
  updatedAt: Date
}
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
3. **Update Theme**: `PUT /user/theme` → Customize public page
4. **Share Public Hub**: Get public URL `/public/:userId`
5. **Users Click Links**: `POST /click/:linkId` → Tracked
6. **View Analytics**: `GET /analytics` → See metrics
7. **Export Analytics**: `GET /analytics/export/:userId` → Download CSV

---

## 👤 User Profile Endpoints

### Get User Profile
Retrieve current user's profile information including theme and accent color.

**Endpoint:** `GET /user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "hubTitle": "John's Links",
  "hubDescription": "All my important links",
  "theme": "dark",
  "accentColor": "#00ff00",
  "totalVisits": 1523,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-24T14:22:00Z"
}
```

**Error (404):**
```json
{
  "message": "User not found"
}
```

---

### Update Profile
Update user profile information.

**Endpoint:** `PUT /user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "hubTitle": "My Awesome Links",
  "hubDescription": "Check out these links!"
}
```

**Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "hubTitle": "My Awesome Links",
    "hubDescription": "Check out these links!",
    "theme": "dark",
    "accentColor": "#00ff00"
  }
}
```

---

### Update Theme
Change user's theme preference (light or dark).

**Endpoint:** `PUT /user/theme`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "theme": "light"
}
```

**Valid Values:**
- `"dark"` - Dark theme (default)
- `"light"` - Light theme

**Response (200):**
```json
{
  "message": "Theme updated successfully",
  "theme": "light"
}
```

**Error (400):**
```json
{
  "message": "Invalid theme. Must be 'light' or 'dark'"
}
```

---

### Update Accent Color
Change the accent color for public hub page.

**Endpoint:** `PUT /user/accent-color`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "accentColor": "#ff5500"
}
```

**Valid Format:**
- Hex color codes: `#RGB` or `#RRGGBB`
- Examples: `#00f`, `#00ff00`, `#FF5500`

**Response (200):**
```json
{
  "message": "Accent color updated successfully",
  "accentColor": "#ff5500"
}
```

**Error (400):**
```json
{
  "message": "Invalid color. Must be a valid hex color (e.g., #00ff00)"
}
```

---

## 📊 Analytics Export Endpoints

### Export Analytics as CSV
Download all link analytics data as a CSV file.

**Endpoint:** `GET /analytics/export/:userId`

**Parameters:**
- `userId` (path) - User's MongoDB ObjectId

**Response (200):**
- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="username_analytics_YYYY-MM-DD.csv"`

**CSV Format:**
```
Link Title,URL,Total Clicks,Total Visits,Last Clicked,Created Date
My GitHub,https://github.com/johndoe,152,189,2026-01-24,2026-01-15
Desktop Software,https://desktop.example.com,89,102,2026-01-23,2026-01-16
Universal Link,https://example.com,245,301,2026-01-24,2026-01-14
```

**Example Response:**
- File auto-downloads as CSV
- Filename: `johndoe_analytics_2026-01-24.csv`

**Error (404):**
```json
{
  "message": "User not found"
}
```

**Error (404):**
```json
{
  "message": "No links found for this user"
}
```

---

## 📍 Location & Device Filtering

### Get Public Links (with Filtering)
Public links are filtered based on:
1. **Visitor's Location** (Geolocation via IP)
2. **Visitor's Device Type** (Mobile, Desktop, Tablet)
3. **Theme Preference** (Light or Dark)

**Endpoint:** `GET /public/:userId`

**Response (200):**
```json
{
  "userName": "John Doe",
  "hubTitle": "John's Links",
  "hubDescription": "All my important links",
  "theme": "dark",
  "accentColor": "#00ff00",
  "visitorCountry": "IN",
  "visitorCountryName": "India",
  "visitorDevice": "desktop",
  "visitorDeviceInfo": {
    "deviceType": "desktop",
    "browser": "Chrome",
    "browserVersion": "120.0",
    "os": "Windows",
    "osVersion": "10",
    "device": "Desktop"
  },
  "totalLinks": 8,
  "visibleLinks": 6,
  "links": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My GitHub",
      "url": "https://github.com/johndoe",
      "description": "My GitHub profile",
      "clicks": 15,
      "visits": 45,
      "qrCode": "data:image/png;base64,iVBORw0KG...",
      "allowedCountries": ["GLOBAL"],
      "allowedDevices": ["all"]
    }
  ]
}
```

**Filtering Logic:**
- **Location**: Links with `allowedCountries: ["GLOBAL"]` visible everywhere; others only in specified countries
- **Device**: Links with `allowedDevices: ["all"]` visible on all devices; others only on specified devices
- **Combined**: Both filters use AND logic (country match AND device match required)

---

## 📱 Device Types

Automatically detected from User-Agent:

| Device Type | Detection | Example |
|-------------|-----------|---------|
| `mobile` | iOS, Android phones | iPhone, Samsung Galaxy |
| `desktop` | Windows, Mac, Linux | Windows PC, MacBook |
| `tablet` | iPad, Android tablets | iPad Pro, Galaxy Tab |
| `all` | All devices (default) | Unrestricted |

### Setting Device Restrictions
```json
// Mobile only
"allowedDevices": ["mobile"]

// Desktop only
"allowedDevices": ["desktop"]

// Mobile and tablet
"allowedDevices": ["mobile", "tablet"]

// All devices (default)
"allowedDevices": ["all"]
```

---

## 🌍 Location Codes

Common country codes for `allowedCountries`:

| Code | Country | Code | Country |
|------|---------|------|---------|
| `GLOBAL` | Worldwide | `IN` | India |
| `US` | United States | `GB` | United Kingdom |
| `CA` | Canada | `AU` | Australia |
| `DE` | Germany | `FR` | France |
| `JP` | Japan | `CN` | China |
| `BR` | Brazil | `RU` | Russia |

**Geolocation Source:** ip-api.com (45 req/min free tier)

---

**Version**: 2.0.0  
**Last Updated**: January 24, 2026  
**Author**: JPD HUB Team  
**Latest Features**: Device Detection, Location Filtering, Theme Toggle, CSV Export, User Profiles
