# 🔀 SPA Routing on Vercel - Complete Guide

## 🚨 Problem

When accessing routes on Vercel, getting 404 errors:
- `https://md-engineering-frontend.vercel.app/login` → 404
- `https://md-engineering-frontend.vercel.app/dashboard` → 404

**Why?** Vercel treats these as actual file paths, not React Router routes.

---

## ✅ Solution: Configure vercel.json

The `vercel.json` file has been updated with rewrites configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### What This Does

```
User requests: https://example.com/login
                    ↓
Vercel sees:   /login
                    ↓
Rewrites to:   /index.html
                    ↓
Browser runs:  React app with /login route
                    ↓
Result:        Login page displays ✅
```

---

## 🚀 How to Apply This Fix

### Option 1: Already Committed (Recommended)

If you've already pushed the updated `vercel.json` to GitHub:

1. Go to: https://vercel.com/dashboard
2. Click your project: **md-engineers-frontend**
3. Go to: **Deployments**
4. Click **Redeploy** on latest deployment
5. Wait for build to complete (green checkmark)

### Option 2: Manual Update

If you need to manually update:

1. Go to Vercel Dashboard
2. Click **Settings** → **Git**
3. Scroll to **Build & Development Settings**
4. Ensure `buildCommand` is: `npm run build`
5. Go to **Deployments** → **Redeploy**

---

## 🔍 Verify SPA Routing Works

### Test 1: Access Login Page
```bash
curl https://md-engineering-frontend.vercel.app/login
# Should return HTML (not 404)
```

Or:
1. Open browser
2. Go to: `https://md-engineering-frontend.vercel.app/login`
3. Should see login form (not error)

### Test 2: Check Vercel Configuration
```bash
curl -I https://md-engineering-frontend.vercel.app/nonexistent-page
# Should return 200 (rewrites to index.html)
```

### Test 3: Access Protected Routes
After login, try:
- `https://md-engineering-frontend.vercel.app/dashboard`
- `https://md-engineering-frontend.vercel.app/employees`
- `https://md-engineering-frontend.vercel.app/attendance`

Should all load (will redirect to login if not authenticated)

---

## 🎯 Complete Setup Flow

### Step 1: Backend (Railway) ✅
- [x] Express app configured
- [x] PORT and DATABASE_URL set
- [x] CORS enabled
- [x] Health check working
- [x] Admin user seeded

### Step 2: Frontend Config (GitHub) ✅
- [x] `vercel.json` has rewrites
- [x] `Apis.js` has fallback logic
- [x] `.env.production` created
- [x] Environment variables configured

### Step 3: Vercel Deployment ⏳
- [ ] Environment variables added
- [ ] Project redeployed
- [ ] Build successful (green checkmark)
- [ ] Login page accessible
- [ ] API calls reach Railway

---

## 📊 Route Handling

### Routes Configured in RoutesConfig.jsx

```javascript
/login              // Public route - anyone can access
/dashboard          // Protected route - requires login
/users              // Protected route
/chemicals          // Protected route
/stock              // Protected route
/employees          // Protected route
/attendance         // Protected route
/salary             // Protected route
/loans              // Protected route
/expenses           // Protected route
*                   // Catch-all - redirects to /login
```

### How React Router Works (After SPA Config)

```
1. User requests: /login
                    ↓
2. Vercel rewrites to: /index.html
                    ↓
3. React app loads (from index.html)
                    ↓
4. React Router matches: /login route
                    ↓
5. Displays: Login component ✅
```

---

## 🐛 Troubleshooting

### Still Getting 404 on Routes?

**Check 1: Vercel Configuration**
```bash
# Visit Vercel dashboard
Settings → Git → Build & Development Settings
Ensure buildCommand: npm run build
```

**Check 2: vercel.json Exists**
```bash
# In your project root
ls -la vercel.json
# Should show the file exists
```

**Check 3: Push to GitHub**
```bash
git add vercel.json
git commit -m "Configure SPA routing for Vercel"
git push
```

**Check 4: Redeploy**
```bash
Vercel Dashboard → Deployments → Redeploy latest
Wait for green checkmark
```

**Check 5: Clear Cache**
```bash
Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
Or: Open DevTools → Settings → Uncheck "Disable cache"
```

---

## 📝 Files Modified

### ✅ vercel.json
Added rewrites configuration to handle SPA routing:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### ✅ src/services/Apis.js
Added fallback logic for environment variable:
```javascript
let BASE = import.meta.env.VITE_API_BASE_URL;
if (!BASE || BASE === 'undefined') {
  BASE = 'https://m-and-d-engineering-production.up.railway.app/api';
}
```

### ✅ src/RoutesConfig.jsx
Already properly configured with React Router routes

---

## ✅ Expected Results

### Before Fix ❌
```
GET https://md-engineering-frontend.vercel.app/login
404 Not Found
```

### After Fix ✅
```
GET https://md-engineering-frontend.vercel.app/login
200 OK
Returns: HTML with login form
```

---

## 🎉 Ready to Deploy!

1. Push `vercel.json` to GitHub (already done if you pulled latest)
2. Go to Vercel Dashboard
3. Redeploy your project
4. Test routes
5. Add environment variables (from QUICK_FIX guide)
6. Redeploy again
7. Test login flow

**Your app should now work perfectly!** 🚀
