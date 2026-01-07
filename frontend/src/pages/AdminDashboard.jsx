import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const { admin, adminToken, isAdminLoggedIn } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (admin && adminToken) {
      fetchStats();
    }
  }, [admin, adminToken]);

  const StatCard = ({ icon, label, value, color = "yellow" }) => (
    <div className={`bg-gradient-to-br from-black/70 to-black/50 border border-${color}-500/40 rounded-lg p-6 hover:border-${color}-400/60 transition-all hover:shadow-lg hover:shadow-${color}-500/20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-semibold mb-1">{label}</p>
          <p className={`text-4xl font-bold text-${color}-400`}>{value || 0}</p>
        </div>
        <span className="text-5xl opacity-20">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AdminNavbar />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Welcome back, <span className="text-yellow-400">{admin?.name}</span>! 👋
          </h1>
          <p className="text-gray-400 text-lg">Hotel Management Dashboard</p>
          <p className="text-gray-500 text-sm mt-2">Role: <span className="text-yellow-400 font-semibold capitalize">{admin?.role}</span></p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading statistics...</div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
              <StatCard icon="📅" label="Total Bookings" value={stats.totalBookings} color="green" />
              <StatCard icon="📈" label="Today's Bookings" value={stats.todayBookings} color="orange" />
              <StatCard icon="💬" label="Messages" value={stats.totalMessages} color="purple" />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-black/70 to-black/50 border border-yellow-500/40 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/admin/menu"
                  className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 text-center transition group"
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition">🍽️</span>
                  <p className="text-yellow-400 font-semibold">Manage Menu</p>
                  <p className="text-xs text-gray-400">Add, edit, delete items</p>
                </Link>

                <Link
                  to="/admin/users"
                  className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 text-center transition group"
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition">👥</span>
                  <p className="text-blue-400 font-semibold">Manage Users</p>
                  <p className="text-xs text-gray-400">View & control users</p>
                </Link>

                <Link
                  to="/admin/bookings"
                  className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center transition group"
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition">📅</span>
                  <p className="text-green-400 font-semibold">Manage Bookings</p>
                  <p className="text-xs text-gray-400">Update booking status</p>
                </Link>

                <Link
                  to="/admin/messages"
                  className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 rounded-lg p-4 text-center transition group"
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition">💬</span>
                  <p className="text-purple-400 font-semibold">Messages</p>
                  <p className="text-xs text-gray-400">Read & reply messages</p>
                </Link>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-black/70 border border-yellow-500/40 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">📊 System Status</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span className="text-gray-400">Status:</span> <span className="text-green-400 font-semibold">✅ Operational</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Last Updated:</span> <span className="text-yellow-400">Just now</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Database:</span> <span className="text-green-400">✅ Connected</span></p>
                </div>
              </div>
              <div className="bg-black/70 border border-yellow-500/40 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">⚙️ Admin Info</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span className="text-gray-400">Name:</span> <span className="text-yellow-400 font-semibold">Durga Prasad Saw</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Email:</span> <span className="text-yellow-400">{admin?.email}</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Role:</span> <span className="text-yellow-400 font-semibold capitalize">staff</span></p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
