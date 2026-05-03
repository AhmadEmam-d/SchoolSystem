import { api } from '../../../app/lib/api';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const API = "https://localhost:7179/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconSend = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="14"height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconUsers = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" />
    <circle cx="17" cy="8" r="3" /><path d="M21 20c0-3-2-5-4.5-5.5" />
  </svg>
);

const IconSearch = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" /><path d="M17 17l4 4" />
  </svg>
);

const IconX = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconCheck = () => (
  <svg width="15" height="15" fill="none" stroke="#2E7D32" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg
    width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const IconLoader = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
    style={{ animation: "spin 1s linear infinite" }}>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);


// ─── Avatar ───────────────────────────────────────────────────────────────────
const PALETTES = [
  ["#E6F1FB", "#0C447C"],
  ["#E1F5EE", "#085041"],
  ["#FBEAF0", "#72243E"],
  ["#EEEDFE", "#3C3489"],
  ["#FAEEDA", "#633806"],
];

const Avatar = ({ name, size = 32 }) => {
  const initials = (name || "").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";
  const [bg, fg] = PALETTES[(name || "").charCodeAt(0) % PALETTES.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: fg, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.34, fontWeight: 500, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: "Student", label: "Students",  description: "Send to all students" },
  { value: "Teacher", label: "Teachers",  description: "Send to all teachers" },
  { value: "Parent",  label: "Parents",   description: "Send to all parents"  },
  { value: "Admin",   label: "Admins",    description: "Send to all admins"   },
];

// ─── ReceiverSearch ───────────────────────────────────────────────────────────
function ReceiverSearch({ token, selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchList();
  }, [activeTab, open]);

  const fetchList = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "students") endpoint = "Students";
      else if (activeTab === "teachers") endpoint = "Teachers";
      else if (activeTab === "parents") endpoint = "Parents";
      
      const res = await fetch(`${API}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // 🔥 مهم: تأكد من البيانات وجلب الـ User OID الصحيح
      console.log(`📦 ${endpoint} API response sample:`, data.data?.[0]);
      
      // تحويل البيانات للتأكد من وجود oid صحيح
      let users = data.data || [];
      users = users.map(user => ({
        ...user,
        oid: user.userId || user.oid || user.id, // محاولة إيجاد الـ OID الصحيح
        fullName: user.fullName || user.userName || user.name
      }));
      
      setResults(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((p) =>
    (p.fullName || "").toLowerCase().includes(query.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(query.toLowerCase())
  );

  const handlePick = (person) => {
    // 🔥 مهم: استخدم الـ oid الصحيح (User OID مش Teacher ID)
    const userOid = person.userId || person.oid || person.id;
    console.log(`✅ Selected user: ${person.fullName}, OID: ${userOid}`);
    
    onSelect({ 
      oid: userOid,
      name: person.fullName || person.userName 
    });
    setOpen(false);
    setQuery("");
  };

  if (selected) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={selected.name} size={28} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          {selected.name}
        </span>
        <button
          onClick={() => onSelect(null)}
          style={{
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 6, cursor: "pointer", padding: 4,
            color: "var(--color-text-tertiary)", display: "flex",
          }}
        >
          <IconX />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ flex: 1, position: "relative" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "9px 12px", background: "var(--color-background-secondary)",
          borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", cursor: "text",
        }}
        onClick={() => setOpen(true)}
      >
        <span style={{ color: "var(--color-text-tertiary)", display: "flex" }}><IconSearch /></span>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search student, teacher, or parent..."
          style={{
            border: "none", outline: "none", background: "transparent",
            fontSize: 14, color: "var(--color-text-primary)", flex: 1,
          }}
        />
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 7px)", left: 0, right: 0,
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 12, zIndex: 200, overflow: "hidden",
        }}>
          <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            {[
              { key: "students", label: "Students" }, 
              { key: "teachers", label: "Teachers" },
              { key: "parents", label: "Parents" }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: activeTab === t.key ? 500 : 400,
                  background: "transparent",
                  color: activeTab === t.key ? "#185FA5" : "var(--color-text-secondary)",
                  borderBottom: activeTab === t.key ? "2px solid #185FA5" : "2px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {loading && (
              <p style={{ textAlign: "center", padding: "20px", fontSize: 13, color: "var(--color-text-tertiary)" }}>
                Loading...
              </p>
            )}
            {!loading && filtered.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px", fontSize: 13, color: "var(--color-text-tertiary)" }}>
                No results found
              </p>
            )}
            {!loading && filtered.map((person) => (
              <div
                key={person.oid}
                onClick={() => handlePick(person)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-background-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Avatar name={person.fullName} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    {person.fullName}
                  </p>
                  {person.email && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--color-text-tertiary)" }}>
                      {person.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SendMessage Page ─────────────────────────────────────────────────────────
export function SendMessage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isGroup, setIsGroup] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [parentMessageOid, setParentMessageOid] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canSend = content.trim() && (isGroup ? targetRole : receiver?.oid);

  const handleModeChange = (group) => {
    setIsGroup(group);
    setReceiver(null);
    setTargetRole("");
    setError("");
  };

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        content: content.trim(),
        isGroupMessage: isGroup,
      };

      if (subject.trim()) payload.subject = subject.trim();
      if (parentMessageOid.trim()) payload.parentMessageOid = parentMessageOid.trim();

      // 🔥 مهم جداً: نضيف يا receiverOid (User OID) يا targetRole مش الاتنين
      if (isGroup) {
        payload.targetRole = targetRole;
      } else {
        payload.receiverOid = receiver.oid;
      }

      console.log("📤 Sending payload:", payload);
      console.log("🔍 Receiver OID being sent:", receiver?.oid);

      const result = await api.messages.send(payload);

      console.log("✅ Full result:", result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/teacher/messages"), 1500);
      } else {
        const errorMessage = result.messages?.EN || 
                            result.messages?.AR || 
                            result.message || 
                            "Failed to send message";
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.error("❌ Error sending message:", e);
      setError(e.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const card = {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 16,
    overflow: "hidden",
  };

  const formRow = {
    padding: "14px 20px",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    borderBottom: "0.5px solid var(--color-border-tertiary)",
  };

  const rowLabel = {
    fontSize: 13, fontWeight: 500,
    color: "var(--color-text-secondary)",
    width: 68, paddingTop: 7, flexShrink: 0,
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => navigate("/teacher/messages")}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            fontSize: 13, color: "var(--color-text-secondary)",
          }}
        >
          <IconArrowLeft /> Back
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 500, color: "var(--color-text-primary)" }}>
            New message
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-tertiary)" }}>
            Send a message to a student, teacher, or group
          </p>
        </div>
      </div>

      <div style={{
        display: "flex", gap: 6, padding: 5,
        background: "var(--color-background-secondary)",
        borderRadius: 13, border: "0.5px solid var(--color-border-tertiary)",
        alignSelf: "flex-start",
      }}>
        {[
          { value: false, label: "Direct message", icon: <IconUser /> },
          { value: true, label: "Group message", icon: <IconUsers /> },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => handleModeChange(opt.value)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: isGroup === opt.value ? 500 : 400,
              background: isGroup === opt.value ? "var(--color-background-primary)" : "transparent",
              color: isGroup === opt.value ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              boxShadow: isGroup === opt.value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      <div style={card}>
        <div style={formRow}>
          <div style={rowLabel}>{isGroup ? "To role" : "To"}</div>
          <div style={{ flex: 1 }}>
            {isGroup ? (
              <>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 8,
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-secondary)",
                    fontSize: 14, color: targetRole ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="">Select a role...</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {targetRole && (
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    {ROLE_OPTIONS.find((r) => r.value === targetRole)?.description}
                  </p>
                )}
              </>
            ) : (
              <ReceiverSearch token={token} selected={receiver} onSelect={setReceiver} />
            )}
          </div>
        </div>

        <div style={formRow}>
          <div style={rowLabel}>Subject</div>
          <div style={{ flex: 1 }}>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about? (optional)"
              style={{
                width: "100%", border: "none", outline: "none",
                fontSize: 14, background: "transparent",
                color: "var(--color-text-primary)", padding: "7px 0",
              }}
            />
          </div>
        </div>

        <div style={{ ...formRow, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ ...rowLabel, paddingTop: 14 }}>Message</div>
          <div style={{ flex: 1 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              style={{
                width: "100%", border: "none", outline: "none", resize: "vertical",
                fontSize: 14, lineHeight: 1.7, background: "transparent",
                color: "var(--color-text-primary)", padding: "7px 0",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          style={{
            width: "100%", padding: "12px 20px", background: "transparent",
            border: "none", cursor: "pointer", fontSize: 12,
            color: "var(--color-text-tertiary)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <IconChevron open={showAdvanced} />
          {showAdvanced ? "Hide advanced options" : "Show advanced options"}
        </button>

        {showAdvanced && (
          <div style={{ padding: "14px 20px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={rowLabel}>Reply to</div>
              <input
                value={parentMessageOid}
                onChange={(e) => setParentMessageOid(e.target.value)}
                placeholder="Parent message ID (optional)"
                style={{
                  flex: 1, border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 13,
                  background: "var(--color-background-secondary)",
                  color: "var(--color-text-primary)", outline: "none",
                }}
              />
            </div>
            <p style={{ margin: "8px 0 0 82px", fontSize: 11, color: "var(--color-text-tertiary)" }}>
              If replying to a specific message, paste its ID here
            </p>
          </div>
        )}
      </div>

      {success && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", background: "#E8F5E9",
          borderRadius: 8, border: "0.5px solid #4CAF50",
        }}>
          <IconCheck />
          <span style={{ fontSize: 13, color: "#2E7D32" }}>Message sent successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F2", borderRadius: 8, border: "0.5px solid #FCA5A5" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#C0391A" }}>{error}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
        <button
          onClick={() => navigate("/teacher/messages")}
          style={{
            padding: "10px 20px", borderRadius: 8,
            border: "0.5px solid var(--color-border-secondary)",
            background: "transparent", cursor: "pointer",
            fontSize: 13, color: "var(--color-text-secondary)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={!canSend || sending}
          style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: canSend && !sending ? "#185FA5" : "var(--color-border-secondary)",
            color: canSend && !sending ? "#fff" : "var(--color-text-tertiary)",
            cursor: canSend && !sending ? "pointer" : "not-allowed",
            fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {sending ? <><IconLoader /> Sending...</> : <><IconSend /> Send message</>}
        </button>
      </div>

    </div>
  );
}