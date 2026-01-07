import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function AdminLogin() {
  const { adminLogin, loading, adminToken, admin } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (adminToken && admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [adminToken, admin, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await adminLogin(form.email, form.password, captchaToken);
      // Ensure we have the admin data before navigating
      if (result && result.admin && result.token) {
        // Small delay to ensure state updates propagate
          setTimeout(() => {
            navigate("/admin/dashboard", { replace: true });
          }, 100);
      } else {
        setError("Login failed: Missing admin data");
      }
    } catch (err) {
      setError(err.error || "Login failed");
    }
  };

    const handleCaptchaChange = (token) => {
      setCaptchaToken(token);
      setError("");
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <form onSubmit={submit} className="max-w-sm w-full space-y-4 bg-black/70 border border-yellow-500/40 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-yellow-400 mb-6">Admin Login</h1>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
        <input
          type="email"
          placeholder="Admin Email"
          value={form.email}
          required
          className="border border-yellow-700 bg-black/60 text-white p-3 w-full rounded focus:outline-none focus:border-yellow-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            required
            className="border border-yellow-700 bg-black/60 text-white p-3 w-full rounded focus:outline-none focus:border-yellow-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              onError={() => setError("Failed to load CAPTCHA. Please refresh.")}
            />
          ) : (
            <div className="text-sm text-red-400">CAPTCHA site key missing</div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !captchaToken}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold w-full p-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
