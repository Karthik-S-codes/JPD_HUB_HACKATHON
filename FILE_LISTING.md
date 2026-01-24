# 📚 JPD HUB - Complete File Listing & Overview

## 📂 Project Directory Structure

```
IIT_Hack/ (Project Root)
│
├── 📖 DOCUMENTATION FILES (15)
│   ├── START_HERE.md                  ← READ THIS FIRST! 🎯
│   ├── README.md                      Project overview & features
│   ├── QUICK_START.md                 Setup guide
│   ├── INDEX.md                       Documentation index
│   ├── API.md                         Complete API reference
│   ├── API_UPDATE_SUMMARY.md          API updates & changes
│   ├── TESTING.md                     Testing & QA guide
│   ├── TESTING_GUIDE.md               Comprehensive testing guide
│   ├── FEATURES_CHECKLIST.md          Feature matrix
│   ├── ARCHITECTURE.md                System design & diagrams
│   ├── DEPLOYMENT.md                  Production deployment guide
│   ├── TROUBLESHOOTING.md             FAQ & solutions
│   ├── BONUS_FEATURES_GUIDE.md        Bonus features documentation
│   ├── BONUS_FEATURES_README.md       Bonus features overview
│   ├── DEVICE_FEATURE_GUIDE.md        Device detection guide
│   ├── LOCATION_FEATURE_GUIDE.md      Geolocation feature guide
│   ├── FRONTEND_UPDATES.md            Frontend changes log
│   └── FILE_LISTING.md                This file
│
├── 🔧 BACKEND (Node.js + Express)
│   │
│   ├── models/
│   │   ├── User.js                    User schema (JWT auth)
│   │   ├── Link.js                    Link schema with QR codes
│   │   └── Analytics.js               Click tracking & analytics
│   │
│   ├── controllers/
│   │   ├── authController.js          Signup/Login logic
│   │   ├── linkController.js          Link CRUD + Analytics + QR
│   │   └── userController.js          User management
│   │
│   ├── routes/
│   │   ├── authRoutes.js              /signup, /login endpoints
│   │   ├── linkRoutes.js              Link management endpoints
│   │   └── userRoutes.js              User profile endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js          JWT verification
│   │   ├── rateLimiter.js             4-tier rate limiting
│   │   ├── geoLocation.js             IP-based geolocation
│   │   └── deviceDetection.js         User-Agent parsing
│   │
│   ├── config/
│   │   └── db.js                      MongoDB connection
│   │
│   ├── utils/
│   │   └── csvExport.js               CSV export utility
│   │
│   ├── app.js                         Express app setup
│   ├── server.js                      Entry point (PORT: 5000)
│   ├── .env                           Environment variables
│   ├── package.json                   Dependencies
│   └── node_modules/                  Installed packages
│
├── 🎨 FRONTEND (React + Vite)
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx              Login page (Enter key support)
│   │   │   ├── Signup.jsx             Signup page (Enter key support)
│   │   │   ├── Dashboard.jsx          Link management dashboard
│   │   │   ├── Analytics.jsx          Analytics & metrics
│   │   │   └── Public.jsx             Public profile page
│   │   │
│   │   ├── components/
│   │   │   └── Navbar.js              Navigation component
│   │   │
│   │   ├── services/
│   │   │   └── api.js                 Axios HTTP client
│   │   │
│   │   ├── App.jsx                    Main app component
│   │   ├── main.jsx                   React entry point
│   │   ├── index.css                  Tailwind base styles
│   │   ├── App.css                    Custom styles
│   │   └── assets/                    Static assets
│   │
│   ├── public/                        Public static files
│   ├── .env.production                Production environment vars
│   ├── vite.config.js                 Vite build config
│   ├── tailwind.config.js             Tailwind CSS config
│   ├── postcss.config.js              PostCSS config
│   ├── eslint.config.js               ESLint rules
│   ├── vercel.json                    Vercel deployment config
│   ├── package.json                   Dependencies
│   ├── README.md                      Frontend docs
│   ├── index.html                     HTML entry point
│   ├── .gitignore                     Git ignore rules
│   └── node_modules/                  Installed packages
│
└── .git/                              Git repository
```

---

## 📊 File Statistics

### Documentation Files (18)
```
START_HERE.md
README.md
QUICK_START.md
INDEX.md
API.md
API_UPDATE_SUMMARY.md
TESTING.md
TESTING_GUIDE.md
FEATURES_CHECKLIST.md
ARCHITECTURE.md
DEPLOYMENT.md
TROUBLESHOOTING.md
BONUS_FEATURES_GUIDE.md
BONUS_FEATURES_README.md
DEVICE_FEATURE_GUIDE.md
LOCATION_FEATURE_GUIDE.md
FRONTEND_UPDATES.md
FILE_LISTING.md
```

### Backend Files
```
models/
  User.js                      JWT authentication
  Link.js                      QR code generation
  Analytics.js                 Click tracking

controllers/
  authController.js            Login/Signup
  linkController.js            CRUD operations
  userController.js            User management

routes/
  authRoutes.js                Auth endpoints
  linkRoutes.js                Link endpoints
  userRoutes.js                User endpoints

middleware/
  authMiddleware.js            JWT verification
  rateLimiter.js               4-tier rate limiting
  geoLocation.js               IP geolocation
  deviceDetection.js           User-Agent parsing

config/
  db.js                        MongoDB connection

utils/
  csvExport.js                 CSV export utility

app.js                         Express app setup
server.js                      Entry point (PORT: 5000)
.env                           Environment variables
package.json                   Node dependencies
```

### Frontend Files
```
pages/
  Login.jsx                    Login page (Enter key support)
  Signup.jsx                   Signup page (Enter key support)
  Dashboard.jsx                Link management
  Analytics.jsx                Analytics dashboard
  Public.jsx                   Public profile

components/
  Navbar.js                    Navigation

services/
  api.js                       Axios HTTP client

App.jsx                        Main app
main.jsx                       React entry
index.css                      Tailwind base
App.css                        Custom styles

.env.production                Production env vars
vite.config.js                 Vite config
tailwind.config.js             Tailwind config
postcss.config.js              PostCSS config
eslint.config.js               ESLint rules
vercel.json                    Vercel deployment
package.json                   Dependencies
README.md                      Frontend docs
index.html                     HTML entry
.gitignore                     Git ignore
```

---

## 🗂️ File Organization Guide

### By Purpose

#### 🔐 Authentication
```
Backend:
  controllers/authController.js   ← Login/Signup logic
  routes/authRoutes.js            ← /signup, /login endpoints
  models/User.js                  ← User schema
  middleware/authMiddleware.js    ← JWT verification

Frontend:
  pages/Login.jsx                 ← Login form (Enter key support)
  pages/Signup.jsx                ← Registration form (Enter key support)
  services/api.js                 ← HTTP client
```

#### 🔗 Link Management
```
Backend:
  models/Link.js                  ← Link schema with QR codes
  controllers/linkController.js   ← CRUD + QR generation
  routes/linkRoutes.js            ← Link endpoints

Frontend:
  pages/Dashboard.jsx             ← Link CRUD interface
  services/api.js                 ← HTTP client
```

#### 📊 Analytics & Tracking
```
Backend:
  models/Analytics.js             ← Click tracking schema
  controllers/linkController.js   ← Analytics logic
  middleware/geoLocation.js       ← IP-based location
  middleware/deviceDetection.js   ← User-Agent parsing
  middleware/rateLimiter.js       ← 4-tier rate limiting
  utils/csvExport.js              ← CSV export utility

Frontend:
  pages/Analytics.jsx             ← Analytics dashboard
  services/api.js                 ← API calls
```

#### 👤 User Management
```
Backend:
  controllers/userController.js   ← User profile logic
  routes/userRoutes.js            ← User endpoints
  models/User.js                  ← User schema

Frontend:
  pages/Dashboard.jsx             ← User settings
  components/Navbar.js            ← User navigation
```

#### 🌐 Public Access
```
Backend:
  routes/linkRoutes.js            ← Public endpoints

Frontend:
  pages/Public.jsx                ← Public profile/hub page
```

---

## 📖 Documentation Quick Reference

### For Different Use Cases

**Beginner (New to Project)**
1. Read [START_HERE.md](START_HERE.md)
2. Skim [README.md](README.md)
3. Follow [QUICK_START.md](QUICK_START.md)

**Developer (Building Features)**
1. Check [ARCHITECTURE.md](ARCHITECTURE.md)
2. Read [API.md](API.md) & [API_UPDATE_SUMMARY.md](API_UPDATE_SUMMARY.md)
3. Review [FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md)
4. Explore [BONUS_FEATURES_GUIDE.md](BONUS_FEATURES_GUIDE.md)

**Tester (QA & Validation)**
1. Follow [TESTING.md](TESTING.md) & [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Use [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Reference [QUICK_START.md](QUICK_START.md)

**DevOps (Deployment)**
1. Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. Check environment configuration
3. Review security in [ARCHITECTURE.md](ARCHITECTURE.md)

**Feature Explorer**
1. Read [BONUS_FEATURES_README.md](BONUS_FEATURES_README.md)
2. Check [DEVICE_FEATURE_GUIDE.md](DEVICE_FEATURE_GUIDE.md)
3. Review [LOCATION_FEATURE_GUIDE.md](LOCATION_FEATURE_GUIDE.md)

---

## 🔄 File Dependencies

### Backend Dependencies
```
server.js (Entry Point: PORT 5000)
  └── app.js (Express Setup)
      ├── config/db.js (MongoDB Connection)
      ├── middleware/
      │   ├── authMiddleware.js (JWT verification)
      │   ├── rateLimiter.js (4-tier rate limiting)
      │   ├── geoLocation.js (IP geolocation)
      │   └── deviceDetection.js (User-Agent parsing)
      │
      ├── routes/authRoutes.js
      │   └── controllers/authController.js
      │       └── models/User.js
      │
      ├── routes/linkRoutes.js
      │   ├── middleware/authMiddleware.js
      │   └── controllers/linkController.js
      │       ├── models/Link.js (QR generation)
      │       ├── models/Analytics.js (Click tracking)
      │       └── utils/csvExport.js
      │
      └── routes/userRoutes.js
          ├── middleware/authMiddleware.js
          └── controllers/userController.js
              └── models/User.js
```

### Frontend Dependencies
```
main.jsx (React Entry)
  └── App.jsx (Router)
      ├── components/Navbar.js
      └── pages/
          ├── Login.jsx (Enter key support)
          │   └── services/api.js
          ├── Signup.jsx (Enter key support)
          │   └── services/api.js
          ├── Dashboard.jsx (Link CRUD + QR modals)
          │   └── services/api.js
          ├── Analytics.jsx (Metrics & CSV export)
          │   └── services/api.js
          └── Public.jsx (Public profile)
              └── services/api.js
```
          ├── ProtectedRoute.jsx
          └── services/api.js
              └── axios (npm package)
```

---

---

## 📦 Dependencies Status

### Backend Dependencies
```
✅ bcryptjs               Password hashing
✅ cors                   Cross-origin requests  
✅ dotenv                 Environment variables
✅ express                Web framework
✅ jsonwebtoken           JWT authentication
✅ mongoose               MongoDB ODM
✅ nodemon                Development auto-reload
✅ qrcode                 QR code generation
✅ ua-parser-js           User-Agent parsing
✅ axios                  HTTP client
```

### Frontend Dependencies
```
✅ react 19.2.0           UI library
✅ react-dom 19.2.0       DOM rendering
✅ react-router-dom       Routing
✅ axios                  HTTP client
✅ vite 7.3.1             Build tool
✅ tailwindcss 3.4.19     CSS framework
✅ eslint                 Code linting
✅ autoprefixer           PostCSS plugin
✅ postcss                CSS processing
```

---

## 🎯 Key Features by File

### Authentication System
```
Backend:
  authController.js       Signup/Login with bcrypt & JWT
  authMiddleware.js       JWT verification
  User.js model           User schema with password hashing

Frontend:
  Login.jsx               Login form (Enter key support)
  Signup.jsx              Registration form (Enter key support)
```

### Link Management System
```
Backend:
  linkController.js       CRUD operations + QR generation
  Link.js model           URL shortening + QR codes
  rateLimiter.js          4-tier rate limiting

Frontend:
  Dashboard.jsx           Link CRUD interface + QR modals
```

### Analytics & Tracking
```
Backend:
  Analytics.js model      Click tracking schema
  geoLocation.js          IP-based geolocation (ip-api.com)
  deviceDetection.js      User-Agent parsing
  csvExport.js            CSV export utility

Frontend:
  Analytics.jsx           Metrics dashboard + CSV export
```

### Public Sharing
```
Backend:
  linkController.js       getPublicLinks function
  
Frontend:
  Public.jsx              Public profile page
```

### UI/UX Features
```
Frontend:
  All pages               Mobile-responsive (sm:, md: breakpoints)
  Login/Signup            Enter key submission
  Dashboard               Responsive button/link layouts
  Color scheme            Pure black background + emerald accents
```

---

## 🏗️ Architecture Overview

### Backend Architecture
```
Express Server (PORT 5000)
  ├── CORS enabled (all origins)
  ├── JSON body parser
  ├── MongoDB Atlas connection
  ├── Rate limiting (4 tiers)
  ├── Geolocation middleware
  ├── Device detection middleware
  └── Routes:
      ├── /api/auth/* (signup, login)
      ├── /api/links/* (CRUD, analytics, public)
      └── /api/user/* (profile management)
```

### Frontend Architecture  
```
React 19 + Vite
  ├── Tailwind CSS (black theme + emerald accents)
  ├── React Router (client-side routing)
  ├── Axios API client (environment-based URLs)
  └── Pages:
      ├── /login (authentication)
      ├── /signup (registration)
      ├── /dashboard (link management)
      ├── /analytics (metrics)
      └── /public/:userId (public profile)
```

### Database Schema
```
MongoDB Atlas
  ├── users collection (User model)
  ├── links collection (Link model + QR codes)
  └── analytics collection (Analytics model)
```

---

## 🚀 Deployment Configuration

### Backend (Render)
```
Deployed URL: https://smart-link-hub-iy53.onrender.com
Environment:
  - NODE_ENV=production
  - PORT=auto-assigned
  - MONGO_URI=mongodb+srv://...
  - JWT_SECRET=9f8a7d6s5a4f3g2h1j0k
```

### Frontend (Vercel)
```
Deployed URL: https://smart-links-hubs.vercel.app
Environment:
  - VITE_API_URL=https://smart-link-hub-iy53.onrender.com
  - VITE_PUBLIC_BASE_URL=https://smart-links-hubs.vercel.app
```

---

## 📋 File Checklist

### Backend Complete ✅
- [x] server.js (Entry point)
- [x] app.js (Express setup)
- [x] .env (Environment variables)
- [x] User.js model
- [x] Link.js model  
- [x] Analytics.js model
- [x] authController.js
- [x] linkController.js
- [x] userController.js
- [x] authRoutes.js
- [x] linkRoutes.js
- [x] userRoutes.js
- [x] authMiddleware.js
- [x] rateLimiter.js
- [x] geoLocation.js
- [x] deviceDetection.js
- [x] db.js config
- [x] csvExport.js utility
- [x] package.json
- [x] node_modules installed

### Frontend Complete ✅
- [x] App.jsx
- [x] main.jsx
- [x] Login.jsx (Enter key support)
- [x] Signup.jsx (Enter key support)
- [x] Dashboard.jsx (Mobile responsive)
- [x] Analytics.jsx (CSV export)
- [x] Public.jsx (Public profile)
- [x] Navbar.js component
- [x] api.js service
- [x] index.css (Tailwind base)
- [x] App.css (Custom styles)
- [x] tailwind.config.js
- [x] postcss.config.js
- [x] vite.config.js
- [x] eslint.config.js
- [x] .env.production
- [x] vercel.json
- [x] package.json
- [x] node_modules installed

### Documentation Complete ✅
- [x] START_HERE.md
- [x] README.md
- [x] QUICK_START.md
- [x] INDEX.md
- [x] API.md
- [x] API_UPDATE_SUMMARY.md
- [x] TESTING.md
- [x] TESTING_GUIDE.md
- [x] FEATURES_CHECKLIST.md
- [x] ARCHITECTURE.md
- [x] DEPLOYMENT.md
- [x] TROUBLESHOOTING.md
- [x] BONUS_FEATURES_GUIDE.md
- [x] BONUS_FEATURES_README.md
- [x] DEVICE_FEATURE_GUIDE.md
- [x] LOCATION_FEATURE_GUIDE.md
- [x] FRONTEND_UPDATES.md
- [x] FILE_LISTING.md

---

## 🚀 Getting Started with Files

### Step 1: Open Project
```bash
cd c:\Users\Karthik\OneDrive\Desktop\IIT_Hack
```

### Step 2: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 3: Configure Environment
```bash
# Backend: Create .env file
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend: Create .env.production file
VITE_API_URL=https://smart-link-hub-iy53.onrender.com
VITE_PUBLIC_BASE_URL=https://smart-links-hubs.vercel.app
```

### Step 4: Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Access Application
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 📝 Recent Updates

### Latest Changes (January 2026)
```
✅ Added Enter key submission to Login.jsx
✅ Added Enter key submission to Signup.jsx
✅ Updated FILE_LISTING.md with current structure
✅ Fixed mobile responsiveness across all pages
✅ Changed color scheme to pure black + emerald
✅ Added CSV export to Analytics.jsx
✅ Deployed to Vercel + Render
```

---

## 🎓 File Learning Path

### For New Developers

**Week 1: Understanding Structure**
1. Read FILE_LISTING.md (this file)
2. Explore backend/models/ (understand schemas)
3. Review frontend/src/pages/ (understand UI)

**Week 2: Backend Deep Dive**
1. Study controllers/ (business logic)
2. Examine routes/ (API endpoints)
3. Understand middleware/ (auth, rate limiting, etc.)

**Week 3: Frontend Deep Dive**
1. Analyze pages/ (React components)
2. Review services/api.js (API calls)
3. Study Tailwind CSS classes

**Week 4: Full Stack Integration**
1. Trace authentication flow
2. Follow link creation process
3. Understand analytics tracking

---

## 📞 Support & Resources

### Quick Links
- Documentation: START_HERE.md
- API Reference: API.md
- Troubleshooting: TROUBLESHOOTING.md
- Deployment: DEPLOYMENT.md

### External Resources
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Dashboard: https://vercel.com
- Render Dashboard: https://render.com

---

---

**Last Updated:** January 25, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready  
**Total Files:** 60+  
**Deployed:** Vercel (Frontend) + Render (Backend)
