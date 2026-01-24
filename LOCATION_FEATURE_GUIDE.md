# Location-Based Link Display Feature

## Overview
This feature allows links to be displayed conditionally based on the visitor's geographic location. Using free IP geolocation, links can be restricted to specific countries or set as global.

---

## How It Works

### 1. **Architecture**

```
Visitor Request → geoLocationMiddleware → Detect IP → Fetch Country
                                              ↓
                                        getPublicLinks
                                              ↓
                                    Filter by allowedCountries
                                              ↓
                                        Return visible links
```

### 2. **Data Flow**

```javascript
// Visitor from India visits: /public/user123

{
  "visitorCountry": "IN",
  "visitorCountryName": "India",
  "totalLinks": 10,
  "visibleLinks": 7,
  "links": [
    { title: "India Only", allowedCountries: ["IN"] },     // VISIBLE
    { title: "Global", allowedCountries: ["GLOBAL"] },     // VISIBLE
    { title: "USA Only", allowedCountries: ["US"] }        // HIDDEN
  ]
}
```

---

## Database Schema

### Link Model Updated

```javascript
{
  title: String,
  url: String,
  description: String,
  allowedCountries: [String],  // NEW: ["IN", "US"] or ["GLOBAL"]
  rules: [...],
  qrCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

**allowedCountries Options:**
- `["GLOBAL"]` - Visible to all countries
- `["IN"]` - Visible only in India
- `["IN", "US"]` - Visible in India and USA
- `["IN", "GB", "CA"]` - Multiple countries

---

## Geolocation Service

### File: `backend/middleware/geoLocation.js`

**Free IP API Used:** `ip-api.com`
- Rate Limit: 45 requests/minute (free tier)
- Response Time: ~200-500ms
- Coverage: 194 countries

**Exported Functions:**

```javascript
// 1. Get location from IP
const locationData = await getLocationFromIP("8.8.8.8");
// Returns:
// {
//   country: "US",
//   countryName: "United States",
//   city: "Mountain View",
//   region: "California",
//   success: true
// }

// 2. Middleware - Auto-attaches to request
app.use(geoLocationMiddleware);
// Now request has:
// req.country = "US"
// req.countryName = "United States"
// req.clientIP = "8.8.8.8"
// req.locationData = { ... }
```

---

## Controller Logic

### File: `backend/controllers/linkController.js`

**Filter Function:**

```javascript
const isLinkVisibleByLocation = (link, visitorCountry) => {
  // Always show if no restrictions
  if (!link.allowedCountries?.length) return true;
  
  // Always show if GLOBAL
  if (link.allowedCountries.includes("GLOBAL")) return true;
  
  // Show only if country matches
  return link.allowedCountries.includes(visitorCountry);
};
```

**Updated getPublicLinks:**

```javascript
// Before: Returns ALL links
const allLinks = await Link.find({ userId: userId });

// After: Returns FILTERED links
const visibleLinks = allLinks.filter(link =>
  isLinkVisibleByLocation(link, req.country)
);
```

---

## API Response Example

### Request
```
GET /public/69738684f1bc057160ffd678
IP: 1.2.3.4 (India)
```

### Response
```json
{
  "userName": "Karthik S",
  "hubTitle": "My Links",
  "hubDescription": "Check out my awesome links",
  "visitorCountry": "IN",
  "visitorCountryName": "India",
  "totalLinks": 5,
  "visibleLinks": 3,
  "links": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "GitHub Repository",
      "url": "https://github.com/...",
      "description": "My latest project",
      "allowedCountries": ["GLOBAL"],
      "qrCode": "data:image/png;base64,..."
    },
    {
      "title": "India-Only Offer",
      "url": "https://example.com",
      "allowedCountries": ["IN"]
    }
  ]
}
```

---

## Frontend Integration (Optional)

### Update Public.jsx to Show Location Info

```javascript
// Show visitor's location
<div className="text-gray-400 text-sm mb-4">
  Showing links available in {visitorCountryName}
</div>

// Display filter stats
<p className="text-emerald-400">
  {visibleLinks} of {totalLinks} links available in your region
</p>
```

---

## Testing Guide

### Test 1: Localhost Default
```bash
# You're at 127.0.0.1 → Defaults to India (IN)
# All links with ["IN"] or ["GLOBAL"] will show
```

### Test 2: Manual IP Testing
```bash
# Test with different IPs using curl
curl -X GET "http://localhost:5000/public/userId" \
  -H "X-Forwarded-For: 8.8.8.8"  # Google (USA)

# Expected: Only ["GLOBAL"] and ["US"] links shown
```

### Test 3: Create Links with Location Restrictions

**In Dashboard (Frontend Update Needed):**
```javascript
// When creating a link, select allowed countries:
const newLink = {
  title: "India Special",
  url: "https://example.com",
  allowedCountries: ["IN"]  // Add this field
};
```

---

## Postman Testing

### Step 1: Create Link (India Only)
```
POST /link
Authorization: Bearer <token>
Body:
{
  "title": "India Special Offer",
  "url": "https://example.com",
  "allowedCountries": ["IN"]
}
```

### Step 2: Create Link (Global)
```
POST /link
Authorization: Bearer <token>
Body:
{
  "title": "Global Link",
  "url": "https://github.com",
  "allowedCountries": ["GLOBAL"]
}
```

### Step 3: Test Public Access (India)
```
GET /public/<userId>
Expected: Both links visible
```

### Step 4: Test Public Access (USA)
```
GET /public/<userId>
X-Forwarded-For: 8.8.8.8
Expected: Only "Global Link" visible
```

---

## Error Handling & Fallbacks

### IP Lookup Failure
```javascript
// If API fails, defaults to:
req.country = "UNKNOWN"

// Links with ["GLOBAL"] still show
// Links with country-specific restrictions DON'T show
```

### Rate Limit (45 req/min)
```javascript
// If exceeded, caches last successful lookup
// Or falls back to "UNKNOWN"
```

---

## Country Codes Reference

**Common ISO 3166-1 Alpha-2 Codes:**

| Country | Code |
|---------|------|
| India | IN |
| United States | US |
| United Kingdom | GB |
| Canada | CA |
| Australia | AU |
| Germany | DE |
| France | FR |
| Japan | JP |
| China | CN |
| Brazil | BR |

Full list: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

---

## Future Enhancements

1. **Block Specific Countries**
   ```javascript
   blockedCountries: ["CN", "RU"]  // Hide from these countries
   ```

2. **Regional Groups**
   ```javascript
   allowedRegions: ["ASIA", "EU", "AMERICAS"]
   ```

3. **Time + Location Rules**
   ```javascript
   {
     type: "location-time",
     allowedCountries: ["IN"],
     timeWindow: { start: "09:00", end: "17:00" }
   }
   ```

4. **Analytics by Country**
   ```javascript
   // Track clicks by country
   analytics: {
     byCountry: { IN: 45, US: 23, GB: 12 }
   }
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Links not filtering | Check `allowedCountries` field in DB |
| Wrong country detected | May be VPN/proxy; IP lookup limitation |
| Rate limit exceeded | Wait 1 minute; ip-api has 45 req/min limit |
| Localhost shows India | Intentional default for testing |

---

## Summary

✅ **Implemented:**
- IP geolocation middleware
- Country-based link filtering
- Database model with `allowedCountries`
- Clean separation of concerns
- Error handling & fallbacks
- Localhost testing support

✅ **Next Steps:**
1. Update Dashboard UI to select `allowedCountries`
2. Test with different VPNs/IPs
3. Monitor IP-API rate limits in production
4. Consider caching for performance
