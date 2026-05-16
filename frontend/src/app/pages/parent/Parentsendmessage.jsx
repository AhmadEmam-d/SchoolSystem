import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Send, ArrowLeft, Search, X, Check, ChevronDown, Loader2
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { api } from '../../lib/api';

const PALETTES = [
  ['#E6F1FB', '#0C447C'],
  ['#E1F5EE', '#085041'],
  ['#FBEAF0', '#72243E'],
  ['#EEEDFE', '#3C3489'],
  ['#FAEEDA', '#633806'],
];

const CustomAvatar = ({ name, size = 32 }) => {
  const initials = (name || '').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  const [bg, fg] = PALETTES[(name || '').charCodeAt(0) % PALETTES.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 500, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

function ReceiverSearch({ selected, onSelect, isRTL }) {
  const token = localStorage.getItem('token');
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) fetchList();
  }, [open]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`https://localhost:7179/api/Teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const users = (data.data || []).map(u => ({
        ...u,
        oid:      u.userId || u.oid || u.id,
        fullName: u.fullName || u.userName || u.name,
      }));
      setResults(users);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter(p =>
    (p.fullName || '').toLowerCase().includes(query.toLowerCase()) ||
    (p.email    || '').toLowerCase().includes(query.toLowerCase())
  );

  const handlePick = (person) => {
    onSelect({ oid: person.userId || person.oid || person.id, name: person.fullName || person.userName });
    setOpen(false);
    setQuery('');
  };

  if (selected) {
    return (
      <div className="flex items-center gap-2">
        <CustomAvatar name={selected.name} size={28} />
        <span className="text-sm font-medium text-foreground">{selected.name}</span>
        <button
          onClick={() => onSelect(null)}
          className="p-1 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted cursor-text transition-all focus-within:ring-2 focus-within:ring-indigo-500"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search teacher..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-lg border border-border z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teachers</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-center py-8 text-sm text-muted-foreground">No results found</p>
            )}
            {!loading && filtered.map(person => (
              <div
                key={person.oid}
                onClick={() => handlePick(person)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
              >
                <CustomAvatar name={person.fullName} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{person.fullName}</p>
                  {person.email && (
                    <p className="text-xs text-muted-foreground truncate">{person.email}</p>
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

export function ParentSendMessage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [receiver,         setReceiver]         = useState(null);
  const [subject,          setSubject]          = useState('');
  const [content,          setContent]          = useState('');
  const [parentMessageOid, setParentMessageOid] = useState('');
  const [sending,          setSending]          = useState(false);
  const [error,            setError]            = useState('');
  const [success,          setSuccess]          = useState(false);
  const [showAdvanced,     setShowAdvanced]     = useState(false);

  const canSend = content.trim() && receiver?.oid;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        receiverOid:    receiver.oid,
        content:        content.trim(),
        isGroupMessage: false,
      };
      if (subject.trim())          payload.subject          = subject.trim();
      if (parentMessageOid.trim()) payload.parentMessageOid = parentMessageOid.trim();

      const result = await api.messages.send(payload);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/parent/messages'), 1500);
      } else {
        throw new Error(result.messages?.EN || result.messages?.AR || result.message || 'Failed to send message');
      }
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/parent/messages')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('newMessage')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('sendMessageToTeachersOrAdmin', 'Send a message to a teacher')}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-0">

          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-border ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-muted-foreground pt-2">{t('to')}</label>
            <div className="flex-1">
              <ReceiverSearch selected={receiver} onSelect={setReceiver} isRTL={isRTL} />
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-border ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-muted-foreground pt-2">{t('subject')}</label>
            <div className="flex-1">
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('subjectOptional')}
              />
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b border-border ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <label className="sm:w-20 text-sm font-medium text-muted-foreground pt-2">{t('message')}</label>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }}
                placeholder={t('writeYourMessage')}
                rows={8}
                className="resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {showAdvanced ? t('hideAdvanced') : t('showAdvanced')}
          </button>

          {showAdvanced && (
            <div className={`flex flex-col sm:flex-row gap-3 p-4 border-t border-border ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <label className="sm:w-20 text-sm font-medium text-muted-foreground pt-2">{t('replyTo')}</label>
              <div className="flex-1">
                <Input
                  value={parentMessageOid}
                  onChange={(e) => setParentMessageOid(e.target.value)}
                  placeholder={t('parentMessageId')}
                />
                <p className="text-xs text-muted-foreground mt-1">{t('parentMessageHint')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {success && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">{t('messageSentSuccess')}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => navigate('/parent/messages')}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSend}
          disabled={!canSend || sending}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          {sending ? (
            <><Loader2 className="h-4 w-4 animate-spin" />{t('sending')}</>
          ) : (
            <><Send className="h-4 w-4" />{t('sendMessage')}</>
          )}
        </Button>
      </div>
    </div>
  );
}