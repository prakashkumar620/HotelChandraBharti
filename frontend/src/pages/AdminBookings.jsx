import { useEffect, useState, useContext } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { AuthContext } from "../context/AuthContext";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { adminToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    loadBookings();
  }, [adminToken, navigate]);

  const loadBookings = async () => {
    try {
      const res = await API.get("/admin/bookings", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(
        `/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Delete this booking?")) {
      try {
        await API.delete(`/admin/bookings/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-600/20 text-green-400 border-green-600/50";
      case "pending":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/50";
      case "rejected":
        return "bg-red-600/20 text-red-400 border-red-600/50";
      case "cancelled":
        return "bg-gray-600/20 text-gray-400 border-gray-600/50";
      default:
        return "bg-blue-600/20 text-blue-400 border-blue-600/50";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "table":
        return "🍽️";
      case "hall":
        return "🏛️";
      case "room":
        return "🛏️";
      default:
        return "📅";
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const typeMatch = filterType === "all" || b.bookingType === filterType;
    const statusMatch = filterStatus === "all" || b.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">📅 Bookings Management</h1>
          <p className="text-gray-400">Manage all table and hall bookings</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 bg-black/70 border border-yellow-500/40 rounded text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Types</option>
              <option value="table">🍽️ Table</option>
              <option value="hall">🏛️ Hall</option>
              <option value="room">🛏️ Room</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-black/70 border border-yellow-500/40 rounded text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="rejected">❌ Rejected</option>
              <option value="cancelled">🚫 Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center text-gray-400 bg-black/70 border border-yellow-500/40 rounded-lg py-12">
            No bookings found.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Summary */}
            <div className="bg-black/70 border border-yellow-500/40 rounded-lg p-4 mb-4">
              <p className="text-gray-300">
                Showing <span className="text-yellow-400 font-bold">{filteredBookings.length}</span> out of <span className="text-yellow-400 font-bold">{bookings.length}</span> bookings
              </p>
            </div>

            {/* Booking Cards */}
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-black/70 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-400/60 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side - Booking Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{getTypeIcon(booking.bookingType)}</span>
                      <div>
                        <p className="text-sm text-gray-400 uppercase">Booking Type</p>
                        <p className="text-xl font-bold text-yellow-400 capitalize">{booking.bookingType}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Guest Name</p>
                        <p className="text-white font-semibold">{booking.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-gray-300 break-all">{booking.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="text-gray-300">{booking.contact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Booking Info & Actions */}
                  <div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Date & Time</p>
                        <p className="text-white font-semibold">
                          {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Guests</p>
                        <p className="text-white font-semibold">👥 {booking.guests} people</p>
                      </div>
                      {booking.specialRequests && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Special Requests</p>
                          <p className="text-gray-300 text-sm">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking._id, e.target.value)}
                          className={`flex-1 px-3 py-2 rounded text-sm font-semibold border transition ${getStatusColor(booking.status)}`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="rejected">❌ Rejected</option>
                          <option value="cancelled">🚫 Cancelled</option>
                        </select>
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="px-3 py-2 rounded text-sm font-semibold bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 transition"
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Booked on: {formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
