import React, { useMemo, useState } from 'react';
import {
  X,
  UserCheck,
  UserX,
  ShieldCheck,
  Code,
  Layers,
  Clock,
  AlertTriangle,
  Ban,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Loader2,
  Undo2,
  Mail,
  MessageSquareText,
  Info,
  ArrowRight
} from 'lucide-react';
import { JoinRequest } from '../types/std';
import { MAX_JOIN_REJECTIONS } from '../utils/authHelpers';

export interface PendingUndoRejection {
  request: JoinRequest;
  reason: string;
  expiresAt: number;
  secondsLeft: number;
}

interface AdminJoinRequestsModalProps {
  requests: JoinRequest[];
  systems: string[];
  activeTeamUids?: string[];
  existingTeamNames?: string[];
  pendingUndoRejections: PendingUndoRejection[];
  onApproveRequest: (
    req: JoinRequest,
    role: 'qa' | 'dev',
    allowedSystems?: string[]
  ) => Promise<{ ok: boolean; error?: string }>;
  onQueueRejectRequest: (req: JoinRequest, reason: string) => void;
  onUndoRejectRequest: (uid: string) => void;
  onUnblockRequest: (req: JoinRequest) => Promise<{ ok: boolean; error?: string }>;
  onDeleteRequest: (uid: string) => Promise<{ ok: boolean; error?: string }>;
  onBack?: () => void;
  onClose: () => void;
}

const QUICK_REJECTION_REASONS = [
  'נא להזין שם פרטי ומשפחה מלאים',
  'כתובת האימייל אינה מוכרת בצוות',
  'יש לפנות למנהל המערכת לאימות זהות'
];

export const AdminJoinRequestsModal: React.FC<AdminJoinRequestsModalProps> = ({
  requests,
  systems,
  activeTeamUids,
  existingTeamNames,
  pendingUndoRejections,
  onApproveRequest,
  onQueueRejectRequest,
  onUndoRejectRequest,
  onUnblockRequest,
  onDeleteRequest,
  onBack,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [roleByUid, setRoleByUid] = useState<Record<string, 'qa' | 'dev'>>({});
  const [allSystemsByUid, setAllSystemsByUid] = useState<Record<string, boolean>>({});
  const [selectedSystemsByUid, setSelectedSystemsByUid] = useState<Record<string, string[]>>({});
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Protection #1: Explicit confirmation dialog + optional rejection reason
  const [rejectDialogReq, setRejectDialogReq] = useState<JoinRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const undoByUid = useMemo(() => {
    const map: Record<string, PendingUndoRejection> = {};
    for (const item of pendingUndoRejections) {
      map[item.request.uid] = item;
    }
    return map;
  }, [pendingUndoRejections]);

  const pendingList = useMemo(
    () => requests.filter((r) => r.status === 'pending'),
    [requests]
  );

  const historyList = useMemo(
    () => requests.filter((r) => r.status !== 'pending'),
    [requests]
  );

  const blockedCount = useMemo(
    () => historyList.filter((r) => r.status === 'blocked' || r.rejectCount >= MAX_JOIN_REJECTIONS).length,
    [historyList]
  );

  const getSelectedRole = (uid: string): 'qa' | 'dev' => roleByUid[uid] || 'qa';
  const getIsAllSystems = (uid: string): boolean => allSystemsByUid[uid] !== false;
  const getSelectedSystems = (uid: string): string[] => selectedSystemsByUid[uid] || [];

  const toggleSystemForUid = (uid: string, sys: string) => {
    setAllSystemsByUid((prev) => ({ ...prev, [uid]: false }));
    setSelectedSystemsByUid((prev) => {
      const current = prev[uid] || [];
      return {
        ...prev,
        [uid]: current.includes(sys) ? current.filter((s) => s !== sys) : [...current, sys]
      };
    });
  };

  const handleApprove = async (req: JoinRequest) => {
    const chosenRole = getSelectedRole(req.uid);
    const isAll = getIsAllSystems(req.uid);
    const chosenSystems = isAll ? undefined : getSelectedSystems(req.uid);

    if (!isAll && (!chosenSystems || chosenSystems.length === 0)) {
      setFeedbackMsg({
        type: 'err',
        text: 'בחרת להגביל למערכות ספציפיות — נא לסמן לפחות מערכת אחת או לבחור "כל המערכות".'
      });
      return;
    }

    setBusyUid(req.uid);
    setFeedbackMsg(null);
    const res = await onApproveRequest(req, chosenRole, chosenSystems);
    setBusyUid(null);
    if (!res.ok) {
      setFeedbackMsg({ type: 'err', text: res.error || 'אישור הבקשה נכשל.' });
      return;
    }
    const roleHe = chosenRole === 'dev' ? 'מפתח (Dev)' : 'בודק תוכנה (QA)';
    setFeedbackMsg({
      type: 'ok',
      text: `${req.fullName} אושר/ה בהצלחה כ-${roleHe} ונוספ/ה לצוות!`
    });
  };

  const handleOpenRejectDialog = (req: JoinRequest) => {
    setRejectDialogReq(req);
    setRejectionReason('');
    setFeedbackMsg(null);
  };

  const handleConfirmReject = () => {
    if (!rejectDialogReq) return;
    const req = rejectDialogReq;
    const reason = rejectionReason.trim();
    setRejectDialogReq(null);
    setRejectionReason('');
    // Protection #3: Queue with 10-second Undo window BEFORE committing to Firebase!
    onQueueRejectRequest(req, reason);
  };

  const handleUnblock = async (req: JoinRequest) => {
    setBusyUid(req.uid);
    setFeedbackMsg(null);
    const res = await onUnblockRequest(req);
    setBusyUid(null);
    if (!res.ok) {
      setFeedbackMsg({ type: 'err', text: res.error || 'שחרור החסימה נכשל.' });
      return;
    }
    setFeedbackMsg({
      type: 'ok',
      text: `החסימה של ${req.fullName} שוחררה ומונה הניסיונות אופס! הבקשה חזרה לממתינות.`
    });
    setActiveTab('pending');
  };

  const handleDelete = async (req: JoinRequest) => {
    setBusyUid(req.uid);
    setFeedbackMsg(null);
    const res = await onDeleteRequest(req.uid);
    setBusyUid(null);
    if (!res.ok) {
      setFeedbackMsg({ type: 'err', text: res.error || 'מחיקת הרשומה נכשלה.' });
    }
  };

  const formatTime = (ts?: number) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור שלב אחד אחורה"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 relative shrink-0">
              <UserCheck className="w-5 h-5" />
              {pendingList.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                  {pendingList.length}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold truncate">בקשות הצטרפות ואישור משתמשים</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                אשר משתמשים חדשים כבודקי QA או מפתחים, הקצה מערכות או שחרר חסימות
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ממתינות לאישור</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  pendingList.length > 0
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }`}
              >
                {pendingList.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>נדחו / חסומים / היסטוריה</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                {historyList.length}
              </span>
              {blockedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  {blockedCount} חסומים
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                feedbackMsg.type === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}
            >
              {feedbackMsg.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Note about Admin role restriction */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              כאן ניתן לאשר משתמשים כ<strong>בודק תוכנה (QA)</strong> או <strong>מפתח (Dev)</strong> בלבד.
              הוספת <strong>מנהל מערכת</strong> מתבצעת אך ורק ידנית במסך &ldquo;ניהול חברי צוות&rdquo;.
            </span>
          </div>

          {activeTab === 'pending' ? (
            pendingList.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  אין בקשות הצטרפות ממתינות כרגע
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ברגע שעובד חדש יירשם למערכת, תקבל התראה חיה כאן ובדף הבית.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map((req) => {
                  const undoItem = undoByUid[req.uid];
                  const selectedRole = getSelectedRole(req.uid);
                  const isAllSys = getIsAllSystems(req.uid);
                  const selectedSys = getSelectedSystems(req.uid);
                  const isBusy = busyUid === req.uid;

                  // If currently inside the 10-second Undo window, render the clear Undo card!
                  if (undoItem) {
                    return (
                      <div
                        key={req.uid}
                        className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
                      >
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                            <span>
                              הבקשה של {req.fullName} תידחה בעוד{' '}
                              <span className="font-mono text-base">{undoItem.secondsLeft}</span> שניות...
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800 dark:text-amber-300">
                            לחצת בטעות? לחץ &ldquo;בטל דחייה&rdquo; עכשיו.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onUndoRejectRequest(req.uid)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow cursor-pointer shrink-0"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>בטל דחייה</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={req.uid}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
                    >
                      {/* Top row: Applicant Identity & Attempt Badge */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                              {req.fullName}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                req.attemptNumber >= MAX_JOIN_REJECTIONS
                                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                                  : req.attemptNumber === 2
                                  ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                                  : 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                              }`}
                            >
                              ניסיון {req.attemptNumber} מתוך {MAX_JOIN_REJECTIONS}
                              {req.attemptNumber >= MAX_JOIN_REJECTIONS ? ' (אחרון!)' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            {req.username && (
                              <span
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-[11px] font-bold"
                                dir="ltr"
                              >
                                @{req.username}
                              </span>
                            )}
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-mono" dir="ltr">
                              {req.email}
                            </span>
                            <span>•</span>
                            <span>{formatTime(req.requestedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {req.rejectCount > 0 && (
                        <div className="px-3 py-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                          נדחה בעבר {req.rejectCount} {req.rejectCount === 1 ? 'פעם' : 'פעמים'}
                          {req.rejectionReason ? ` • סיבה קודמת: "${req.rejectionReason}"` : ''}
                        </div>
                      )}

                      {Array.isArray(existingTeamNames) &&
                        existingTeamNames.some(
                          (n) =>
                            n.trim().replace(/\s+/g, ' ').toLowerCase() ===
                            req.fullName.trim().replace(/\s+/g, ' ').toLowerCase()
                        ) && (
                          <div className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 font-bold flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                              שים לב: כבר קיים חבר צוות פעיל בשם &ldquo;{req.fullName}&rdquo;! ודא שלא מדובר בחשבון כפול לפני אישור.
                            </span>
                          </div>
                        )}

                      {/* 1. Role Picker (Strictly QA or Dev) */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                          בחר תפקיד לאישור:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setRoleByUid((prev) => ({ ...prev, [req.uid]: 'qa' }))
                            }
                            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                              selectedRole === 'qa'
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>בודק תוכנה (QA)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRoleByUid((prev) => ({ ...prev, [req.uid]: 'dev' }))
                            }
                            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                              selectedRole === 'dev'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Code className="w-4 h-4" />
                            <span>מפתח (Dev)</span>
                          </button>
                        </div>
                      </div>

                      {/* 2. Item #1: Authorized Systems Selector */}
                      {systems.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-indigo-500" />
                              <span>מערכות מורשות למשתמש:</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setAllSystemsByUid((prev) => ({ ...prev, [req.uid]: true }))
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  isAllSys
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                כל המערכות
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setAllSystemsByUid((prev) => ({ ...prev, [req.uid]: false }))
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  !isAllSys
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                בחירה ספציפית
                              </button>
                            </div>
                          </div>

                          {!isAllSys && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {systems.map((sys) => {
                                const checked = selectedSys.includes(sys);
                                return (
                                  <button
                                    key={sys}
                                    type="button"
                                    onClick={() => toggleSystemForUid(req.uid, sys)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                      checked
                                        ? selectedRole === 'dev'
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-sky-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    <span className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center text-[10px] bg-white dark:bg-slate-900 font-black">
                                      {checked ? '✓' : ''}
                                    </span>
                                    <span className="bidi-isolate">{sys}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Action Bar: Big Green Approve on Right, Small Separated Reject on Left */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleApprove(req)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition"
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          <span>
                            {isBusy
                              ? 'מאשר...'
                              : `אשר כ${selectedRole === 'dev' ? 'מפתח' : 'בודק QA'}`}
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleOpenRejectDialog(req)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shrink-0"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>דחה</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : historyList.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              אין היסטוריית בקשות שאושרו, נדחו או נחסמו עדיין.
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((req) => {
                const isBlocked =
                  req.status === 'blocked' || req.rejectCount >= MAX_JOIN_REJECTIONS;
                const isApproved = req.status === 'approved';
                const isRevokedApproved =
                  isApproved &&
                  Array.isArray(activeTeamUids) &&
                  !activeTeamUids.includes(req.uid);
                const isBusy = busyUid === req.uid;

                return (
                  <div
                    key={req.uid}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {req.fullName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              isRevokedApproved
                                ? 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                                : isBlocked
                                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                                : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {isRevokedApproved
                              ? 'אושר בעבר • הוסר מהצוות'
                              : isApproved
                              ? `אושר (${req.approvedRole === 'dev' ? 'מפתח' : 'בודק QA'})`
                              : isBlocked
                              ? `חסום (${req.rejectCount}/${MAX_JOIN_REJECTIONS} דחיות)`
                              : `נדחה (${req.rejectCount}/${MAX_JOIN_REJECTIONS})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                          {req.username && <span className="font-bold text-indigo-600 dark:text-indigo-400">@{req.username}</span>}
                          <span>{req.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(!isApproved || isRevokedApproved) && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUnblock(req)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                            title={
                              isRevokedApproved
                                ? 'החזר את הבקשה לממתינות כדי לאשר מחדש'
                                : 'שחרר חסימה ואפס את מונה הדחיות ל-0'
                            }
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isBlocked
                                ? 'שחרר חסימה ואפס ניסיונות'
                                : isRevokedApproved
                                ? 'החזר לממתינות לאישור'
                                : 'החזר לממתינות ואפס'}
                            </span>
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(req)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition"
                          title="מחק רשומה מהיסטוריית הבקשות"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {req.rejectionReason && !isApproved && (
                      <div className="text-xs text-red-700 dark:text-red-300 bg-red-50/70 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/60 rounded-xl px-3 py-2">
                        <strong>סיבת דחייה:</strong> {req.rejectionReason}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                      {isApproved && req.approvedBy && (
                        <span>אושר ע״י {req.approvedBy} ({formatTime(req.approvedAt)})</span>
                      )}
                      {!isApproved && req.rejectedBy && (
                        <span>נדחה ע״י {req.rejectedBy} ({formatTime(req.rejectedAt)})</span>
                      )}
                      {isApproved && req.approvedSystems && req.approvedSystems.length > 0 && (
                        <span>מערכות: {req.approvedSystems.join(', ')}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>

      {/* Protection #1: Explicit Reject Confirmation Dialog + Optional Rejection Reason */}
      {rejectDialogReq && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  לדחות את {rejectDialogReq.fullName}?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rejectDialogReq.rejectCount + 1 >= MAX_JOIN_REJECTIONS ? (
                    <span className="text-red-600 dark:text-red-400 font-extrabold">
                      ⚠️ זו תהיה הדחייה ה-3 מתוך 3 — החשבון ייחסם אוטומטית מהתחברות ולא יוכל לנסות שוב ללא שחרור מנהל!
                    </span>
                  ) : rejectDialogReq.rejectCount + 1 === 2 ? (
                    <span>
                      זו תהיה <strong>הדחייה ה-2 מתוך 3</strong>. העובד יקבל אזהרה מפורשת שנותר לו ניסיון אחד אחרון לפני חסימה.
                    </span>
                  ) : (
                    <span>
                      זו תהיה <strong>הדחייה ה-1 מתוך 3</strong>. העובד יוכל לנסות להגיש בקשה עוד פעמיים.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Optional Rejection Reason Field */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MessageSquareText className="w-3.5 h-3.5 text-rose-500" />
                <span>סיבת הדחייה (אופציונלי — תוצג לעובד):</span>
              </label>
              <textarea
                rows={2}
                maxLength={300}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="למשל: נא להזין שם מלא אמיתי כדי שאוכל לזהות ולאשר אותך..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 rtl-safe resize-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REJECTION_REASONS.map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setRejectionReason(quick)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition"
                  >
                    + {quick}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 font-semibold">
              לאחר האישור ייפתח חלון של <strong>10 שניות לביטול</strong>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                autoFocus
                onClick={() => setRejectDialogReq(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-extrabold transition cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                <span>כן, דחה בקשה</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
