// Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    let endpoint = "";
    let payload = {};

    if (role === "admin") {
      endpoint = "http://localhost:3000/api/auth/adminlogin";
      payload = { name: email, password };
    } else {
      endpoint = "http://localhost:3000/api/auth/collaboratorlogin";
      payload = { email, password };
    }

    try {
      const response = await axios.post(endpoint, payload);
      const { token, role: userRole, name } = response.data;

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ token, role: userRole, name: name || email, email })
      );

      if (userRole === "admin") {
        window.location.hash = "#/admin";
      } else {
        window.location.hash = "#/collaborator";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive
  const isMobile = window.innerWidth < 700;

  return (
    <div
      style={{
        width: isMobile ? "95vw" : 400,
        maxWidth: 400,
        background: "#fff",
        borderRadius: 16,
        boxShadow:
          "0 6px 32px 0 rgba(59,130,246,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)",
        border: "1px solid #e0e7ef",
        padding: isMobile ? 24 : 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: 8,
            letterSpacing: 0.5,
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
                background: role === "admin" ? "#3b82f6" : "transparent",
                color: role === "admin" ? "white" : "#64748b",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow:
                  role === "admin"
                    ? "0 2px 8px rgba(59,130,246,0.10)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (role !== "admin") e.target.style.background = "#e0e7ef";
              }}
              onMouseLeave={(e) => {
                if (role !== "admin") e.target.style.background = "transparent";
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
                background: role === "collaborator" ? "#3b82f6" : "transparent",
                color: role === "collaborator" ? "white" : "#64748b",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow:
                  role === "collaborator"
                    ? "0 2px 8px rgba(59,130,246,0.10)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (role !== "collaborator") e.target.style.background = "#e0e7ef";
              }}
              onMouseLeave={(e) => {
                if (role !== "collaborator") e.target.style.background = "transparent";
              }}
            >
              Collaborateur
            </button>
          </div>
        </div>
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
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
              outline: "none",
              background: "#f9fafb",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 2px #dbeafe";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
            required
          />
        </div>
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
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
              outline: "none",
              background: "#f9fafb",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 2px #dbeafe";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "14px 0",
            background: isLoading
              ? "#9ca3af"
              : "linear-gradient(90deg,#3b82f6,#2563eb)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
            letterSpacing: 0.5,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background =
                "linear-gradient(90deg,#2563eb,#1e40af)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background =
                "linear-gradient(90deg,#3b82f6,#2563eb)";
            }
          }}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
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
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            animation: "fadeInDown 0.5s",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
