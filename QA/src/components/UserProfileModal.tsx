import React, { useEffect, useMemo } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Code,
  Mail,
  Layers,
  Bug,
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowLeft,
  FolderKanban
} from 'lucide-react';
import { STATUSES, STATUS_CONFIG, StdIssue, StdStatus, TeamRole } from '../types/std';
import { formatHebrewDateTime } from './IssueCard';

interface UserProfileModalProps {
  fullName: string;
  email?: string;
  role: TeamRole;
  isAdmin: boolean;
  visibleSystems: string[];
  isAllSystemsAccess: boolean;
  issues: StdIssue[];
  onSelectIssue: (issue: StdIssue) => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  fullName,
  email,
  role,
  isAdmin,
  visibleSystems,
  isAllSystemsAccess,
  issues,
  onSelectIssue,
  onClose
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const roleLabel = isAdmin ? 'מנהל מערכת' : role === 'dev' ? 'מפתח' : 'בודק QA';

  const stats = useMemo(() => {
    const lowerName = fullName.trim().toLowerCase();
    const matchesUser = (raw?: string) =>
      Boolean(lowerName && raw && raw.toLowerCase().includes(lowerName));

    const openedIssues: StdIssue[] = [];
    const openedByStatus: Record<StdStatus, number> = {
      'פתוח': 0,
      'בטיפול': 0,
      'ניתן לבדוק שוב': 0,
      'נבדק תקין': 0
    };
    const openedBySystem: Record<string, number> = {};
    let commentsWrittenCount = 0;
    let openInMySystemsCount = 0;
    const openInMySystemsByStatus: Record<StdStatus, number> = {
      'פתוח': 0,
      'בטיפול': 0,
      'ניתן לבדוק שוב': 0,
      'נבדק תקין': 0
    };

    const recentActivityMap = new Map<
      string,
      { issue: StdIssue; kind: 'opened' | 'commented'; timestamp: number }
    >();

    for (const iss of issues) {
      const st = iss.status || 'פתוח';
      if (st in openInMySystemsByStatus) {
        openInMySystemsByStatus[st]++;
      }
      if (st !== 'נבדק תקין') {
        openInMySystemsCount++;
      }

      const openedByMe = matchesUser(iss.createdBy);
      if (openedByMe) {
        openedIssues.push(iss);
        if (st in openedByStatus) {
          openedByStatus[st]++;
        }
        openedBySystem[iss.system] = (openedBySystem[iss.system] || 0) + 1;
        recentActivityMap.set(iss.id, {
          issue: iss,
          kind: 'opened',
          timestamp: iss.updatedAt || iss.createdAt || 0
        });
      }

      let latestMyCommentAt = 0;
      for (const c of iss.comments || []) {
        if (matchesUser(c.author)) {
          commentsWrittenCount++;
          if ((c.createdAt || 0) > latestMyCommentAt) {
            latestMyCommentAt = c.createdAt || 0;
          }
        }
      }

      if (latestMyCommentAt > 0) {
        const existing = recentActivityMap.get(iss.id);
        if (!existing || latestMyCommentAt > existing.timestamp) {
          recentActivityMap.set(iss.id, {
            issue: iss,
            kind: existing ? existing.kind : 'commented',
            timestamp: Math.max(latestMyCommentAt, iss.updatedAt || 0)
          });
        }
      }
    }

    const recentIssues = Array.from(recentActivityMap.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);

    const perSystemBreakdown = Object.entries(openedBySystem).sort((a, b) => b[1] - a[1]);

    return {
      openedCount: openedIssues.length,
      openedByStatus,
      openedBySystem,
      perSystemBreakdown,
      commentsWrittenCount,
      openInMySystemsCount,
      openInMySystemsByStatus,
      recentIssues
    };
  }, [issues, fullName]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Name, Role & Login Email ONLY (no copy button) */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-5 bg-gradient-to-l from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-md ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  : role === 'dev'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                  : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
              }`}
            >
              {isAdmin ? (
                <UserCheck className="w-6 h-6" />
              ) : role === 'dev' ? (
                <Code className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white truncate rtl-safe">
                  {fullName}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold shrink-0 ${
                    isAdmin
                      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                      : role === 'dev'
                      ? 'bg-purple-400/20 text-purple-200 border border-purple-400/30'
                      : 'bg-sky-400/20 text-sky-200 border border-sky-400/30'
                  }`}
                >
                  {roleLabel}
                </span>
              </div>

              {email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <Mail className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  <span dir="ltr" className="truncate">
                    {email}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0 transition"
            aria-label="סגור"
            title="סגור (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* 1. Key Activity KPIs (Works great for QA, Dev & Admin alike!) */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/70 text-center space-y-1">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300">
                <Bug className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-indigo-950 dark:text-white font-mono">
                {stats.openedCount}
              </div>
              <div className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                תקלות שפתחתי
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/70 text-center space-y-1">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/70 text-emerald-600 dark:text-emerald-300">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-emerald-950 dark:text-white font-mono">
                {stats.commentsWrittenCount}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                תגובות שכתבתי
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 text-center space-y-1">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/70 text-amber-600 dark:text-amber-300">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-amber-950 dark:text-white font-mono">
                {stats.openInMySystemsCount}
              </div>
              <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                ממתינות בפרויקטים שלי
              </div>
            </div>
          </div>

          {/* 2. Authorized Projects / Systems */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>פרויקטים מורשים ({visibleSystems.length})</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  isAllSystemsAccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {isAllSystemsAccess ? 'גישה מלאה לכלל המערכות' : 'הרשאה ממוקדת'}
              </span>
            </div>

            {visibleSystems.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                אין כרגע פרויקטים פעילים המשויכים לחשבון זה.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {visibleSystems.map((sys) => {
                  const openedHere = stats.openedBySystem[sys] || 0;
                  return (
                    <span
                      key={sys}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="bidi-isolate">{sys}</span>
                      {openedHere > 0 && (
                        <span
                          className="px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-extrabold"
                          title={`פתחת ${openedHere} תקלות בפרויקט זה`}
                        >
                          {openedHere}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Smart Activity Breakdown (Idea #1) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
              {stats.openedCount > 0
                ? 'פילוח התקלות שפתחתי לפי סטטוס'
                : 'תמונת מצב בפרויקטים המורשים שלי'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUSES.map((st) => {
                const cfg = STATUS_CONFIG[st];
                const count =
                  stats.openedCount > 0
                    ? stats.openedByStatus[st]
                    : stats.openInMySystemsByStatus[st];
                return (
                  <div
                    key={st}
                    className={`p-2.5 rounded-xl border text-center ${cfg.bgBadge} ${cfg.borderBadge}`}
                  >
                    <div className={`text-base font-black font-mono ${cfg.textBadge}`}>{count}</div>
                    <div className={`text-[10px] font-extrabold mt-0.5 truncate ${cfg.textBadge}`}>
                      {st}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. 3 Most Recent Issues I Opened or Commented On (Idea #4) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>3 התקלות האחרונות שלי</span>
              </span>
              {stats.recentIssues.length > 0 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-400">
                  לחץ על תקלה למעבר ישיר
                </span>
              )}
            </div>

            {stats.recentIssues.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                עדיין לא נרשמה פעילות אישית (פתיחת תקלה או תגובה) בפרויקטים הפעילים.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentIssues.map(({ issue, kind, timestamp }) => {
                  const stCfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG['פתוח'];
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer text-right group flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-950 text-white font-mono font-bold text-[10px]">
                            #{issue.testCaseId}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] bidi-isolate">
                            {issue.system}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${stCfg.bgBadge} ${stCfg.textBadge} ${stCfg.borderBadge}`}
                          >
                            {issue.status}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                            {kind === 'opened' ? 'פתחתי' : 'הגבתי'}
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 truncate rtl-safe">
                          {issue.subject}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                          עודכן: {formatHebrewDateTime(timestamp)}
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
