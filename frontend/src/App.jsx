// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Prediction from "./components/Prediction";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AnimeAiChat from "./components/AnemiAiChat";
import HealthRecords from "./components/HealthRecords";
import PatientProfile from "./components/PatientProfile";




export default function App() {
  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar stays visible on all pages */}
      <Navbar />

      {/* Page Routes */}
      <div className="page-container" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/chat" element={<AnimeAiChat />} />
           <Route path="/records" element={<HealthRecords />} />
           <Route path="/profile" element={<PatientProfile />} />

        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
