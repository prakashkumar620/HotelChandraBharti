import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo2.png";

export default function Navbar() {
  const { isLoggedIn, isAdminLoggedIn, user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-yellow-500/40 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* show image when available, otherwise fallback to text badge */}
            <LogoImage />
            <span className="font-bold text-xl text-yellow-400 tracking-wider group-hover:text-yellow-300 transition">
              Hotel Chandra Bharti
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6 items-center text-sm">
            {/* Always visible */}
            <Link to="/" className="text-gray-300 hover:text-yellow-300 transition font-medium">
              Home
            </Link>

            {/* Show only when logged in */}
            {isLoggedIn && (
              <>
                <Link to="/menu" className="text-gray-300 hover:text-yellow-300 transition font-medium">
                  🍽️ Menu
                </Link>
                <Link to="/table-booking" className="text-gray-300 hover:text-yellow-300 transition font-medium">
                  📅 Book Table/Hall
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-300 transition font-medium">
                  📧 Contact
                </Link>
                {/* Cart */}
                <Link to="/cart" className="text-gray-300 hover:text-yellow-300 transition relative font-medium">
                  🛒 Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User/Admin Status */}
            {isAdminLoggedIn ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-yellow-300 hover:text-yellow-200 transition font-medium"
                >
                  📊 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  🚪 Admin Logout
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                <span className="text-yellow-300 font-semibold">👤 {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                {/* Admin login removed - admins use regular Login page */}
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-yellow-300 transition font-medium"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition"
                >
                  ✍️ Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="lg:hidden text-yellow-400 text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-yellow-500/20 pt-4 space-y-2">
            <Link to="/" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
              Home
            </Link>

            {/* Show only when logged in */}
            {isLoggedIn && (
              <>
                <Link to="/menu" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
                  🍽️ Menu
                </Link>
                <Link to="/table-booking" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
                  📅 Book Table/Hall
                </Link>
                <Link to="/contact" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
                  📧 Contact
                </Link>
                <Link to="/cart" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
                  🛒 Cart ({itemCount})
                </Link>
              </>
            )}

            {isAdminLoggedIn ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-yellow-300 hover:text-yellow-200 py-2 font-medium"
                >
                  📊 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded mt-2 font-medium"
                >
                  🚪 Admin Logout
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                <p className="text-yellow-300 py-2 font-semibold">👤 {user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded font-medium"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                {/* Admin login removed - admins use regular Login page */}
                <Link to="/login" className="block text-gray-300 hover:text-yellow-300 py-2 font-medium">
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-yellow-500 text-black px-4 py-2 rounded mt-2 text-center font-bold"
                >
                  ✍️ Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function LogoImage() {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-slate-900">
        HCB
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt="Hotel Chandra Bharti"
      className="w-12 h-12 rounded-full object-cover shadow-md"
      onError={() => setErr(true)}
    />
  );
}
