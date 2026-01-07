import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("=== App Initialization ===");
console.log("Google Client ID:", googleClientId ? "Loaded" : "Not loaded");

const root = ReactDOM.createRoot(document.getElementById("root"));

try {
  root.render(
    <React.StrictMode>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      ) : (
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      )}
    </React.StrictMode>
  );
  console.log("✓ App rendered successfully");
} catch (error) {
  console.error("✗ Failed to render app:", error);
  document.getElementById("root").innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">Error: ${error.message}</div>`;
}
