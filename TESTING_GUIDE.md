# JPD HUB - Testing Guide

## 1️⃣ Backend Setup
✅ Check `.env` file has:
```
MONGO_URI=mongodb+srv://karthis3477_db_user:CJ8hZWS3cQDQGNYS@clusterone.ezqrwfg.mongodb.net/linkhub
JWT_SECRET=9f8a7d6s5a4f3g2h1j0k
PORT=5000
```

✅ Install dependencies:
```bash
cd backend
npm install
npm run dev
```

Expected console output:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

---

## 2️⃣ Test with Postman

### **A. Sign Up**
- **Method:** POST
- **URL:** `http://localhost:5000/auth/signup`
- **Body (JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!"
}
```
- **Expected Response:** 
```json
{
  "message": "Signup successful",
  "userId": "xxx",
  "email": "test@example.com"
}
```
- **Status:** 201

---

### **B. Login**
- **Method:** POST
- **URL:** `http://localhost:5000/auth/login`
- **Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```
- **Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "userId": "xxx"
}
```
- **Status:** 200
- **Save the `token` for next requests**

---

### **C. Create Link**
- **Method:** POST
- **URL:** `http://localhost:5000/link`
- **Headers:**
  - `Content-Type: application/json`
  - `authorization: <your_token_from_login>`
- **Body (JSON):**
```json
{
  "title": "My First Link",
  "url": "https://github.com",
  "description": "GitHub repository",
  "rules": []
}
```
- **Expected Response:** 201 with link object
- **Check:** Link has `_id`, `qrCode`, `clicks: 0`, `visits: 0`

---

### **D. Get My Links**
- **Method:** GET
- **URL:** `http://localhost:5000/links`
- **Headers:**
  - `authorization: <your_token>`
- **Expected Response:** 200 with array of links

---

### **E. Track Click**
- **Method:** POST
- **URL:** `http://localhost:5000/click/<link_id>`
- **Headers:** None needed
- **Expected Response:** 200 `{ "message": "Click tracked" }`
- **Check:** Analytics document created in MongoDB

---

### **F. Get Analytics**
- **Method:** GET
- **URL:** `http://localhost:5000/analytics`
- **Headers:**
  - `authorization: <your_token>`
- **Expected Response:** 200
```json
{
  "totalVisits": 1,
  "totalClicks": 1,
  "topPerformers": [...],
  "allLinks": [...],
  "totalLinks": 1,
  "averageClicksPerLink": "1.00",
  "averageVisitsPerLink": "1.00"
}
```

---

### **G. Get Public Links** 
- **Method:** GET
- **URL:** `http://localhost:5000/public/<userId>`
- **Headers:** None needed
- **Expected Response:** 200 with link array

---

### **H. Update Link**
- **Method:** PUT
- **URL:** `http://localhost:5000/link/<link_id>`
- **Headers:**
  - `Content-Type: application/json`
  - `authorization: <your_token>`
- **Body (JSON):**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```
- **Expected Response:** 200

---

### **I. Delete Link**
- **Method:** DELETE
- **URL:** `http://localhost:5000/link/<link_id>`
- **Headers:**
  - `authorization: <your_token>`
- **Expected Response:** 200

---

## 3️⃣ Test Time-Based Rules

### **Create Link with Time Rule**
- **Method:** POST
- **URL:** `http://localhost:5000/link`
- **Headers:**
  - `authorization: <your_token>`
- **Body (JSON):**
```json
{
  "title": "Business Hours Link",
  "url": "https://example.com",
  "description": "Only show 9 AM - 5 PM weekdays",
  "rules": [
    {
      "type": "time",
      "condition": {
        "startTime": "09:00",
        "endTime": "17:00",
        "daysOfWeek": ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      "active": true
    }
  ]
}
```

### **Check Rule on Public Page**
- Open `http://localhost:5174/public/<userId>`
- Link should only appear if current time is 9 AM - 5 PM on weekdays
- Outside hours: Link hidden automatically

---

## 4️⃣ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| ❌ MongoDB Connection Error | Check `.env` MONGO_URI is correct |
| ❌ No token in signup response | Backend was updated with fix |
| ❌ 401 Unauthorized on link create | Check token is passed in headers |
| ❌ Links not saved | Verify DB connection logs |
| ❌ Analytics not updating | Check Analytics model in MongoDB |

---

## 5️⃣ Database Check

Open MongoDB Atlas and verify:
1. **Database:** `linkhub`
2. **Collections:**
   - `users` (user documents)
   - `links` (link documents with rules)
   - `analytics` (click tracking data)

---

## ✅ Success Checklist
- [ ] Backend starts without errors
- [ ] Signup creates user in DB
- [ ] Login returns valid token
- [ ] Links can be created/updated/deleted
- [ ] Analytics track clicks
- [ ] Public page displays rules correctly
- [ ] Time-based rules hide links outside hours
