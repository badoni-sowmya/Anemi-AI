import React, { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { useNavigate } from "react-router-dom";

const Prediction = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [segmentedImage, setSegmentedImage] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ---------------------- CAMERA ----------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user" 
        } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      alert("Unable to access camera. Please check permissions.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!cameraActive) {
      alert("Please start camera first!");
      return;
    }

    setLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg", 0.92);

    try {
      const response = await fetch("http://127.0.0.1:5005/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (data.segmented_image) {
        const segmentedBase64 = "data:image/jpeg;base64," + data.segmented_image;
        setSegmentedImage(segmentedBase64);
        setCropImage(segmentedBase64);
        stopCamera();
      }
    } catch (error) {
      console.error("Segmentation error:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = (_, area) => setCroppedAreaPixels(area);

  const handlePredict = async () => {
    if (!cropImage) return;
    
    setLoading(true);
    try {
      const croppedBase64 = await getCroppedImg(cropImage, croppedAreaPixels);

      const response = await fetch("http://127.0.0.1:5005/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
  image: croppedBase64,
  username: localStorage.getItem("username") 
}),

      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setCropImage(null);
    setSegmentedImage(null);
    setResult(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    stopCamera();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logo}>👁️</div>
          <div style={styles.headerText}>
            <h2 style={styles.title}>Anemia Detection</h2>
            <p style={styles.subtitle}>Capture your eye image for hemoglobin estimation</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressSteps}>
          <div style={{...styles.step, ...(cameraActive || cropImage ? styles.stepCompleted : {})}}>
            <div style={styles.stepNumber}>1</div>
            <span>Start Camera</span>
          </div>
          <div style={{...styles.step, ...(cropImage ? styles.stepCompleted : {})}}>
            <div style={styles.stepNumber}>2</div>
            <span>Capture & Segment</span>
          </div>
          <div style={{...styles.step, ...(result ? styles.stepCompleted : {})}}>
            <div style={styles.stepNumber}>3</div>
            <span>Get Results</span>
          </div>
        </div>

        {/* Camera Section */}
        {!cropImage && (
          <div style={styles.cameraSection}>
            <div style={styles.videoContainer}>
              <video 
                ref={videoRef} 
                style={{
                  ...styles.video,
                  border: cameraActive ? "3px solid #6b3e26" : "3px dashed #ccc"
                }}
              />
              {!cameraActive && (
                <div style={styles.cameraPlaceholder}>
                  <div style={styles.cameraIcon}>📷</div>
                  <p>Camera not active</p>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Camera Controls */}
            <div style={styles.buttonGroup}>
              {!cameraActive ? (
                <button onClick={startCamera} style={styles.primaryButton}>
                  🎥 Start Camera
                </button>
              ) : (
                <div style={styles.buttonRow}>
                  <button onClick={stopCamera} style={styles.secondaryButton}>
                    ⏹️ Stop Camera
                  </button>
                  <button onClick={capturePhoto} style={styles.primaryButton} disabled={loading}>
                    {loading ? "⏳ Processing..." : "📸 Capture & Segment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cropper Section */}
        {cropImage && (
          <div style={styles.cropperSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Crop Conjunctiva Area</h3>
              <button onClick={resetProcess} style={styles.resetButton}>
                🔄 Retake
              </button>
            </div>

            <div style={styles.noteBox}>
              <div style={styles.noteIcon}>💡</div>
              <div>
                <strong>Important:</strong> Carefully crop <strong>only around the lower conjunctiva</strong> 
                (the pink inner part of your lower eyelid) for accurate hemoglobin prediction.
              </div>
            </div>

            <div style={styles.cropContainer}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                maxZoom={25}
                minZoom={1}
                zoomSpeed={0.3}
                restrictPosition={false}
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom Controls */}
            <div style={styles.zoomControls}>
              <label style={styles.zoomLabel}>Zoom:</label>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={styles.zoomSlider}
              />
              <span style={styles.zoomValue}>{zoom.toFixed(1)}x</span>
            </div>

            <button 
              onClick={handlePredict} 
              style={styles.predictButton}
              disabled={loading}
            >
              {loading ? "🔮 Analyzing..." : "🧪 Predict Hemoglobin"}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <div style={styles.resultIcon}>📊</div>
              <h3 style={styles.resultTitle}>Prediction Results</h3>
            </div>
            
            <div style={styles.resultCards}>
              <div style={styles.resultCard}>
                <div style={styles.cardLabel}>Anemia Status</div>
                <div style={{
                  ...styles.cardValue,
                  color: result.anaemia === 'Yes' ? '#e74c3c' : '#27ae60'
                }}>
                  {result.anaemia}
                </div>
              </div>
              <div style={styles.resultCard}>
                <div style={styles.cardLabel}>Hemoglobin Level</div>
                <div style={styles.cardValue}>
                  {result.hb.toFixed(2)} g/dL
                </div>
              </div>
            </div>

            <div style={styles.resultInterpretation}>
              <strong>Interpretation:</strong> {
                result.hb >= 12 ? "Normal hemoglobin levels" :
                result.hb >= 10 ? "Mild anemia - Consider dietary changes" :
                result.hb >= 8 ? "Moderate anemia - Consult a doctor" :
                "Severe anemia - Immediate medical attention recommended"
              }
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
  onClick={async () => {
    const res = await fetch("http://127.0.0.1:5005/download_report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        hb: result.hb,
        anaemia: result.anaemia
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AnemiAI_Report.pdf";
    link.click();
  }}
  style={styles.secondaryButton}
>
  📥 Download Report
</button>

              <button
                onClick={() => navigate("/chat")}
                style={styles.chatButton}
              >
                💬 Chat with AnemAi
              </button>
              
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Processing your image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ------------------------- STYLES -------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5e6d3",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "30px 20px",
    background: "linear-gradient(135deg, #f5e6d3 0%, #e8d6cf 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(107, 62, 38, 0.15)",
    textAlign: "center",
    border: "1px solid #e8d6cf",
    position: "relative",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0e6dc",
  },

  logo: {
    width: "60px",
    height: "60px",
    backgroundColor: "#6b3e26",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow: "0 4px 12px rgba(107, 62, 38, 0.3)",
  },

  headerText: {
    textAlign: "left",
  },

  title: {
    color: "#6b3e26",
    fontSize: "28px",
    margin: "0 0 5px 0",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#8c5e3c",
    margin: "0",
    fontSize: "14px",
    opacity: "0.8",
  },

  progressSteps: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
    position: "relative",
  },

  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
    zIndex: 2,
  },

  stepCompleted: {
    color: "#6b3e26",
  },

  stepNumber: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#e8d6cf",
    color: "#8c5e3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
    border: "2px solid #d4c1b5",
  },

  cameraSection: {
    marginBottom: "20px",
  },

  videoContainer: {
    position: "relative",
    marginBottom: "20px",
  },

  video: {
    width: "100%",
    height: "300px",
    borderRadius: "16px",
    objectFit: "cover",
    backgroundColor: "#f8f1ea",
  },

  cameraPlaceholder: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "#8c5e3c",
  },

  cameraIcon: {
    fontSize: "48px",
    marginBottom: "10px",
    opacity: "0.5",
  },

  buttonGroup: {
    marginTop: "15px",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },

  primaryButton: {
    padding: "14px 24px",
    backgroundColor: "#6b3e26",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(107, 62, 38, 0.3)",
    minWidth: "160px",
  },

  secondaryButton: {
    padding: "14px 24px",
    backgroundColor: "transparent",
    color: "#6b3e26",
    border: "2px solid #6b3e26",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.3s ease",
    minWidth: "140px",
  },

  cropperSection: {
    marginBottom: "20px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  sectionTitle: {
    color: "#6b3e26",
    margin: "0",
    fontSize: "20px",
  },

  resetButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#8c5e3c",
    border: "1px solid #8c5e3c",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.3s ease",
  },

  noteBox: {
    backgroundColor: "#fff7e6",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #e0c29f",
    color: "#6b3e26",
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "left",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },

  noteIcon: {
    fontSize: "18px",
    flexShrink: 0,
  },

  cropContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
    background: "#1a1a1a",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    marginBottom: "15px",
  },

  zoomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f8f1ea",
    borderRadius: "10px",
  },

  zoomLabel: {
    color: "#6b3e26",
    fontWeight: "bold",
    fontSize: "14px",
  },

  zoomSlider: {
    flex: "1",
    maxWidth: "200px",
  },

  zoomValue: {
    color: "#8c5e3c",
    fontSize: "14px",
    fontWeight: "bold",
    minWidth: "40px",
  },

  predictButton: {
    padding: "16px",
    width: "100%",
    backgroundColor: "#6b3e26",
    color: "white",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(107, 62, 38, 0.4)",
  },

  resultSection: {
    marginTop: "20px",
    padding: "25px",
    backgroundColor: "#fef9f5",
    borderRadius: "16px",
    border: "2px solid #e8d6cf",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  resultIcon: {
    fontSize: "28px",
  },

  resultTitle: {
    color: "#6b3e26",
    margin: "0",
    fontSize: "22px",
  },

  resultCards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  resultCard: {
    flex: "1",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e8d6cf",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  cardLabel: {
    fontSize: "12px",
    color: "#8c5e3c",
    fontWeight: "bold",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  cardValue: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#6b3e26",
  },

  resultInterpretation: {
    padding: "15px",
    backgroundColor: "#f0f7ff",
    borderRadius: "10px",
    border: "1px solid #cce5ff",
    color: "#2c3e50",
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "left",
  },

  actionButtons: {
    display: "flex",
    gap: "12px",
  },

  chatButton: {
    flex: "2",
    padding: "16px",
    backgroundColor: "#8c5e3c",
    color: "white",
    fontSize: "15px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(140, 94, 60, 0.3)",
  },

  newTestButton: {
    flex: "1",
    padding: "16px",
    backgroundColor: "transparent",
    color: "#6b3e26",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #6b3e26",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },

  loadingOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "24px",
    zIndex: "1000",
  },

  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #6b3e26",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },

  loadingText: {
    color: "#6b3e26",
    fontSize: "16px",
    fontWeight: "bold",
  },
};



export default Prediction;