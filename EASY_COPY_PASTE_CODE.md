# COPY-PASTE READY PAGE CODE

## Instructions
1. Copy each page code below
2. Paste into corresponding frontend/src/pages/[FileName].jsx
3. Replace existing file content

---

# ========== LOGIN.JSX ==========
# Copy this entire code to frontend/src/pages/Login.jsx

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.error || "Login failed");
    } finally {
      setLoading(false);
    }
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
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
    </div>
  );
}

---

# ========== FORGOTPASSWORD.JSX ==========
# Copy this entire code to frontend/src/pages/ForgotPassword.jsx

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage("OTP sent to your email! Check your inbox.");
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      setError(err.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Forgot Password</h1>
      <p className="text-gray-300 text-sm mb-4">Enter your email to receive an OTP</p>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-400 text-sm">
        <Link to="/login" className="text-yellow-400 hover:text-yellow-300">Back to Login</Link>
      </p>
    </div>
  );
}

---

# ========== RESETPASSWORD.JSX ==========
# Copy this entire code to frontend/src/pages/ResetPassword.jsx

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword, formData.confirmPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Reset Your Password</h1>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">{success}</div>}

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
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP from email"
          value={formData.otp}
          onChange={handleChange}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-400 text-sm">
        <Link to="/login" className="text-yellow-400 hover:text-yellow-300">Back to Login</Link>
      </p>
    </div>
  );
}

---

**Additional pages (Menu, Cart, Contact, etc.) are available in COMPLETE_PAGE_TEMPLATES.txt**

Copy these 3 pages first and test. Then continue with remaining pages.
