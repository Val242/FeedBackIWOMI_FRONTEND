// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Choose endpoint dynamically based on role
      const endpoint =
        role === "admin"
          ? "http://localhost:3000/api/auth/adminlogin"
          : "http://localhost:3000/api/auth/collaboratorlogin";

      const response = await axios.post(endpoint, { name, password });

      const { token, role: userRole } = response.data;

      // Store token and user info in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ token, role: userRole, name })
      );

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "developer") {
        navigate("/collaborator");
      }
      console.log(userRole);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[900px] flex bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Left side: Branding */}
      <div className="flex-1 p-12 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl" />

        <div className="relative z-10 max-w-[300px]">
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/40">
              <span className="text-4xl">💬</span>
            </div>

            <h1 className="text-4xl font-extrabold mb-3 leading-tight bg-gradient-to-br from-white to-slate-200 bg-clip-text text-transparent">
              Feedback Hub
            </h1>
            <p className="text-lg opacity-90">Plateforme collaborative</p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 p-12 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Role
            </label>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-3 rounded-md font-medium text-sm transition ${
                  role === "admin"
                    ? "bg-blue-500 text-white shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("developer")}
                className={`flex-1 py-3 rounded-md font-medium text-sm transition ${
                  role === "developer"
                    ? "bg-blue-500 text-white shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Collaborator
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full py-3 px-4 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-3 px-4 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 shadow"
            }`}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
