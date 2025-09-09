// Login.jsx
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
    const { token, role: userRole, name: userName, developerId } = response.data;

localStorage.setItem(
  "currentUser",
  JSON.stringify({ token, role: userRole, name: userName, developerId })
);


      if (userRole === "admin") navigate("/admin");
      else navigate("/collaborator");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive width
  const isMobile = window.innerWidth < 700;

  return (
    <div
      style={{
        width: isMobile ? "95vw" : 400,
        maxWidth: 400,
        background: "#fff",
        borderRadius: 16,
        boxShadow:
          "0 6px 32px rgba(59,130,246,0.10), 0 1.5px 6px rgba(0,0,0,0.04)",
        border: "1px solid #e0e7ef",
        padding: isMobile ? 24 : 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: "50px auto",
      }}
    >
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: 8,
          }}
        >
          Feedback Hub
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 8 }}>
          Plateforme collaborative
        </p>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 4,
          }}
        >
          Connexion
        </h3>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          Accédez à votre espace de travail
        </p>
      </div>

      <form onSubmit={handleLogin} autoComplete="off">
        {/* Role Selector */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Rôle
          </label>
          <div
            style={{
              display: "flex",
              gap: 8,
              background: "#f1f5f9",
              padding: 4,
              borderRadius: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setRole("admin")}
              style={{
                flex: 1,
                padding: "12px 0",
                background: role === "admin" ? "#000" : "transparent",
                color: role === "admin" ? "white" : "#64748b",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Administrateur
            </button>
            <button
              type="button"
              onClick={() => setRole("collaborator")}
              style={{
                flex: 1,
                padding: "12px 0",
                background: role === "collaborator" ? "#000" : "transparent",
                color: role === "collaborator" ? "white" : "#64748b",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Collaborateur
            </button>
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              outline: "none",
              background: "#f9fafb",
            }}
            required
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mot de passe"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              outline: "none",
              background: "#f9fafb",
            }}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "14px 0",
            background: isLoading ? "#9ca3af" : "#000",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Quit Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#f1f5f9",
            color: "#374151",
            border: "1.5px solid #d1d5db",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 12,
          }}
        >
          Quit
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: 24,
            padding: "14px 28px",
            background: "#fee2e2",
            border: "1.5px solid #fca5a5",
            borderRadius: 10,
            color: "#b91c1c",
            fontSize: 15,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
