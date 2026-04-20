// src/components/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("Creating account...");

    try {
      const res = await fetch("http://127.0.0.1:5005/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,      // backend uses username field
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Signup failed");
        return;
      }

      setMsg("Account created successfully 🎉");

      setTimeout(() => navigate("/login"), 800);

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
          <h2 style={styles.title}>Create an Account</h2>
          <p style={styles.subtitle}>
            Join AnemiAI to monitor anemia and hemoglobin levels easily.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email Address"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Create Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Create Account
          </button>

          <p style={{ textAlign: "center", color: "#6b3e26" }}>{msg}</p>
        </form>

        <div style={styles.footer}>
          <p style={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginLink}>
              Login
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
    maxWidth: "420px",
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
    border: "2px solid rgba(107, 62, 38, 0.1)",
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
  loginText: {
    margin: "0",
    fontSize: "14px",
    color: "#6b3e26",
    opacity: "0.8",
  },
  loginLink: {
    color: "#6d3710ff",
    textDecoration: "none",
    fontWeight: "600",
    opacity: "1",
  },
};

export default Signup;