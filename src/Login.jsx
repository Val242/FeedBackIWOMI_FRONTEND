import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint =
        role === "admin"
          ? "http://localhost:3000/api/auth/adminlogin"
          : "http://localhost:3000/api/auth/collaboratorlogin";

      const response = await axios.post(endpoint, { name, password });
      const { token, role: userRole, name: userName, developerId, progress } = response.data;

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ token, role: userRole, name: userName, developerId, progress })
      );

      if (userRole === "admin") navigate("/admin");
      else navigate("/collaborator");
    } catch (err) {
      setError(err.response?.data?.message || "Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Feedback Hub</h2>
          <p className="text-gray-600 text-sm mb-2">Collaborative Platform</p>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Login</h3>
          <p className="text-gray-500 text-sm">Access your workspace</p>
        </div>

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              {["admin", "collaborator"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-transform duration-200 ${
                    role === r
                      ? "bg-indigo-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-indigo-100 hover:scale-105"
                  }`}
                >
                  {r === "admin" ? "Administrator" : "Collaborator"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all hover:shadow-md bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all hover:shadow-md bg-gray-50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-transform duration-200 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Quit */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl font-semibold border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            Quit
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
