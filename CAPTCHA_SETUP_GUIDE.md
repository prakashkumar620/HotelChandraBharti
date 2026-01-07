# CAPTCHA Implementation Setup Guide

## Overview
Google reCAPTCHA v2 has been integrated into your Hotel Chandra Bharti application for the following forms:
- **Login Page** - User authentication protection
- **Signup Page** - User registration protection  
- **Contact Page** - Contact form submission protection
- **Forgot Password** - Password recovery protection

## Getting Google reCAPTCHA Keys

### Step 1: Create a reCAPTCHA Project
1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account (create one if needed)
3. Click the **+** button to create a new site

### Step 2: Configure Your reCAPTCHA
1. **Label**: Enter "Hotel Chandra Bharti" or your project name
2. **reCAPTCHA Type**: Select "reCAPTCHA v2"
3. **reCAPTCHA v2 Type**: Choose "I'm not a robot" Checkbox
4. **Domains**: Add your domains:
   - `localhost` (for development)
   - `yourdomainname.com` (for production)
5. Click **Create**

### Step 3: Copy Your Keys
After creation, you'll see:
- **Site Key** - Used in frontend
- **Secret Key** - Used in backend

## Installation

### Backend Setup

1. **Install axios** (if not already installed):
   ```bash
   cd backend
   npm install axios
   ```

2. **Update your `.env` file**:
   ```env
   RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY_HERE
   VITE_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY_HERE
   ```
   Replace `YOUR_SECRET_KEY_HERE` with your Secret Key from Google reCAPTCHA
   Replace `YOUR_SITE_KEY_HERE` with your Site Key from Google reCAPTCHA

### Frontend Setup

1. **Install react-google-recaptcha**:
   ```bash
   cd frontend
   npm install react-google-recaptcha
   ```

2. **Create a `.env` file** in the frontend directory (if not exists):
   ```env
   VITE_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY_HERE
   ```

## How It Works

### Frontend Flow
1. User fills out a form (Login, Signup, Contact, etc.)
2. CAPTCHA widget appears in the form
3. User clicks "I'm not a robot" checkbox
4. Google reCAPTCHA validates the user
5. Upon successful validation, form is submitted with CAPTCHA token
6. CAPTCHA is reset after submission attempt

### Backend Flow
1. Backend receives form data with `captchaToken`
2. `captchaMiddleware` verifies the token with Google's servers
3. If valid (score > 0.5), request proceeds to the controller
4. If invalid, request is rejected with CAPTCHA error message

## Files Modified/Created

### Backend
- **New**: `middleware/captchaMiddleware.js` - CAPTCHA verification logic
- **Updated**: `routes/authRoutes.js` - Added CAPTCHA to signup, login, forgot-password
- **Updated**: `routes/contactRoutes.js` - Added CAPTCHA to contact submission
- **Updated**: `package.json` - Added axios dependency
- **Updated**: `.env` - Added CAPTCHA keys

### Frontend  
- **Updated**: `src/pages/Login.jsx` - Added ReCAPTCHA widget
- **Updated**: `src/pages/Signup.jsx` - Added ReCAPTCHA widget
- **Updated**: `src/pages/Contact.jsx` - Added ReCAPTCHA widget
- **Updated**: `src/context/AuthContext.jsx` - Updated login/signup to pass captchaToken
- **Updated**: `package.json` - Added react-google-recaptcha dependency

## Testing

### Local Testing
1. Start backend: `npm start` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Navigate to Login/Signup/Contact pages
4. You should see the CAPTCHA widget
5. Complete CAPTCHA and submit the form
6. Check backend logs for successful verification

### Common Issues

**"Cannot find VITE_RECAPTCHA_SITE_KEY"**
- Make sure `.env` or `.env.local` is in the frontend directory
- Restart the frontend dev server after updating `.env`
- Use `import.meta.env.VITE_RECAPTCHA_SITE_KEY` in code

**"CAPTCHA verification failed"**
- Check that RECAPTCHA_SECRET_KEY in backend `.env` is correct
- Verify the domain is added to your Google reCAPTCHA settings
- Ensure localhost is added for development

**CAPTCHA widget not showing**
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check browser console for JavaScript errors
- Verify the site key is correct in `.env`

## Optional: reCAPTCHA v3 (Advanced)

If you want to use invisible reCAPTCHA v3 instead:
1. Create a new reCAPTCHA v3 site in Google Console
2. Update the middleware to check `response.data.score` (0.0 to 1.0)
3. Only allow requests with score > 0.5 (adjustable)
4. No UI changes needed - it works in the background

## Security Notes

- **Never expose Secret Key** in frontend code
- Always verify CAPTCHA on the backend
- CAPTCHA protects against automated abuse, not hacking
- Keep your Google reCAPTCHA keys secure and rotate them periodically
- Monitor reCAPTCHA dashboard for suspicious activity

## Deployment

When deploying to production:
1. Add your production domain to Google reCAPTCHA settings
2. Update environment variables on your hosting platform
3. Test thoroughly on the live domain before going public
4. Monitor reCAPTCHA analytics for false positives/negatives

## Support

For issues:
- Check [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v2)
- Review middleware logs on backend
- Check browser console for frontend errors
- Verify all environment variables are set correctly
