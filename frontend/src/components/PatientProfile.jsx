import React, { useState, useEffect } from "react";

export default function PatientProfile() {

  const username = localStorage.getItem("username");

  const [profile, setProfile] = useState({
    username,
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    blood_group: "",
    medical_history: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await fetch(`http://127.0.0.1:5005/profile/${username}`);
    if (res.ok) setProfile(await res.json());
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:5005/profile/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    alert("Profile saved successfully");
  };

  return (
    <div style={styles.wrapper}>

      <div style={styles.card}>
        <h2 style={styles.title}>👤 Patient Profile</h2>
        <p style={styles.subtitle}>Update your basic details below</p>

        <form onSubmit={saveProfile} style={styles.form}>

          <Field label="Full Name" value={profile.name}
                 onChange={v => setProfile({ ...profile, name: v })} />

          <Field label="Age" type="number" value={profile.age}
                 onChange={v => setProfile({ ...profile, age: v })} />

          <Field label="Gender" value={profile.gender}
                 onChange={v => setProfile({ ...profile, gender: v })} />

          <Field label="Phone Number" value={profile.phone}
                 onChange={v => setProfile({ ...profile, phone: v })} />

          <Field label="Address" value={profile.address}
                 onChange={v => setProfile({ ...profile, address: v })} />

          <Field label="Blood Group" value={profile.blood_group}
                 onChange={v => setProfile({ ...profile, blood_group: v })} />

          <div style={styles.group}>
            <label style={styles.label}>🩺 Medical History</label>
            <textarea
              style={styles.textarea}
              placeholder="Write brief history (optional)"
              value={profile.medical_history}
              onChange={e => setProfile({ ...profile, medical_history: e.target.value })}
            />
          </div>

          <button type="submit" style={styles.button}>
            💾 Save Profile
          </button>

        </form>
      </div>
    </div>
  );
}

/* ---------- Small reusable input ---------- */

function Field({ label, value, onChange, type="text" }) {
  return (
    <div style={styles.group}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        style={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    padding: "30px 15px",
    
    backgroundColor: "#f5e6d3",
  },

  card: {
    maxWidth: 600,
    margin: "0 auto",
    background: "white",
    borderRadius: 16,
    padding: 25,
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    border: "1.5px solid #f0dfc9"
  },

  title: {
    margin: 0,
    color: "#5a3921",
    textAlign: "center"
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 15,
    textAlign: "center",
    color: "#8b7355",
    fontSize: 14
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  group: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  label: {
    fontWeight: 600,
    color: "#5a3921",
    fontSize: 14
  },

  input: {
  width: "100%",
  boxSizing: "border-box",

  padding: "14px 16px",

  borderRadius: "12px",
  border: "2px solid #e6d5c8",

  background: "#fffdf8",

  fontSize: "15px",
  color: "#5a3921",

  outline: "none",
  transition: "all 0.25s ease",

  // prevents touching card edges visually
  marginTop: "2px",
},

  textarea: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "2px solid #e8d6cf",
    outline: "none",
    minHeight: 100,
    resize: "vertical",
    fontSize: 14
  },

  button: {
    marginTop: 10,
    background: "linear-gradient(135deg,#8b4513,#a25a2c)",
    color: "white",
    padding: 12,
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    cursor: "pointer"
  }
};
