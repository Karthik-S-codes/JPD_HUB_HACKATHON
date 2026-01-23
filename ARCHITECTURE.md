# JPD HUB - Architecture & System Design

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User's Web Browser                          │
│                    (React Frontend - Port 5174)                  │
└─────────────┬───────────────────────────────────────────────────┘
              │
              │ HTTP/JSON (Axios)
              │
┌─────────────▼───────────────────────────────────────────────────┐
│                   Express.js API Server                          │
│                     (Port 5000)                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Routes  │  │ Link Routes  │  │ CORS/Middleware│        │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                                     │
│  ┌──────▼──────┐  ┌───────▼──────┐                             │
│  │Auth         │  │Link          │                             │
│  │Controller   │  │Controller    │                             │
│  └──────┬──────┘  └───────┬──────┘                             │
│         │                  │                                     │
└─────────┼──────────────────┼──────────────────────────────────┘
          │                  │
          │ MongoDB Queries
          │ (Mongoose ODM)
          │
┌─────────▼──────────────────▼──────────────────────────────────┐
│              MongoDB Database (Atlas Cloud)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │Users        │  │Links        │  │Analytics     │          │
│  │Collection   │  │Collection   │  │Collection    │          │
│  └─────────────┘  └─────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### User Signup Flow
```
User Signup Form
        │
        ▼
Validate Input (Frontend)
        │
        ▼
POST /signup
        │
        ▼
Validate Input (Backend)
        │
        ▼
Hash Password (bcryptjs)
        │
        ▼
Create User in DB
        │
        ▼
Generate JWT Token
        │
        ▼
Return Token to Frontend
        │
        ▼
Store Token (localStorage)
        │
        ▼
Redirect to Dashboard
```

### Create Link Flow
```
Link Form (Title, URL, Description)
        │
        ▼
Validate Input (Frontend)
        │
        ▼
POST /link (with JWT token)
        │
        ▼
Verify JWT (Middleware)
        │
        ▼
Validate Input (Backend)
        │
        ▼
Generate QR Code (qrcode library)
        │
        ▼
Assign Order Number
        │
        ▼
Create Document in Links Collection
        │
        ▼
Return Link with QR Code
        │
        ▼
Update UI Dashboard
        │
        ▼
Link appears in list with counter = 0
```

### Click Tracking Flow
```
User clicks link on Public Hub
        │
        ▼
POST /click/:linkId
        │
        ▼
Detect Device Type (user-agent parsing)
        │
        ▼
Record Analytics (userId, linkId, device, timestamp, IP)
        │
        ▼
Increment link.clicks counter
        │
        ▼
Increment link.visits counter
        │
        ▼
Return updated click count
        │
        ▼
Browser navigates to target URL
```

### Analytics Retrieval Flow
```
User clicks "Analytics" button
        │
        ▼
GET /analytics (with JWT token)
        │
        ▼
Verify JWT (Middleware)
        │
        ▼
Aggregate Analytics Data:
├── Count total visits
├── Count total clicks
├── Get top 5 links by clicks
└── Calculate CTR for each link
        │
        ▼
Return aggregated metrics
        │
        ▼
Display Dashboard with:
├── Total Visits (👁️)
├── Total Clicks (🔗)
├── Top Performers (table)
└── All Links (with CTR)
```

---

## 🗂️ Folder Structure & Responsibility

```
backend/
├── models/                    # Database Schemas
│   ├── User.js              # User authentication & hub customization
│   ├── Link.js              # Links with QR codes & rules
│   └── Analytics.js         # Click tracking & device detection
│
├── controllers/               # Business Logic
│   ├── authController.js    # Signup/Login logic, JWT generation
│   └── linkController.js    # CRUD, QR generation, Analytics aggregation
│
├── routes/                    # API Endpoints
│   ├── authRoutes.js        # /signup, /login
│   └── linkRoutes.js        # /link, /links, /analytics, /public, /click
│
├── middleware/                # Request Processing
│   └── auth.js              # JWT verification & user extraction
│
├── config/                    # Configuration
│   └── db.js                # MongoDB connection setup
│
├── app.js                     # Express setup (middleware, routes)
├── server.js                  # Entry point (server startup)
└── .env                       # Environment variables (secrets)

frontend/
├── pages/                     # Page Components
│   ├── Login.jsx            # Authentication entry, form handling
│   ├── Signup.jsx           # New account creation
│   ├── Dashboard.jsx        # Link CRUD, QR modals, form management
│   ├── Analytics.jsx        # Metrics display, aggregated data
│   └── Public.jsx           # Public hub, link display, click tracking
│
├── components/                # Reusable Components
│   ├── Navbar.jsx           # Navigation bar
│   ├── ProtectedRoute.jsx   # Route guard (auth check)
│   └── (others)
│
├── services/                  # API Integration
│   └── api.js               # Axios instance, base URL configuration
│
├── App.jsx                    # Router setup, route definitions
├── main.jsx                   # React entry point
├── index.css                  # Base styles + Tailwind imports
└── vite.config.js             # Build configuration
```

---

## 📊 Database Schema Diagram

### User Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  name: String,                     // User's name
  email: String (unique),           // Email address
  password: String (hashed),        // bcryptjs hash
  hubTitle: String,                 // "My Links"
  hubDescription: String,           // User-defined description
  theme: String,                    // "dark" or "light"
  accentColor: String,              // Cyan, blue, etc.
  totalVisits: Number,              // Hub visit counter
  createdAt: Date,
  updatedAt: Date
}
```

### Link Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  userId: ObjectId (ref: User),     // Foreign key
  title: String,                    // Link title
  url: String,                      // Target URL
  description: String,              // Optional description
  clicks: Number,                   // Click counter
  visits: Number,                   // Visit counter
  order: Number,                    // Display order (1, 2, 3...)
  qrCode: String,                   // Data URL (PNG base64)
  rules: [                          // Rule-based display
    {
      type: String,                 // "time", "device", etc.
      condition: Mixed,             // Rule parameters
      active: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,                    // Primary key
  userId: ObjectId (ref: User),     // Foreign key
  linkId: ObjectId (ref: Link),     // Foreign key
  timestamp: Date,                  // When click happened
  userAgent: String,                // Browser info
  ipAddress: String,                // Visitor IP
  country: String,                  // Geo-location (for future use)
  device: String                    // "mobile", "desktop", "tablet"
}
```

### Index Strategy
```javascript
// For fast queries:
User.createIndex({ email: 1 })           // Email lookup
Link.createIndex({ userId: 1, order: 1 }) // User's links sorted
Analytics.createIndex({ linkId: 1 })      // Link analytics aggregation
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React)                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. User enters email & password                         │ │
│ │ 2. Submit to POST /login                                │ │
│ │ 3. Receive JWT token                                    │ │
│ │ 4. Store token: localStorage.setItem('token', jwt)      │ │
│ │ 5. Include in all requests: Authorization: Bearer JWT   │ │
│ │ 6. On logout: localStorage.removeItem('token')          │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ HTTP Header         │
        │ Authorization:      │
        │ Bearer <JWT>        │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ Backend (Express)                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Middleware: auth.js                                     │ │
│ │ 1. Extract token from Authorization header              │ │
│ │ 2. Verify token: jwt.verify(token, SECRET)              │ │
│ │ 3. If valid: extract userId, set req.userId            │ │
│ │ 4. If invalid: return 401 Unauthorized                  │ │
│ │ 5. Call next() to continue to route handler             │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 API Request/Response Cycle

### Protected Endpoint Example (Create Link)

**Request**:
```
POST http://localhost:5000/link HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My GitHub",
  "url": "https://github.com/user",
  "description": "My GitHub profile"
}
```

**Response (Success - 201)**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "My GitHub",
  "url": "https://github.com/user",
  "description": "My GitHub profile",
  "clicks": 0,
  "visits": 0,
  "order": 1,
  "qrCode": "data:image/png;base64,iVBORw0KGgo...",
  "rules": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response (Error - 401)**:
```json
{
  "error": "Invalid token"
}
```

---

## 📱 Frontend Component Hierarchy

```
App.jsx
├── BrowserRouter (React Router)
│   └── Routes
│       ├── Route "/" → Login.jsx
│       │   ├── LoginForm
│       │   └── SignupLink
│       │
│       ├── Route "/signup" → Signup.jsx
│       │   ├── SignupForm
│       │   └── LoginLink
│       │
│       ├── Route "/dashboard" → Dashboard.jsx
│       │   ├── Navbar (user info, logout)
│       │   ├── LinkForm (create new link)
│       │   ├── LinksList
│       │   │   └── LinkItem (with edit, delete, QR buttons)
│       │   ├── QRCodeModal (for displaying QR)
│       │   └── AnalyticsButton
│       │
│       ├── Route "/analytics" → Analytics.jsx
│       │   ├── StatCards (visits, clicks)
│       │   ├── TopPerformers (table)
│       │   └── PerformanceTable (all links)
│       │
│       └── Route "/public/:id" → Public.jsx
│           ├── UserInfo (avatar, name)
│           └── LinksList (clickable links)
```

---

## 🔌 Integration Points

### Frontend → Backend
- **Axios Instance**: `axios.defaults.baseURL = 'http://localhost:5000'`
- **Headers**: Automatically adds `Authorization: Bearer TOKEN`
- **Error Handling**: Centralized error handling in api.js
- **Token Management**: Stored in localStorage, sent with every request

### Backend → Database
- **ODM**: Mongoose for MongoDB interaction
- **Connection**: MongoDB Atlas cloud database
- **Queries**: Automatic population of references
- **Indexes**: For fast lookups on frequently queried fields

---

## 🛡️ Security Layers

```
Layer 1: Frontend Validation
├── Email format validation
├── URL format validation
└── Password strength check

Layer 2: HTTP Transport
├── HTTPS (in production)
└── CORS (origin validation)

Layer 3: API Authentication
├── JWT token verification
├── Token expiration (if implemented)
└── Token revocation on logout

Layer 4: Database Security
├── Password hashing (bcryptjs)
├── Authorization checks (userId match)
├── Input sanitization
└── MongoDB Atlas IP whitelisting

Layer 5: Data Protection
├── No sensitive data in logs
├── No passwords in responses
├── Proper error messages
└── HTTPS encryption
```

---

## ⚡ Performance Optimization

### Frontend Optimizations
- Vite for fast development builds
- React.lazy() for code splitting (ready to implement)
- Tailwind CSS for minimal CSS
- Efficient state management with useState

### Backend Optimizations
- Express middleware ordering
- MongoDB indexes on userId
- Efficient aggregation pipelines
- Connection pooling ready
- Caching-ready architecture

### Database Optimizations
- Proper schema normalization
- Indexes on frequently queried fields
- Lean queries (select specific fields)
- Pagination-ready (implement limit/skip)

---

## 🚀 Scaling Strategy

### Horizontal Scaling
```
├── Multiple backend instances
│   └── Load balancer (Nginx, AWS ELB)
│       ├── Backend 1 (Port 5000)
│       ├── Backend 2 (Port 5000)
│       └── Backend 3 (Port 5000)
│
└── Single MongoDB Atlas cluster
    └── Auto-scales vertically
```

### Caching Layer
```
Frontend
  ↓
CDN (Cloudflare)
  ↓
Redis Cache Layer
  ↓
Backend
  ↓
MongoDB
```

### Database Scaling
```
MongoDB Atlas
├── Sharding (by userId)
│   ├── Shard 1: Users A-M
│   ├── Shard 2: Users N-Z
│   └── Shard 3: Users AA-ZZ
│
├── Replication Set (3 nodes)
│   ├── Primary (write)
│   ├── Secondary 1 (read)
│   └── Secondary 2 (read)
│
└── Auto-scaling storage
```

---

## 📊 Request Rate Limits (Recommended)

```
/auth endpoints (signup, login):
  └── 5 requests per minute per IP

/link endpoints (CRUD):
  └── 100 requests per minute per user

/public endpoints:
  └── 1000 requests per minute per IP

/analytics endpoint:
  └── 30 requests per minute per user
```

---

## 🔄 Error Handling Strategy

```
Frontend Error Handling:
├── Try-catch in async functions
├── API error response parsing
├── User-friendly error messages
└── Redirect on auth errors (401 → Login)

Backend Error Handling:
├── Try-catch in controllers
├── Proper HTTP status codes
│   ├── 200 OK
│   ├── 201 Created
│   ├── 400 Bad Request
│   ├── 401 Unauthorized
│   ├── 403 Forbidden
│   ├── 404 Not Found
│   └── 500 Server Error
├── Detailed error messages
└── No sensitive data leakage
```

---

## 🧪 Testing Strategy

```
Unit Tests (Controller functions):
├── Create link with valid data → success
├── Create link with invalid URL → error 400
├── Create link without auth → error 401
└── Get analytics for multiple links

Integration Tests (Full flow):
├── Signup → Login → Create link → View analytics
├── Edit link → QR code regenerates
└── Delete link → analytics cleanup

E2E Tests (User interactions):
├── Login flow
├── Create/edit/delete links
├── Click tracking
└── Analytics verification

Load Tests:
├── 100+ concurrent users
├── 1000+ links
└── 10000+ analytics records
```

---

## 📈 Monitoring & Metrics

```
Frontend Metrics:
├── Page load time
├── API response time
├── User interactions
└── Error rates

Backend Metrics:
├── Request count
├── Response time (avg, p95, p99)
├── Error rate by endpoint
├── Database query time
└── Memory usage

Database Metrics:
├── Query count
├── Index usage
├── Disk space
├── Collection sizes
└── Replication lag
```

---

## 🎯 Architecture Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 19 + Vite | User interface |
| Backend | Express.js | API server |
| Database | MongoDB Atlas | Data persistence |
| Auth | JWT + bcryptjs | Security |
| QR Code | qrcode library | Link visualization |
| Styling | Tailwind CSS | Beautiful UI |
| HTTP Client | Axios | API requests |

---

**Architecture Version**: 1.0  
**Last Updated**: January 2024  
**Status**: Production Ready ✅
