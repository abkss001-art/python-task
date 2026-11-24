import React, { useEffect, useState } from 'react';
import {
  X,
  SlidersHorizontal,
  BarChart3,
  DatabaseBackup,
  Users,
  Settings,
  KeyRound,
  Gauge,
  Archive,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Lock,
  Unlock,
  Terminal,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { verifyDeveloperVaultPassword } from '../utils/securityUtils';

interface AdminToolsModalProps {
  archivedCount: number;
  pendingJoinRequestsCount?: number;
  initialView?: 'main' | 'dev';
  isDevVaultUnlocked: boolean;
  onUnlockDevVault: () => void;
  onLockDevVault: () => void;
  onOpenReport: () => void;
  onOpenBackup: () => void;
  onOpenTeam: () => void;
  onOpenJoinRequests: () => void;
  onOpenCloud: () => void;
  onOpenSecurity: () => void;
  onOpenQuota: () => void;
  onOpenArchive: () => void;
  onOpenMcpAdmin: () => void;
  onClose: () => void;
}

const MAX_DEV_ATTEMPTS = 5;
const DEV_LOCKOUT_MS = 30_000;

export const AdminToolsModal: React.FC<AdminToolsModalProps> = ({
  archivedCount,
  pendingJoinRequestsCount = 0,
  initialView = 'main',
  isDevVaultUnlocked,
  onUnlockDevVault,
  onLockDevVault,
  onOpenReport,
  onOpenBackup,
  onOpenTeam,
  onOpenJoinRequests,
  onOpenCloud,
  onOpenSecurity,
  onOpenQuota,
  onOpenArchive,
  onOpenMcpAdmin,
  onClose
}) => {
  const [view, setView] = useState<'main' | 'dev_gate' | 'dev'>(() => {
    if (initialView === 'dev') {
      return isDevVaultUnlocked ? 'dev' : 'dev_gate';
    }
    return 'main';
  });
  const [devPassword, setDevPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!lockedUntil || lockedUntil <= Date.now()) {
      setLockSecondsLeft(0);
      return;
    }
    const tick = () => {
      const rem = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockSecondsLeft(rem);
      if (rem === 0) {
        setLockedUntil(0);
        setFailedAttempts(0);
        setAuthError(null);
      }
    };
    tick();
    const timer = window.setInterval(tick, 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const handleOpenDevArea = () => {
    setAuthError(null);
    setDevPassword('');
    if (isDevVaultUnlocked) {
      setView('dev');
    } else {
      setView('dev_gate');
    }
  };

  const handleSubmitDevPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockSecondsLeft > 0 || isVerifying) return;
    if (!devPassword.trim()) {
      setAuthError('נא להזין סיסמה.');
      return;
    }
    setIsVerifying(true);
    setAuthError(null);
    try {
      const ok = await verifyDeveloperVaultPassword(devPassword);
      if (ok) {
        setDevPassword('');
        setFailedAttempts(0);
        setLockedUntil(0);
        onUnlockDevVault();
        setView('dev');
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        setDevPassword('');
        if (nextFailed >= MAX_DEV_ATTEMPTS) {
          const until = Date.now() + DEV_LOCKOUT_MS;
          setLockedUntil(until);
          setAuthError('בוצעו יותר מדי ניסיונות שגויים. הכניסה ננעלה ל-30 שניות.');
        } else {
          const remaining = MAX_DEV_ATTEMPTS - nextFailed;
          setAuthError(`סיסמה שגויה (נותרו ${remaining} ניסיונות).`);
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockAndGoBack = () => {
    onLockDevVault();
    setDevPassword('');
    setAuthError(null);
    setView('main');
  };

  const regularSecondaryTools = [
    {
      id: 'report',
      title: 'דוח התקדמות מנהלים',
      subtitle: 'גרפים, פילוחים וסיכום כלל המערכות',
      icon: BarChart3,
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800',
      action: onOpenReport
    },
    {
      id: 'archive',
      title: 'ארכיון מערכות',
      subtitle: 'צפייה ושחזור של מערכות בארכיון',
      icon: Archive,
      iconBg: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800',
      badge: archivedCount > 0 ? `${archivedCount} מערכות` : undefined,
      action: onOpenArchive
    }
  ];

  const devTools = [
    {
      id: 'backup',
      title: 'גיבוי נתונים וייבוא אקסל',
      subtitle: 'גיבוי, שחזור וייבוא תסריטים מאקסל / CSV',
      icon: DatabaseBackup,
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
      action: onOpenBackup
    },
    {
      id: 'quota',
      title: 'מכסות שימוש ואחסון',
      subtitle: 'מעקב אחר נפח אחסון, מחוברים ומכסות שימוש',
      icon: Gauge,
      iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800',
      action: onOpenQuota
    },
    {
      id: 'security',
      title: 'אבטחה ויומן פעולות',
      subtitle: 'מצב אבטחת המערכת ותיעוד פעולות',
      icon: KeyRound,
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
      action: onOpenSecurity
    },
    {
      id: 'cloud',
      title: 'הגדרות חיבור וסנכרון',
      subtitle: 'הגדרות סנכרון בזמן אמת של המערכת',
      icon: Settings,
      iconBg: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800',
      action: onOpenCloud
    },
    {
      id: 'mcp',
      title: 'חיבור סוכני AI (MCP)',
      subtitle: 'הפעלה, ניהול וכיבוי של חיבור Antigravity ו-Claude לצוות',
      icon: Bot,
      iconBg: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800',
      action: onOpenMcpAdmin
    }
  ];

  const isSubView = view === 'dev_gate' || view === 'dev';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className={`flex items-center justify-between gap-2 px-5 sm:px-6 py-4 text-white shrink-0 ${
            view === 'dev' || view === 'dev_gate'
              ? 'bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-900'
              : 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isSubView && (
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  setDevPassword('');
                  setView('main');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור לכלי ניהול"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div
              className={`p-2 rounded-2xl border shrink-0 ${
                isSubView
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
              }`}
            >
              {view === 'dev' ? (
                <Terminal className="w-5 h-5" />
              ) : view === 'dev_gate' ? (
                <Lock className="w-5 h-5" />
              ) : (
                <SlidersHorizontal className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2 truncate">
                <span>
                  {view === 'dev'
                    ? 'סביבת מפתח'
                    : view === 'dev_gate'
                    ? 'כניסה לסביבת מפתח'
                    : 'כלי ניהול ושליטה'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold shrink-0 ${
                    isSubView
                      ? 'bg-amber-400/20 text-amber-200'
                      : 'bg-white/10 text-indigo-200'
                  }`}
                >
                  {isSubView ? 'מוגן' : 'מנהל מערכת'}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 truncate">
                {view === 'dev'
                  ? 'כלי תשתית, גיבוי, אבטחה ומכסות'
                  : view === 'dev_gate'
                  ? 'הזן סיסמת מפתח להמשך'
                  : 'בחר פעולה מהרשימה לפתיחה מהירה'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {view === 'dev' && (
              <button
                type="button"
                onClick={handleLockAndGoBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold cursor-pointer transition"
                title="נעל סביבת מפתח וחזור"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">נעל</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
              title="סגור"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {view === 'main' && (
          <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
            {/* Row 1: Team Management (First / Right) + Join Requests (Second / Left) side by side */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTeam();
                }}
                className="flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 bg-white dark:bg-slate-800/90 hover:bg-violet-50/50 dark:hover:bg-slate-800 transition cursor-pointer text-right group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:-translate-x-0.5 transition-transform shrink-0 mt-1" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 leading-snug">
                    ניהול חברי צוות
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 leading-snug">
                    הוספה, עריכה והקצאת מערכות
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenJoinRequests();
                }}
                className={`flex flex-col justify-between p-3.5 rounded-2xl border transition cursor-pointer text-right group shadow-xs hover:shadow-sm ${
                  pendingJoinRequestsCount > 0
                    ? 'border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-slate-800/90 hover:bg-teal-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${
                      pendingJoinRequestsCount > 0
                        ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700'
                        : 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                  </div>
                  {pendingJoinRequestsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs animate-pulse shrink-0">
                      {pendingJoinRequestsCount} ממתינות
                    </span>
                  ) : (
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:-translate-x-0.5 transition-transform shrink-0 mt-1" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 leading-snug">
                    בקשות הצטרפות
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 leading-snug">
                    אישור עובדים ושחרור חסימות
                  </p>
                </div>
              </button>
            </div>

            {/* Regular Secondary Admin Tools */}
            <div className="space-y-2.5">
              {regularSecondaryTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      tool.action();
                    }}
                    className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800/90 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition cursor-pointer text-right group shadow-xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${tool.iconBg}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 truncate">
                            {tool.title}
                          </span>
                          {tool.badge && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed truncate">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:-translate-x-1 transition-transform shrink-0 mr-2" />
                  </button>
                );
              })}
            </div>

            {/* Locked Developer Environment Entry */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={handleOpenDevArea}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-l from-amber-50/80 via-white to-slate-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 hover:border-amber-500 dark:hover:border-amber-600 transition cursor-pointer text-right group shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border bg-slate-900 text-amber-400 border-amber-500/40 group-hover:scale-105 transition-transform">
                    {isDevVaultUnlocked ? (
                      <Unlock className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        סביבת מפתח
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                          isDevVaultUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {isDevVaultUnlocked ? 'פתוחה' : 'מוגן בסיסמה'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      גיבוי, מכסות שימוש, אבטחה, חיבור וסוכני AI
                    </p>
                  </div>
                </div>

                <ArrowLeft className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0 mr-2" />
              </button>
            </div>
          </div>
        )}

        {view === 'dev_gate' && (
          <form onSubmit={handleSubmitDevPassword} className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="leading-relaxed font-medium">
                אזור זה מיועד למפתח המערכת בלבד (גיבוי, מכסות, אבטחה, חיבור וסוכני AI).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                סיסמת מפתח
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  disabled={lockSecondsLeft > 0 || isVerifying}
                  value={devPassword}
                  onChange={(e) => {
                    setDevPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="הזן סיסמת מפתח..."
                  className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition disabled:opacity-60"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  {lockSecondsLeft > 0
                    ? `הכניסה ננעלה זמנית — נסה שוב בעוד ${lockSecondsLeft} שניות.`
                    : authError}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={lockSecondsLeft > 0 || isVerifying || !devPassword.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מאמת סיסמה...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>פתח סביבת מפתח</span>
                </>
              )}
            </button>
          </form>
        )}

        {view === 'dev' && (
          <div className="p-4 sm:p-6 space-y-2.5 overflow-y-auto flex-1">
            {devTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    tool.action();
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-slate-800/90 hover:bg-amber-50/40 dark:hover:bg-slate-800 transition cursor-pointer text-right group shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${tool.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 truncate">
                        {tool.title}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed truncate">
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0 mr-2" />
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {isSubView ? (
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setDevPassword('');
                setView('main');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזור לכלי מנהל</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
