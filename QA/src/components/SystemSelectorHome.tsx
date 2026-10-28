import React from 'react';
import {
  Layers,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderPlus,
  SlidersHorizontal,
  Archive,
  Boxes,
  Plus,
  Sparkles
} from 'lucide-react';
import { StdIssue } from '../types/std';

interface SystemSelectorHomeProps {
  systems: string[];
  archivedSystems: string[];
  issues: StdIssue[];
  currentUserName: string;
  userTeamTitle: string;
  isAdmin: boolean;
  canCreateOrEdit: boolean;
  onSelectSystem: (sys: string) => void;
  onAddSystem: (name: string) => void;
  onManageSystem?: (name: string) => void;
  onOpenArchiveModal?: () => void;
  onOpenNewIssue?: () => void;
}

export const SystemSelectorHome: React.FC<SystemSelectorHomeProps> = ({
  systems,
  archivedSystems,
  issues,
  currentUserName,
  userTeamTitle,
  isAdmin,
  canCreateOrEdit,
  onSelectSystem,
  onAddSystem,
  onManageSystem,
  onOpenArchiveModal,
  onOpenNewIssue
}) => {
  // Global stats calculation
  const totalIssues = issues.length;
  const criticalOpenIssues = issues.filter(
    (i) => i.severity === 'קריטית' && i.status !== 'נבדק תקין'
  ).length;
  const inProgressIssues = issues.filter(
    (i) => i.status === 'פתוח' || i.status === 'בטיפול' || i.status === 'ניתן לבדוק שוב'
  ).length;

  const handleAddNewSystemClick = () => {
    const name = window.prompt('הזן שם עבור מערכת חדשה:');
    if (name && name.trim()) {
      onAddSystem(name.trim());
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto py-2 sm:py-6" dir="rtl">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 border border-indigo-500/20 shadow-xl">
        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>מערכת ניהול ובקרת איכות STD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              שלום, {currentUserName} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              ברוך הבא לסביבת העבודה של <strong className="text-indigo-300">{userTeamTitle}</strong>. 
              בחר מערכת מהרשימה מטה כדי לצפות בתקלות, לעקוב אחר סטטוסים ולנהל בדיקות בזמן אמת.
            </p>
          </div>

          {/* Quick Stats Summary Strip */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center min-w-[85px] sm:min-w-[100px]">
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">מערכות</div>
              <div className="text-xl sm:text-2xl font-black font-mono mt-0.5 text-white">
                {systems.length}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center min-w-[85px] sm:min-w-[100px]">
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">בטיפול</div>
              <div className="text-xl sm:text-2xl font-black font-mono mt-0.5 text-amber-300">
                {inProgressIssues}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center min-w-[85px] sm:min-w-[100px]">
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium">קריטיות</div>
              <div className="text-xl sm:text-2xl font-black font-mono mt-0.5 text-rose-300">
                {criticalOpenIssues}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>בחר מערכת לתחילת עבודה</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            האפליקציה תזכור את המערכת שתבחר עבור הביקורים הבאים שלך
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleAddNewSystemClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>הוספת מערכת חדשה</span>
          </button>
        )}
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {systems.map((sys) => {
          const sysIssues = issues.filter((i) => i.system === sys);
          const totalCount = sysIssues.length;
          const openCount = sysIssues.filter(
            (i) => i.status !== 'נבדק תקין'
          ).length;
          const criticalCount = sysIssues.filter(
            (i) => i.severity === 'קריטית' && i.status !== 'נבדק תקין'
          ).length;
          const resolvedCount = sysIssues.filter((i) => i.status === 'נבדק תקין').length;

          // Percentage resolved
          const resolvedPercent =
            totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

          return (
            <div
              key={sys}
              onClick={() => onSelectSystem(sys)}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-indigo-400/80 dark:hover:border-indigo-500 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Icon, System Name & Admin Menu */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition duration-200 shadow-2xs">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors bidi-isolate">
                        {sys}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {totalCount === 0 ? 'אין תקלות מדווחות' : `${totalCount} תקלות רשומות`}
                      </span>
                    </div>
                  </div>

                  {isAdmin && onManageSystem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onManageSystem(sys);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={`ניהול מערכת ${sys}`}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Badges Row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 my-3">
                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">פתוחות</span>
                    <span className="text-sm font-extrabold font-mono text-amber-600 dark:text-amber-400">
                      {openCount}
                    </span>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">קריטיות</span>
                    <span
                      className={`text-sm font-extrabold font-mono ${
                        criticalCount > 0
                          ? 'text-rose-600 dark:text-rose-400 flex items-center justify-center gap-0.5'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {criticalCount > 0 && <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
                      {criticalCount}
                    </span>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">תקינות</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {resolvedCount}
                    </span>
                  </div>
                </div>

                {/* Resolution Progress Bar */}
                {totalCount > 0 && (
                  <div className="space-y-1 my-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>התקדמות בדיקות</span>
                      <span className="font-bold font-mono">{resolvedPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${resolvedPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Enter Button CTA */}
              <div className="pt-3 mt-1 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                <span>כניסה למערכת</span>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:-translate-x-1">
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}

        {/* Admin Add System Card in Grid */}
        {isAdmin && (
          <button
            type="button"
            onClick={handleAddNewSystemClick}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition shadow-2xs">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                הוספת מערכת חדשה
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                הגדרת סביבת בדיקות ייעודית נוספת
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Admin Archived Systems Banner */}
      {isAdmin && archivedSystems.length > 0 && onOpenArchiveModal && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              קיימות <strong className="font-bold">{archivedSystems.length}</strong> מערכות בארכיון שאינן מוצגות לשאר הצוות.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenArchiveModal}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition cursor-pointer"
          >
            פתח ארכיון
          </button>
        </div>
      )}
    </div>
  );
};
