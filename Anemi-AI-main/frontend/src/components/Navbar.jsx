import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("username");

  return (
    <nav className="navbar" style={styles.navbar}>
      <div style={styles.brand}>
        <img src={logo} alt="AnemiAI Logo" style={styles.logoImg} />
        <h2 style={styles.logoText}>AnemiAI</h2>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About Us</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>

        {/* only after login */}
        {isLoggedIn && (
          <>
            <Link to="/prediction" style={styles.link}>Prediction</Link>
            <Link to="/records" style={styles.link}>Health Records</Link>
          </>
        )}

        {/* before login */}
        {!isLoggedIn && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
        {isLoggedIn && (
  <Link to="/profile" style={styles.link}>My Profile</Link>
)}


        {/* logout */}
        {isLoggedIn && (
          <span
            style={{ ...styles.link, cursor: "pointer" }}
            onClick={() => {
              const ok = window.confirm("Are you sure you want to logout?");
              if (!ok) return;
              localStorage.removeItem("username");
              window.location.reload();
            }}
          >
            Logout
          </span>
        )}
      </div>
    </nav>
  );
};


const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    background: "linear-gradient(to right, #6b3e26, #aa6927ff)",
    color: "white",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImg: {
    width: "60px",
    height: "60px",
  },
  logoText: {
    margin: 0,
    fontSize: "1.5rem",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Navbar;
