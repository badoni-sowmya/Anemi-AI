// src/components/About.jsx
import React, { useState } from "react";

const About = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div style={styles.container}>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>About AnemiAI</h1>

        <p style={styles.heroSubtitle}>
          AnemiAI is an intelligent healthcare assistant that predicts anemia and estimates Hemoglobin (Hb) levels using
          a simple image of your lower eyelid. No labs, no waiting — just instant insights powered by AI.
        </p>

        <div style={styles.heroHighlightCard}>
          <h2 style={styles.heroHighlightTitle}>Why AnemiAI Matters</h2>
          <p style={styles.heroHighlightText}>
            Over 1.6 billion people suffer from anemia worldwide. Early detection is key — and AnemiAI helps make
            anemia screening fast, accessible, and accurate for everyone.
          </p>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={styles.cardsSection}>
        <h2 style={styles.sectionTitle}>Why Choose AnemiAI?</h2>

        <div style={styles.cardsContainer}>
          {featureCards.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(hoverIndex === index ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <h3 style={styles.cardTitle}>{item.icon} {item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>

        <div style={styles.stepsContainer}>
          {steps.map((step, idx) => (
            <div key={idx} style={styles.stepCard}>
              <h3 style={styles.stepTitle}>{step.step}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={styles.bannerSection}>
        <h2 style={styles.bannerTitle}>Start Monitoring Your Health Today!</h2>
        <p style={styles.bannerSubtitle}>
          Detect anemia early, track your Hb levels, and stay in control of your health — all with a single photo.
        </p>
        <a href="/prediction" style={styles.bannerButton}>Predict Now</a>
      </section>
    </div>
  );
};

/* ------------------- CONTENT DATA ------------------- */
const featureCards = [
  {  title: "Our Mission", desc: "Make anemia detection fast, simple, and accessible with AI." },
  {  title: "AI-Powered Analysis", desc: "Deep-learning models detect eyelid color changes to estimate Hb." },
  {  title: "Secure Data", desc: "Your images and health data are protected with end-to-end privacy." },
  {  title: "Health Insights", desc: "Track your anemia predictions over time with clear visual trends." },
  {  title: "Fast Results", desc: "Get instant Hb estimation and anemia status in seconds." },
  {  title: "Accessible Anywhere", desc: "Use AnemiAI on any device with a camera, anytime." },
];

const steps = [
  { step: "1️⃣ Capture Image", desc: "Take a clear photo of your lower eyelid." },
  { step: "2️⃣ AI Analysis", desc: "The AI analyzes eyelid color patterns to detect anemia." },
  { step: "3️⃣ Get Results", desc: "Instant predictions about Hb levels and anemia risk." },
 
];

/* ------------------- INLINE STYLES ------------------- */

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    background: "#f5e6d3",
    paddingBottom: "60px",
  },

  /* HERO */
  heroSection: {
    textAlign: "center",
    padding: "70px 20px 40px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#6b3e26",
    marginBottom: "15px",
  },
  heroSubtitle: {
    fontSize: "19px",
    lineHeight: "1.6",
    maxWidth: "750px",
    margin: "0 auto",
    color: "#8c5e3c",
  },

  heroHighlightCard: {
    marginTop: "40px",
    backgroundColor: "#fff5e6",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  heroHighlightTitle: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#6b3e26",
    fontWeight: "600",
  },
  heroHighlightText: {
    fontSize: "17px",
    color: "#8c5e3c",
    lineHeight: "1.6",
  },

  /* FEATURE CARDS */
  cardsSection: {
    padding: "50px 25px",
  },
  sectionTitle: {
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "35px",
    color: "#6b3e26",
    fontWeight: "600",
  },
  cardsContainer: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",   // ← EXACTLY 3 CARDS PER ROW
  gap: "25px",
  padding: "0 10px",
},

  card: {
    backgroundColor: "#fff5e6",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
    color: "#6b3e26",
    transition: "0.3s ease",
  },
  cardHover: {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  cardTitle: {
    fontSize: "22px",
    marginBottom: "12px",
  },
  cardDesc: {
    fontSize: "16px",
    color: "#8c5e3c",
  },

  /* STEPS */
  howItWorksSection: {
    padding: "40px 20px",
  },
  stepsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
    gap: "22px",
  },
  stepCard: {
    backgroundColor: "#fff5e6",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  stepTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#6b3e26",
  },
  stepDesc: {
    fontSize: "15px",
    color: "#8c5e3c",
  },

  /* CTA */
  bannerSection: {
    marginTop: "60px",
    backgroundColor: "#6b3e26",
    padding: "45px 20px",
    borderRadius: "16px",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    color: "#fff",
  },
  bannerTitle: {
    fontSize: "30px",
    marginBottom: "10px",
    fontWeight: "600",
  },
  bannerSubtitle: {
    fontSize: "16px",
    marginBottom: "22px",
  },
  bannerButton: {
    padding: "14px 30px",
    borderRadius: "10px",
    backgroundColor: "#f5e6d3",
    color: "#6b3e26",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    transition: "0.3s",
  },
};

export default About;
