# Deployment Configuration Guide

## Render Backend URL
https://jpd-hub-hackathon.onrender.com

## Environment Variables to Set on Render

Go to your Render Dashboard:
1. Select your backend service: **jpd-hub-hackathon**
2. Click **Settings** tab
3. Scroll to **Environment Variables**
4. Add this variable:

```
FRONTEND_URL = https://jpd-hub-hackathon.vercel.app
```

(Replace with your actual Vercel frontend URL once deployed)

## Environment Variables Already Set
- MONGO_URI ✅
- JWT_SECRET ✅
- PORT ✅
- NODE_ENV ✅

## Vercel Frontend Deployment
Once you deploy frontend, the URL will be: https://jpd-hub-hackathon.vercel.app

After getting Vercel URL, update the FRONTEND_URL variable on Render with that URL.
