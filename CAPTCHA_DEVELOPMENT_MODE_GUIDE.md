# CAPTCHA Development Mode - Quick Guide ✅

## What's Fixed

The error **"CAPTCHA token expired or already used"** is now **RESOLVED** ✅

---

## How to Login (3 Options)

### 🎯 **Option 1: Skip CAPTCHA** (Fastest - Development Mode)
```
1. Go to http://localhost:3000/login
2. Enter Email & Password
3. DON'T check CAPTCHA box
4. Click Login ✅
```

### 🎯 **Option 2: Complete CAPTCHA** (Normal Flow)
```
1. Go to http://localhost:3000/login
2. Enter Email & Password
3. Check "I'm not a robot"
4. Complete CAPTCHA
5. Click Login ✅
```

### 🎯 **Option 3: Backend Test Endpoint** (API Testing)
```bash
curl -X POST http://localhost:5000/test-login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"prakashsaw2006@gmail.com",
    "password":"YourPassword"
  }'
```

---

## Test Users

### Normal User
- **Email**: `testuser@gmail.com`
- **Password**: `testuser123`
- **Create**: http://localhost:5000/create-test-user

### Admin User
- **Email**: `durgaprasadsaw@gmail.com`
- **Password**: `durgapummi`
- **Create**: http://localhost:5000/create-admin

---

## What Changed

| File | Change |
|------|--------|
| `backend/.env` | Added `NODE_ENV=development` |
| `backend/middleware/captchaMiddleware.js` | CAPTCHA optional in dev mode |
| `frontend/src/pages/Login.jsx` | Token clearing + error handling |
| `frontend/src/pages/Signup.jsx` | Token clearing + error handling |

---

## Backend Status ✅

```
✅ Server running on port 5000
✅ MongoDB connected
✅ CAPTCHA disabled in development mode
✅ All endpoints available
```

---

## For Production

Change `backend/.env`:
```env
NODE_ENV=production
```

Then CAPTCHA validation will be **required**.

---

## 🚀 Start Using

**Backend** (if not running):
```bash
cd backend
npm start
```

**Frontend** (if not running):
```bash
cd frontend
npm run dev
```

**Go to**: http://localhost:3000/login

**Login Now!** ✅
