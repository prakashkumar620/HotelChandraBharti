# Google OAuth 2.0 Integration Guide

This document explains the Google OAuth authentication system that has been added to the Hotel Chandra Bharti application.

## Overview

The application now supports two authentication methods:
1. **Email/Password Authentication** (Traditional)
2. **Google OAuth Authentication** (New)

Users can only login/signup using the same method they originally used. This means:
- If a user signs up with email/password, they must login with email/password
- If a user signs up with Google, they must login with Google

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → Create OAuth 2.0 Client ID
5. Choose "Web Application"
6. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain
7. Add Authorized redirect URIs:
   - `http://localhost:5173/login` (for development)
   - `http://localhost:3000/login` (if using different port)
   - Your production domain login page
8. Copy the **Client ID** (you'll need it)

### 2. Configure Environment Variables

#### Backend (.env)
```
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env or .env.local)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### 3. Install Dependencies

The dependencies have already been installed:

**Backend:**
- `google-auth-library` - For verifying Google ID tokens

**Frontend:**
- `@react-oauth/google` - For Google login UI component

## How It Works

### Backend Flow

1. **Google Auth Endpoint** (`POST /auth/google-auth`)
   - Receives the Google ID token from frontend
   - Verifies the token with Google's servers
   - Checks if user exists in database
   - If exists: Validates authentication method matches
   - If new: Creates user with `authMethod: "google"`
   - Returns JWT token and user info

2. **User Model Updates**
   - Added `googleId` field (stores Google's unique ID)
   - Added `authMethod` field (enum: "email" or "google")
   - Made `password` and `phone` optional for Google users

3. **Validation Rules**
   - Users created with email cannot login with Google (error message returned)
   - Users created with Google cannot login with email/password (error message returned)

### Frontend Flow

1. **Signup Page**
   - Shows Google login button at top
   - Users can click to signup with Google immediately
   - Or use traditional email/password form below

2. **Login Page**
   - Shows Google login button at top
   - Users can click to login with Google immediately
   - Or use traditional email/password form below

3. **AuthContext**
   - `googleSignup()` - Handles Google signup
   - `googleLogin()` - Handles Google login
   - Both methods parse the Google token and call `/auth/google-auth` endpoint

## User Experience

### First-time Google User (Signup)
```
1. User clicks "Sign up with Google"
2. Google login popup appears
3. User authenticates with Google account
4. Account created automatically with name and email from Google
5. JWT token issued
6. User redirected to home page (logged in)
```

### Existing Email User Trying Google Login
```
1. User tries to login with Google
2. Email already exists in database
3. But authMethod is "email" not "google"
4. Error: "This email is registered with password login. Please use email/password to login."
```

### Existing Google User Trying Email Login
```
1. User tries to login with email/password
2. Email found in database
3. But authMethod is "google" not "email"
4. Error: "This account was created with Google. Please login with Google."
```

## Security Features

1. **Token Verification**
   - Google ID tokens are verified with Google's OAuth 2.0 servers
   - Invalid tokens are rejected

2. **Auth Method Isolation**
   - Users can only use the authentication method they signed up with
   - Prevents account takeover attempts

3. **JWT Tokens**
   - Server-side JWT tokens issued for all logins
   - Tokens expire in 7 days
   - Includes user ID, email, and role

4. **CAPTCHA on Email Login**
   - Google login bypasses CAPTCHA requirement
   - Email login still requires CAPTCHA verification

## Database Changes

### User Model Schema
```javascript
{
  name: String (required),
  email: String (unique, required),
  phone: String (optional),
  password: String (optional - only for email auth),
  googleId: String (optional - only for Google auth),
  authMethod: Enum ["email", "google"],
  resetOtp: Number,
  resetOtpExpires: Date,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Existing Users
- Existing users will have `authMethod: "email"` automatically

## API Endpoints

### Google Authentication Endpoint
**POST** `/auth/google-auth`

Request:
```json
{
  "idToken": "google_id_token_jwt_string",
  "name": "User Name",
  "email": "user@example.com"
}
```

Response (Success):
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": null,
    "authMethod": "google",
    "role": "user"
  }
}
```

Response (Error - Email exists with different auth method):
```json
{
  "error": "This email is registered with password login. Please use email/password to login."
}
```

## Troubleshooting

### "CAPTCHA is not properly configured"
- Check `VITE_RECAPTCHA_SITE_KEY` in frontend .env
- Google login doesn't need CAPTCHA, only email login does

### "Invalid Google token"
- Ensure `GOOGLE_CLIENT_ID` in backend .env is correct
- Token verification is failing - check Google Cloud credentials

### "This email is registered with password login"
- User tried to login with Google but account was created with email
- Guide user to use email/password login instead

### "This account was created with Google"
- User tried to login with email/password but account was created with Google
- Guide user to use Google login instead

## Testing

### Test Email/Password Signup
1. Go to `/signup`
2. Fill email, password, name, phone
3. Complete CAPTCHA
4. Click "Sign Up with Email"
5. Should redirect to `/login`

### Test Google Signup
1. Go to `/signup`
2. Click Google button
3. Complete Google authentication
4. Should redirect to home page (logged in)

### Test Email/Password Login
1. Go to `/login`
2. Enter email and password of email-based account
3. Complete CAPTCHA
4. Click "Login with Email"
5. Should redirect to home page

### Test Google Login
1. Go to `/login`
2. Click Google button
3. Complete Google authentication
4. Should redirect to home page

### Test Cross-Auth Prevention
1. Create account with email: `test@example.com`
2. Try to login with Google using same email
3. Should see error message

## Future Enhancements

- Add account linking (allow users to add Google to existing email account)
- Add logout on all devices
- Add session management
- Add two-factor authentication
- Support other OAuth providers (GitHub, Facebook, etc.)

## Support

For issues or questions about Google OAuth implementation, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Docs](https://github.com/react-oauth/react-oauth.github.io)
- [google-auth-library Docs](https://github.com/googleapis/google-auth-library-nodejs)
