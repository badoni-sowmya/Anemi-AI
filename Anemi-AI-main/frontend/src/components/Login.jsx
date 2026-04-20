// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("Logging in...");

    try {
      const res = await fetch("http://127.0.0.1:5005/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Invalid credentials");
        return;
      }

      setMsg("Login successful 🎉");

      localStorage.setItem("username", email);

      setTimeout(() => navigate("/"), 800);

    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🩺</span>
          </div>
          <h2 style={styles.title}>Welcome to AnemiAI</h2>
          <p style={styles.subtitle}>
            Predict anemia and monitor your hemoglobin levels easily.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>

          <p style={{ textAlign: "center", color: "#6b3e26" }}>{msg}</p>
        </form>

        <div style={styles.footer}>
          <p style={styles.signupText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.signupLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5e6d3",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff5e6",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(107, 62, 38, 0.15)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(107, 62, 38, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    marginBottom: "16px",
  },
  logoIcon: {
    fontSize: "48px",
    display: "block",
  },
  title: {
    marginBottom: "12px",
    color: "#6b3e26",
    fontSize: "24px",
    fontWeight: "600",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    marginBottom: "0",
    color: "#8c5e3c",
    fontSize: "14px",
    lineHeight: "1.5",
    opacity: "0.8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "24px",
  },
  inputGroup: {
    position: "relative",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "2px solid rgba(155, 72, 28, 0.1)",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: "all 0.2s ease",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6b3e26",
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(107, 62, 38, 0.2)",
  },
  footer: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid rgba(107, 62, 38, 0.1)",
  },
  signupText: {
    margin: "0",
    fontSize: "14px",
    color: "#6b3e26",
    opacity: "0.8",
  },
  signupLink: {
    color: "#824b24ff",
    textDecoration: "none",
    fontWeight: "600",
    opacity: "1",
  },
};

export default Login;