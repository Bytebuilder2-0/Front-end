# Frontend Deployment Guide

## 🎯 Your Branch is Ready for Deployment!

Branch: `depl`
Repository: `Bytebuilder2-0/Front-end`

---

## 🚀 Deploy to Vercel (Recommended)

### Method 1: Vercel Dashboard (Easiest)

1. **Sign up/Login to Vercel**
   - Go to: https://vercel.com
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Select repository: `Bytebuilder2-0/Front-end`
   - **IMPORTANT**: Select branch `depl` (not main/dev)

3. **Configure Settings**
   ```
   Framework Preset: Vite (auto-detected)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable**
   - Variable Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.com/api`
   - Replace with your actual backend URL

5. **Click Deploy** ✅

---

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "c:\Users\vijay\OneDrive\Desktop\final evalutions\Front-end"
   vercel --prod
   ```

4. **Set Environment Variable**
   ```bash
   vercel env add VITE_API_BASE_URL
   ```
   Enter your backend URL when prompted

---

## 🌐 Alternative: Deploy to Netlify

1. **Sign up/Login to Netlify**
   - Go to: https://netlify.com
   - Sign in with GitHub

2. **Import from Git**
   - Click "Add new site" → "Import from Git"
   - Select `Bytebuilder2-0/Front-end`
   - Branch: `depl`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

5. **Deploy**

---

## 📋 What Has Been Configured

✅ All hardcoded localhost URLs replaced with environment variables
✅ Centralized API configuration in `src/config/api.js`
✅ Environment variable template created (`.env.example`)
✅ 40+ files updated for production readiness
✅ Git branch `depl` pushed to GitHub

---

## 🔧 Environment Variables Needed

**VITE_API_BASE_URL**
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.com/api`

*Note: Make sure your backend is deployed first and update this value*

---

## 🎨 After Deployment

Your app will be available at:
- Vercel: `https://your-app-name.vercel.app`
- Netlify: `https://your-app-name.netlify.app`

You can set up a custom domain in the platform settings.

---

## 🔒 Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Use `.env.example` as a template
- Set environment variables in your deployment platform
- Backend URL must support CORS for your frontend domain

---

## 🚨 Common Issues

**Issue 1: API calls failing**
- Check `VITE_API_BASE_URL` is set correctly in Vercel/Netlify
- Verify backend is running and accessible
- Check backend CORS settings allow your frontend domain

**Issue 2: Environment variable not working**
- Vite requires `VITE_` prefix for client-side variables
- Redeploy after adding environment variables
- Clear cache and hard refresh browser

**Issue 3: Build fails**
- Check Node.js version compatibility
- Run `npm install` locally and commit `package-lock.json`
- Check build logs for specific errors

---

## 📞 Need Help?

Repository: https://github.com/Bytebuilder2-0/Front-end/tree/depl

---

**Happy Deploying! 🎉**
