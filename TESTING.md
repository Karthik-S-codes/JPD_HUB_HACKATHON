# JPD HUB - Testing Guide

## Quick Start

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5174
```

## Testing Checklist

### 1. Authentication Flow
- [ ] Navigate to http://localhost:5174
- [ ] Click "Sign up" link
- [ ] Fill in name, email, password
- [ ] Click "Create Account"
- [ ] You should be redirected to Login page
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] Should see Dashboard with "Your Links" heading

### 2. Create Link
- [ ] In Dashboard, fill in:
  - Title: "My GitHub"
  - URL: https://github.com/yourname
  - Description: "My GitHub profile"
- [ ] Click "Add Link"
- [ ] Link should appear in the list with click counter = 0
- [ ] QR code icon should be visible

### 3. View QR Code
- [ ] Click the QR code icon for any link
- [ ] Modal should pop up showing the QR code
- [ ] QR code should be scannable
- [ ] Close modal by clicking outside or X button

### 4. Copy Link
- [ ] Click the copy icon for any link
- [ ] Check browser notification/toast
- [ ] Paste in URL bar to verify

### 5. Edit Link
- [ ] Click the edit icon for any link
- [ ] Form should populate with current values
- [ ] Change the title or URL
- [ ] Click "Update" button
- [ ] Link should update in list
- [ ] QR code should regenerate if URL changed

### 6. Delete Link
- [ ] Click the delete/trash icon
- [ ] Confirm deletion
- [ ] Link should be removed from list

### 7. Reorder Links
- [ ] Drag links to reorder (if drag implemented)
- [ ] Or use order endpoint: `POST /links/reorder`

### 8. Public Link Hub
- [ ] Click "Share Your Hub" button
- [ ] Copy the public URL
- [ ] Open in new incognito window: `http://localhost:5174/public/{userId}`
- [ ] Should see user's links beautifully displayed
- [ ] Click any link - should track click
- [ ] Notice click counter increases on dashboard (refresh page)

### 9. Analytics Dashboard
- [ ] Click "Analytics" button in Dashboard
- [ ] Should see:
  - Total Visits (all hub visits)
  - Total Clicks (all link clicks)
  - Top Performers (top 5 links by clicks)
  - Performance Table (all links with CTR)
- [ ] CTR = (Clicks / Visits) * 100
- [ ] Refresh dashboard and public hub multiple times
- [ ] Metrics should increase

### 10. Click Tracking
- [ ] Create a test link
- [ ] Share public link
- [ ] Click the link from public hub
- [ ] Check Analytics page - clicks should increase
- [ ] Device type should be detected (mobile/desktop/tablet)

### 11. Error Handling
- [ ] Try creating link with invalid URL - should show error
- [ ] Try signing up with existing email - should show error
- [ ] Try accessing dashboard without login - should redirect to login
- [ ] Try accessing non-existent public hub - should show error

### 12. Logout
- [ ] Click "Logout" button in Dashboard
- [ ] Should be redirected to Login page
- [ ] Token should be cleared from localStorage

## API Testing (with curl or Postman)

### Sign Up
```bash
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Copy the token from response
```

### Create Link (requires auth)
```bash
curl -X POST http://localhost:5000/link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"GitHub","url":"https://github.com","description":"My GitHub profile"}'
```

### Get All Links (requires auth)
```bash
curl -X GET http://localhost:5000/links \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Link (requires auth)
```bash
curl -X PUT http://localhost:5000/link/LINK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Updated Title","url":"https://new-url.com"}'
```

### Delete Link (requires auth)
```bash
curl -X DELETE http://localhost:5000/link/LINK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Public Links
```bash
curl -X GET http://localhost:5000/public/USER_ID
```

### Track Click
```bash
curl -X POST http://localhost:5000/click/LINK_ID \
  -H "Content-Type: application/json" \
  -d '{"userAgent":"Mozilla/5.0...","ipAddress":"127.0.0.1"}'
```

### Get Analytics (requires auth)
```bash
curl -X GET http://localhost:5000/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Feature Completeness

### ✅ Completed (90%)
- User signup and login with JWT
- Create, edit, delete, reorder links
- QR code generation and display
- Public link hub
- Click tracking with device detection
- Analytics dashboard
- Beautiful Tailwind CSS styling

### 🔄 Partially Complete (10%)
- Rule-based link display (backend schema exists, UI needed)
- Rate limiting (architecture ready)
- Profile customization page

### Optional Enhancements
- Drag-and-drop reordering UI
- Export analytics as CSV/PDF
- URL shortening integration
- Offline link fallback
- Dark/light mode toggle

## Troubleshooting

### Backend won't start
- Check .env file has MONGO_URI and JWT_SECRET
- Ensure MongoDB connection is active
- Check port 5000 is not in use

### Frontend shows blank
- Delete frontend/.vite folder
- Restart dev server
- Check console for errors (F12)

### Links not showing after creation
- Refresh the page
- Check browser DevTools Network tab
- Ensure backend is running

### QR code not generating
- Ensure qrcode package is installed (npm install qrcode)
- Check backend console for errors
- Restart backend server

## Performance Testing

- Create 50+ links and verify dashboard still loads quickly
- Track 100+ clicks and verify analytics aggregation
- Test public hub with 1000+ visits

## Security Testing

- Try SQL injection in input fields
- Try accessing other user's links
- Try modifying JWT token and accessing protected routes
- Test password hashing (check user in DB is hashed, not plaintext)

---

**Expected Result**: All tests pass, project is production-ready! 🚀
