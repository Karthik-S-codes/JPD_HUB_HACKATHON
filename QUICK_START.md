# JPD HUB - Quick Reference Guide

## 🚀 Start Application (30 seconds)

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
**Expected Output**: `Server running on port 5000`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
**Expected Output**: `VITE v7.x.x  ready in xxx ms ➜  Local: http://localhost:5174`

### Open Browser
Navigate to: **http://localhost:5174**

---

## 👤 Create Test Account

### Signup
1. Click "Sign up" link
2. Fill in:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
3. Click "Create Account"
4. Auto-redirects to Login

### Login
1. Enter email: john@example.com
2. Enter password: password123
3. Click "Login"
4. Redirected to Dashboard

---

## 🔗 Create & Manage Links

### Add Link
1. In Dashboard, fill:
   - **Title**: GitHub
   - **URL**: https://github.com/yourname
   - **Description**: My GitHub profile
2. Click "Add Link"
3. Link appears in list with click counter = 0

### Edit Link
1. Click ✏️ edit icon
2. Modify title/URL/description
3. Click "Update"
4. QR code regenerates if URL changed

### Delete Link
1. Click 🗑️ delete icon
2. Confirm deletion
3. Link removed from list

### View QR Code
1. Click 📱 QR code icon
2. Modal shows scannable QR code
3. Close by clicking outside or X

### Copy Link
1. Click 📋 copy icon
2. Public link copied to clipboard

---

## 📊 View Analytics

### Click Analytics Button
1. In Dashboard, click "📊 Analytics"
2. See:
   - **Total Visits**: All hub visits
   - **Total Clicks**: All link clicks
   - **Top Performers**: Top 5 links by clicks
   - **Performance Table**: All links with CTR

### Increase Metrics
1. Get public share link (copy icon)
2. Open in new window/incognito
3. Click any link
4. Refresh dashboard - metrics increase

---

## 🌐 Public Hub

### Get Public URL
1. In Dashboard, click copy icon on any link
2. Or construct: `http://localhost:5174/public/{YOUR_USER_ID}`

### Share Hub
1. Send public URL to others
2. They can view your links
3. Their clicks tracked in analytics
4. Device type detected (mobile/desktop)

---

## 🔑 API Endpoints Quick Reference

### Auth Endpoints
```bash
# Sign Up
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@example.com","password":"pass"}'

# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'
```

### Link Endpoints (Replace TOKEN with your JWT)
```bash
# Create
curl -X POST http://localhost:5000/link \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"GitHub","url":"https://github.com","description":"My GitHub"}'

# Get All
curl -X GET http://localhost:5000/links \
  -H "Authorization: Bearer TOKEN"

# Update
curl -X PUT http://localhost:5000/link/LINK_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Delete
curl -X DELETE http://localhost:5000/link/LINK_ID \
  -H "Authorization: Bearer TOKEN"

# Get Analytics
curl -X GET http://localhost:5000/analytics \
  -H "Authorization: Bearer TOKEN"
```

### Public Endpoints
```bash
# Get Public Links
curl -X GET http://localhost:5000/public/USER_ID

# Track Click
curl -X POST http://localhost:5000/click/LINK_ID \
  -H "Content-Type: application/json" \
  -d '{"userAgent":"Mozilla/5.0...","ipAddress":"127.0.0.1"}'
```

---

## 📁 Key Files to Know

### Backend
- `server.js` - Entry point
- `app.js` - Express configuration
- `models/User.js` - User schema
- `models/Link.js` - Link schema with QR codes
- `models/Analytics.js` - Click tracking
- `controllers/authController.js` - Login/Signup logic
- `controllers/linkController.js` - Link CRUD + Analytics
- `routes/authRoutes.js` - Auth endpoints
- `routes/linkRoutes.js` - Link endpoints
- `middleware/auth.js` - JWT verification

### Frontend
- `App.jsx` - Router & routes
- `pages/Login.jsx` - Login page
- `pages/Signup.jsx` - Signup page
- `pages/Dashboard.jsx` - Link management
- `pages/Analytics.jsx` - Analytics dashboard
- `pages/Public.jsx` - Public hub
- `services/api.js` - Axios instance

---

## 🎨 Styling Quick Tips

### Colors
- **Background**: Dark gradient (slate-900 to blue-900)
- **Accent**: Cyan (cyan-400, cyan-500)
- **Secondary**: Blue (blue-400, blue-500)
- **Text**: White on dark

### Tailwind Classes Used
```
bg-gradient-to-r  from-slate-900 to-blue-900
text-cyan-400
border-cyan-500/30
hover:bg-cyan-500/10
rounded-lg
shadow-lg
backdrop-blur-md
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
# Edit .env: MONGO_URI=your_connection_string

# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Frontend shows blank
```bash
# Clear cache
rm -r frontend/.vite

# Reinstall dependencies
cd frontend
npm install
npm run dev
```

### Links not saving
1. Check backend console for errors
2. Verify MongoDB is connected
3. Check browser Network tab for API errors
4. Ensure token is in localStorage

### QR codes not showing
1. Verify qrcode package installed: `npm list qrcode` in backend
2. Check backend console for QR generation errors
3. Try creating a new link

### Analytics not updating
1. Refresh the Analytics page
2. Check that you clicked links from public hub
3. Verify Analytics.js model exists in MongoDB
4. Check backend console for aggregation errors

---

## 📈 Performance Optimization Tips

### Frontend
- Use incognito window to bypass cache
- Open DevTools (F12) → Network to see load times
- Lighthouse audit for performance score

### Backend
- Monitor logs for slow queries
- Check MongoDB Atlas Charts for database performance
- Use query indexes on userId and email

---

## 🔒 Security Notes

### Don't Share
- JWT token (stored in localStorage)
- MongoDB connection string
- JWT_SECRET from .env

### Always Use
- HTTPS in production
- Strong password (min 8 characters)
- HTTPOnly cookies for tokens (production)

---

## 📚 Full Documentation Files

- **README.md** - Project overview
- **API.md** - Complete API reference
- **TESTING.md** - Testing checklist
- **DEPLOYMENT.md** - Production deployment
- **PROJECT_STATUS.md** - Completion status

---

## ⚡ Common Tasks

### Reset Database
1. Delete all collections in MongoDB Atlas
2. Restart backend: `npm run dev`
3. Create new account and links

### Change Theme Color
1. Edit `frontend/tailwind.config.js`
2. Change `extend.colors.cyan` to another color
3. Update all `text-cyan-400` to your color

### Add New Route
1. Create in `pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add to router: `<Route path="/path" element={<NewPage />} />`

### Add New API Endpoint
1. Create function in `controllers/linkController.js`
2. Add route in `routes/linkRoutes.js`
3. Add to documentation in `API.md`

---

## 🎯 Test Checklist (5 mins)

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5174
- [ ] Can signup with new email
- [ ] Can login with correct credentials
- [ ] Can create a link
- [ ] Can see link in dashboard
- [ ] Can edit link title
- [ ] Can delete link
- [ ] Can view QR code
- [ ] Can access public hub
- [ ] Click counter increases
- [ ] Can view analytics
- [ ] Can logout

**All passed?** → Project is working! ✅

---

## 💡 Pro Tips

1. **Save Time**: Use the same email/password for testing
2. **Test Multiple Users**: Use different emails to test multi-user scenarios
3. **Check Console**: Always check browser (F12) and backend console for errors
4. **Public Hub URL**: Copy from dashboard copy icon, don't type manually
5. **Analytics**: Need to click links from public hub to see metrics increase

---

## 📞 Need Help?

1. Check **TESTING.md** for detailed testing guide
2. Check **API.md** for endpoint specifications
3. Check **DEPLOYMENT.md** for production setup
4. Check browser console (F12) for frontend errors
5. Check backend terminal for API errors

---

## ✨ You're All Set!

Your JPD HUB application is ready to use! 🚀

**Project Status**: 90% Complete  
**Last Updated**: January 2024  
**Version**: 1.0.0
