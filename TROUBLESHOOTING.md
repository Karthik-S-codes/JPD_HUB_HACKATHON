# JPD HUB - Troubleshooting & FAQ

## 🆘 Common Issues & Solutions

### Issue 1: Backend Won't Start - "Cannot find module"

**Error**: `Error: Cannot find module './app'`

**Solution**:
```bash
# 1. Verify app.js exists in backend directory
ls backend/app.js

# 2. If missing, create it:
# (The file should already exist - verify server.js imports correctly)

# 3. Restart backend
cd backend
npm run dev
```

---

### Issue 2: MongoDB Connection Failed

**Error**: `Error: connect ECONNREFUSED` or `connection timeout`

**Solution**:
```bash
# 1. Check .env file has correct connection string
cat backend/.env

# 2. Verify MongoDB is running (if local)
# For MongoDB Atlas:
# - Check cluster status in Dashboard
# - Verify IP address is whitelisted
# - Check username/password are correct

# 3. Test connection string:
# Copy-paste the MongoDB URI and check:
# - Credentials are escaped properly
# - Database name is included
# - @ symbol isn't escaped

# 4. Update .env with correct connection:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

**Example .env**:
```
MONGO_URI=mongodb+srv://karthis3477_db_user:CJ8hZWS3cQDQGNYS@clusterone.ezqrwfg.mongodb.net/linkhub
JWT_SECRET=9f8a7d6s5a4f3g2h1j0k
PORT=5000
```

---

### Issue 3: Frontend Shows Blank Page

**Symptoms**: 
- Page loads but shows no content
- Console shows errors (F12)

**Solution**:
```bash
# 1. Clear Vite cache
rm -r frontend/.vite

# 2. Clear browser cache
# Go to Settings → Clear browsing data

# 3. Reinstall frontend dependencies
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev

# 4. Check if backend is running
# Should see: "Server running on port 5000"

# 5. Check browser console (F12) for errors
```

---

### Issue 4: "Cannot POST /link" - 404 Error

**Error**: API endpoint returns 404

**Solution**:
```bash
# 1. Verify backend server is running
# Terminal should show: "Server running on port 5000"

# 2. Check linkRoutes.js is imported in server.js
# Should see: const linkRoutes = require("./routes/linkRoutes");

# 3. Verify endpoint exists
# Check: backend/routes/linkRoutes.js has "router.post('/link', ...)"

# 4. Check authorization header
# API requires: Authorization: Bearer TOKEN

# 5. Restart backend
npm run dev
```

---

### Issue 5: "Invalid token" Error

**Error**: `Invalid token` or `401 Unauthorized`

**Solution**:
```bash
# 1. Clear localStorage and login again
# Open browser DevTools (F12) → Application → Local Storage
# Delete 'token' entry

# 2. Login again to get fresh token
# Go to Login page and enter credentials

# 3. If still failing, check:
# - JWT_SECRET in .env matches frontend expectations
# - Token wasn't modified
# - Token hasn't expired

# 4. Check token format
# Should be: "Bearer eyJhbGciOi..."
# Not: "Bearer Bearer eyJhbGc..."
```

---

### Issue 6: QR Codes Not Generating

**Error**: QR code field is empty or shows error

**Solution**:
```bash
# 1. Verify qrcode package is installed
cd backend
npm list qrcode

# 2. If not installed, install it
npm install qrcode

# 3. Verify linkController.js imports qrcode
# Should have: const QRCode = require('qrcode');

# 4. Check backend console for errors
# Look for QR generation error messages

# 5. Test QR generation manually
# Create a link via API and check response includes qrCode field
```

---

### Issue 7: Links Not Saving in Database

**Error**: Link is created but disappears after refresh

**Solution**:
```bash
# 1. Check MongoDB connection
# Verify MONGO_URI in .env

# 2. Verify database exists
# Check MongoDB Atlas → Databases → linkhub collection

# 3. Check Link model exists
# File should be: backend/models/Link.js

# 4. Check linkController.js saves to database
# Should have: await link.save();

# 5. Restart backend and try creating link again
npm run dev

# 6. Check MongoDB Atlas collections
# Go to Dashboard → Collections → should see Link documents
```

---

### Issue 8: Click Counter Not Increasing

**Error**: Analytics shows 0 clicks even after clicking link

**Solution**:
```bash
# 1. Verify you're clicking from public hub
# Get public URL: /public/{your_user_id}
# Don't click from dashboard - that won't track

# 2. Refresh analytics page after clicking
# Click → go back → refresh analytics

# 3. Check Analytics model exists in MongoDB
# Should have Analytics collection with click records

# 4. Verify click endpoint is being called
# Open DevTools (F12) → Network tab
# Click a link and look for POST /click/... request

# 5. If still not working:
# - Check backend logs for errors
# - Verify linkController.js::trackClick() exists
# - Restart backend
```

---

### Issue 9: "CORS Error" in Browser Console

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```bash
# 1. Verify CORS is enabled in backend
# Check app.js has: app.use(cors());

# 2. Check frontend API baseURL is correct
# backend/services/api.js should have:
# axios.defaults.baseURL = 'http://localhost:5000';

# 3. Restart backend and frontend
npm run dev  # Both servers

# 4. For production, update CORS settings:
# In backend app.js:
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

### Issue 10: "Port 5000 Already in Use"

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# 1. Find process using port 5000
# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# 2. Kill the process
taskkill /PID <process_id> /F

# 3. Or change port in .env
# Edit: PORT=5001

# 4. Restart backend
npm run dev
```

---

## ❓ FAQ - Frequently Asked Questions

### Q: How do I reset my password?
**A**: The current version doesn't have password reset. To reset:
1. Delete your user account from MongoDB
2. Signup with the same email and new password
3. In MongoDB Atlas → Collections → Users → Delete your user document

---

### Q: Can I delete my account?
**A**: Not yet implemented. To delete:
1. Go to MongoDB Atlas → Collections → Users
2. Find your document by email
3. Click Delete

---

### Q: How do I export my analytics?
**A**: Currently not available. Workarounds:
1. Screenshot the analytics page
2. Manually copy metrics
3. Use MongoDB export tools

(Will be added in v1.1)

---

### Q: Can multiple people access the same account?
**A**: No - JWT token is single-user. Create separate accounts.

---

### Q: How long is the JWT token valid for?
**A**: Currently no expiration set. In production, add:
```javascript
// In login response:
token: jwt.sign(data, SECRET, { expiresIn: '7d' })
```

---

### Q: Where are QR codes stored?
**A**: As data URLs in the Link document's `qrCode` field.

---

### Q: Can I change my email address?
**A**: Not yet implemented. Workaround:
1. Create new account with new email
2. Note down your link IDs
3. Create new links (automatic QR generation)
4. Share new public hub URL

---

### Q: What happens if I delete a link?
**A**: Link and all its analytics are deleted. No recovery possible.

---

### Q: Can I reorder links on mobile?
**A**: Not yet. Reordering is desktop-only. Mobile: swipe or scroll.

---

### Q: Is my data secure?
**A**: Yes:
- Passwords hashed with bcryptjs
- JWT tokens for authentication
- HTTPS in production
- No sensitive data in logs

---

### Q: Can I have two users with same email?
**A**: No - email must be unique in signup.

---

### Q: Does the public hub show my email?
**A**: No - only shows name and links.

---

### Q: Can I see who clicked my links?
**A**: No - only aggregate metrics. IP addresses stored but not displayed.

---

### Q: What happens if I click my own link?
**A**: It counts toward analytics. Try using public URL in incognito window.

---

### Q: Can I set a custom domain?
**A**: Not in current version. Domain format is:
`http://localhost:5174/public/{user_id}`

In production:
`https://yourdomain.com/public/{user_id}`

---

## 🔧 Advanced Troubleshooting

### Check Server Health

**Backend Health Check**:
```bash
curl http://localhost:5000/
# Should return: {"message":"Welcome to the API"}
```

**MongoDB Health**:
```bash
# In MongoDB shell:
db.adminCommand({ping: 1})
# Should return: { ok: 1 }
```

---

### Verify Environment Variables

**Backend**:
```bash
# Check .env is loaded
cd backend
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

---

### Debug Database Queries

**Check what's in database**:
```bash
# Using MongoDB Compass or Atlas:
1. Connect with connection string
2. Browse databases
3. Check linkhub → Users collection
4. Check linkhub → Links collection
5. Check linkhub → Analytics collection
```

---

### Test API Endpoints

**Using curl**:
```bash
# Signup
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Create Link (replace TOKEN)
curl -X POST http://localhost:5000/link \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","url":"https://google.com"}'
```

---

### Check Logs

**Backend Logs**:
```bash
# Terminal running "npm run dev" shows all logs
# Look for errors like:
# - MongoError
# - SyntaxError
# - TypeError
# - Network errors
```

**Browser Logs**:
```bash
# Press F12 in browser
# Go to Console tab
# Look for:
# - Red error messages
# - Network errors
# - Failed API calls
```

---

## 📞 When All Else Fails

### Complete Reset

```bash
# 1. Delete node_modules and reinstall
cd backend
rm -r node_modules package-lock.json
npm install

cd ../frontend
rm -r node_modules package-lock.json
npm install

# 2. Delete .vite cache
rm -r frontend/.vite

# 3. Clear MongoDB (optional)
# Go to MongoDB Atlas → Delete all collections and start fresh

# 4. Clear browser cache
# F12 → Application → Clear all

# 5. Restart everything
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2
```

---

### Get Diagnostic Information

```bash
# Node version
node --version

# npm version
npm --version

# Installed packages (backend)
cd backend && npm list

# Check MongoDB connection
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected!')).catch(e => console.log('Failed:', e.message));"
```

---

## 📚 Additional Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **JWT Docs**: https://jwt.io
- **Axios Docs**: https://axios-http.com

---

## 💬 Still Need Help?

1. Check **QUICK_START.md** for basic setup
2. Check **API.md** for endpoint details
3. Check **TESTING.md** for testing procedures
4. Search browser console (F12) for error messages
5. Check backend terminal for server errors
6. Visit [Stack Overflow](https://stackoverflow.com) with error message

---

**Last Updated**: January 2024  
**Version**: 1.0.0 Support Guide
