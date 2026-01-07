import { useEffect, useState, useContext } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { AuthContext } from "../context/AuthContext";

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  const { adminToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    loadMessages();
  }, [adminToken, navigate]);

  const loadMessages = async () => {
    try {
      const res = await API.get("/contact", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setMsgs(res.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Delete this message?")) {
      try {
        await API.delete(`/contact/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setMsgs((prev) => prev.filter((m) => m._id !== id));
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">Contact Messages</h1>
        <div className="space-y-3">
          {msgs.map((m) => (
            <div key={m._id} className="bg-black/70 border border-yellow-500/40 rounded p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-yellow-200">
                    {m.name} ({m.email}) – {m.phone}
                  </div>
                  <div className="text-sm text-gray-300">{m.subject}</div>
                  <p className="mt-1 text-gray-100">{m.message}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(m._id)}
                  className="ml-4 px-3 py-2 rounded text-sm font-semibold bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 transition whitespace-nowrap"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
          {msgs.length === 0 && <p className="text-gray-200">No messages yet.</p>}
        </div>
      </div>
    </div>
  );
}
