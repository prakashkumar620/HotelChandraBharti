import { useState, useRef } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!email) {
        setError("Please enter your email");
        return;
      }

      if (!captchaToken) {
        setError("Please complete the CAPTCHA verification");
        return;
      }

      setLoading(true);
      await API.post("/auth/forgot-password", { email, captchaToken });
      alert("OTP sent to your Gmail! Now enter the OTP to reset your password.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError("");
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={submit} className="max-w-sm w-full space-y-4 bg-black/70 border border-yellow-500/40 p-6 rounded">
        <h1 className="text-xl font-bold text-center text-yellow-400">Forgot Password</h1>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded">{error}</div>}

        <input
          type="email"
          placeholder="Enter your Gmail"
          value={email}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

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
            <div className="w-full bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-center text-sm">
              CAPTCHA is not properly configured. Please contact support.
            </div>
          )}
        </div>

        <button 
          disabled={loading || !captchaToken} 
          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black p-2 w-full rounded font-semibold"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
