import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Send,
  ImagePlus,
  ClipboardPaste,
  Trash2,
  Edit3,
  Check,
  Maximize2,
  MessageCircle,
  BellOff,
  BellRing,
  AtSign,
  Hash,
  Cloud,
  Sparkles
} from 'lucide-react';
import {
  ChatTypingUser,
  StdIssue,
  SystemChatMessage,
  TeamRole
} from '../types/std';
import { TeamMember } from '../utils/teamMembers';
import {
  extractImagesFromClipboardEvent,
  processScreenshotFile,
  readImagesFromSystemClipboard
} from '../utils/imageUtils';
import {
  doesMessageMentionUser,
  extractMentionsFromText,
  formatChatDayLabel,
  formatChatTime,
  getChatDayKey,
  parseMessageTokens
} from '../utils/chatUtils';
import { getSavedGoogleDriveUrl } from '../services/googleDriveService';
import { sanitizeImageUrl } from '../utils/securityUtils';

interface SystemChatDrawerProps {
  isOpen: boolean;
  system: string;
  messages: SystemChatMessage[];
  systemIssues: StdIssue[];
  teamMembers: TeamMember[];
  typingUsers: ChatTypingUser[];
  currentUserName: string;
  currentUserRole: TeamRole;
  isAdmin: boolean;
  isSystemMuted: boolean;
  initialLastReadAt: number;
  onClose: () => void;
  onSendMessage: (input: {
    text: string;
    screenshots: string[];
    mentions: string[];
  }) => Promise<void> | void;
  onEditMessage: (messageId: string, newText: string, mentions: string[]) => Promise<void> | void;
  onDeleteMessage: (messageId: string) => Promise<void> | void;
  onToggleReaction: (messageId: string, emoji: string) => Promise<void> | void;
  onTypingChange: (isTyping: boolean) => void;
  onToggleMuteSystem: () => void;
  onJumpToIssue: (testCaseId: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

const QUICK_REACTIONS = ['👍', '✅', '👀'];

function getRoleLabel(role: TeamRole): { text: string; badgeClass: string } {
  if (role === 'admin') {
    return {
      text: 'מנהל',
      badgeClass:
        'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
    };
  }
  if (role === 'dev') {
    return {
      text: 'מפתח',
      badgeClass:
        'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
    };
  }
  return {
    text: 'בודק',
    badgeClass:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
  };
}

export const SystemChatDrawer: React.FC<SystemChatDrawerProps> = ({
  isOpen,
  system,
  messages,
  systemIssues,
  teamMembers,
  typingUsers,
  currentUserName,
  isAdmin,
  isSystemMuted,
  initialLastReadAt,
  onClose,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onToggleReaction,
  onTypingChange,
  onToggleMuteSystem,
  onJumpToIssue,
  onOpenLightbox
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<
    { type: 'mention' | 'issue'; query: string; startIndex: number } | null
  >(null);
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(0);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastTypingSentRef = useRef<number>(0);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasDriveConfigured = Boolean(getSavedGoogleDriveUrl());

  const teamMemberNames = useMemo(
    () => teamMembers.map((m) => m.fullName),
    [teamMembers]
  );

  const issuesByTestCaseId = useMemo(() => {
    const map = new Map<string, StdIssue>();
    for (const iss of systemIssues) {
      map.set(iss.testCaseId.trim().toLowerCase(), iss);
    }
    return map;
  }, [systemIssues]);

  // Index of first unread message when opening the drawer
  const firstUnreadMessageId = useMemo(() => {
    if (!initialLastReadAt || initialLastReadAt <= 0) return null;
    const normalizedSelf = currentUserName.trim().toLowerCase();
    const found = messages.find(
      (m) =>
        m.createdAt > initialLastReadAt &&
        !m.deletedAt &&
        m.author.trim().toLowerCase() !== normalizedSelf
    );
    return found ? found.id : null;
  }, [messages, initialLastReadAt, currentUserName]);

  // Autocomplete candidates for @mention or #issue
  const pickerItems = useMemo(() => {
    if (!activePicker) return [];
    const q = activePicker.query.trim().toLowerCase();
    if (activePicker.type === 'mention') {
      return teamMembers
        .filter((m) => m.fullName.toLowerCase().includes(q))
        .slice(0, 8)
        .map((m) => ({
          id: m.id,
          label: m.fullName,
          sublabel: getRoleLabel(m.role).text,
          insertValue: `@${m.fullName} `
        }));
    }
    return systemIssues
      .filter(
        (iss) =>
          iss.testCaseId.toLowerCase().includes(q) ||
          iss.subject.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((iss) => ({
        id: iss.id,
        label: `#${iss.testCaseId}`,
        sublabel: iss.subject,
        insertValue: `#${iss.testCaseId} `
      }));
  }, [activePicker, teamMembers, systemIssues]);

  // Auto-scroll to bottom when drawer opens or new messages arrive
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(timer);
  }, [isOpen, messages.length, system]);

  // Focus composer when opening drawer
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 120);
    } else {
      setEditingId(null);
      setConfirmDeleteId(null);
      setActivePicker(null);
      onTypingChange(false);
    }
  }, [isOpen, system]);

  useEffect(() => {
    setSelectedPickerIndex(0);
  }, [pickerItems.length, activePicker?.query, activePicker?.type]);

  if (!isOpen) return null;

  const detectAutocompleteTrigger = (value: string, cursorPos: number) => {
    const beforeCursor = value.slice(0, cursorPos);
    const match = beforeCursor.match(/(?:^|\s)([@#])([^\s@#]{0,25})$/);
    if (!match) {
      setActivePicker(null);
      return;
    }
    const triggerChar = match[1];
    const query = match[2] || '';
    const startIndex = beforeCursor.lastIndexOf(triggerChar);
    setActivePicker({
      type: triggerChar === '@' ? 'mention' : 'issue',
      query,
      startIndex
    });
  };

  const applyPickerSelection = (insertValue: string) => {
    if (!activePicker) return;
    const el = textareaRef.current;
    const cursorPos = el?.selectionStart ?? text.length;
    const prefix = text.slice(0, activePicker.startIndex);
    const suffix = text.slice(cursorPos);
    const nextText = `${prefix}${insertValue}${suffix}`;
    setText(nextText);
    setActivePicker(null);
    setTimeout(() => {
      if (textareaRef.current) {
        const nextCursor = prefix.length + insertValue.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    }, 10);
  };

  const notifyTypingActivity = (hasContent: boolean) => {
    if (!hasContent) {
      onTypingChange(false);
      return;
    }
    const now = Date.now();
    if (now - lastTypingSentRef.current > 2000) {
      lastTypingSentRef.current = now;
      onTypingChange(true);
    }
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }
    typingStopTimerRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 3200);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    detectAutocompleteTrigger(val, e.target.selectionStart ?? val.length);
    notifyTypingActivity(val.trim().length > 0);
  };

  const handleAddFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;
    const processed: string[] = [];
    for (const file of list.slice(0, 6)) {
      try {
        const dataUrl = await processScreenshotFile(file);
        processed.push(dataUrl);
      } catch {
        // skip invalid image
      }
    }
    if (processed.length > 0) {
      setAttachments((prev) => [...prev, ...processed].slice(0, 6));
    }
  };

  const handlePasteInComposer = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedImages = await extractImagesFromClipboardEvent(e);
    if (pastedImages.length > 0) {
      setAttachments((prev) => [...prev, ...pastedImages].slice(0, 6));
    }
  };

  const handlePasteFromButton = async () => {
    try {
      const imgs = await readImagesFromSystemClipboard();
      if (imgs.length > 0) {
        setAttachments((prev) => [...prev, ...imgs].slice(0, 6));
        setUploadFeedback('צילום המסך הודבק מהלוח!');
        setTimeout(() => setUploadFeedback(null), 2200);
      }
    } catch {
      setUploadFeedback('השתמש ב-Ctrl+V בשדה ההודעה או העלה קובץ תמונה');
      setTimeout(() => setUploadFeedback(null), 2800);
    }
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isSending) return;

    setIsSending(true);
    const mentions = extractMentionsFromText(trimmed, teamMembers);
    const payloadText = trimmed;
    const payloadImages = [...attachments];

    setText('');
    setAttachments([]);
    setActivePicker(null);
    onTypingChange(false);

    try {
      await onSendMessage({
        text: payloadText,
        screenshots: payloadImages,
        mentions
      });
    } finally {
      setIsSending(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    }
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (activePicker && pickerItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedPickerIndex((prev) => (prev + 1) % pickerItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedPickerIndex((prev) => (prev - 1 + pickerItems.length) % pickerItems.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyPickerSelection(pickerItems[selectedPickerIndex].insertValue);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setActivePicker(null);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSaveEdit = async (msgId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;
    const mentions = extractMentionsFromText(trimmed, teamMembers);
    await onEditMessage(msgId, trimmed, mentions);
    setEditingId(null);
    setEditingText('');
  };

  const normalizedSelf = currentUserName.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/45 dark:bg-slate-950/70 backdrop-blur-[2px] pointer-events-auto transition-opacity"
      />

      {/* Drawer Panel (Full-screen on mobile, Side drawer on Left side in RTL desktop so board remains visible) */}
      <aside
        className="relative mr-auto h-full w-full sm:w-[440px] md:w-[480px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-left duration-200"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer?.files?.length) {
            await handleAddFiles(e.dataTransfer.files);
          }
        }}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-30 bg-indigo-600/20 backdrop-blur-xs border-4 border-dashed border-indigo-500 flex flex-col items-center justify-center text-indigo-900 dark:text-indigo-100 pointer-events-none">
            <ImagePlus className="w-12 h-12 mb-2 text-indigo-600 dark:text-indigo-400" />
            <div className="text-base font-black">שחרר כאן לצרוף תמונות לצ׳אט</div>
          </div>
        )}

        {/* Drawer Header */}
        <div className="shrink-0 px-4 py-3.5 bg-gradient-to-l from-indigo-600 to-violet-600 dark:from-indigo-950 dark:to-slate-900 text-white border-b border-indigo-500/30 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black truncate bidi-isolate">
                  צ׳אט צוות • {system}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-indigo-100/90 dark:text-slate-400">
                <span>{messages.length} הודעות שמורות</span>
                {hasDriveConfigured && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/15 text-[10px] font-bold"
                    title="תמונות בצ׳אט מסונכרנות בענן Google Drive של המערכת"
                  >
                    <Cloud className="w-3 h-3" />
                    <span>ענן תמונות פעיל</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleMuteSystem}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isSystemMuted
                  ? 'bg-amber-500/25 text-amber-200 hover:bg-amber-500/35'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={
                isSystemMuted
                  ? 'צ׳אט מערכת זו מושתק — לחץ להפעלת התראות'
                  : 'השתק התראות לצ׳אט מערכת זו'
              }
            >
              {isSystemMuted ? (
                <BellOff className="w-4 h-4" />
              ) : (
                <BellRing className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="סגור צ׳אט"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Muted Banner Notice */}
        {isSystemMuted && (
          <div className="shrink-0 px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <BellOff className="w-3.5 h-3.5 shrink-0" />
              <span>התראות הצ׳אט למערכת זו מושתקות (תיוגי @שם עדיין יתריעו)</span>
            </span>
            <button
              type="button"
              onClick={onToggleMuteSystem}
              className="font-bold underline cursor-pointer shrink-0"
            >
              בטל השתקה
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-slate-50 dark:bg-slate-950/70"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                תחילת שיחת הצוות במערכת {system}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                כתוב הודעה לצוות, תייג חבר צוות עם <code className="font-bold">@שם</code>, קשר תקלה עם{' '}
                <code className="font-bold">#מספר</code>, או הדבק צילום מסך עם Ctrl+V.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDayDivider =
                !prevMsg || getChatDayKey(prevMsg.createdAt) !== getChatDayKey(msg.createdAt);
              const showUnreadDivider = firstUnreadMessageId === msg.id;

              const isMine = msg.author.trim().toLowerCase() === normalizedSelf;
              const isDeleted = Boolean(msg.deletedAt);
              const mentionsMe = !isMine && !isDeleted && doesMessageMentionUser(msg, currentUserName);
              const roleBadge = getRoleLabel(msg.authorRole);
              const tokens = parseMessageTokens(msg.text || '', teamMemberNames);

              return (
                <React.Fragment key={msg.id}>
                  {showDayDivider && (
                    <div className="flex items-center justify-center my-3">
                      <span className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {formatChatDayLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  {showUnreadDivider && (
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-rose-400/70 dark:bg-rose-500/50" />
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-extrabold">
                        הודעות חדשות
                      </span>
                      <div className="flex-1 h-px bg-rose-400/70 dark:bg-rose-500/50" />
                    </div>
                  )}

                  <div className={`flex flex-col ${isMine ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`group relative max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-2xs border transition ${
                        isDeleted
                          ? 'bg-slate-100/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                          : isMine
                          ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-sm'
                          : mentionsMe
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-slate-900 dark:text-slate-100 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/40 rounded-tl-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 rounded-tl-sm'
                      }`}
                    >
                      {/* Sender Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-extrabold ${
                              isDeleted
                                ? 'text-slate-500 dark:text-slate-400'
                                : isMine
                                ? 'text-indigo-50'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {msg.author}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold border ${
                              isMine && !isDeleted
                                ? 'bg-white/15 text-white border-white/20'
                                : roleBadge.badgeClass
                            }`}
                          >
                            {roleBadge.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] shrink-0">
                          <span
                            className={
                              isMine && !isDeleted
                                ? 'text-indigo-100/90'
                                : 'text-slate-400 dark:text-slate-500'
                            }
                          >
                            {formatChatTime(msg.createdAt)}
                          </span>
                          {msg.editedAt && !isDeleted && (
                            <span
                              className={
                                isMine ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                              }
                            >
                              (נערך)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Body / Edit Mode / Deleted Tombstone */}
                      {isDeleted ? (
                        <div className="text-xs italic py-0.5 flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span>הודעה נמחקה על ידי מנהל</span>
                        </div>
                      ) : editingId === msg.id ? (
                        <div className="space-y-2 mt-1 min-w-[220px]">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit(msg.id);
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            className="w-full rounded-xl p-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-slate-700 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
                            >
                              ביטול
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(msg.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>שמור</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {msg.text && (
                            <p className="text-xs sm:text-[13px] whitespace-pre-wrap break-words leading-relaxed">
                              {tokens.map((tok, tIdx) => {
                                if (tok.type === 'issue') {
                                  const matchedIssue = issuesByTestCaseId.get(
                                    tok.testCaseId.toLowerCase()
                                  );
                                  return (
                                    <button
                                      key={tIdx}
                                      type="button"
                                      onClick={() => onJumpToIssue(tok.testCaseId)}
                                      title={
                                        matchedIssue
                                          ? `פתח תסריט #${matchedIssue.testCaseId}: ${matchedIssue.subject}`
                                          : `אתר תסריט #${tok.testCaseId}`
                                      }
                                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md font-mono font-extrabold text-[11px] underline decoration-dotted cursor-pointer transition ${
                                        isMine
                                          ? 'bg-white/20 text-white hover:bg-white/30'
                                          : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                                      }`}
                                    >
                                      {tok.value}
                                    </button>
                                  );
                                }
                                if (tok.type === 'mention') {
                                  const isMentioningSelf =
                                    tok.name.trim().toLowerCase() === normalizedSelf;
                                  return (
                                    <span
                                      key={tIdx}
                                      className={`inline-block px-1.5 py-0.2 mx-0.5 rounded-md font-bold ${
                                        isMine
                                          ? 'bg-white/20 text-white'
                                          : isMentioningSelf
                                          ? 'bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-100'
                                          : 'bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300'
                                      }`}
                                    >
                                      {tok.value}
                                    </span>
                                  );
                                }
                                return <React.Fragment key={tIdx}>{tok.value}</React.Fragment>;
                              })}
                            </p>
                          )}

                          {/* Attached Screenshots */}
                          {msg.screenshots && msg.screenshots.length > 0 && (
                            <div
                              className={`mt-2 grid gap-1.5 ${
                                msg.screenshots.length === 1
                                  ? 'grid-cols-1 max-w-[260px]'
                                  : 'grid-cols-2'
                              }`}
                            >
                              {msg.screenshots.map((rawImgUrl, imgIdx) => {
                                const imgUrl = sanitizeImageUrl(rawImgUrl);
                                if (!imgUrl) return null;
                                return (
                                  <button
                                    key={imgIdx}
                                    type="button"
                                    onClick={() =>
                                      onOpenLightbox(
                                        msg.screenshots || [],
                                        imgIdx,
                                        `${system} • צילום מצ׳אט (${msg.author})`
                                      )
                                    }
                                    className="relative group/img rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-200 dark:bg-slate-800 aspect-video cursor-pointer"
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={`צילום מצורף ${imgIdx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition">
                                      <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}

                      {/* Reactions Display + Actions Bar */}
                      {!isDeleted && (
                        <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                          {/* Reaction Buttons */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {QUICK_REACTIONS.map((emoji) => {
                              const users = msg.reactions?.[emoji] || [];
                              const iReacted = users.some(
                                (u) => u.trim().toLowerCase() === normalizedSelf
                              );
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => onToggleReaction(msg.id, emoji)}
                                  title={
                                    users.length > 0 ? users.join(', ') : `הגב עם ${emoji}`
                                  }
                                  className={`px-1.5 py-0.5 rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer ${
                                    iReacted
                                      ? isMine
                                        ? 'bg-white text-indigo-700 font-bold'
                                        : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold border border-indigo-300 dark:border-indigo-700'
                                      : users.length > 0
                                      ? isMine
                                        ? 'bg-white/15 text-white hover:bg-white/25'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                      : isMine
                                      ? 'opacity-65 hover:opacity-100 hover:bg-white/15 text-white'
                                      : 'opacity-50 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  {users.length > 0 && (
                                    <span className="font-mono text-[10px]">{users.length}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Author Edit / Admin Delete */}
                          {(isMine || isAdmin) && editingId !== msg.id && (
                            <div className="flex items-center gap-1">
                              {isMine && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingId(msg.id);
                                    setEditingText(msg.text || '');
                                    setConfirmDeleteId(null);
                                  }}
                                  className={`p-1 rounded-lg transition cursor-pointer ${
                                    isMine
                                      ? 'hover:bg-white/20 text-indigo-100'
                                      : 'hover:bg-slate-100 text-slate-500'
                                  }`}
                                  title="ערוך הודעה"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {isAdmin &&
                                (confirmDeleteId === msg.id ? (
                                  <div className="flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await onDeleteMessage(msg.id);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="underline cursor-pointer"
                                    >
                                      אשר מחיקה
                                    </button>
                                    <span>|</span>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="opacity-85 hover:opacity-100 cursor-pointer"
                                    >
                                      ביטול
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(msg.id)}
                                    className={`p-1 rounded-lg transition cursor-pointer ${
                                      isMine
                                        ? 'hover:bg-rose-500/80 text-indigo-100 hover:text-white'
                                        : 'hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600'
                                    }`}
                                    title="מחק הודעה (מנהל)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Live Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="shrink-0 px-4 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.1s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
            </span>
            <span>
              {typingUsers.map((u) => u.author).join(', ')}{' '}
              {typingUsers.length === 1 ? 'כותב עכשיו...' : 'כותבים עכשיו...'}
            </span>
          </div>
        )}

        {/* Composer Section */}
        <div className="relative shrink-0 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Autocomplete Popover (@mention or #issue) */}
          {activePicker && pickerItems.length > 0 && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-20 max-h-52 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                {activePicker.type === 'mention' ? (
                  <>
                    <AtSign className="w-3 h-3 text-indigo-500" />
                    <span>תייג חבר צוות (יקבל התראה מודגשת):</span>
                  </>
                ) : (
                  <>
                    <Hash className="w-3 h-3 text-indigo-500" />
                    <span>קשר תסריט תקלה במערכת {system}:</span>
                  </>
                )}
              </div>
              {pickerItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPickerSelection(item.insertValue)}
                  className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between gap-2 transition cursor-pointer ${
                    idx === selectedPickerIndex
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[55%]">
                    {item.sublabel}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Upload / Paste Feedback Toast */}
          {uploadFeedback && (
            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-1">
              {uploadFeedback}
            </div>
          )}

          {/* Staged Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {attachments.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                >
                  <img src={src} alt="מצורף" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setAttachments((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow"
                    title="הסר תמונה"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input + Action Buttons */}
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-400 transition">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleComposerKeyDown}
                onPaste={handlePasteInComposer}
                rows={2}
                placeholder="כתוב הודעה... (@ לתיוג, # לתקלה, Ctrl+V לצילום מסך)"
                className="w-full bg-transparent text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none leading-relaxed"
              />

              {/* Quick Toolbar inside Composer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-slate-700/70 mt-1">
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                    title="צרף צילום מסך / תמונה"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePasteFromButton}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                    title="הדבק צילום מסך מהלוח"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = text && !text.endsWith(' ') ? `${text} @` : `${text}@`;
                      setText(prefix);
                      setActivePicker({
                        type: 'mention',
                        query: '',
                        startIndex: prefix.length - 1
                      });
                      setTimeout(() => textareaRef.current?.focus(), 10);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                    title="תייג חבר צוות (@)"
                  >
                    <AtSign className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = text && !text.endsWith(' ') ? `${text} #` : `${text}#`;
                      setText(prefix);
                      setActivePicker({
                        type: 'issue',
                        query: '',
                        startIndex: prefix.length - 1
                      });
                      setTimeout(() => textareaRef.current?.focus(), 10);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                    title="קשר לתסריט תקלה (#)"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Enter לשליחה • Shift+Enter לשורה חדשה
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSending || (!text.trim() && attachments.length === 0)}
              onClick={handleSubmit}
              className="h-11 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition cursor-pointer shrink-0"
              title="שלח הודעה"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
