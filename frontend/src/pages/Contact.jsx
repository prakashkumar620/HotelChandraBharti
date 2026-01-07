import { useState } from "react";
import { API } from "../utils/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/contact", { ...form });
      alert("Message sent!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      // captcha removed for contact form
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">Contact Us</h1>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-3 bg-black/70 border border-yellow-500/40 p-4 rounded">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={form.phone}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          className="border border-yellow-700 bg-black/60 text-white p-2 w-full rounded h-24"
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        {/* CAPTCHA removed for contact form (not required for normal users) */}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white w-full p-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
