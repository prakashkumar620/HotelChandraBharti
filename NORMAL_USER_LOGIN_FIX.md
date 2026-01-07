# Normal User Login - Troubleshooting & Fixes

## 🔧 Fixes Applied

### 1. ✅ Error Handling in AuthContext.login() 
**File:** `frontend/src/context/AuthContext.jsx`
- Simplified the login fallback logic to be clearer
- Admin login failure → tries user login automatically
- User login error is properly caught and shown to user
- Removed double error wrapping that could cause issues

**How it works now:**
1. Try admin login → if succeeds, user is logged in as admin ✓
2. If admin login fails (401), continue without throwing
3. Try user login → if succeeds, user is logged in as user ✓
4. If user login fails, throw the user error message

### 2. ✅ JWT Token Role Field
**Files:** 
- `backend/controllers/authController.js` - User login
- `backend/controllers/adminController.js` - Admin login

- Added `role: "user"` to user JWT tokens
- Added `role: admin.role` to admin JWT tokens (was missing)
- User login response now includes `role: "user"`

### 3. ✅ Test User Creation Endpoint
**File:** `backend/server.js`
- Added `/create-test-user` endpoint to easily create test users
- No CAPTCHA required (direct endpoint)
- Creates user: email: `testuser@gmail.com`, password: `testuser123`

---

## 🧪 Testing Steps

### Step 1: Create Test Data
Visit these URLs in your browser:

```
http://localhost:5000/create-admin     (creates default admin if not exists)
http://localhost:5000/create-test-user (creates test user)
```

You should see responses like:
```json
{
  "message": "Default admin created successfully",
  "admin": { "id": "...", "name": "Hotel Admin", "email": "durgaprasadsaw@gmail.com", "role": "owner" }
}
```

and

```json
{
  "message": "Test user created successfully",
  "user": { "id": "...", "name": "Test User", "email": "testuser@gmail.com" },
  "credentials": { "email": "testuser@gmail.com", "password": "testuser123" }
}
```

### Step 2: Test Admin Login
Go to http://localhost:3000/admin/login

**Credentials:**
- Email: `durgaprasadsaw@gmail.com`
- Password: `durgapummi`

Should redirect to Admin Dashboard after successful login

### Step 3: Test Normal User Login
Go to http://localhost:3000/login

**Test Credentials (Option 1 - Created via test endpoint):**
- Email: `testuser@gmail.com`
- Password: `testuser123`

**Test Credentials (Option 2 - Create via signup first):**
1. Go to /signup
2. Fill form:
   - Name: `John Doe`
   - Email: `john@gmail.com`
   - Phone: `9876543210`
   - Password: `password123`
   - Confirm: `password123`
3. CAPTCHA must be completed (requires proper .env configuration)
4. Click signup → should redirect to /login
5. Login with above credentials

---

## 🐛 If Login Still Fails

### Check 1: CAPTCHA Configuration
**Error:** "CAPTCHA is not properly configured"

**Solution:**
1. Check `.env` file in backend folder:
```env
RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

2. Get keys from: https://www.google.com/recaptcha/admin

3. Or for testing, use the test endpoint which bypasses CAPTCHA:
```
http://localhost:5000/create-test-user
```

### Check 2: Database Connection
**Error:** "Cannot read property 'findOne' of undefined" or timeout

**Solution:**
1. Ensure MongoDB is running
2. Check `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/hotel_chandra_bharti
```

3. Or use MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_chandra_bharti
```

### Check 3: Backend Not Running
**Error:** "Cannot reach server" or network error

**Solution:**
1. Terminal 1 (Backend):
```bash
cd backend
npm start
```

2. Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

3. Check server is running:
```
http://localhost:5000/health
```

Should respond: `{"message":"Server is running"}`

### Check 4: CORS Issues
**Error:** Request blocked in browser console

**Solution:**
Backend already has CORS enabled in `server.js`. If still having issues:
1. Check backend is on port 5000
2. Check frontend is on port 3000 (or update API_BASE_URL in frontend)
3. Check CORS error message in console

### Check 5: Verify User Exists in Database
Use MongoDB Compass or mongo shell:

```javascript
use hotel_chandra_bharti
db.users.find()
```

Should show users created via signup or `/create-test-user`

---

## 📊 Login Flow Diagram

```
User enters email & password + CAPTCHA token
                    ↓
            Try admin login
                    ↓
         ┌─────────────────┐
         │ Admin found?    │
         └─────────────────┘
                 │
        ┌────────┴────────┐
        │ No              │ Yes
        ↓                 ↓
    Try user login    Check password
        │                 │
        │         ┌───────┴────────┐
        │         │ Match?         │
        │         └───────┬────────┘
        │                 │ No
        │                 ↓
        │         Return 401 error
        │         (fall back to user)
        │
    Try user login
        │
    ┌───┴────────┐
    │ User found?│
    └───┬────────┘
        │
    ┌───┴──────┐
    │ No       │ Yes
    ↓          ↓
404 err    Check password
└──────┐       │
       │   ┌───┴────┐
       │   │Match?  │
       │   └───┬────┘
       │       │ No
       │       ↓
       │   Return 401 error
       │
    Return error to frontend
        │
    Show error message
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000  
- [ ] MongoDB connected and running
- [ ] Test admin created via `/create-admin`
- [ ] Test user created via `/create-test-user`
- [ ] Admin login works (durgaprasadsaw@gmail.com / durgapummi)
- [ ] User login works (testuser@gmail.com / testuser123)
- [ ] Signup form works (for manual user creation)
- [ ] CAPTCHA displays on login/signup pages
- [ ] Password visibility toggle works
- [ ] Error messages display properly

---

## 🔍 Debugging with Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try login and watch for logs:

```javascript
// Should see in console:
"Admin login failed, attempting user login..." 
"User login successful"

// Or:
"User login failed:"
// Followed by error message
```

4. Go to Network tab
5. Look for `/auth/login` request
6. Check response status and data

Expected response (201):
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "testuser@gmail.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

---

## 🆘 Still Having Issues?

1. **Check server.js startup logs** - Look for connection errors
2. **Check MongoDB logs** - Ensure database is accepting connections
3. **Check browser console** - Look for CORS or CAPTCHA errors
4. **Check network tab** - What status codes are being returned?
5. **Try test endpoints** - `/create-test-user` doesn't use CAPTCHA

---

## 📝 Summary of Changes

| File | Change |
|------|--------|
| `frontend/src/context/AuthContext.jsx` | Simplified login fallback logic, fixed error handling |
| `backend/controllers/authController.js` | Added `role: "user"` to JWT and response |
| `backend/controllers/adminController.js` | Added `role: admin.role` to JWT |
| `backend/server.js` | Added `/create-test-user` endpoint |
| `frontend/src/admin.jpeg` | Moved from public to src directory |

