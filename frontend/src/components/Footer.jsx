// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 AnemiAI. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#6b3e26",
    padding: "15px 0",
    textAlign: "center",
    marginTop: "50px",
  },
  text: {
    color: "#fff",
    fontSize: "14px",
  },
};

export default Footer;
