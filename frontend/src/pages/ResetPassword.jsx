import { useState, useEffect } from "react";
import { API } from "../utils/api";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setForm({ ...form, email: location.state.email });
    }
  }, [location.state]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!form.email || !form.otp || !form.newPassword || !form.confirmPassword) {
        alert("Please fill in all fields");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      setLoading(true);
      await API.post("/auth/reset-password", form);
      alert("Password Reset! Login again.");
      setForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={submit} className="max-w-sm w-full space-y-4 bg-black/70 border border-yellow-500/40 p-6 rounded">
        <h1 className="text-xl font-bold text-center text-yellow-400">Reset Password</h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="OTP"
          value={form.otp}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button disabled={loading} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white p-2 w-full rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
