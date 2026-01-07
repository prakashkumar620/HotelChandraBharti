// ============================================
// FRONTEND PAGES - COMPLETE IMPLEMENTATION
// ============================================

// ========== Login.jsx ==========
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">User Login</h1>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-500"
        />
        <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        <Link to="/forgot-password" className="text-yellow-400">Forgot Password?</Link> | 
        <Link to="/signup" className="text-yellow-400"> Sign Up</Link>
      </p>
    </div>
  );
}

// ========== ForgotPassword.jsx ==========
// Send OTP to email
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage("OTP sent to your email!");
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      setMessage(err.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-300 text-sm">Enter your email to receive OTP</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white"
        />
        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded">
          {loading ? "Sending..." : "Send OTP"}
        </button>
        {message && <p className="text-yellow-300 text-center">{message}</p>}
      </form>
    </div>
  );
};

// ========== ResetPassword.jsx ==========
// Verify OTP and set new password
const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword, formData.confirmPassword);
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setError(err.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black/70 border border-yellow-500/40 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Reset Password</h1>
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white" />
        <input type="text" placeholder="OTP" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white" />
        <input type="password" placeholder="New Password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white" />
        <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white" />
        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export { ForgotPassword, ResetPassword };
