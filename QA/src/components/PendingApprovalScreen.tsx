import React, { useEffect, useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Lock,
  BellRing,
  CheckCircle2,
  LogOut,
  RefreshCw,
  AlertTriangle,
  User,
  Mail,
  Send,
  Loader2,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  Ban
} from 'lucide-react';
import { JoinRequest } from '../types/std';
import { JOIN_RETRY_COOLDOWN_MS, MAX_JOIN_REJECTIONS } from '../utils/authHelpers';

interface PendingApprovalScreenProps {
  firebaseEmail: string;
  joinRequest: JoinRequest | null;
  notificationsEnabled: boolean;
  onEnableNotifications: () => void;
  onResubmitJoinRequest: (fullName: string) => Promise<{ ok: boolean; error?: string }>;
  onBootstrapAdminProfile?: (fullName: string) => Promise<{ ok: boolean; error?: string }>;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  firebaseEmail,
  joinRequest,
  notificationsEnabled,
  onEnableNotifications,
  onResubmitJoinRequest,
  onBootstrapAdminProfile,
  onLogout,
  theme = 'light',
  onToggleTheme
}) => {
  const [fullNameInput, setFullNameInput] = useState(joinRequest?.fullName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [showBootstrapPanel, setShowBootstrapPanel] = useState(false);

  useEffect(() => {
    if (joinRequest?.fullName && !fullNameInput) {
      setFullNameInput(joinRequest.fullName);
    }
  }, [joinRequest?.fullName]);

  // 1-second tick for retry cooldown countdown
  const cooldownUntil =
    joinRequest?.status === 'rejected' && joinRequest.rejectedAt
      ? joinRequest.rejectedAt + JOIN_RETRY_COOLDOWN_MS
      : 0;
  const remainingCooldownSec = Math.max(0, Math.ceil((cooldownUntil - nowMs) / 1000));

  useEffect(() => {
    if (remainingCooldownSec <= 0) return;
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remainingCooldownSec > 0]);

  const rejectCount = joinRequest?.rejectCount ?? 0;
  const isBlocked =
    joinRequest?.status === 'blocked' || rejectCount >= MAX_JOIN_REJECTIONS;
  const isRejected = !isBlocked && joinRequest?.status === 'rejected';
  const isPending = joinRequest?.status === 'pending';
  const isRevokedApproved = !isBlocked && joinRequest?.status === 'approved';
  const displayName = joinRequest?.fullName || fullNameInput || firebaseEmail.split('@')[0] || 'משתמש';

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const clean = fullNameInput.trim();
    if (clean.length < 2) {
      setError('נא להזין שם מלא תקין (לפחות 2 תווים).');
      return;
    }
    setIsSubmitting(true);
    const res = await onResubmitJoinRequest(clean);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'שליחת הבקשה נכשלה.');
      return;
    }
    setSuccessMsg('בקשת ההצטרפות נשלחה מחדש למנהל המערכת! ממתין לאישור.');
  };

  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onBootstrapAdminProfile) return;
    setError(null);
    const clean = fullNameInput.trim();
    if (clean.length < 2) {
      setError('נא להזין שם מלא תקין.');
      return;
    }
    setIsSubmitting(true);
    const res = await onBootstrapAdminProfile(clean);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'אתחול מנהל ראשוני נחסם (כבר קיים מנהל במערכת).');
    }
  };

  const formatTimestamp = (ts?: number) => {
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
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      dir="rtl"
    >
      {/* Home-Shell Header (Zero workspace data exposed!) */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 p-1.5 border border-indigo-400/30 shadow-md flex items-center justify-center shrink-0">
              <img src="./icon.svg" alt="סמל צב מן" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  צב מן
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isBlocked
                      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                      : isRejected
                      ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                  }`}
                >
                  {isBlocked
                    ? 'חשבון חסום'
                    : isRejected
                    ? 'בקשה נדחתה'
                    : 'ממתין לאישור מנהל'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                דף הבית • צוות בדיקות מדור נחשון
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                title={theme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>התנתק</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Waiting Room Home Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Main Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Colored Status Header Banner */}
          <div
            className={`px-6 py-7 text-center border-b ${
              isBlocked
                ? 'bg-gradient-to-b from-red-50 to-white dark:from-red-950/40 dark:to-slate-900 border-red-100 dark:border-red-900/50'
                : isRejected
                ? 'bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 border-amber-100 dark:border-amber-900/50'
                : 'bg-gradient-to-b from-indigo-50/90 to-white dark:from-indigo-950/40 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50'
            }`}
          >
            {/* Animated Status Icon */}
            <div className="flex justify-center mb-4">
              {isBlocked ? (
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/80 border-2 border-red-300 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shadow-lg">
                  <Ban className="w-8 h-8" />
                </div>
              ) : isRejected ? (
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg">
                  <ShieldAlert className="w-8 h-8" />
                </div>
              ) : (
                <div className="relative flex items-center justify-center w-16 h-16">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-indigo-400 opacity-30" />
                  <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>

            {isBlocked ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-red-700 dark:text-red-400">
                  החשבון שלך נחסם מהתחברות למערכת
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  בקשת ההצטרפות שלך נדחתה <strong>3 פעמים</strong>, ולכן האפשרות לשלוח בקשות נוספות נחסמה.
                </p>
              </>
            ) : isRejected ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  בקשת ההצטרפות שלך נדחתה
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  שלום <strong>{displayName}</strong>, המנהל דחה את הבקשה האחרונה שלך (ניסיון{' '}
                  {rejectCount} מתוך {MAX_JOIN_REJECTIONS}).
                </p>
              </>
            ) : isPending ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[11px] font-extrabold mb-3 border border-indigo-200 dark:border-indigo-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    מאזין לאישור בזמן אמת • ניסיון {joinRequest?.attemptNumber || 1} מתוך{' '}
                    {MAX_JOIN_REJECTIONS}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  שלום {displayName}, אתה עדיין לא מאושר למערכת
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  בקשתך נשלחה למנהל המערכת! המתן לאישורו — ברגע שהמנהל יאשר אותך (כבודק תוכנה או מפתח),
                  דף הבית יתחבר אוטומטית ותקבל הודעת אישור מיד.
                </p>
              </>
            ) : isRevokedApproved ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  הרשאת הגישה של חשבון זה אינה פעילה
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  חשבון זה אושר בעבר אך כרגע אינו פעיל בצוות (ייתכן שהגישה הוסרה או הועברה לחשבון אימייל אחר שלך).
                  אם יש לך מייל אחר במערכת — לחץ <strong>התנתק</strong> והתחבר דרכו, או שלח בקשת הצטרפות מחדש למנהל למטה.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  השלמת בקשת הצטרפות למערכת
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  חשבונך מחובר אך טרם אושר ע״י מנהל. הזן את שמך המלא כדי לשלוח בקשת הצטרפות מיידית למנהל המערכת.
                </p>
              </>
            )}
          </div>

          {/* Body Content by State */}
          <div className="p-6 space-y-5">
            {/* Admin Rejection Reason Box (shown on rejected or blocked if provided) */}
            {(isRejected || isBlocked) && joinRequest?.rejectionReason && (
              <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/70 space-y-1">
                <div className="text-xs font-extrabold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>סיבת הדחייה מהמנהל:</span>
                </div>
                <p className="text-sm font-semibold text-red-950 dark:text-red-100 leading-relaxed rtl-safe">
                  &ldquo;{joinRequest.rejectionReason}&rdquo;
                </p>
              </div>
            )}

            {/* Specific Warning for 2nd Rejection (User's Exact Rule!) */}
            {isRejected && rejectCount === 2 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-700 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>אזהרה: ניסיון שני ואחד לפני האחרון!</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100 leading-relaxed">
                  זהו הניסיון השני ואחד לפני האחרון לפני שתיחסם מהתחברות למערכת ותצטרך לפנות ישירות למנהל.
                  וודא שהשם המלא שלך תקין ומוכר למנהל לפני שליחת הבקשה האחרונה.
                </p>
              </div>
            )}

            {/* 1st Rejection Helpful Notice */}
            {isRejected && rejectCount === 1 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                נותרו לך עוד <strong>2 ניסיונות נוספים</strong> לשלוח בקשת הצטרפות. באפשרותך לעדכן את השם המלא למטה ולנסות שוב.
              </div>
            )}

            {/* Blocked State Instructions */}
            {isBlocked && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-center">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  יש לפנות ישירות למנהל המערכת
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  רק מנהל מערכת יכול לשחרר את החסימה עבור כתובת{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">
                    {firebaseEmail}
                  </span>{' '}
                  ולאשר את הצטרפותך לצוות. אם המנהל ישחרר את החסימה או יאשר אותך, המסך יתעדכן אוטומטית!
                </p>
              </div>
            )}

            {/* Account Summary Pill */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    שם שנשלח לאישור
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{displayName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    חשבון מחובר
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate block" dir="ltr">
                    {firebaseEmail}
                  </span>
                </div>
              </div>
              {joinRequest?.requestedAt && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>מועד הבקשה האחרונה: {formatTimestamp(joinRequest.requestedAt)}</span>
                  <span className="font-bold">
                    ניסיון {joinRequest.attemptNumber} / {MAX_JOIN_REJECTIONS}
                  </span>
                </div>
              )}
            </div>

            {/* Item #3: Enable Notification on Device When Approved */}
            {!isBlocked && (
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  notificationsEnabled
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notificationsEnabled
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                        : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300'
                    }`}
                  >
                    {notificationsEnabled ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <BellRing className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {notificationsEnabled
                        ? 'התראות למכשיר פעילות!'
                        : 'רוצה לקבל התראה למכשיר ברגע שתאושר?'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {notificationsEnabled
                        ? 'ברגע שהמנהל יאשר את חשבונך, תקפוץ לך התראה עם צליל והמערכת תיפתח מיד.'
                        : 'אפשר התראות כדי שלא תצטרך לבדוק ידנית — תקבל הודעה מיד ברגע האישור.'}
                    </p>
                  </div>
                </div>
                {!notificationsEnabled && (
                  <button
                    type="button"
                    onClick={onEnableNotifications}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>הפעל התראה כשאאושר</span>
                  </button>
                )}
              </div>
            )}

            {/* Retry / Initial Submit Form (For rejected < 3, revoked previously-approved accounts, or missing joinRequest) */}
            {(isRejected || isRevokedApproved || !joinRequest) && !isBlocked && (
              <form
                onSubmit={handleSubmitRequest}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {isRejected || isRevokedApproved
                    ? 'עדכן את שמך המלא ושלח בקשה מחדש למנהל:'
                    : 'הזן את שמך המלא לשליחת הבקשה למנהל:'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={120}
                      value={fullNameInput}
                      onChange={(e) => {
                        setFullNameInput(e.target.value);
                        setError(null);
                      }}
                      placeholder="שם פרטי ומשפחה..."
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500 rtl-safe"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || remainingCooldownSec > 0}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>שולח...</span>
                      </>
                    ) : remainingCooldownSec > 0 ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>המתן {remainingCooldownSec} שניות...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {isRejected
                            ? rejectCount === 2
                              ? 'שלח בקשה (ניסיון אחרון)'
                              : 'שלח בקשה מחדש'
                            : 'שלח בקשת הצטרפות'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Locked Home Preview Skeleton (Zero Real Data — Pure Visual Context) */}
            <div className="relative rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 overflow-hidden">
              <div className="grid grid-cols-3 gap-2.5 opacity-30 select-none pointer-events-none blur-[1.5px]">
                <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold shadow-md border border-slate-700">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>הגישה למערכות נעולה עד לאישור המנהל</span>
                </div>
              </div>
            </div>

            {/* Subtle First-Time Empty-DB Admin Bootstrap Option (only when no joinRequest yet) */}
            {!joinRequest && onBootstrapAdminProfile && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                {!showBootstrapPanel ? (
                  <button
                    type="button"
                    onClick={() => setShowBootstrapPanel(true)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition"
                  >
                    הגדרת מנהל ראשי (התקנה ראשונית)
                  </button>
                ) : (
                  <form
                    onSubmit={handleBootstrapSubmit}
                    className="mt-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-right"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>הגדרת מנהל ראשי למערכת חדשה</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      הגדר כמנהל ראשי
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>הדף מתעדכן אוטומטית בזמן אמת — אין צורך לרענן</span>
        </div>
      </main>
    </div>
  );
};
