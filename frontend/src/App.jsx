import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

// Pages - User
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import TableBooking from "./pages/TableBooking";
import Contact from "./pages/Contact";

// Pages - Admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AddMenuItem from "./pages/AddMenuItem";
import EditMenuItem from "./pages/EditMenuItem";
import AdminUsers from "./pages/AdminUsers";
import AdminMessages from "./pages/AdminMessages";
import AdminBookings from "./pages/AdminBookings";

// Components
import Navbar from "./components/Navbar";

export default function App() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error("App Error:", event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "monospace",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#1a1a1a",
          border: "2px solid #ff6b6b",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "600px"
        }}>
          <h1 style={{ color: "#ff6b6b", marginTop: 0 }}>App Error</h1>
          <pre style={{
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "4px",
            overflowX: "auto",
            fontSize: "12px"
          }}>
            {error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#fbbf24",
              color: "#000",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/table-booking"
          element={
            <ProtectedRoute>
              <TableBooking />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute adminOnly>
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu/add"
          element={
            <ProtectedRoute adminOnly>
              <AddMenuItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditMenuItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute adminOnly>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
