import React from 'react';
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
  UserPlus
} from 'lucide-react';

interface AdminToolsModalProps {
  archivedCount: number;
  pendingJoinRequestsCount?: number;
  onOpenReport: () => void;
  onOpenBackup: () => void;
  onOpenTeam: () => void;
  onOpenJoinRequests: () => void;
  onOpenCloud: () => void;
  onOpenSecurity: () => void;
  onOpenQuota: () => void;
  onOpenArchive: () => void;
  onClose: () => void;
}

export const AdminToolsModal: React.FC<AdminToolsModalProps> = ({
  archivedCount,
  pendingJoinRequestsCount = 0,
  onOpenReport,
  onOpenBackup,
  onOpenTeam,
  onOpenJoinRequests,
  onOpenCloud,
  onOpenSecurity,
  onOpenQuota,
  onOpenArchive,
  onClose
}) => {
  const tools = [
    {
      id: 'join-requests',
      title: 'בקשות הצטרפות ואישור משתמשים',
      subtitle: 'אישור מהיר של עובדים חדשים כבודקי QA או מפתחים, הקצאת מערכות ושחרור חסימות',
      icon: UserPlus,
      iconBg:
        pendingJoinRequestsCount > 0
          ? 'bg-rose-100 text-rose-700 border-rose-300'
          : 'bg-teal-100 text-teal-700 border-teal-200',
      badge:
        pendingJoinRequestsCount > 0 ? `${pendingJoinRequestsCount} ממתינות לאישור` : undefined,
      badgeUrgent: pendingJoinRequestsCount > 0,
      action: onOpenJoinRequests
    },
    {
      id: 'report',
      title: 'דוח התקדמות מנהלים',
      subtitle: 'גרפים, פילוחים וסיכום כלל המערכות לפי סטטוסים וחומרה',
      icon: BarChart3,
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      action: onOpenReport
    },
    {
      id: 'backup',
      title: 'דרייב, גיבוי נתונים וייבוא אקסל (5TB)',
      subtitle: 'חיבור Google Drive, ייצוא גיבוי מלא וייבוא תסריטים מקובצי CSV/Excel',
      icon: DatabaseBackup,
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      action: onOpenBackup
    },
    {
      id: 'team',
      title: 'ניהול חברי צוות והרשאות',
      subtitle: 'הוספה והסרה של בודקי QA, מפתחים ומנהלי מערכת מורשים',
      icon: Users,
      iconBg: 'bg-violet-100 text-violet-700 border-violet-200',
      action: onOpenTeam
    },
    {
      id: 'cloud',
      title: 'הגדרות ענן וחיבור בזמן אמת (Firebase)',
      subtitle: 'חיבור שרת ענן וסנכרון תקלות וצילומי מסך מול כל הצוות',
      icon: Settings,
      iconBg: 'bg-sky-100 text-sky-700 border-sky-200',
      action: onOpenCloud
    },
    {
      id: 'security',
      title: 'אבטחה ויומן ביקורת שרת (Audit Log)',
      subtitle: 'סטטוס הגנות Firebase, ניהול איפוס סיסמאות ויומן פעולות בלתי-ניתן למחיקה',
      icon: KeyRound,
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      action: onOpenSecurity
    },
    {
      id: 'quota',
      title: 'ניטור מכסות שימוש חינמיות (Quota Monitor)',
      subtitle: 'מעקב חי אחר נפח Firebase Spark, מחוברים, Google Drive (5TB) ו-App Check',
      icon: Gauge,
      iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      action: onOpenQuota
    },
    {
      id: 'archive',
      title: 'ארכיון מערכות',
      subtitle: 'צפייה ושחזור של מערכות ותסריטי בדיקה שהועברו לארכיון',
      icon: Archive,
      iconBg: 'bg-orange-100 text-orange-700 border-orange-200',
      badge: archivedCount > 0 ? `${archivedCount} מערכות` : undefined,
      action: onOpenArchive
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>כלי ניהול ושליטה</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 text-[11px] font-mono font-bold">
                  מנהל מערכת
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                בחר פעולה מהרשימה לפתיחה מהירה:
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

        {/* Tools List - One below the other */}
        <div className="p-4 sm:p-6 space-y-2.5 overflow-y-auto flex-1">
          {tools.map((tool) => {
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
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                            (tool as { badgeUrgent?: boolean }).badgeUrgent
                              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          }`}
                        >
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
    </div>
  );
};
