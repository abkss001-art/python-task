import React from 'react';
import {
  X,
  SlidersHorizontal,
  BarChart3,
  DatabaseBackup,
  Users,
  Settings,
  KeyRound,
  Archive,
  ArrowLeft
} from 'lucide-react';

interface AdminToolsModalProps {
  archivedCount: number;
  onOpenReport: () => void;
  onOpenBackup: () => void;
  onOpenTeam: () => void;
  onOpenCloud: () => void;
  onOpenSecurity: () => void;
  onOpenArchive: () => void;
  onClose: () => void;
}

export const AdminToolsModal: React.FC<AdminToolsModalProps> = ({
  archivedCount,
  onOpenReport,
  onOpenBackup,
  onOpenTeam,
  onOpenCloud,
  onOpenSecurity,
  onOpenArchive,
  onClose
}) => {
  const tools = [
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
      title: 'ניהול אבטחה, סיסמאות ומנהל-על',
      subtitle: 'מוגן בקוד אבטחה ראשי – שינוי קודי כניסה ושם מנהל-העל',
      icon: KeyRound,
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      action: onOpenSecurity
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
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
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 transition cursor-pointer text-right group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${tool.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 truncate">
                        {tool.title}
                      </span>
                      {tool.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed truncate">
                      {tool.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-transform shrink-0 mr-2" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
