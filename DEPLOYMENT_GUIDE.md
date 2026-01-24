# Deployment Guide - JPD HUB

## Prerequisites
- GitHub account (to push your code)
- Render account (for backend)
- Vercel account (for frontend)

---

## Step 1: Push to GitHub

First, push your project to GitHub:

```bash
cd c:\Users\Karthik\OneDrive\Desktop\IIT_Hack

git add .
git commit -m "Ready for deployment"
git push origin main
```

**Note:** If you haven't initialized git yet:
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/JPD_HUB_HACKATHON.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 2.2 Connect GitHub Repository
1. Select "Build and deploy from a Git repository"
2. Connect your GitHub account
3. Find and select `JPD_HUB_HACKATHON` repository
4. Click "Connect"

### 2.3 Configure Render Service
Fill in the details:
- **Name:** `jpd-hub-backend` (or any name)
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Runtime:** `node-18` or later

### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables:
```
MONGO_URI = mongodb+srv://karthis3477_db_user:CJ8hZWS3cQDQGNYS@clusterone.ezqrwfg.mongodb.net/linkhub
JWT_SECRET = 9f8a7d6s5a4f3g2h1j0k
NODE_ENV = production
```

### 2.5 Deploy
Click "Create Web Service"

⏳ Wait 5-10 minutes for deployment. You'll get a URL like:
```
https://jpd-hub-backend.onrender.com
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select `JPD_HUB_HACKATHON`
4. Click "Import"

### 3.3 Configure Project
- **Framework:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.4 Add Environment Variables
Click "Environment Variables"

Add this variable:
```
VITE_API_URL = https://jpd-hub-backend.onrender.com
```
(Replace with YOUR Render backend URL from Step 2.5)

### 3.5 Deploy
Click "Deploy"

⏳ Wait 2-5 minutes. You'll get a URL like:
```
https://jpd-hub-hackathon.vercel.app
```

---

## Step 4: Update Backend CORS

Now that frontend URL is known, update backend CORS for production:

**File:** `backend/server.js`

Find this line:
```javascript
app.use(cors());
```

Replace with:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://jpd-hub-hackathon.vercel.app" // Add your Vercel URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
```

Then push to GitHub:
```bash
git add backend/server.js
git commit -m "Configure CORS for production"
git push
```

Render will auto-redeploy.

---

## Step 5: Test the Live Deployment

1. Open: `https://jpd-hub-hackathon.vercel.app`
2. Try signing up with a test account
3. Try logging in
4. Check Dashboard and Analytics

---

## Troubleshooting

### Frontend still calling localhost:5000?
- Check Vercel environment variable: `VITE_API_URL = https://jpd-hub-backend.onrender.com`
- Redeploy: Vercel → Deployments → Click latest → "Redeploy"

### Backend returning CORS error?
- Check Render environment variables are set correctly
- Verify frontend URL in CORS allowedOrigins
- Render → Service → Redeploy

### MongoDB connection fails?
- Check `MONGO_URI` in Render environment variables
- Verify MongoDB Atlas allows connections from Render IPs
- Go to MongoDB Atlas → Network Access → Check if 0.0.0.0/0 is allowed

---

## Local Development (Still Works!)

You can continue developing locally:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access at `http://localhost:5175`

---

## Summary

✅ Backend deployed to Render  
✅ Frontend deployed to Vercel  
✅ CORS configured for production  
✅ Environment variables set  
✅ Live at https://jpd-hub-hackathon.vercel.app  

Good luck! 🚀
