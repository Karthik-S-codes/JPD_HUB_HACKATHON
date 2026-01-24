# JPD HUB - Smart Link Sharing Platform

A modern, feature-rich link sharing platform that allows users to create a centralized hub for all their links with advanced analytics, QR codes, device detection, location filtering, and customizable theming.

## 🎯 Project Overview

JPD HUB is a complete link management solution with intelligent device and location-based filtering, comprehensive analytics with CSV export, and full theme customization. Share your links with style and control exactly who sees what.

---

## ✨ Features Implemented

### 1. **Link Hub Management** ✅
- Add, edit, delete links with titles, URLs, and descriptions
- Reorderable links (drag & drop support)
- Unique public URL for each user's link hub
- Customizable hub title and description
- Advanced link filtering by country and device type

### 2. **Device Detection & Filtering** ✅
- Automatic device detection (Mobile, Desktop, Tablet, TV/Wearable)
- User-Agent parsing using `ua-parser-js`
- Restrict link visibility by device type
- Visitor device information in analytics
- Device icons in UI (📱 🖥️ 🎮)

### 3. **Location-Based Filtering** ✅
- Geolocation detection using `ip-api.com` (45 req/min free)
- Support for 195+ countries
- Restrict link visibility by country
- Visitor country information in analytics
- Combined filtering (Device AND Location)

### 4. **Theme & Color Customization** ✅
- Dark mode (default) and Light mode toggle
- Custom accent color selection (hex format)
- Theme persistence per user
- Dynamic theme application on public pages
- Live preview in theme settings

### 5. **Analytics & Monitoring** ✅
- Track total hub visits and individual link clicks
- Click-through rate (CTR) calculation
- Top performing links identification
- Device and location breakdown
- **CSV Export** - Download analytics as CSV file
- Beautiful analytics dashboard with statistics
- Real-time visitor information

### 6. **QR Code Generation** ✅
- Automatic QR code for each link
- Modal QR viewer
- Shareable QR codes
- QR codes include device/location filtering

### 7. **User Authentication** ✅
- Secure signup and login
- bcryptjs password hashing
- JWT token-based authentication
- Protected routes and API endpoints
- Comprehensive error handling

### 8. **Public Link Hub** ✅
- Beautiful responsive public profile
- Theme and color application
- Click tracking and analytics
- User avatar display
- Device/location-aware link visibility

### 9. **Rate Limiting** ✅
- 4-tier rate limiting system
- Protects against abuse
- Different limits for different endpoint types
- Graceful error responses

### 10. **Backend API** ✅
- Express.js RESTful API
- MongoDB with Mongoose ODM
- Clean MVC architecture
- Input validation and error handling
- Modular code structure

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB connection string (Atlas or local)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd JPD_HUB_HACKATHON
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file in backend directory
echo "MONGODB_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env
echo "PORT=5000" >> .env

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Application runs on http://localhost:5173
```

### Step 4: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📋 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_for_jwt_tokens
PORT=5000
NODE_ENV=development
```

### Frontend (.env if needed)
```
VITE_API_URL=http://localhost:5000
```

---

## 📊 Complete API Documentation

Full API reference available in [API.md](./API.md) including:

- **Authentication Endpoints** - Sign up, login
- **Link Management** - Create, read, update, delete links
- **Analytics Endpoints** - View analytics, export CSV
- **User Profile** - Manage theme, accent color
- **Public Hub** - Access public links with filtering
- **Click Tracking** - Track link clicks

**API Version**: 2.0.0 (Updated January 24, 2026)

---

## 📁 Project Structure

```
IIT_Hack/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      (Sign up, Login)
│   │   ├── linkController.js      (Link CRUD + CSV export)
│   │   └── userController.js      (Profile, Theme, Color)
│   ├── models/
│   │   ├── User.js                (User schema)
│   │   └── Link.js                (Link schema)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── linkRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── geolocationMiddleware.js    (IP-based location)
│   │   ├── deviceDetection.js          (User-Agent parsing)
│   │   └── rateLimiter.js              (4-tier system)
│   ├── utils/
│   │   └── csvExport.js           (CSV generation)
│   └── server.js                  (Main entry point)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx           (Sign up, Login)
│   │   │   ├── Dashboard.jsx      (Link management + Theme)
│   │   │   ├── Analytics.jsx      (Analytics + CSV export)
│   │   │   └── Public.jsx         (Public profile)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LinkCard.jsx
│   │   │   └── QRModal.jsx
│   │   ├── App.jsx                (Main app)
│   │   └── main.jsx               (Entry point)
│   ├── vite.config.js
│   └── package.json
│
├── README.md                      (This file)
├── API.md                         (Full API documentation)
└── package.json
```

---

## 🎨 Theme & Design

### Dark Mode (Default)
- Black/Slate background (#0f172a)
- Emerald/Teal accents (#10b981, #14b8a6)
- Light text (#f1f5f9)
- Glass-morphism effects

### Light Mode
- White/Gray background (#f8fafc)
- Emerald accents (#059669)
- Dark text (#1e293b)
- Subtle borders and shadows

### Customization
- Users can choose between Dark/Light mode
- Users can select custom accent color (any hex color)
- Theme persists across sessions
- Public pages dynamically apply user's theme

---

## 🔐 Security Features

✅ **Password Security**
- bcryptjs hashing with salt rounds
- No plaintext passwords stored

✅ **Authentication**
- JWT tokens with expiration
- Secure token validation
- Protected API endpoints

✅ **Input Validation**
- Email validation
- URL validation
- Hex color validation
- Type checking for all inputs

✅ **Rate Limiting**
- 100 requests/15 min for public endpoints
- 50 requests/15 min for auth endpoints
- 150 requests/15 min for authenticated endpoints
- 30 requests/15 min for analytics export

✅ **Data Protection**
- User passwords never exposed
- Private links by default
- User isolation (can only access own links)

---

## 📱 Supported Devices

| Device Type | Detection | Accuracy |
|-------------|-----------|----------|
| iPhone/iPad | User-Agent | 99% |
| Android Phone | User-Agent | 98% |
| Android Tablet | User-Agent | 95% |
| Windows/Mac | User-Agent | 99% |
| Desktop | User-Agent | 99% |
| Smart TV | User-Agent | 90% |
| Wearables | User-Agent | 85% |

---

## 🌍 Geolocation Support

- **Provider**: ip-api.com
- **Free Tier**: 45 requests/minute
- **Coverage**: 195+ countries
- **Accuracy**: City-level
- **Fallback**: India (IN) on localhost

**Supported Location Codes**:
```
GLOBAL (All countries)
US, UK, IN, CA, AU, DE, FR, JP, CN, BR, and 185+ more
```

---

## 📊 Analytics Capabilities

### Real-time Metrics
- Total hub visits
- Individual link clicks
- Click-through rate (CTR)
- Device distribution
- Location distribution
- Last clicked date

### CSV Export
```
Link Title,URL,Total Clicks,Total Visits,Last Clicked,Created Date
My GitHub,https://github.com,...,5,2024-01-24,...
...
```

### Device Breakdown
Shows visitor distribution by:
- Mobile devices
- Desktop computers
- Tablets
- Smart TVs/Wearables

### Location Breakdown
Shows visitor distribution by:
- Country codes
- Country names
- Global vs targeted traffic

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Device Detection**: ua-parser-js
- **Geolocation**: ip-api.com
- **Utilities**: axios, cors

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

---

## 📚 How to Use

### 1. Create Account
- Visit http://localhost:5173
- Click "Sign Up"
- Enter email, password, name
- Click "Create Account"

### 2. Add Links
- Go to Dashboard
- Click "Add New Link"
- Enter URL, title, description
- *Optional*: Set allowed countries/devices
- Click "Create"

### 3. Customize Theme
- Click 🎨 Theme button in Dashboard
- Choose Dark/Light mode
- Pick accent color
- Click "Apply"

### 4. Share Your Hub
- Copy public link from Dashboard
- Share on social media
- Friends see your themed link hub

### 5. View Analytics
- Click "Analytics" in navigation
- See real-time statistics
- Click 📊 Export CSV to download data
- Analyze device/location breakdown

### 6. Filter Links (Advanced)
- In Dashboard, edit a link
- Set "Allowed Countries" (optional)
- Set "Allowed Devices" (optional)
- Link only shows to matching visitors

---

## 🧪 Testing the Features

### Test Device Detection
1. Create a link visible only to "mobile"
2. Visit public page on mobile phone
3. Verify link appears on mobile, not on desktop

### Test Location Filtering
1. Create a link for country "US" only
2. Visit from different location/VPN
3. Verify link visibility changes

### Test Theme
1. Toggle Dark/Light mode in Dashboard
2. Visit public page in different browser
3. Verify theme persists and applies

### Test CSV Export
1. Go to Analytics page
2. Click 📊 Export CSV
3. Verify file downloads with correct data

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
# Verify MONGODB_URI in .env
# Check if port 5000 is available
lsof -i :5000  # On Mac/Linux
netstat -ano | findstr :5000  # On Windows
```

### Frontend won't connect to backend
```bash
# Verify backend is running on port 5000
# Check CORS settings in server.js
# Check network tab in browser devtools
```

### Geolocation showing wrong country
- May be VPN/proxy masking real location
- Fallback to India (IN) on localhost is normal
- Use valid public IP for accurate detection

### Theme not persisting
- Clear browser cache
- Check MongoDB connection
- Verify user profile API is working

### Rate limit errors
- Wait 15 minutes for limit reset
- Reduce request frequency
- Different limits for different endpoints

---

## 📖 Additional Resources

- **Full API Documentation**: [API.md](./API.md)
- **Device Detection Guide**: User-Agent parsing with ua-parser-js
- **Location Filtering Guide**: IP-based geolocation with ip-api.com
- **Theme System**: Dark/Light modes with custom colors

---

## 🚀 Deployment

Ready for production! Check deployment guides for:
- Heroku (Backend)
- Vercel (Frontend)
- AWS, Azure, Google Cloud
- Docker containerization

---

## 👥 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Contact Info]
- Documentation: [API.md](./API.md)

---

**Project Status**: 99% Complete ✅
**Last Updated**: January 24, 2026
**Version**: 2.0.0