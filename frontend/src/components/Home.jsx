// src/components/Home.jsx
import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to AnemiAI </h1>
        <p style={styles.heroSubtitle}>
          Detect anemia and estimate Hemoglobin levels instantly using AI-based
          computer vision. Simply capture an image of your lower eyelid, and get
          accurate predictions in seconds!
        </p>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Features</h2>
        <div style={styles.cardsContainer}>
          <FeatureCard
            
            title="Easy Image Capture"
            desc="Use your camera to capture the lower eyelid and let our AI analyze it automatically. No manual RGB input needed."
          />
          <FeatureCard
           
            title="Hemoglobin Estimation"
            desc="Get an estimated Hemoglobin (Hb) level instantly with high accuracy using our trained AI models."
          />
          <FeatureCard
            
            title="Fast Predictions"
            desc="Predict anemia in seconds. Our AI processes the image efficiently and returns results quickly."
          />
          <FeatureCard
            
            title="Historical Tracking"
            desc="Keep track of your predictions over time to monitor your health and detect trends early."
          />
          <FeatureCard
            
            title="Secure Data"
            desc="Your images and health data are stored securely. Privacy is our top priority."
          />
          <FeatureCard
            
            title="AI-Powered Analysis"
            desc="Our advanced AI model uses computer vision to detect subtle changes in eyelid color and provide accurate predictions."
          />
        </div>
      </section>

      {/* About Section */}
      <section style={styles.aboutSection}>
        <h2 style={styles.sectionTitle}>About AnemiAI</h2>
        <p style={styles.aboutText}>
          AnemiAI is designed to make anemia detection simple, fast, and
          accessible to everyone. With just a simple camera capture, our AI
          model analyzes the lower eyelid to estimate your Hemoglobin level and
          detect anemia early. This can help in preventive care and prompt
          medical attention when needed.
        </p>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
      }}
    >
      <h3 style={styles.cardTitle}>
        {icon} {title}
      </h3>
      <p style={styles.cardDesc}>{desc}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5e6d3",
    minHeight: "100vh",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#fff5e6",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    marginBottom: "50px",
  },
  heroTitle: {
    fontSize: "40px",
    color: "#6b3e26",
    marginBottom: "20px",
    fontWeight: "700",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#8c5e3c",
    lineHeight: "1.6",
  },
  featuresSection: {
    marginBottom: "50px",
  },
  sectionTitle: {
    fontSize: "32px",
    textAlign: "center",
    color: "#6b3e26",
    marginBottom: "30px",
    fontWeight: "600",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
  },
  card: {
    backgroundColor: "#fff5e6",
    flex: "1 1 300px",
    maxWidth: "340px",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    textAlign: "center",
    color: "#6b3e26",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#7a4f33",
  },
  aboutSection: {
    textAlign: "center",
    padding: "45px 25px",
    backgroundColor: "#fff5e6",
    borderRadius: "15px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  aboutText: {
    fontSize: "16px",
    color: "#8c5e3c",
    maxWidth: "750px",
    margin: "0 auto",
    lineHeight: "1.7",
  },
};

export default Home;
