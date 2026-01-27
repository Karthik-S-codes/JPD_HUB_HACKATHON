# JPD HUB - Deployment Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Render account (backend)
- Vercel account (frontend)
- GitHub repository access

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

### Current Production
- Frontend: Vercel (e.g., https://your-frontend.vercel.app)
- Backend: Render (e.g., https://your-backend.onrender.com)
- Set `VITE_API_BASE_URL` in Vercel to the Render backend URL
- Allow the Vercel domain in backend CORS settings

### Deploy Backend to Render
1. Push the repository to GitHub and ensure the `backend` folder is present.
2. In Render, create a new Web Service → connect the repo → set root to `backend`.
3. Build command: `npm install` (auto-detected). Start command: `npm start`.
4. Environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=production
   ```
5. Enable auto-deploy on push. Copy the Render service URL for the frontend.

### Deploy Frontend to Vercel
1. Import the repo in Vercel and select the `frontend` directory.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Environment variables in Vercel:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
4. Deploy. Re-deploy after any backend URL change.

---

## 🗄️ MongoDB Setup (Atlas)

1. Create an Atlas account (free tier).
2. Create a cluster in a nearby region.
3. Create a database user and save credentials.
4. Get the connection string from "Connect" → "Drivers" and replace placeholders:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/databasename
   ```
5. Add IP allowlist (allow all for dev; restrict for production).

---

## 📋 Environment Variables Checklist

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_very_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=production
```

### Frontend (.env or Vercel project settings)
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` created with all variables
- [ ] Database connection tested
- [ ] API endpoints tested locally
- [ ] No console errors or warnings
- [ ] QRCode package installed
- [ ] Error handling in place

### Frontend
- [ ] Dependencies installed (`npm install`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] `VITE_API_BASE_URL` points to Render backend
- [ ] All pages tested locally
- [ ] Login/Signup works
- [ ] Links can be created and deleted
- [ ] Analytics loads data
- [ ] Public hub is accessible

---

## 🔒 Security Checklist

### Backend
- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `MONGO_URI` is secure (no password in code)
- [ ] CORS restricted to production frontend
- [ ] Input validation on all endpoints
- [ ] Password hashing with bcryptjs
- [ ] No sensitive data in logs
- [ ] Rate limiting implemented
- [ ] HTTPS enabled on production

### Frontend
- [ ] No API keys exposed in code
- [ ] Authentication token stored securely
- [ ] XSS protections enabled
- [ ] CSRF tokens if needed
- [ ] No hardcoded URLs in code
- [ ] Environment variables for API endpoints

---

## 📊 Monitoring & Logging

### Backend Logs
- Render: View logs in the Render dashboard (Events/Logs) or via `render logs` if using CLI.
- Local: `npm run dev` shows console logs.

### Frontend Errors
- Use Vercel dashboard logs or `vercel logs <project-name>`.
- Optional: add Sentry for client-side error tracking.

### Database Monitoring
- Use MongoDB Atlas metrics and alerts.
- Watch query performance and connection counts.

---

## 🛠️ Troubleshooting Deployment

### Frontend shows blank page
- Check browser console (F12).
- Verify `VITE_API_BASE_URL` matches the Render backend URL.
- Redeploy after env changes.

### Backend returns 500 errors
- Confirm environment variables are set on Render.
- Verify MongoDB connection string and network rules.
- Check Render logs for stack traces.

### CORS errors
- Update backend CORS to allow the Vercel domain only.

### QR code not generating
- Ensure `qrcode` dependency installed on backend.
- Check backend logs for errors.

### Analytics not tracking clicks
- Confirm Analytics model exists in MongoDB.
- Check click endpoint calls and responses in the network tab.

---

## 📈 Scaling for Growth

### Database Optimization
- Add indexes to frequently queried fields.
- Archive old analytics data.
- Implement data retention policy.

### Backend Optimization
- Add caching (Redis).
- Implement pagination for large datasets.
- Enable connection pooling.

### Frontend Optimization
- Enable code-splitting/lazy loading.
- Compress assets.
- Minify CSS and JavaScript.
- Serve over HTTP/2.

### Infrastructure
- Use CDN for static assets.
- Add load balancer for multiple backend instances.
- Configure auto-scaling based on traffic.

---

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor Render logs daily
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

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Express.js Guide](https://expressjs.com)
- [React Docs](https://react.dev)

---

**Deployment Status**: Live on Vercel (frontend) + Render (backend) ✅  
**Last Updated**: January 2026
