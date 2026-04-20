// src/components/Contact.jsx
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <section style={styles.headerSection}>
        <h1 style={styles.mainTitle}>Get In Touch</h1>
        <p style={styles.subtitle}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      <div style={styles.contentWrapper}>
        {/* Contact Form Section */}
        <section style={styles.formSection}>
          <h2 style={styles.formTitle}>Send Us a Message</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                style={styles.textarea}
              ></textarea>
            </div>
            
            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </section>

        {/* Contact Info Section */}
        <section style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          <p style={styles.infoDescription}>
            Feel free to reach out through any channel
          </p>
          
          <div style={styles.cardsContainer}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>✉️</div>
              <h3 style={styles.cardTitle}>Email</h3>
              <p style={styles.cardText}>support@anemiai.com</p>
              <p style={styles.cardSubtext}>Reply within 24 hours</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>📞</div>
              <h3 style={styles.cardTitle}>Phone</h3>
              <p style={styles.cardText}>+91 98765 43210</p>
              <p style={styles.cardSubtext}>Mon-Fri from 9am to 6pm</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>📍</div>
              <h3 style={styles.cardTitle}>Address</h3>
              <p style={styles.cardText}>123 AI Health Street</p>
              <p style={styles.cardSubtext}>Bengaluru, India</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5e6d3",
    minHeight: "100vh",
    padding: "40px 20px",
  },
  headerSection: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 50px auto",
    padding: "0 20px",
  },
  mainTitle: {
    fontSize: "40px",
    color: "#6b3e26",
    marginBottom: "15px",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "18px",
    color: "#8c5e3c",
    lineHeight: "1.6",
    margin: "0",
  },
  contentWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    maxWidth: "1100px",
    margin: "0 auto",
    alignItems: "start",
  },
  formSection: {
    padding: "35px",
    backgroundColor: "#fff5e6",
    borderRadius: "14px",
    boxShadow: "0 4px 18px rgba(107, 62, 38, 0.12)",
  },
  formTitle: {
    fontSize: "26px",
    color: "#6b3e26",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "15px",
    color: "#6b3e26",
    fontWeight: "500",
  },
  input: {
    padding: "13px",
    borderRadius: "9px",
    border: "2px solid #e6d3c2",
    fontSize: "15px",
    backgroundColor: "#fff",
  },
  textarea: {
    padding: "13px",
    borderRadius: "9px",
    border: "2px solid #e6d3c2",
    fontSize: "15px",
    backgroundColor: "#fff",
    resize: "vertical",
    fontFamily: "inherit",
    minHeight: "120px",
  },
  button: {
    padding: "15px",
    borderRadius: "9px",
    border: "none",
    backgroundColor: "#6b3e26",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  infoSection: {
    padding: "35px",
    backgroundColor: "#fff5e6",
    borderRadius: "14px",
    boxShadow: "0 4px 18px rgba(107, 62, 38, 0.12)",
  },
  sectionTitle: {
    fontSize: "26px",
    color: "#6b3e26",
    marginBottom: "12px",
    fontWeight: "600",
  },
  infoDescription: {
    fontSize: "15px",
    color: "#8c5e3c",
    marginBottom: "25px",
    lineHeight: "1.5",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    backgroundColor: "#f5e6d3",
    padding: "22px",
    borderRadius: "10px",
    textAlign: "center",
    border: "2px solid #e6d3c2",
  },
  cardIcon: {
    fontSize: "24px",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "17px",
    color: "#6b3e26",
    marginBottom: "8px",
    fontWeight: "600",
  },
  cardText: {
    fontSize: "14px",
    color: "#6b3e26",
    margin: "0 0 4px 0",
    fontWeight: "500",
  },
  cardSubtext: {
    fontSize: "13px",
    color: "#8c5e3c",
    margin: "0",
  },
  // Responsive Design
  "@media (max-width: 968px)": {
    contentWrapper: {
      gridTemplateColumns: "1fr",
      gap: "30px",
    },
    formSection: {
      padding: "30px",
    },
    infoSection: {
      padding: "30px",
    },
  },
  "@media (max-width: 768px)": {
    container: {
      padding: "30px 15px",
    },
    mainTitle: {
      fontSize: "32px",
    },
    headerSection: {
      marginBottom: "40px",
    },
    formSection: {
      padding: "25px",
    },
    infoSection: {
      padding: "25px",
    },
  },
};

export default Contact;