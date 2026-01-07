import { useEffect, useState, useContext } from "react";
import { API } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { AuthContext } from "../context/AuthContext";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { adminToken } = useContext(AuthContext);

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    const load = async () => {
      const res = await API.get("/admin/menu", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setItems(res.data);
    };
    load();
  }, [adminToken, navigate]);

  const deleteItem = async (id) => {
    await API.delete(`/menu/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-yellow-400">Manage Menu</h1>
          <Link
            to="/admin/menu/add"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Item
          </Link>
        </div>

        <table className="w-full bg-black/70 border border-yellow-500/40 rounded">
          <thead>
            <tr className="border-b border-yellow-500/40">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-b border-yellow-500/20">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.category}</td>
                <td className="p-2">₹{it.price}</td>
                <td className="p-2 flex gap-2">
                  <Link
                    to={`/admin/menu/edit/${it._id}`}
                    className="text-blue-400 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteItem(it._id)}
                    className="text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-200">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
