import { api } from '../../../app/lib/api';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { Send, ArrowLeft, User, Users, Search, X, Check, ChevronDown, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

// ─── Avatar Colors ───────────────────────────────────────────────────────────
const PALETTES = [
  ["#E6F1FB", "#0C447C"],
  ["#E1F5EE", "#085041"],
  ["#FBEAF0", "#72243E"],
  ["#EEEDFE", "#3C3489"],
  ["#FAEEDA", "#633806"],
];

const CustomAvatar = ({ name, size = 32 }) => {
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

// ─── ReceiverSearch Component ─────────────────────────────────────────────────
function ReceiverSearch({ token, selected, onSelect, isRTL }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("teachers");
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
      if (activeTab === "teachers") endpoint = "Teachers";
      else if (activeTab === "parents") endpoint = "Parents";

      const res = await fetch(`http://edusmarrt.runasp.net/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      let users = data.data || [];
      users = users.map(user => ({
        ...user,
        oid: user.userId || user.oid || user.id,
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
    const userOid = person.userId || person.oid || person.id;
    onSelect({ 
      oid: userOid,
      name: person.fullName || person.userName 
    });
    setOpen(false);
    setQuery("");
  };

  if (selected) {
    return (
      <div className="flex items-center gap-2">
        <CustomAvatar name={selected.name} size={28} />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {selected.name}
        </span>
        <button
          onClick={() => onSelect(null)}
          className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-text transition-all focus-within:ring-2 focus-within:ring-indigo-500"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search teacher or parent..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: "teachers", label: "Teachers" },
              { key: "parents", label: "Parents" }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                No results found
              </p>
            )}

            {!loading && filtered.map((person) => (
              <div
                key={person.oid}
                onClick={() => handlePick(person)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <CustomAvatar name={person.fullName} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {person.fullName}
                  </p>
                  {person.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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

// ─── Main Component ──────────────────────────────────────────────────────────
export function StudentSendMessage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
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

      if (isGroup) {
        payload.targetRole = targetRole;
      } else {
        payload.receiverOid = receiver.oid;
      }

      console.log("📤 Sending payload:", payload);

      const result = await api.messages.send(payload);

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
      console.error("Error sending message:", e);
      setError(e.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/teacher/messages")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('newMessage')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('sendMessageToTeachersOrGroup')}
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => handleModeChange(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !isGroup
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          {t('directMessage')}
        </button>
        <button
          onClick={() => handleModeChange(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isGroup
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          {t('groupMessage')}
        </button>
      </div>

      {/* Message Form */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          {/* To Field */}
          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 dark:border-gray-700 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
              {isGroup ? t('toRole') : t('to')}
            </label>
            <div className="flex-1">
              {isGroup ? (
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">{t('selectRole')}</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              ) : (
                <ReceiverSearch token={token} selected={receiver} onSelect={setReceiver} isRTL={isRTL} />
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 dark:border-gray-700 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
              {t('subject')}
            </label>
            <div className="flex-1">
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('subjectOptional')}
                className="w-full"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 dark:border-gray-700 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
              {t('message')}
            </label>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('writeYourMessage')}
                rows={8}
                className="w-full resize-none"
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {showAdvanced ? t('hideAdvanced') : t('showAdvanced')}
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className={`flex flex-col sm:flex-row gap-3 p-4 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <label className="sm:w-20 text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
                {t('replyTo')}
              </label>
              <div className="flex-1">
                <Input
                  value={parentMessageOid}
                  onChange={(e) => setParentMessageOid(e.target.value)}
                  placeholder={t('parentMessageId')}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t('parentMessageHint')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            {t('messageSentSuccess')}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => navigate("/teacher/messages")}
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSend}
          disabled={!canSend || sending}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('sending')}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t('sendMessage')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}