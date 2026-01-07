# 🧪 Quick Test Checklist

## ✅ Pre-Test Verification

- [x] Backend running on port 5000
- [x] MongoDB connected to Atlas
- [x] CAPTCHA bypass enabled (NODE_ENV=development)
- [x] Test endpoints available

---

## 🎯 Test Case 1: Skip CAPTCHA Login

**What**: Login without checking CAPTCHA box

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter email: `testuser@gmail.com`
3. [ ] Enter password: `testuser123`
4. [ ] **DON'T check "I'm not a robot"**
5. [ ] Click **Login** button
6. [ ] Should redirect to home page

**Expected Result**: ✅ Logged in successfully, no errors

**Backend Console Should Show**:
```
✓ CAPTCHA verification skipped (development mode)
✓ User login successful
```

---

## 🎯 Test Case 2: With CAPTCHA Completed

**What**: Login after completing CAPTCHA normally

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter email: `testuser@gmail.com`
3. [ ] Enter password: `testuser123`
4. [ ] Check "I'm not a robot"
5. [ ] Wait for CAPTCHA to load and complete
6. [ ] Click **Login** button
7. [ ] Should redirect to home page

**Expected Result**: ✅ Logged in successfully with real CAPTCHA token

**Backend Console Should Show**:
```
✓ CAPTCHA token verified
✓ User login successful
```

---

## 🎯 Test Case 3: Admin Login (No CAPTCHA)

**What**: Admin login without CAPTCHA

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter email: `durgaprasadsaw@gmail.com`
3. [ ] Enter password: `durgapummi`
4. [ ] Skip CAPTCHA
5. [ ] Click **Login** button
6. [ ] Should redirect to admin dashboard

**Expected Result**: ✅ Admin logged in, redirected to /admin/dashboard

**Backend Console Should Show**:
```
✓ Admin login successful for: durgaprasadsaw@gmail.com
```

---

## 🎯 Test Case 4: Wrong Password

**What**: Verify error handling for wrong credentials

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter email: `testuser@gmail.com`
3. [ ] Enter password: `wrongpassword`
4. [ ] Skip CAPTCHA
5. [ ] Click **Login** button
6. [ ] Should see error message

**Expected Result**: ❌ Error shown (not logged in)

**Error Message Should Show**:
```
Invalid credentials
```

---

## 🎯 Test Case 5: Non-existent User

**What**: Verify error for user not found

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter email: `nonexistent@gmail.com`
3. [ ] Enter password: `somepassword`
4. [ ] Skip CAPTCHA
5. [ ] Click **Login** button
6. [ ] Should see error message

**Expected Result**: ❌ Error shown (user not found)

**Error Message Should Show**:
```
Invalid credentials
```

---

## 🎯 Test Case 6: CAPTCHA Token Expiration Handling

**What**: Verify old/expired CAPTCHA tokens are handled

**Steps**:
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter credentials
3. [ ] Complete CAPTCHA
4. [ ] Wait 5+ minutes
5. [ ] Click **Login** button
6. [ ] Should either:
    - [ ] Login successfully (if within token lifetime), OR
    - [ ] Show error to retry CAPTCHA

**Expected Result**: ✅ Either succeeds or shows clear error (no "token expired" crash)

---

## 🎯 Test Case 7: Backend API Test

**What**: Test login endpoint directly

**Command**:
```bash
curl -X POST http://localhost:5000/test-login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@gmail.com","password":"testuser123"}'
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "testuser@gmail.com",
    "name": "Test User",
    "role": "user"
  }
}
```

**Expected Result**: ✅ Returns valid JWT token and user data

---

## 🎯 Test Case 8: Create Test User

**What**: Verify test user creation endpoint

**Steps**:
1. [ ] Visit http://localhost:5000/create-test-user
2. [ ] Should see success message or data

**Expected Result**: ✅ User created (or already exists)

**Backend Should Show**:
```
✓ Test user created/verified
```

---

## 📊 Results Summary

After running all tests, check:

| Test | Status | Notes |
|------|--------|-------|
| Skip CAPTCHA | [ ] Pass / [ ] Fail | |
| With CAPTCHA | [ ] Pass / [ ] Fail | |
| Admin Login | [ ] Pass / [ ] Fail | |
| Wrong Password | [ ] Pass / [ ] Fail | |
| User Not Found | [ ] Pass / [ ] Fail | |
| Expired Token | [ ] Pass / [ ] Fail | |
| API Test | [ ] Pass / [ ] Fail | |
| Create User | [ ] Pass / [ ] Fail | |

---

## 🚀 If All Tests Pass

✅ **Your application is working correctly!**

Next steps:
- [ ] Test with real frontend UI
- [ ] Test signup with CAPTCHA
- [ ] Test password reset
- [ ] Test admin operations
- [ ] Test user operations

---

## ❌ If Tests Fail

Check:
1. Is backend running? → `npm start` in backend folder
2. Is frontend running? → `npm run dev` in frontend folder
3. Is MongoDB connected? → Check backend console
4. Are credentials correct? → Check test users above
5. Check browser console for errors → F12 → Console tab
6. Check backend console for errors → Terminal output

---

**Status: Ready to test!** 🧪✅
