# Smart URL Generation - Quick Test Guide

## 🧪 Testing Checklist

### 1. Test Slug Generation Utility
```bash
cd backend/utils
node testSlugGenerator.js
```

**Expected Output:**
```
✅ "Anika Sharma" → "anika-sharma"
✅ "John's Hub!" → "johns-hub"
✅ All validation tests pass
```

---

### 2. Test User Signup with Slug

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Signup successful",
  "userId": "...",
  "email": "test@example.com",
  "hubSlug": "test-user",
  "hubUrl": "/hub/test-user"
}
```

✅ **Check:** Response includes `hubSlug` and `hubUrl`

---

### 3. Test Duplicate Name Handling

**Test Case:**
Sign up 3 users with the same name "John Doe"

**Expected Slugs:**
1. First user: `john-doe`
2. Second user: `john-doe-1`
3. Third user: `john-doe-2`

**Commands:**
```bash
# User 1
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john1@example.com","password":"pass123"}'

# User 2
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john2@example.com","password":"pass123"}'

# User 3
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john3@example.com","password":"pass123"}'
```

✅ **Check:** Each user gets a unique slug

---

### 4. Test Hub Access by Slug

**Request:**
```bash
curl http://localhost:5000/api/links/hub/test-user
```

**Expected Response (200 OK):**
```json
{
  "userName": "Test User",
  "hubSlug": "test-user",
  "hubTitle": "My Links",
  "hubDescription": "",
  "theme": "dark",
  "accentColor": "#00ff00",
  "links": []
}
```

✅ **Check:** Hub data returned successfully

---

### 5. Test Invalid Slug

**Request:**
```bash
curl http://localhost:5000/api/links/hub/Invalid@Slug
```

**Expected Response (404):**
```json
{
  "message": "Invalid hub URL",
  "slug": "Invalid@Slug"
}
```

✅ **Check:** Invalid slugs are rejected

---

### 6. Test Non-Existent Slug

**Request:**
```bash
curl http://localhost:5000/api/links/hub/does-not-exist-12345
```

**Expected Response (404):**
```json
{
  "message": "Hub not found",
  "slug": "does-not-exist-12345"
}
```

✅ **Check:** Non-existent slugs return 404

---

### 7. Test Special Characters in Name

**Test Names:**
```json
{
  "name": "Aniká Śharmä",
  "email": "anika1@example.com",
  "password": "pass123"
}
```

**Expected Slug:** `anik-shrm` or similar (special chars removed)

```json
{
  "name": "User_Name#123!",
  "email": "user@example.com",
  "password": "pass123"
}
```

**Expected Slug:** `user-name-123`

✅ **Check:** Special characters are properly removed

---

### 8. Test Legacy Route (Backward Compatibility)

**Request (Old route with user ID):**
```bash
curl http://localhost:5000/api/links/public/507f1f77bcf86cd799439011
```

**Expected:** Still works, returns hub data

✅ **Check:** Old route continues to function

---

### 9. Verify Database

**MongoDB Query:**
```javascript
// Connect to MongoDB
db.users.find().forEach(user => {
  print(`${user.name} → ${user.hubSlug}`);
});
```

**Expected:**
- All users have `hubSlug` field
- All slugs are unique
- All slugs are lowercase
- No special characters in slugs

✅ **Check:** Database has correct slug data

---

### 10. Test Migration Script

**For Existing Users:**
```bash
cd backend/utils
node migrateUserSlugs.js migrate
```

**Expected Output:**
```
✅ [1/5] Anika Sharma → anika-sharma
✅ [2/5] John Doe → john-doe
...
📊 Migration Summary
✅ Successfully migrated: 5 users
```

**Verify:**
```bash
node migrateUserSlugs.js verify
```

✅ **Check:** All existing users now have slugs

---

## 🎯 Success Criteria

### All Tests Pass When:

- [ ] Slug generation utility works correctly
- [ ] New signups automatically get unique slugs
- [ ] Duplicate names get numbered suffixes (-1, -2, etc.)
- [ ] GET /hub/:slug returns correct hub data
- [ ] Invalid slugs return 404
- [ ] Non-existent slugs return 404
- [ ] Special characters are properly handled
- [ ] Legacy /public/:userId route still works
- [ ] Database has hubSlug for all users
- [ ] All slugs are unique

---

## 🐛 Common Issues & Solutions

### Issue: "hubSlug is required"
**Solution:** Run migration script for existing users

### Issue: Duplicate key error
**Solution:** Ensure `generateUniqueSlug` is used, not `generateSlug`

### Issue: Slug has uppercase letters
**Solution:** Check User model has `lowercase: true` on hubSlug field

### Issue: Cannot access hub by slug
**Solution:** Verify route is registered in linkRoutes.js

---

## 📊 Performance Check

### Test Load:
```bash
# Create 100 users with same name
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"John Doe\",\"email\":\"john${i}@example.com\",\"password\":\"pass123\"}"
done
```

**Expected:**
- All complete successfully
- Slugs: john-doe, john-doe-1, john-doe-2, ... john-doe-99
- No duplicate slug errors

✅ **Check:** System handles high collision scenarios

---

## ✨ Production Deployment Checklist

Before deploying to production:

- [ ] Run all tests locally
- [ ] Test with Postman/Insomnia
- [ ] Run migration script on staging database
- [ ] Verify all existing users have slugs
- [ ] Update frontend to use new slug URLs
- [ ] Test slug URLs in production environment
- [ ] Monitor logs for any slug-related errors
- [ ] Update user documentation with new URL format

---

**Test Status:** Ready for testing ✅
**Created:** January 25, 2026
**Author:** Smart URL Generation Feature
