const axios = require("axios");

const verifyCaptcha = async (req, res, next) => {
  try {
    const token = req.body.captchaToken;
    const isDevelopment = process.env.NODE_ENV !== "production";

    // In development, SKIP CAPTCHA ENTIRELY - all tokens are accepted
    if (isDevelopment) {
      console.log("✓ CAPTCHA verification SKIPPED (development mode - NODE_ENV=" + process.env.NODE_ENV + ")");
      return next();
    }

    // Allow test token in any environment (for testing without completing real CAPTCHA)
    const testToken = "test-captcha-token-for-development";
    if (token === testToken) {
      console.log("✓ Using test CAPTCHA token");
      return next();
    }

    if (!token) {
      console.error("CAPTCHA verification failed: No token provided");
      return res.status(400).json({ error: "Please complete the CAPTCHA verification" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("CAPTCHA verification failed: Secret key not configured");
      // In development, allow requests even if secret key is missing
      if (isDevelopment) {
        console.log("⚠️  RECAPTCHA_SECRET_KEY not set - allowing request (development mode)");
        return next();
      }
      return res.status(500).json({ error: "CAPTCHA is not properly configured on server" });
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: secretKey,
          response: token
        }
      }
    );

    console.log("CAPTCHA response:", {
      success: response.data.success,
      score: response.data.score,
      action: response.data.action,
      errorCodes: response.data["error-codes"]
    });

    // For reCAPTCHA v2 (checkbox), success is the only requirement
    // For reCAPTCHA v3, we check the score
    if (response.data.success) {
      if (response.data.score && response.data.score < 0.5) {
        console.error("CAPTCHA verification failed: Score too low", response.data.score);
        return res.status(400).json({ error: "CAPTCHA verification failed - suspicious activity detected" });
      }
      // Token is valid, proceed to next middleware
      next();
    } else {
      console.error("CAPTCHA verification failed:", response.data);
      
      // Handle specific error codes
      const errorCodes = response.data["error-codes"] || [];
      if (errorCodes.includes("timeout-or-duplicate")) {
        return res.status(400).json({ error: "CAPTCHA token expired or already used. Please complete the CAPTCHA again." });
      }
      
      return res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
    }
  } catch (error) {
    console.error("CAPTCHA verification error:", error.message);
    // In development, bypass all CAPTCHA errors
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      console.log("⚠️  CAPTCHA verification error in development mode - allowing request");
      return next();
    }
    res.status(500).json({ error: "CAPTCHA verification error. Please try again." });
  }
};

module.exports = { verifyCaptcha };
