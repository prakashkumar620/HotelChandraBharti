import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login, googleLogin, token, user, adminToken, admin } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (adminToken && admin) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (token && user) {
      navigate("/", { replace: true });
    }
  }, [token, user, adminToken, admin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!captchaToken) {
        setError("Please complete the CAPTCHA verification");
        setLoading(false);
        return;
      }

      // Store token and immediately clear it to prevent reuse
      const token = captchaToken;
      setCaptchaToken("");

      const resp = await login(formData.email, formData.password, token);
      // If admin login succeeded, backend returns `admin` in response
      if (resp && resp.admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.error || err.message || "Login failed");
      // Reset CAPTCHA on error so user can try again
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const resp = await googleLogin(credentialResponse.credential);
      if (resp && resp.admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.error || err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (token) => {
    // Called when user completes CAPTCHA - token will be the verification token
    setCaptchaToken(token);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Login to Your Account</h1>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400 transition"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4a6 6 0 016 6v.001l.717.717a1 1 0 01-1.414 1.414L14.41 11.41A4 4 0 1010 4zm0-2C4.477 2 1 5.477 1 10s3.477 8 9 8 9-3.477 9-9S15.523 2 10 2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex justify-center">
          {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="dark"
              onChange={handleCaptchaChange}
              onError={() => {
                setError("CAPTCHA verification failed. Please try again.");
                setCaptchaToken("");
              }}
            />
          ) : (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-center">
              CAPTCHA is not properly configured. Please contact support.
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>
      <div className="space-y-2 mt-4 text-center text-sm">
        <p className="text-gray-400">
          <Link to="/forgot-password" className="text-yellow-400 hover:text-yellow-300">Forgot Password?</Link>
        </p>
        <p className="text-gray-400">
          New user? <Link to="/signup" className="text-yellow-400 hover:text-yellow-300">Sign up here</Link>
        </p>
      </div>

      {/* Divider */}
      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Google Login Button */}
          <div className="mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed. Please try again.")}
              theme="dark"
            />
          </div>
        </>
      )}
    </div>
  );
}
