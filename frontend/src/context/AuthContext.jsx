import { createContext, useState, useEffect } from "react";
import { API } from "../utils/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [adminToken, setAdminToken] = useState(sessionStorage.getItem("adminToken") || "");
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedAdminToken = sessionStorage.getItem("adminToken");
    const storedUser = sessionStorage.getItem("user");
    const storedAdmin = sessionStorage.getItem("admin");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    if (storedAdminToken && storedAdmin) {
      setAdminToken(storedAdminToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Fetch user profile when token changes
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  // Fetch admin profile when adminToken changes
  useEffect(() => {
    if (adminToken && !admin) {
      const storedAdmin = sessionStorage.getItem("admin");
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    }
  }, [adminToken, admin]);

  const fetchUserProfile = async () => {
    try {
      const response = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const signup = async (userData, captchaToken) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/signup", { ...userData, captchaToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, captchaToken) => {
    setLoading(true);

    try {
      // First, try admin login
      let adminLoginAttempted = false;
      try {
        console.log("Attempting admin login with email:", email);
        const adminResp = await API.post("/admin/login", { email, password, captchaToken });
        const { token: adminTokenResp, admin } = adminResp.data;
        setAdminToken(adminTokenResp);
        setAdmin(admin);
        sessionStorage.setItem("adminToken", adminTokenResp);
        sessionStorage.setItem("admin", JSON.stringify(admin));
        console.log("✓ Admin login successful for:", admin.email);
        return { ...adminResp.data, type: "admin" };
      } catch (adminErr) {
        const status = adminErr.response?.status;
        console.log("✗ Admin login failed with status:", status);
        
        // If admin found but wrong password, don't try user login
        if (status === 401) {
          console.error("Admin found but password invalid - aborting user login attempt");
          throw adminErr.response?.data || adminErr;
        }
        // If admin not found (404), continue to user login
        adminLoginAttempted = true;
      }

      // Admin not found or not authenticated, try normal user login
      if (adminLoginAttempted) {
        console.log("Admin not found, attempting normal user login with email:", email);
      }
      
      const response = await API.post("/auth/login", { email, password, captchaToken });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      console.log("✓ Normal user login successful for:", user.email);
      return { ...response.data, type: "user" };
    } catch (error) {
      console.error("Login failed:", error);
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password, captchaToken) => {
    setLoading(true);
    try {
      const response = await API.post("/admin/login", { email, password, captchaToken });
      console.log("Admin login response:", response.data);
      const { token, admin } = response.data;
      console.log("Setting admin:", admin);
      setAdminToken(token);
      setAdmin(admin);
      sessionStorage.setItem("adminToken", token);
      sessionStorage.setItem("admin", JSON.stringify(admin));
      console.log("Admin state after login:", { token, admin });
      return response.data;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setAdminToken("");
    setUser(null);
    setAdmin(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("admin");
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async (idToken) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/google-auth", { idToken });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      console.log("✓ Google signup successful for:", user.email);
      return response.data;
    } catch (error) {
      console.error("Google signup error:", error);
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/google-auth", { idToken });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      console.log("✓ Google login successful for:", user.email);
      return response.data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!token && !!user;
  const isAdminLoggedIn = !!adminToken && !!admin;

  return (
    <AuthContext.Provider
      value={{
        token,
        adminToken,
        user,
        admin,
        loading,
        login,
        logout,
        signup,
        adminLogin,
        googleSignup,
        googleLogin,
        forgotPassword,
        resetPassword,
        isLoggedIn,
        isAdminLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
