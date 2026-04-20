import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AnimeAiChat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `👋 **Hello! I am AnemAi — your anemia assistant.**

I can help you understand:
- Your hemoglobin results  
- Causes of anemia  
- Diet plans  
- Symptoms & corrections  
- When to see a doctor  

Ask me anything! 😊`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5005/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();
      const botReply = data.error ? "⚠️ Error: " + data.error : data.reply;

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Failed to contact AnemAi server." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            ← Back
          </button>
          <div style={styles.headerContent}>
            <div style={styles.avatar}>🤖</div>
            <div>
              <h3 style={styles.headerTitle}>AnemAi Chatbot</h3>
              <p style={styles.headerSubtitle}>Your anemia assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messagesBox}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.message,
                  ...(msg.from === "user" ? styles.userMessage : styles.botMessage),
                }}
              >
                {msg.from === "bot" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                    }}
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.typingIndicator}>
              <div style={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span style={styles.typingText}>AnemAi is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div style={styles.inputContainer}>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="Ask about anemia..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              disabled={loading}
            />
            <button 
              onClick={handleSend} 
              style={styles.sendBtn}
              disabled={loading || !input.trim()}
            >
              <span style={styles.sendIcon}>↑</span>
            </button>
          </div>
          <p style={styles.inputHint}>
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

// ---------------------- STYLES ----------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f2e7da",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "520px",
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 12px 35px rgba(107, 62, 38, 0.15)",
    display: "flex",
    flexDirection: "column",
    height: "85vh",
    maxHeight: "700px",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #f0e6dc",
  },
  backBtn: {
    backgroundColor: "transparent",
    color: "#6b3e26",
    border: "2px solid #6b3e26",
    borderRadius: "12px",
    padding: "8px 16px",
    cursor: "pointer",
    marginRight: "16px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: "50px",
    height: "50px",
    backgroundColor: "#6b3e26",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginRight: "16px",
    boxShadow: "0 4px 12px rgba(107, 62, 38, 0.2)",
  },
  headerTitle: {
    margin: 0,
    color: "#6b3e26",
    fontWeight: "bold",
    fontSize: "22px",
    marginBottom: "4px",
  },
  headerSubtitle: {
    margin: 0,
    color: "#8d6b55",
    fontSize: "14px",
    fontWeight: "500",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#faf5f0",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
    border: "1px solid #e8d9cc",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  message: {
    padding: "16px 20px",
    borderRadius: "18px",
    maxWidth: "80%",
    fontSize: "15px",
    lineHeight: "1.5",
    wordWrap: "break-word",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  userMessage: {
    backgroundColor: "#6b3e26",
    color: "white",
    borderBottomRightRadius: "6px",
  },
  botMessage: {
    backgroundColor: "white",
    color: "#5a4a3a",
    borderBottomLeftRadius: "6px",
    border: "1px solid #e8d9cc",
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    backgroundColor: "white",
    borderRadius: "18px",
    border: "1px solid #e8d9cc",
    maxWidth: "fit-content",
  },
  typingDots: {
    display: "flex",
    gap: "4px",
  },
  typingText: {
    fontSize: "14px",
    color: "#8d6b55",
    fontStyle: "italic",
  },
  inputContainer: {
    paddingTop: "16px",
    borderTop: "2px solid #f0e6dc",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  input: {
    flex: 1,
    padding: "16px 20px",
    borderRadius: "16px",
    border: "2px solid #e8d9cc",
    fontSize: "15px",
    backgroundColor: "#faf5f0",
    transition: "all 0.2s ease",
  },
  sendBtn: {
    width: "50px",
    height: "50px",
    backgroundColor: "#6b3e26",
    color: "white",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(107, 62, 38, 0.3)",
  },
  sendIcon: {
    transform: "translateY(-1px)",
  },
  inputHint: {
    margin: 0,
    fontSize: "12px",
    color: "#8d6b55",
    textAlign: "center",
    fontStyle: "italic",
  },
};



export default AnimeAiChat;