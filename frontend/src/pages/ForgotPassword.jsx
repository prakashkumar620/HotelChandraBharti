import { useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      alert("OTP sent to your Gmail! Now enter the OTP to reset your password.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={submit} className="max-w-sm w-full space-y-4 bg-black/70 border border-yellow-500/40 p-6 rounded">
        <h1 className="text-xl font-bold text-center text-yellow-400">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your Gmail"
          value={email}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black p-2 w-full rounded">
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
