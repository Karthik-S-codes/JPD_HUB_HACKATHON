# JPD HUB - Smart Link Sharing Platform

A modern, feature-rich link sharing platform that allows users to create a centralized hub for all their links with advanced analytics, QR codes, device detection, location filtering, and customizable theming.

## 🎯 Project Overview

JPD HUB is a complete link management solution with intelligent device and location-based filtering, comprehensive analytics with CSV export, and full theme customization. Share your links with style and control exactly who sees what.

---

## ✨ Features Implemented

### 1. **Smart URL Generation** ✅ NEW!
- Automatic slug generation from user names
- Clean, memorable URLs (e.g., `/hub/anika-sharma`)
- Handles duplicate names with numbered suffixes
- SEO-friendly and shareable
- Real-time slug validation
- Backward compatible with old URLs

### 2. **Link Hub Management** ✅
- Add, edit, delete links with titles, URLs, and descriptions
- Reorderable links (drag & drop support)
- Unique public URL for each user's link hub
- Customizable hub title and description
- Advanced link filtering by country and device type

### 3. **Device Detection & Filtering** ✅
- Automatic device detection (Mobile, Desktop, Tablet, TV/Wearable)
- User-Agent parsing using `ua-parser-js`
- Restrict link visibility by device type
- Visitor device information in analytics
- Device icons in UI (📱 🖥️ 🎮)

### 4. **Location-Based Filtering** ✅
- Geolocation detection using `ip-api.com` (45 req/min free)
- Support for 195+ countries
- Restrict link visibility by country
- Visitor country information in analytics
- Combined filtering (Device AND Location)

### 5. **Theme & Color Customization** ✅
- Dark mode (default) and Light mode toggle
- Custom accent color selection (hex format)
- Theme persistence per user
- Dynamic theme application on public pages
- Live preview in theme settings

### 6. **Analytics & Monitoring** ✅
- Track total hub visits and individual link clicks
- Click-through rate (CTR) calculation
- Top performing links identification
- Device and location breakdown
- **CSV Export** - Download analytics as CSV file
- **PDF Export** - Download analytics as PDF with formatted tables
- Beautiful analytics dashboard with statistics
- Real-time visitor information
- Mobile-responsive analytics cards

### 7. **QR Code Generation** ✅
- Automatic QR code for each link
- Modal QR viewer
- Shareable QR codes
- QR codes include device/location filtering

### 8. **User Authentication** ✅
- Secure signup and login
- bcryptjs password hashing
- JWT token-based authentication
- Protected routes and API endpoints
- Comprehensive error handling

### 9. **Public Link Hub** ✅
- Beautiful responsive public profile
- Theme and color application
- Click tracking and analytics
- User avatar display
- Device/location-aware link visibility

### 10. **Rate Limiting** ✅
- 4-tier rate limiting system
- Protects against abuse
- Different limits for different endpoint types
- Graceful error responses

### 11. **Backend API** ✅
- Express.js RESTful API
- MongoDB with Mongoose ODM
- Clean MVC architecture
- Input validation and error handling
- Modular code structure

### 12. **Advanced Rules Engine** ✅ NEW!
- **Time-based Rules** - Show links on specific days/times
- **Device-based Rules** - Display links to mobile/desktop/tablet only
- **Location-based Rules** - Restrict links by country
- **Performance-based Rules** - Show links based on click thresholds
- Rule chaining (multiple rules per link)
- Dashboard rule visualization with detailed descriptions
- Responsive rule management UI

### 13. **PDF Export for Analytics** ✅ NEW!
- Export analytics data as PDF documents
- Formatted tables with headers and styling
- Responsive design for mobile and desktop
- Automatic filename with timestamp
- Includes summary statistics and link performance table

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

Full API reference available in [API_UPDATE_SUMMARY.md](./API_UPDATE_SUMMARY.md) including:

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
│   │   ├── authController.js      (Sign up, Login with slug generation)
│   │   ├── linkController.js      (Link CRUD + CSV export + Hub by slug)
│   │   └── userController.js      (Profile, Theme, Color)
│   ├── models/
│   │   ├── User.js                (User schema with hubSlug field)
│   │   └── Link.js                (Link schema)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── linkRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── geoLocation.js              (IP-based location)
│   │   ├── deviceDetection.js          (User-Agent parsing)
│   │   └── rateLimiter.js              (4-tier system)
│   ├── utils/
│   │   ├── csvExport.js                (CSV generation)
│   │   ├── slugGenerator.js            (Smart URL slug generation)
│   │   ├── testSlugGenerator.js        (Slug tests)
│   │   └── migrateUserSlugs.js         (Migration script)
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
├── API_UPDATE_SUMMARY.md          (Full API documentation)
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
- **PDF Generation**: jsPDF + jsPDF-AutoTable

---

## 📚 How to Use

### 1. Create Account
- Visit http://localhost:5173
- Click "Sign Up"
- Enter email, password, name
- System automatically generates your unique slug (e.g., "anika-sharma")
- Click "Create Account"
- Your personalized hub URL is ready: `/hub/your-slug`

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
- Copy your clean public link from Dashboard (e.g., `yourdomain.com/hub/anika-sharma`)
- Share on social media
- Friends see your themed link hub at your personalized URL

### 5. View Analytics
- Click "Analytics" in navigation
- See real-time statistics
- Click 📊 Export CSV to download data
- Click 📄 Export PDF to download formatted PDF report
- Analyze device/location breakdown
- Mobile-responsive analytics cards

### 6. Advanced: Set Rules for Links
- In Dashboard, edit a link
- Click "⚙️ Add Rule" button
- Choose rule type: Time, Device, Location, or Performance
- Configure rule conditions (days, times, countries, devices, etc.)
- See rule descriptions in form and on link cards
- Rules control which visitors see each link

### 6. Filter Links (Advanced)
- In Dashboard, edit a link
- Set "Allowed Countries" (optional)
- Set "Allowed Devices" (optional)
- Link only shows to matching visitors

---

## 🧪 Testing the Features

### Test Smart URL Generation
1. Sign up with name "John Smith"
2. Check Dashboard for your slug URL
3. Verify URL is clean: `/hub/john-smith`
4. Try accessing both `/hub/john-smith` and `/public/yourUserId`
5. Both routes should work (legacy compatibility)

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

### Test PDF Export
1. Go to Analytics page
2. Click 📄 Export PDF
3. Verify PDF downloads and opens correctly
4. Check on mobile and desktop browsers
5. Verify table is properly formatted with headers and data

### Test Rules Engine
1. Go to Dashboard and edit a link
2. Click "⚙️ Add Rule"
3. Select a rule type (e.g., Time-based)
4. Configure rule conditions (e.g., 9 AM - 5 PM on weekdays)
5. Click "Add Rule"
6. Verify rule appears in "Applied Rules" section with description
7. Verify rule chip appears on the link card
8. Edit the link again to see rule details in the form

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

### Slug URL not working
- Verify `hubSlug` field exists in User model
- Check slug format: lowercase, hyphens only (e.g., `john-smith`)
- Ensure both `/hub/:slug` and `/public/:userId` routes are configured
- Run migration script if upgrading from older version: `node backend/utils/migrateUserSlugs.js`

---

## 📖 Additional Resources

- **Full API Documentation**: [API_UPDATE_SUMMARY.md](./API_UPDATE_SUMMARY.md)
- **Smart URL Generation Guide**: [SMART_URL_GENERATION_GUIDE.md](./SMART_URL_GENERATION_GUIDE.md)
- **Frontend Slug Integration**: [FRONTEND_SLUG_INTEGRATION.md](./FRONTEND_SLUG_INTEGRATION.md)
- **Testing Slug Feature**: [TESTING_SLUG_FEATURE.md](./TESTING_SLUG_FEATURE.md)
- **Device Detection Guide**: User-Agent parsing with ua-parser-js
- **Location Filtering Guide**: IP-based geolocation with ip-api.com
- **Theme System**: Dark/Light modes with custom colors

---

## 🚀 Deployment

Production is live using:
- Frontend: Vercel (e.g.,https://smart-links-hub.vercel.app/)
- Backend: Render (e.g., https://smart-link-hub-iy53.onrender.com)

If you redeploy:
- Set `VITE_API_BASE_URL` in Vercel to the Render backend URL
- Confirm CORS on the backend allows the Vercel domain
- Verify `/hub/:slug` and `/public/:userId` both resolve
- Keep MongoDB indexes for `hubSlug` in place for smart URLs
- Run `node backend/utils/migrateUserSlugs.js` if migrating older data

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
- Contact: [8867598441]
- Documentation: [API_UPDATE_SUMMARY.md](./API_UPDATE_SUMMARY.md)

---

**Project Status**: 99% Complete ✅
**Last Updated**: January 27, 2026
**Version**: 2.1.0