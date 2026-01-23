# JPD HUB - Deployment Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Vercel or Netlify account (for frontend)
- Heroku or Railway account (for backend)

---

## 🏃 Quick Start (Local Development)

### 1. Clone and Install

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 2. Access Application
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

---

## 🚀 Production Deployment

### Option 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Connect Your Repository**
   - Click "Deploy from GitHub"
   - Select your repository
   - Select `backend` as root directory

3. **Set Environment Variables**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy on each push
   - Your backend URL will be provided

### Option 2: Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set PORT="5000"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku logs --tail
   ```

---

## 🎨 Production Deployment: Frontend

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Update API Endpoint**
   - Edit `frontend/src/services/api.js`
   - Change `baseURL` to your production backend URL:
   ```javascript
   const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://your-backend.railway.app';
   ```

4. **Set Environment Variables in Vercel**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy to Netlify

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy with Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment
   - Add `VITE_API_BASE_URL=https://your-backend-url.com`

---

## 🗄️ MongoDB Setup (Atlas)

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account

2. **Create Cluster**
   - Click "Create Deployment"
   - Choose "Free" tier
   - Select region close to you
   - Create cluster

3. **Create Database User**
   - Go to "Database Access"
   - Create user with password
   - Note: username and password

4. **Get Connection String**
   - Go to "Databases" → Click "Connect"
   - Choose "Drivers" option
   - Copy connection string
   - Replace `<username>`, `<password>`, and database name
   ```
   mongodb+srv://username:password@cluster.mongodb.net/databasename
   ```

5. **Add IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" for development
   - (For production: add specific IPs)

---

## 📋 Environment Variables Checklist

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_very_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=production
```

### Frontend (.env or .env.production)
```
VITE_API_BASE_URL=https://your-backend-url.com
```

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created with all variables
- [ ] Database connection tested
- [ ] All API endpoints tested locally
- [ ] No console errors or warnings
- [ ] QRCode package installed
- [ ] Error handling in place

### Frontend
- [ ] All dependencies installed (`npm install`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] API endpoints updated to production backend
- [ ] All pages tested locally
- [ ] Login/Signup works
- [ ] Links can be created and deleted
- [ ] Analytics loads data
- [ ] Public hub is accessible

---

## 🔒 Security Checklist

### Backend
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MONGO_URI is secure (no password in code)
- [ ] CORS configured for production frontend only
- [ ] Input validation on all endpoints
- [ ] Password hashing with bcryptjs
- [ ] No sensitive data in logs
- [ ] Rate limiting implemented
- [ ] HTTPS enabled on production

### Frontend
- [ ] No API keys exposed in code
- [ ] Authentication token in httpOnly cookie (or secure storage)
- [ ] XSS protection enabled
- [ ] CSRF tokens if needed
- [ ] No hardcoded URLs in code
- [ ] Environment variables for API endpoints

---

## 📊 Monitoring & Logging

### Backend Logs
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Local
npm run dev  # shows console logs
```

### Frontend Errors
- Use Sentry or similar service for error tracking
- Add to `package.json`:
  ```bash
  npm install @sentry/react @sentry/tracing
  ```

### Database Monitoring
- Use MongoDB Atlas Charts
- Monitor query performance
- Set up alerts for high usage

---

## 🛠️ Troubleshooting Deployment

### Frontend shows blank page
- Check browser console (F12)
- Verify API endpoint is correct
- Check CORS settings on backend
- Clear browser cache

### Backend returns 500 errors
- Check environment variables are set
- Verify MongoDB connection
- Check server logs
- Ensure all dependencies are installed

### CORS errors
- Backend: Update CORS configuration
  ```javascript
  app.use(cors({
    origin: 'https://your-frontend-url.com',
    credentials: true
  }));
  ```

### QR code not generating
- Verify `qrcode` package is installed
- Check backend logs for errors
- Test QR endpoint separately

### Analytics not tracking clicks
- Verify Analytics model is created in MongoDB
- Check click endpoint is being called
- Verify frontend is sending correct data

---

## 📈 Scaling for Growth

### Database Optimization
- Add indexes to frequently queried fields
- Archive old analytics data
- Implement data retention policy

### Backend Optimization
- Add caching layer (Redis)
- Implement pagination for large datasets
- Add database connection pooling

### Frontend Optimization
- Implement lazy loading
- Compress images
- Minify CSS and JavaScript
- Enable HTTP/2

### Infrastructure
- Use CDN for static assets
- Add load balancer for multiple backend instances
- Implement auto-scaling based on traffic

---

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor server logs daily
- [ ] Check database size weekly
- [ ] Review user analytics monthly
- [ ] Update dependencies quarterly
- [ ] Backup database monthly

### Backup Strategy
```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# Restore MongoDB
mongorestore dump/
```

---

## 🎓 Performance Targets

- **Frontend Load Time**: < 2 seconds
- **API Response Time**: < 200ms
- **Database Query Time**: < 50ms
- **Uptime**: 99.9%

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Docs](https://react.dev)

---

**Deployment Status**: Ready for Production ✅  
**Last Updated**: January 2024
