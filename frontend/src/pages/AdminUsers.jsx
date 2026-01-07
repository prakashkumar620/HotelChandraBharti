import { useEffect, useState, useContext } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { AuthContext } from "../context/AuthContext";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { adminToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    const loadUsers = async () => {
      try {
        const res = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [adminToken, navigate]);

  const blockUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u))
      );
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
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

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">👥 Users Management</h1>
          <p className="text-gray-400">Manage all registered users in one place</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-black/70 border border-yellow-500/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 bg-black/70 border border-yellow-500/40 rounded-lg py-12">
            {searchTerm ? "No users match your search." : "No users found."}
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Summary Card */}
            <div className="bg-black/70 border border-yellow-500/40 rounded-lg p-4 mb-4">
              <p className="text-gray-300">
                Showing <span className="text-yellow-400 font-bold">{filteredUsers.length}</span> out of <span className="text-yellow-400 font-bold">{users.length}</span> users
              </p>
            </div>

            {/* User Cards */}
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-black/70 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-400/60 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* User Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.name || "Unknown"}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">📱 {user.phone || "N/A"}</p>
                  </div>

                  {/* Signup Date */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Joined Date</p>
                    <p className="text-sm text-gray-300 font-semibold">{formatDate(user.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end md:justify-start flex-wrap">
                    <button
                      onClick={() => blockUser(user._id)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        user.isBlocked
                          ? "bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30"
                          : "bg-orange-600/20 text-orange-400 border border-orange-600/50 hover:bg-orange-600/30"
                      }`}
                    >
                      {user.isBlocked ? "🔓 Unblock" : "🔒 Block"}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 rounded text-sm font-semibold bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Status Badge */}
                  {user.isBlocked && (
                    <div className="md:col-span-4 bg-red-600/20 border border-red-600/50 rounded px-3 py-1 inline-block">
                      <span className="text-red-400 text-sm font-semibold">⛔ User Blocked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
