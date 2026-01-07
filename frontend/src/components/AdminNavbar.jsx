import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import adminLogo from "../admin.jpeg";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/admin/dashboard", label: "📊 Dashboard", icon: "📊" },
    { path: "/admin/menu", label: "🍽️ Menu", icon: "🍽️" },
    { path: "/admin/users", label: "👥 Users", icon: "👥" },
    { path: "/admin/messages", label: "💬 Messages", icon: "💬" },
    { path: "/admin/bookings", label: "📅 Bookings", icon: "📅" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-black to-slate-900 border-b border-yellow-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3 font-bold text-xl text-yellow-400 hover:text-yellow-300 transition">
            <AdminLogo />
            <span className="hidden sm:block">Hotel Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium ${
                  isActive(link.path)
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-lg"
                    : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                {link.icon} {link.label.split(" ")[1]}
              </Link>
            ))}
          </div>

          {/* Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-yellow-400 font-semibold">{admin?.name}</p>
              <p className="text-xs text-gray-400">{admin?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition border border-red-600/50 font-semibold"
            >
              🚪 Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-yellow-500/10 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-400"
                    : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}

function AdminLogo() {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-slate-900">
        HB
      </div>
    );
  }

  return (
    <img
      src={adminLogo}
      alt="Hotel Chandra Bharti"
      className="w-10 h-10 rounded-full object-cover shadow-sm"
      onError={() => setErr(true)}
    />
  );
}
