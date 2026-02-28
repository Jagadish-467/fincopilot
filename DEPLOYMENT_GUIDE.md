# FinCopilot Deployment Guide

Complete step-by-step guide to deploy both backend (Render) and frontend (Vercel).

## **STEP 2: DEPLOY BACKEND TO RENDER**

### Prerequisites
- GitHub repository set up (✅ Done)
- Render account: [render.com](https://render.com)
- Google Generative AI API key
- Supabase credentials

---

### **2.1: Create Render Account**

1. Go to [render.com](https://render.com)
2. Click **"Sign up"** → Sign up with GitHub (recommended)
3. Authorize GitHub access
4. Click **"Create"** to confirm

---

### **2.2: Deploy Backend Service**

#### **Step A: Create Web Service**

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Select your `fincopilot` repository
3. **Configure the service:**

   | Field | Value |
   |-------|-------|
   | **Name** | `fincopilot-backend` |
   | **Environment** | `Python 3.11` |
   | **Build Command** | `pip install -r backend/requirements.txt` |
   | **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Plan** | `Free` |
   | **Region** | `Oregon` (or closest to you) |

4. Click **"Create Web Service"** and wait for deployment (5-15 minutes)

   You'll see:
   ```
   Build started...
   Installing dependencies...
   Deploying...
   ✅ Your service is live!
   ```

---

#### **Step B: Add Environment Variables**

Once deployed:

1. In the web service dashboard, go to **"Environment"** tab
2. Add these variables:

   ```
   GOOGLE_GENAI_API_KEY =  [Your Google API Key]
   SUPABASE_URL = https://xxdptjcieiqlixscgzeg.supabase.co
   SUPABASE_KEY = [Your Supabase anon key]
   ```

3. Click **"Save"** (automatic re-deployment happens)

---

#### **Step C: Get Your Backend URL**

1. In the web service, look for the **"Onboard"** section
2. Copy your service URL (e.g., `https://fincopilot-backend.onrender.com`)
3. **Save this URL** - you'll need it for the frontend

---

### **2.3: Verify Backend is Running**

Test your backend:

```bash
# In browser or terminal:
curl https://fincopilot-backend.onrender.com/health

# Should return:
# {"status":"ok"}
```

---

## **STEP 3: DEPLOY FRONTEND TO VERCEL**

### Prerequisites
- Vercel account: [vercel.com](https://vercel.com)
- Backend URL from Step 2.3

---

### **3.1: Create Vercel Account**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize GitHub
4. Welcome! You're ready to deploy

---

### **3.2: Deploy Frontend**

#### **Step A: Import Project**

1. In Vercel Dashboard, click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select `Jagadish-467/fincopilot`
4. Click **"Import"**

---

#### **Step B: Configure Project**

1. **Framework Preset:** Select **"Vite"**
2. **Root Directory:**
   - Click **"Edit"** next to Root
   - Set to: `frontend`
   - Click **"Continue"**

3. **Environment Variables:**
   Add these variables:

   ```
   VITE_SUPABASE_PROJECT_ID = xxdptjcieiqlixscgzeg
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_SUPABASE_URL = https://xxdptjcieiqlixscgzeg.supabase.co
   VITE_GOOGLE_CLIENT_ID = 223319533605-c3g7mcglrbm2slcmosmmo4l5q7bitabc.apps.googleusercontent.com
   VITE_API_URL = https://fincopilot-backend.onrender.com
   ```

4. Click **"Deploy"** and wait (2-5 minutes)

   You'll see:
   ```
   Building...
   Deployment successful! 🎉
   ```

---

#### **Step C: Get Your Frontend URL**

1. After deployment, you'll see your Vercel URL
   - Example: `https://fincopilot.vercel.app`
2. **Save this URL** - you'll need it for Google OAuth

---

### **3.3: Verify Frontend is Running**

1. Open your Vercel URL in browser
2. You should see the FinCopilot landing page
3. Try clicking a button - check browser console for any errors

---

## **STEP 4: CONFIGURE GOOGLE OAUTH**

### Prerequisites
- Frontend URL from Step 3.3
- Google Cloud Console access

---

### **4.1: Update Authorized Origins**

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project (should be visible in console)
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID** (`223319533605-...`)
5. Under **"Authorized JavaScript origins"**, add:
   ```
   https://your-vercel-url.vercel.app
   ```
6. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-vercel-url.vercel.app
   https://your-vercel-url.vercel.app/auth
   ```
7. Click **"Save"**

---

### **4.2: Test Google Login**

1. Go to `https://your-vercel-url.vercel.app`
2. Click **"Sign in with Google"**
3. You should see Google OAuth popup
4. If it works, ✅ OAuth is configured!

---

## **STEP 5: TEST ALL FEATURES**

### Test Checklist

#### **Authentication**
- [ ] Google OAuth login works
- [ ] Email/password signup works
- [ ] Can see after-login dashboard

#### **Dashboard**
- [ ] Dashboard page loads
- [ ] User info displays

#### **Budget Feature**
- [ ] Navigate to Budget page
- [ ] Budget calculations work

#### **EMI Calculator**
- [ ] Navigate to EMI page
- [ ] Loan calculations work
- [ ] Schemes display correctly

#### **Backend API**
- [ ] Check Network tab in browser
- [ ] API calls go to `fincopilot-backend.onrender.com`
- [ ] No CORS errors

---

## **PRODUCTION URLS SUMMARY**

```
Frontend:  https://your-vercel-url.vercel.app
Backend:   https://fincopilot-backend.onrender.com
Database:  Supabase (xxdptjcieiqlixscgzeg)
```

---

## **TROUBLESHOOTING**

### "Google OAuth redirect URI mismatch"
→ Update authorized origins in Google Cloud Console to match your Vercel URL

### "Backend not responding"
→ Check Render logs: Dashboard → fincopilot-backend → Logs
→ Verify environment variables are set correctly

### "CORS error in browser"
→ Update backend CORS origins (in `backend/main.py`)
→ Redeploy backend to Render

### "Supabase connection failed"
→ Verify SUPABASE_URL and SUPABASE_KEY are correct
→ Check Supabase project is not paused

### "Frontend shows blank page"
→ Check browser console for errors
→ Verify VITE_API_URL points to correct backend URL
→ Check Vercel build logs for errors

---

## **NEXT STEPS**

✅ Backend deployed to Render
✅ Frontend deployed to Vercel
✅ Google OAuth configured
✅ All features tested

**You're live!** 🚀

---

## **CONTINUOUS DEPLOYMENT**

Any push to `main` branch will auto-redeploy:
- **Backend:** Render auto-redeploys on git push
- **Frontend:** Vercel auto-redeploys on git push

```bash
# Deploy changes automatically
git add .
git commit -m "Your message"
git push origin main

# Changes live in 2-5 minutes!
```
