import React, { useEffect, useState } from "react";

function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWhatsAppBox, setShowWhatsAppBox] = useState(false);
const [phoneInput, setPhoneInput] = useState("");
const [selectedReport, setSelectedReport] = useState(null);


  const loadRecords = () => {
    const username = localStorage.getItem("username");
    setIsLoading(true);

    fetch(`http://127.0.0.1:5005/records/${username}`)
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadRecords();
    // Add CSS animations safely
    const addAnimations = () => {
      if (document.styleSheets && document.styleSheets.length > 0) {
        try {
          const styleSheet = document.styleSheets[0];
          // Check if animation already exists
          let spinExists = false;
          for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].name === 'spin') {
              spinExists = true;
              break;
            }
          }
          
          if (!spinExists) {
            styleSheet.insertRule(`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `, styleSheet.cssRules.length);
          }
        } catch (err) {
          // Fallback: add style tag
          if (!document.getElementById('health-records-animations')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'health-records-animations';
            styleTag.innerHTML = `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `;
            document.head.appendChild(styleTag);
          }
        }
      }
    };

    // Run after a short delay to ensure DOM is ready
    setTimeout(addAnimations, 100);
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;

    try {
      await fetch(`http://127.0.0.1:5005/records/delete/${id}`, {
        method: "DELETE"
      });
      loadRecords();
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record. Please try again.");
    }
  };

  const getAnemiaColor = (anaemia) => {
    return anaemia === "Yes" ? "#dc2626" : "#059669";
  };

  const getHemoglobinStatus = (value) => {
    if (value >= 11.0) return { text: "Normal", color: "#059669" };
   
    return { text: "Below Normal", color: "#d97706" };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Health Records</h2>
        <div style={styles.subtitle}>Track your hemoglobin levels and anemia status</div>
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h3 style={styles.emptyTitle}>No health records yet</h3>
          <p style={styles.emptyText}>Your health records will appear here once you add them.</p>
        </div>
      ) : (
        <div style={styles.recordsGrid}>
          {records.map((r, index) => {
            const hemoglobinStatus = getHemoglobinStatus(r.hemoglobin);
            return (
              <div 
                key={index} 
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(139, 115, 85, 0.15)';
                  e.currentTarget.style.borderColor = '#d4b896';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 115, 85, 0.1)';
                  e.currentTarget.style.borderColor = '#f1e8df';
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.date}>
                     {new Date(r.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style={styles.recordNumber}>Record #{records.length - index}</div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.metricContainer}>
                    <div style={styles.metricLabel}>Hemoglobin Level</div>
                    <div style={styles.metricValue}>
                      <span style={styles.valueNumber}>{r.hemoglobin.toFixed(2)}</span>
                      <span style={styles.valueUnit}>g/dL</span>
                    </div>
                    <div 
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: hemoglobinStatus.color + "15",
                        color: hemoglobinStatus.color,
                        borderColor: hemoglobinStatus.color
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {hemoglobinStatus.text}
                    </div>
                  </div>

                  <div style={styles.metricContainer}>
                    <div style={styles.metricLabel}>Anemia Status</div>
                    <div 
                      style={{
                        ...styles.anemiaBadge,
                        backgroundColor: getAnemiaColor(r.anaemia) + "15",
                        color: getAnemiaColor(r.anaemia),
                        borderColor: getAnemiaColor(r.anaemia)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {r.anaemia === "Yes" ? "⚠️" : "✅"} {r.anaemia}
                    </div>
                    <div style={styles.metricDescription}>
                      {r.anaemia === "Yes" 
                        ? "Consult with a healthcare provider" 
                        : "No anemia detected"}
                    </div>
                  </div>
                </div>

              <div style={styles.cardFooter}>
  
  {/* Download Report Button */}
  

  <button
  style={styles.whatsappButton}
  onClick={() => {
    setSelectedReport(r);
    setShowWhatsAppBox(true);
  }}
>
   Send to WhatsApp
</button>


  <button
    style={styles.downloadButton}
    onClick={async () => {
      try {
        const res = await fetch("http://127.0.0.1:5005/download_report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: r.username,
            hb: r.hemoglobin,
            anaemia: r.anaemia
          }),
        });

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "AnemiAI_Report.pdf";
        link.click();
      } catch (e) {
        alert("Failed to download report");
        console.error(e);
      }
    }}
  >
    📥 Download
  </button>

  {/* Delete Button */}
  <button
    style={styles.deleteButton}
    onClick={() => handleDelete(r._id)}
  >
    <span style={styles.deleteIcon}>🗑️</span>
    Delete
  </button>
</div>


              </div>
              
            );
          })}
          
        </div>
      )}
      {/* ===== Records Grid remains same above ===== */}

{showWhatsAppBox && (
  <div style={styles.overlay}>
    <div style={styles.popup}>
      <h3 style={{ marginBottom: 5 }}>Send Report via WhatsApp</h3>

      <p style={{ fontSize: 13, marginTop: 0 }}>
        Enter WhatsApp number with country code<br />
        Example: <b>+919876543210</b>
      </p>

      <input
        type="tel"
        value={phoneInput}
        onChange={(e) => setPhoneInput(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        style={styles.input}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 15 }}>
        <button
          style={styles.cancelBtn}
          onClick={() => {
            setShowWhatsAppBox(false);
            setPhoneInput("");
          }}
        >
          Cancel
        </button>

        <button
          style={styles.sendBtn}
          onClick={() => {
            fetch("http://127.0.0.1:5005/send_whatsapp_report", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: localStorage.getItem("username"),
                phone: phoneInput,
                hb: selectedReport.hemoglobin,
                anaemia: selectedReport.anaemia
              })
            })
              .then(res => res.json())
              .then(data => alert(data.message || data.error));

            setShowWhatsAppBox(false);
            setPhoneInput("");
          }}
        >
          Send Report
        </button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
}

const styles = {
   whatsappButton: {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #d7f3e3, #b7e4c7)",
  color: "#064e3b",
  borderRadius: "12px",
  border: "2px solid #99d1b5",
  cursor: "pointer",
  fontWeight: "700",
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  boxShadow: "0 4px 14px rgba(6, 78, 59, 0.18)",
  transition: "0.2s",
},

overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.55)",
  backdropFilter: "blur(3px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

popup: {
  background: "linear-gradient(145deg, #fff7ec, #f6e9d4)",
  padding: "28px 26px",
  width: "380px",
  borderRadius: "18px",
  textAlign: "center",
  border: "2px solid #ebd9c3",
  boxShadow: "0 25px 50px rgba(92, 64, 39, 0.25)",
},

input: {
  width: "100%",
  height: "55px",
  padding: "0 14px",
  borderRadius: "14px",
  border: "2px solid #d6c3ac",
  marginTop: "14px",
  fontSize: "1.05rem",
  textAlign: "center",
  outline: "none",
  background: "#fffdf8",
  color: "#5a3921",
  boxSizing: "border-box",
  display: "block",
}
,
cancelBtn: {
  background: "#fde2e1",
  color: "#7f1d1d",
  padding: "9px 18px",
  borderRadius: "12px",
  border: "1px solid #fecaca",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 3px 10px rgba(127, 29, 29, 0.15)",
},

sendBtn: {
  background: "linear-gradient(135deg, #25D366, #128C7E)",
  color: "white",
  padding: "9px 18px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 4px 14px rgba(18, 140, 126, 0.3)",
},

downloadButton: {
  padding: "10px 16px",
  background: "#e6f4ff",
  color: "#1d4ed8",
  borderRadius: "10px",
  border: "2px solid #bfdbfe",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  gap: "6px",
  alignItems: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
  marginRight: "8px"
},

  container: {
    padding: "30px 20px",
    backgroundColor: "#f5e6d3",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "700px",
    margin: "0 auto"
  },
  title: {
    color: "#5a3921",
    fontSize: "2.2rem",
    fontWeight: "700",
    marginBottom: "12px",
    letterSpacing: "-0.3px"
  },
  subtitle: {
    color: "#8b7355",
    fontSize: "1.1rem",
    fontWeight: "500",
    lineHeight: "1.5"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e8d6cf",
    borderTop: "4px solid #8b4513",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  loadingText: {
    color: "#8b7355",
    fontSize: "1.1rem",
    fontWeight: "500"
  },
  emptyState: {
    textAlign: "center",
    padding: "50px 30px",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "450px",
    margin: "0 auto",
    boxShadow: "0 8px 20px rgba(139, 115, 85, 0.1)",
    border: "2px dashed #e8d6cf"
  },
  emptyIcon: {
    fontSize: "3.5rem",
    marginBottom: "20px",
    color: "#8b7355"
  },
  emptyTitle: {
    color: "#5a3921",
    fontSize: "1.6rem",
    fontWeight: "600",
    marginBottom: "12px"
  },
  emptyText: {
    color: "#8b7355",
    fontSize: "1rem",
    lineHeight: "1.6",
    maxWidth: "350px",
    margin: "0 auto"
  },
  recordsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 0"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(139, 115, 85, 0.1)",
    border: "2px solid #f1e8df",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    minHeight: "300px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #f5f0e9"
  },
  date: {
    color: "#8b7355",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  recordNumber: {
    backgroundColor: "#f5f0e9",
    color: "#5a3921",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #e8d6cf"
  },
  cardBody: {
    flex: "1",
    marginBottom: "20px"
  },
  metricContainer: {
    marginBottom: "25px"
  },
  metricLabel: {
    color: "#8b7355",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  metricValue: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    marginBottom: "12px"
  },
  valueNumber: {
    color: "#5a3921",
    fontSize: "2.2rem",
    fontWeight: "700",
    fontFamily: "'Georgia', serif"
  },
  valueUnit: {
    color: "#8b7355",
    fontSize: "1rem",
    fontWeight: "600"
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  },
  anemiaBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid",
    marginBottom: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  },
  metricDescription: {
    color: "#a38b70",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    fontStyle: "italic"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "15px",
    borderTop: "1px solid #f5f0e9"
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.1)"
  },
  deleteIcon: {
    fontSize: "1.1rem"
  }
};

export default HealthRecords;