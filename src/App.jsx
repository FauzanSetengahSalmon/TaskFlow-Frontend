import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { API_ENDPOINTS } from './utils/config';

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);   // pastikan BE mengirim { success: true, user: {...} }
        setShowLogin(false);
      } else {
        alert(data.message || "Email atau password salah");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.logout, { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar user={user} onLoginClick={() => setShowLogin(true)} logout={logout} />
      {showLogin && !user && (
        <LoginPage login={login} onClose={() => setShowLogin(false)} />
      )}
      <Dashboard user={user} />
    </div>
  );
}