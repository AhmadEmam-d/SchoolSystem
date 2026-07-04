import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API = "http://edusmarrt.runasp.net/api";

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7"/><path d="M17 17l4 4"/>
  </svg>
);
const IconCompose = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 8.5-8.5z"/>
  </svg>
);
const IconInbox = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);
const IconSend = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ─── Avatar ──────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 36 }) => {
  const initials = name?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "?";
  const colors = ["#C8D9F7", "#C3EDD8", "#FAD5C8", "#EAC9F5", "#FAE8C0"];
  const textColors = ["#1A5FB4", "#1A7A47", "#C0391A", "#7B2FA8", "#7D5A00"];
  const idx = name?.charCodeAt(0) % colors.length || 0;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0, letterSpacing: "0.03em"
    }}>{initials}</div>
  );
};

// ─── New Message Modal ────────────────────────────────────────────────────────
function NewMessageModal({ onClose, token }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim() || !body.trim()) return;
    setSending(true);
    try {
      await fetch(`${API}/Messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverOid: to, subject, content: body })
      });
      onClose(true);
    } catch {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }}>
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)"
        }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>New message</span>
          <button onClick={() => onClose(false)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
            borderRadius: 6, color: "var(--color-text-secondary)", display: "flex"
          }}><IconClose /></button>
        </div>

        {/* Fields */}
        <div style={{ padding: "12px 20px" }}>
          {[
            { label: "To", value: to, set: setTo, placeholder: "Recipient ID or name..." },
            { label: "Subject", value: subject, set: setSubject, placeholder: "Subject (optional)" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: "0.5px solid var(--color-border-tertiary)"
            }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", width: 56, flexShrink: 0 }}>{label}</span>
              <input
                value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent",
                  color: "var(--color-text-primary)"
                }}
              />
            </div>
          ))}

          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Write your message..."
            style={{
              width: "100%", minHeight: 160, border: "none", outline: "none",
              fontSize: 14, lineHeight: 1.7, resize: "none", background: "transparent",
              color: "var(--color-text-primary)", marginTop: 12, boxSizing: "border-box"
            }}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 20px",
          borderTop: "0.5px solid var(--color-border-tertiary)"
        }}>
          <button onClick={() => onClose(false)} style={{
            padding: "8px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)",
            background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)"
          }}>Discard</button>
          <button onClick={handleSend} disabled={sending || !to.trim() || !body.trim()} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: (!to.trim() || !body.trim()) ? "var(--color-border-secondary)" : "#185FA5",
            color: (!to.trim() || !body.trim()) ? "var(--color-text-tertiary)" : "#fff",
            cursor: (!to.trim() || !body.trim()) ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6
          }}>
            <IconSend /> {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function TeacherMessages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [sentUserOids, setSentUserOids]         = useState(new Set());
  const [receivedUserOids, setReceivedUserOids] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => { fetchAll(); }, []);

  // When user selects a conversation and messages aren't loaded yet, fetch them
  useEffect(() => {
    if (selectedUser && !messages[selectedUser]) {
      fetchMessages();
    }
  }, [selectedUser]);

  // Cross-reference conversations userOids into sent/received sets
  // Handles cases where receiverOid stored in messages != userOid from conversations
  useEffect(() => {
    if (!conversations.length || !Object.keys(messages).length) return;
    const allMsgs = Object.values(messages).flat();
    setSentUserOids(prev => {
      const updated = new Set(prev);
      conversations.forEach(c => {
        if (allMsgs.some(m => m._dir === "sent" && (m.receiverOid === c.userOid || m.senderOid === c.userOid))) {
          updated.add(c.userOid);
        }
      });
      return updated;
    });
    setReceivedUserOids(prev => {
      const updated = new Set(prev);
      conversations.forEach(c => {
        if (allMsgs.some(m => m._dir === "received" && (m.senderOid === c.userOid || m.receiverOid === c.userOid))) {
          updated.add(c.userOid);
        }
      });
      return updated;
    });
  }, [conversations, messages]);

  const fetchAll = async () => {
    await fetchMessages();   // must load first so filter sets are ready
    fetchConversations();
    fetchSummary();
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API}/Messages/summary`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSummary(data.data);
    } catch {}
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/Messages/conversations`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setConversations(data.data || []);
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const [inboxRes, sentRes] = await Promise.all([
        fetch(`${API}/Messages/inbox`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/Messages/sent`,  { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const inbox = await inboxRes.json();
      const sent  = await sentRes.json();

      const inboxMsgs = (inbox.data || []).map(m => ({ ...m, _dir: "received" }));
      const sentMsgs  = (sent.data  || []).map(m => ({ ...m, _dir: "sent" }));

      // Build sets of user-oids directly from API — most reliable source
      const sSet = new Set();
      const rSet = new Set();
      sentMsgs.forEach(m  => { if (m.receiverOid) sSet.add(m.receiverOid); });
      inboxMsgs.forEach(m => { if (m.senderOid)   rSet.add(m.senderOid);  });
      setSentUserOids(sSet);
      setReceivedUserOids(rSet);

      // Group by the "other" person
      const grouped = {};
      [...inboxMsgs, ...sentMsgs].forEach(msg => {
        const other = msg.senderOid === user.oid ? msg.receiverOid : msg.senderOid;
        if (!grouped[other]) grouped[other] = [];
        if (!grouped[other].find(x => x.oid === msg.oid)) grouped[other].push(msg);
      });
      Object.keys(grouped).forEach(k =>
        grouped[k].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );
      setMessages(grouped);
    } catch(e) { console.error("fetchMessages", e); }
  };

  // Mark all unread messages in a conversation as read
  // Correct endpoint: PUT /Messages/{messageOid}/read  (per message)
  const markAsRead = async (userOid) => {
    const conv = conversations.find(c => c.userOid === userOid);
    const prevUnread = conv?.unreadCount || 0;
    if (prevUnread === 0) return;

    // Optimistic UI update immediately
    setConversations(prev =>
      prev.map(c => c.userOid === userOid ? { ...c, unreadCount: 0 } : c)
    );
    setSummary(prev => prev ? {
      ...prev,
      unreadCount: Math.max(0, (prev.unreadCount || 0) - prevUnread)
    } : prev);

    // Find all unread received messages for this conversation
    // Find messages for this conversation
    let convMsgs = messages[userOid] || [];
    if (!convMsgs.length) {
      for (const msgs of Object.values(messages)) {
        if (msgs.some(m => m.senderOid === userOid || m.receiverOid === userOid)) {
          convMsgs = msgs; break;
        }
      }
    }

    const unreadMsgs = convMsgs.filter(m => m._dir === "received" || m.senderOid !== user.oid);

    // Call PUT /Messages/{oid}/read for each unread message
    await Promise.allSettled(
      unreadMsgs.map(msg =>
        fetch(`${API}/Messages/${msg.oid}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    );
  };

  // Helper: get messages for a conversation
  const getMsgsForConv = (userOid) => {
    if (messages[userOid]) return messages[userOid];
    for (const msgs of Object.values(messages)) {
      if (msgs.some(m => m.senderOid === userOid || m.receiverOid === userOid)) return msgs;
    }
    return [];
  };

  const filteredConversations = conversations.filter(c => {
    const matchSearch = c.userName?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "all")      return true;
    if (filter === "unread")   return c.unreadCount > 0;
    // Use the sets built directly from API responses - most reliable
    if (filter === "sent")     return sentUserOids.has(c.userOid);
    if (filter === "received") return receivedUserOids.has(c.userOid);
    return true;
  });

  const allMessages = selectedUser ? getMsgsForConv(selectedUser) : [];

  // Right panel always shows ALL messages in the conversation
  // The filter (sent/received) only affects which conversations appear in the LEFT list
  const currentMessages = allMessages;
  const selectedConv = conversations.find(c => c.userOid === selectedUser);

  const filterTabs = [
    { id: "all", label: "All", icon: <IconInbox /> },
    { id: "unread", label: "Unread", icon: null },
    { id: "sent", label: "Sent", icon: <IconSend /> },
    { id: "received", label: "Received", icon: null },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%", fontFamily: "var(--font-sans)" }}>

      {showCompose && (
        <NewMessageModal token={token} onClose={(sent) => { setShowCompose(false); if (sent) fetchAll(); }} />
      )}

      {/* Summary Stats */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Total messages", value: summary.totalMessages, accent: "#185FA5" },
            { label: "Unread", value: summary.unreadCount, accent: "#C0391A" },
            { label: "Sent", value: summary.sentCount, accent: "#1A7A47" },
            { label: "Received", value: summary.receivedCount, accent: "#7B2FA8" },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: "var(--color-background-secondary)",
              borderRadius: 12, padding: "14px 18px",
              borderLeft: `3px solid ${accent}`
            }}>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 500, margin: 0, color: "var(--color-text-primary)", lineHeight: 1 }}>{value ?? "—"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, flex: 1, minHeight: 0, height: "calc(100vh - 220px)" }}>

        {/* LEFT: Sidebar */}
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Compose Button */}
          <div style={{ padding: "14px 14px 10px" }}>
            <button
             onClick={() => navigate("/teacher/messages/new")}
              style={{
                width: "100%", padding: "9px 14px", borderRadius: 10,
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-primary)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 7, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--color-background-primary)"}
            >
              <IconCompose /> New Message
            </button>
          </div>

          {/* Search */}
          <div style={{ padding: "0 14px 10px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
              background: "var(--color-background-secondary)",
              borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)"
            }}>
              <span style={{ color: "var(--color-text-tertiary)", display: "flex" }}><IconSearch /></span>
              <input
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: "var(--color-text-primary)", flex: 1
                }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", padding: "0 14px 10px", gap: 4 }}>
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  flex: 1, padding: "5px 4px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontSize: 11.5, fontWeight: filter === tab.id ? 500 : 400,
                  background: filter === tab.id ? "#185FA5" : "transparent",
                  color: filter === tab.id ? "#fff" : "var(--color-text-secondary)",
                  transition: "all 0.15s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConversations.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13, padding: 24 }}>No conversations</p>
            )}
            {filteredConversations.map(c => (
              <div
                key={c.userOid}
                onClick={() => {
                  setSelectedUser(c.userOid);
                  setSelectedMessage(null);
                  if (c.unreadCount > 0) markAsRead(c.userOid);
                }}
                style={{
                  display: "flex", gap: 10, padding: "11px 14px", cursor: "pointer",
                  background: selectedUser === c.userOid ? "rgba(24,95,165,0.07)" : "transparent",
                  borderLeft: selectedUser === c.userOid ? "2.5px solid #185FA5" : "2.5px solid transparent",
                  transition: "background 0.1s"
                }}
              >
                <Avatar name={c.userName} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{c.userName}</span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0, marginLeft: 6 }}>
                      {new Date(c.lastMessageTime).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.lastMessage}
                  </p>
                  {c.unreadCount > 0 && (
                    <span style={{
                      display: "inline-block", marginTop: 4, background: "#C0391A", color: "#fff",
                      fontSize: 10, borderRadius: 10, padding: "1px 7px", fontWeight: 600
                    }}>{c.unreadCount} new</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Messages Panel */}
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            {selectedConv ? (
              <>
                <Avatar name={selectedConv.userName} size={34} />
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{selectedConv.userName}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    {currentMessages.length} message{currentMessages.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>Select a conversation</p>
            )}
          </div>

          {/* Messages split: top list + bottom detail */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

            {/* Message list — scrollable top half */}
            <div style={{ flex: selectedMessage ? "0 0 45%" : "1", overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6, transition: "flex 0.2s" }}>
              {!selectedUser && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.35, paddingTop: 60, gap: 8 }}>
                  <IconInbox />
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>Choose a conversation</p>
                </div>
              )}
              {currentMessages.map(msg => {
                const isMine = msg.senderOid === user.oid;
                const isSelected = selectedMessage?.oid === msg.oid;
                return (
                  <div
                    key={msg.oid}
                    onClick={() => setSelectedMessage(isSelected ? null : msg)}
                    style={{
                      padding: "10px 13px", borderRadius: 10, cursor: "pointer",
                      border: `1.5px solid ${isSelected ? "#185FA5" : "var(--color-border-tertiary)"}`,
                      background: isSelected ? "rgba(24,95,165,0.06)" : "var(--color-background-secondary)",
                      transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10
                    }}
                  >
                    {/* Direction badge */}
                    <span style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                      background: isMine ? "#EAF3DE" : "#E6F1FB",
                      color: isMine ? "#3B6D11" : "#185FA5",
                      minWidth: 58, textAlign: "center"
                    }}>{isMine ? "Sent" : "Received"}</span>

                    {/* Subject + preview */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {msg.subject && (
                        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.subject}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.content}
                      </p>
                    </div>

                    {/* Time */}
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0 }}>{msg.timeAgo}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Detail Panel — slides in at bottom */}
            {selectedMessage && (
              <div style={{
                flex: "0 0 55%", borderTop: "0.5px solid var(--color-border-tertiary)",
                display: "flex", flexDirection: "column", overflow: "hidden"
              }}>
                {/* Detail header */}
                <div style={{
                  padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: "0.5px solid var(--color-border-tertiary)", gap: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 600, padding: "3px 9px", borderRadius: 6, flexShrink: 0,
                      background: selectedMessage.senderOid === user.oid ? "#EAF3DE" : "#E6F1FB",
                      color: selectedMessage.senderOid === user.oid ? "#3B6D11" : "#185FA5"
                    }}>
                      {selectedMessage.senderOid === user.oid ? "Sent" : "Received"}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedMessage.subject || "Message"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{selectedMessage.timeAgo}</span>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "var(--color-text-secondary)", display: "flex" }}
                    ><IconClose /></button>
                  </div>
                </div>

                {/* From / To info */}
                <div style={{ padding: "8px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>From: <span style={{ color: "var(--color-text-secondary)" }}>{selectedMessage.senderName || (selectedMessage.senderOid === user.oid ? "You" : selectedMessage.senderOid)}</span></span>
                  <span style={{ color: "var(--color-text-tertiary)" }}>To: <span style={{ color: "var(--color-text-secondary)" }}>{selectedMessage.receiverName || (selectedMessage.receiverOid === user.oid ? "You" : selectedMessage.receiverOid)}</span></span>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "var(--color-text-primary)", whiteSpace: "pre-wrap" }}>
                    {selectedMessage.content}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}