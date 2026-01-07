import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/api";

const RESTAURANT_WHATSAPP = "919939328151"; // replace with your number

export default function TableBooking() {
  const { items, total } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [bookingType, setBookingType] = useState("table"); // table or hall
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    guests: "",
    date: "",
    time: "",
    purpose: "", // for hall booking
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.mobile || !form.guests || !form.date) {
      setMessage("Please fill in all required fields");
      return;
    }

    if (bookingType === "hall" && !form.purpose) {
      setMessage("Please enter the purpose of booking");
      return;
    }

    setLoading(true);

    try {
      // Send to backend
      const bookingData = {
        userId: user?._id,
        name: form.name,
        email: form.email,
        phone: form.mobile,
        bookingType: bookingType,
        guests: parseInt(form.guests),
        bookingDate: form.date,
        bookingTime: form.time,
        specialRequests: bookingType === "hall" ? `Purpose: ${form.purpose}\n${form.note}` : form.note
      };

      await API.post("/bookings", bookingData);
      setMessage("✅ Booking request sent successfully!");

      // Also send WhatsApp message
      const orderLines =
        items.length === 0
          ? "No items selected"
          : items
              .map(
                (it, idx) =>
                  `${idx + 1}) ${it.name} x ${it.qty} = ₹${it.price * it.qty}`
              )
              .join("\n");

      const msg = `
${bookingType.toUpperCase()} BOOKING REQUEST

Name: ${form.name}
Email: ${form.email}
Mobile: ${form.mobile}
Guests: ${form.guests}
Date: ${form.date}
Time: ${form.time}
${bookingType === "hall" ? `Purpose: ${form.purpose}` : ""}

Order:
${orderLines}

Total: ₹${total}

Extra Note:
${form.note || "None"}
      `.trim();

      const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");

      // Reset form
      setForm({
        name: "",
        email: "",
        mobile: "",
        guests: "",
        date: "",
        time: "",
        purpose: "",
        note: ""
      });
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data?.error || "Failed to send booking"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-yellow-400">📅 Booking</h1>
        <p className="text-gray-400 mb-8">Reserve your table or hall with us</p>

        {/* Booking Type Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setBookingType("table")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
              bookingType === "table"
                ? "bg-yellow-500 text-black border-2 border-yellow-600"
                : "bg-black/70 text-gray-300 border-2 border-yellow-500/40 hover:border-yellow-500/60"
            }`}
          >
            🍽️ Table Booking
          </button>
          <button
            onClick={() => setBookingType("hall")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
              bookingType === "hall"
                ? "bg-yellow-500 text-black border-2 border-yellow-600"
                : "bg-black/70 text-gray-300 border-2 border-yellow-500/40 hover:border-yellow-500/60"
            }`}
          >
            🏛️ Hall Booking
          </button>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-black/70 border border-yellow-500/40 p-8 rounded-lg">
          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              message.includes("✅") ? "bg-green-600/20 text-green-400 border border-green-600/50" : "bg-red-600/20 text-red-400 border border-red-600/50"
            }`}>
              {message}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">📝 Full Name *</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              required
              className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">📧 Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              required
              className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">📱 Mobile Number *</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              required
              className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">👥 Number of Guests *</label>
            <input
              type="number"
              placeholder="How many people?"
              value={form.guests}
              required
              min="1"
              className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">📅 Date *</label>
              <input
                type="date"
                value={form.date}
                required
                className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-2">🕐 Time</label>
              <input
                type="time"
                value={form.time}
                className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          {/* Purpose (Hall Only) */}
          {bookingType === "hall" && (
            <div>
              <label className="block text-gray-300 font-semibold mb-2">🎯 Purpose of Booking *</label>
              <select
                value={form.purpose}
                required
                className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400"
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              >
                <option value="">Select purpose...</option>
                <option value="Wedding">💒 Wedding</option>
                <option value="Birthday Party">🎂 Birthday Party</option>
                <option value="Corporate Event">💼 Corporate Event</option>
                <option value="Conference">🎤 Conference</option>
                <option value="Seminar">📚 Seminar</option>
                <option value="Family Gathering">👨‍👩‍👧‍👦 Family Gathering</option>
                <option value="Other">📌 Other</option>
              </select>
            </div>
          )}

          {/* Special Request / Note */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">
              {bookingType === "hall" ? "📝 Additional Details" : "📝 Special Request"}
            </label>
            <textarea
              placeholder={bookingType === "hall" ? "Any special arrangements or decorations needed?" : "Any dietary restrictions or special requests?"}
              value={form.note}
              className="w-full border border-yellow-700 bg-black/60 text-white p-3 rounded focus:outline-none focus:border-yellow-400 h-24"
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/40 p-4 rounded-lg">
              <p className="text-yellow-400 font-bold mb-2">🛒 Your Order:</p>
              {items.map((item) => (
                <p key={item._id} className="text-gray-300 text-sm">
                  {item.name} x {item.qty} = ₹{item.price * item.qty}
                </p>
              ))}
              <p className="text-yellow-400 font-bold mt-2">Total: ₹{total}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Processing..." : `${bookingType === "hall" ? "📩 Send Hall Booking" : "📩 Send Table Booking"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
