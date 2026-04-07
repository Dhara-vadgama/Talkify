import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateMeetingCode, getMeetingShareUrl } from "@/lib/meetingCode";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = useCallback(() => {
    const code = generateMeetingCode();
    setGeneratedCode(code);
    setCopied(false);
  }, []);

  const handleJoinMeeting = () => {
    if (!generatedCode) {
      toast.error("Please generate a meeting code first");
      return;
    }
    navigate(`/meeting/${generatedCode}`);
  };

  const handleCopyCode = async () => {
    const url = getMeetingShareUrl(generatedCode);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = getMeetingShareUrl(generatedCode);
    const shareData = {
      title: "Join my Talkify meeting",
      text: `Join my video meeting on Talkify! Meeting code: ${generatedCode}`,
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Meeting link copied to clipboard!");
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <span style={{ fontSize: "1.3rem" }}>📹</span>
          <h2 style={styles.brandText}>Talkify</h2>
        </div>
        <div style={styles.navActions}>
          <button style={styles.iconBtn} onClick={() => navigate("/history")} title="History">
            🕘
          </button>
          <button
            style={styles.outlineBtn}
            onClick={() => { localStorage.removeItem("token"); navigate("/auth"); }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.main}>
        <h2 style={styles.heading}>
          Providing Quality Video Call Just Like Quality{" "}
          <span style={{ color: "#4285f4" }}>Education</span>
        </h2>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Meeting Code</h3>

          <button style={styles.generateBtn} onClick={handleGenerateCode}>
            🔄 Generate New Meeting Code
          </button>

          {generatedCode && (
            <>
              <div style={styles.codeBox}>
                <code style={styles.codeText}>{generatedCode}</code>
              </div>

              <div style={styles.urlBox}>
                <span style={styles.urlLabel}>Share this link:</span>
                <span style={styles.urlText}>{getMeetingShareUrl(generatedCode)}</span>
              </div>

              <div style={styles.actionRow}>
                <button style={styles.actionBtn} onClick={handleJoinMeeting}>
                  🎥 Join Meeting
                </button>
                <button style={styles.actionBtnOutline} onClick={handleCopyCode}>
                  {copied ? "✅ Copied!" : "📋 Copy Link"}
                </button>
                <button style={styles.actionBtnOutline} onClick={handleShare}>
                  📤 Share
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#1a1c22",
    color: "#e8eaed",
    fontFamily: "'Inter', 'Google Sans', system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandText: { fontSize: "1.25rem", fontWeight: 700, margin: 0 },
  navActions: { display: "flex", alignItems: "center", gap: 12 },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: "1.3rem",
    cursor: "pointer",
    padding: 8,
    borderRadius: 8,
  },
  outlineBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#e8eaed",
    padding: "6px 16px",
    borderRadius: 24,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 24px",
    maxWidth: 560,
    margin: "0 auto",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.3,
    marginBottom: 40,
  },
  card: {
    width: "100%",
    background: "#23262f",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
  },
  generateBtn: {
    background: "#4285f4",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: 28,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(66,133,244,0.35)",
    transition: "background 0.2s",
  },
  codeBox: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: "16px 24px",
    textAlign: "center",
  },
  codeText: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    color: "#4285f4",
    letterSpacing: 3,
  },
  urlBox: {
    width: "100%",
    background: "rgba(66,133,244,0.08)",
    borderRadius: 10,
    padding: "10px 16px",
    textAlign: "center",
    wordBreak: "break-all",
  },
  urlLabel: {
    display: "block",
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 4,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  urlText: {
    fontSize: 13,
    color: "#4285f4",
    fontFamily: "'Courier New', monospace",
  },
  actionRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap" as const,
    justifyContent: "center",
    width: "100%",
  },
  actionBtn: {
    background: "#4285f4",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 24,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(66,133,244,0.3)",
  },
  actionBtnOutline: {
    background: "none",
    color: "#e8eaed",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "12px 24px",
    borderRadius: 24,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
