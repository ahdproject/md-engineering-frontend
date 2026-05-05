# 🚀 Vercel Deployment - Environment Variables Setup

## ❌ Problem: API Calls Failing with 404

**Error:** `Failed to load resource: m-and-d-engineering-…ay.app/auth/login`

**Issue:** Missing `/api` in URL path

**Root Cause:** `VITE_API_BASE_URL` environment variable not set in Vercel

---

## ✅ Solution: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com
2. Go to your project: **M&D Engineers Frontend**
3. Click **Settings** (top right)
4. Select **Environment Variables** from left sidebar

### Step 2: Add Environment Variables

Create these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | `https://m-and-d-engineering-production.up.railway.app/api` | Production, Preview, Development |
| `VITE_PUBLIC_GOOGLE_CLIENT` | `your-google-client-id` | All Environments |

### Step 3: Redeploy

1. After adding variables, go to **Deployments**
2. Click the latest deployment
3. Click **Redeploy** button
4. Wait for deployment to complete

---

## 🔍 Verify Setup

### Check Console Logs

After redeployment:

1. Open your Vercel frontend URL
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for: `🔗 API Base URL: https://m-and-d-engineering-production.up.railway.app/api`

### Test Login

Try logging in with:
- **Email:** `admin@mdengineers.com`
- **Password:** `Admin@123`

---

## 📋 Environment Files Reference

### `.env` (Development)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PUBLIC_GOOGLE_CLIENT=your-google-client-id
```

### `.env.production` (For reference - Vercel uses dashboard)
```env
VITE_API_BASE_URL=https://m-and-d-engineering-production.up.railway.app/api
VITE_PUBLIC_GOOGLE_CLIENT=your-google-client-id
```

### `.env.local` (Local override - never commit)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PUBLIC_GOOGLE_CLIENT=your-google-client-id
```

---

## 🐛 Troubleshooting

### Still getting 404 error?

1. **Check API URL in console:**
   - Open DevTools Console
   - Should show: `🔗 API Base URL: https://m-and-d-engineering-production.up.railway.app/api`
   - If showing `undefined`, variables not set in Vercel

2. **Verify Railway backend is running:**
   ```bash
   curl https://m-and-d-engineering-production.up.railway.app/
   ```
   Should return: `{"success":true,"message":"🚀 M&D Engineers ERP API running"}`

3. **Clear browser cache:**
   - Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
   - Or clear cookies for the domain

4. **Check Vercel deployment logs:**
   - Vercel Dashboard → Deployments → Click latest
   - View build and runtime logs for errors

---

## 🚨 Common Mistakes

❌ Setting env vars in `.env` file → Won't work on Vercel
❌ Forgetting to redeploy → Old build still running
❌ Wrong URL format → Use full URL with `/api` included
❌ Typo in variable name → `VITE_API_BASE_URL` (not `VITE_API_URL`)

✅ Set env vars in **Vercel Dashboard**
✅ Redeploy after adding variables
✅ Use exact URL: `https://m-and-d-engineering-production.up.railway.app/api`
✅ Check console logs to verify

---

## ✅ Quick Checklist

- [ ] Vercel environment variables set
- [ ] `VITE_API_BASE_URL` = `https://m-and-d-engineering-production.up.railway.app/api`
- [ ] Vercel project redeployed
- [ ] Console shows correct API URL
- [ ] Railway backend is running
- [ ] Login page loads without 404 errors

---

## 📞 Still Not Working?

Check these:

1. **Network Tab** (DevTools → Network)
   - Look for failed requests to Railway
   - Check response status and headers

2. **Railway Logs**
   - Open Railway Dashboard
   - Check logs for connection/auth errors

3. **CORS Issues**
   - Should see error: `Access to XMLHttpRequest... has been blocked by CORS policy`
   - Fixed in backend with `app.use(cors())`

---

**Ready? Set environment variables in Vercel now!** 🎯
