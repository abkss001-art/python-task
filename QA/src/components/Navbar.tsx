import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Plus,
  Cloud,
  Users,
  UserCheck,
  FolderPlus,
  Layers,
  Check,
  X,
  Lock,
  ShieldCheck,
  Settings,
  Trash2,
  Archive,
  BellRing,
  Download,
  LogOut,
  BarChart3,
  DatabaseBackup,
  RefreshCw,
  KeyRound,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { StdIssue, SyncStatusInfo, TeamRole } from '../types/std';

interface NavbarProps {
  systems: string[];
  archivedSystems: string[];
  activeSystem: string;
  onSelectSystem: (sys: string) => void;
  onAddSystem: (newSys: string) => void;
  onManageSystem?: (sys: string) => void;
  onRequestRemoveSystem?: (sys: string) => void;
  onOpenArchiveModal?: () => void;
  onOpenAdminReport?: () => void;
  onOpenAdminBackup?: () => void;
  onOpenTeamModal?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenAdminToolsModal?: () => void;
  onManualSync?: () => void;
  issues: StdIssue[];
  syncStatus: SyncStatusInfo;
  currentUserName: string;
  currentUserRole: TeamRole;
  canCreateOrEdit: boolean;
  onOpenNewIssue: () => void;
  onOpenFirebaseModal: () => void;
  isAdmin: boolean;
  onLogoutUser: () => void;
  notificationsEnabled: boolean;
  onInstallAndNotify: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

/**
 * סמל / לוגו יחידתי מרשים עבור "צב מן" – צוות בדיקות מדור נחשון
 */
const TzavManEmblem: React.FC = () => (
  <div className="relative group shrink-0">
    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 opacity-35 blur-xs group-hover:opacity-60 transition duration-300" />
    <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 p-1 shadow-lg border border-indigo-400/30 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="52%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="innerWing" x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <path
          d="M32 4L9 13.5V30.5C9 45.8 18.8 56.9 32 61C45.2 56.9 55 45.8 55 30.5V13.5L32 4Z"
          fill="url(#shieldGrad)"
          stroke="#A5B4FC"
          strokeWidth="1.5"
        />

        <path
          d="M32 9L14 16.5V30.2C14 42.4 21.6 51.5 32 55.2C42.4 51.5 50 42.4 50 30.2V16.5L32 9Z"
          fill="#0F172A"
          fillOpacity="0.82"
        />

        <circle
          cx="32"
          cy="31"
          r="14"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.55"
        />
        <circle
          cx="32"
          cy="31"
          r="9.5"
          stroke="#818CF8"
          strokeWidth="1"
          opacity="0.4"
        />

        <path
          d="M21.5 31.5L28.5 38.5L43.5 22.5"
          stroke="url(#innerWing)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M32 12.5L33.3 15.2L36.2 15.6L34.1 17.6L34.6 20.5L32 19.1L29.4 20.5L29.9 17.6L27.8 15.6L30.7 15.2L32 12.5Z"
          fill="#38BDF8"
        />
      </svg>
    </div>
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({
  systems,
  archivedSystems,
  activeSystem,
  onSelectSystem,
  onAddSystem,
  onManageSystem,
  onRequestRemoveSystem,
  onOpenArchiveModal,
  onOpenAdminReport,
  onOpenAdminBackup,
  onOpenTeamModal,
  onOpenSecurityModal,
  onOpenAdminToolsModal,
  onManualSync,
  issues,
  syncStatus,
  currentUserName,
  currentUserRole,
  canCreateOrEdit,
  onOpenNewIssue,
  onOpenFirebaseModal,
  isAdmin,
  onLogoutUser,
  notificationsEnabled,
  onInstallAndNotify,
  theme = 'light',
  onToggleTheme
}) => {
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  const [isSyncSpinning, setIsSyncSpinning] = useState(false);

  const handleCreateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newSystemName.trim();
    if (!cleaned) return;
    onAddSystem(cleaned);
    setNewSystemName('');
    setIsAddingSystem(false);
  };

  // O(N) memoized counter map for all systems so rendering 10+ system tabs is instant O(1)
  const systemCounters = useMemo(() => {
    const archivedSet = new Set(archivedSystems);
    const systemsSet = new Set(systems);
    const totalBySys: Record<string, number> = {};
    const openBySys: Record<string, number> = {};
    let allTotal = 0;
    let allOpen = 0;

    for (const iss of issues) {
      const sys = iss.system;
      totalBySys[sys] = (totalBySys[sys] || 0) + 1;
      if (iss.status === 'פתוח') {
        openBySys[sys] = (openBySys[sys] || 0) + 1;
      }
      if (!archivedSet.has(sys) && systemsSet.has(sys)) {
        allTotal++;
        if (iss.status === 'פתוח') {
          allOpen++;
        }
      }
    }

    return { totalBySys, openBySys, allTotal, allOpen };
  }, [issues, archivedSystems, systems]);

  const getCountForSystem = (sys: string) => {
    if (sys === 'ALL') return systemCounters.allTotal;
    return systemCounters.totalBySys[sys] || 0;
  };

  const getOpenCountForSystem = (sys: string) => {
    if (sys === 'ALL') return systemCounters.allOpen;
    return systemCounters.openBySys[sys] || 0;
  };

  const isViewingArchivedSystem = archivedSystems.includes(activeSystem);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top Section: Responsive layout for Mobile & Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand Block + Mobile CTA */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <TzavManEmblem />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-l from-slate-950 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-cyan-400 bg-clip-text text-transparent leading-tight">
                    צב מן
                  </h1>
                  {/* Desktop/Tablet Subtitle inline under title */}
                  <p className="hidden sm:block text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    <span>סביבת עבודה של </span>
                    <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">צ</strong>וות{' '}
                    <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">ב</strong>דיקות{' '}
                    <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">מ</strong>דור{' '}
                    <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">נ</strong>חשון
                  </p>
                </div>
              </div>

              {/* Mobile New Bug CTA (Only for QA & Admin) */}
              {canCreateOrEdit && (
                <button
                  type="button"
                  onClick={onOpenNewIssue}
                  className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>תקלה חדשה</span>
                </button>
              )}
            </div>

            {/* Mobile Full-Width Subtitle: Never truncated or overlapped by '+ תקלה חדשה' */}
            <p className="sm:hidden text-xs text-slate-600 dark:text-slate-400 pr-0.5 leading-relaxed">
              <span>סביבת עבודה של </span>
              <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">צ</strong>וות{' '}
              <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">ב</strong>דיקות{' '}
              <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">מ</strong>דור{' '}
              <strong className="font-extrabold text-indigo-700 dark:text-indigo-400">נ</strong>חשון
            </p>
          </div>

          {/* Row 2 on Mobile (Inline on Desktop): Sync Badge + Install/Notify + User Identity + Admin + Desktop CTA */}
          <div className="flex items-center justify-between lg:justify-end gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/80">
            {/* Live Sync Indicator & App Download / Notifications */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsSyncSpinning(true);
                  onManualSync?.();
                  setTimeout(() => setIsSyncSpinning(false), 900);
                }}
                title="סנכרון חי בזמן אמת"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                  syncStatus.connected
                    ? 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      syncStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      syncStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
                <RefreshCw
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSyncSpinning ? 'animate-spin text-indigo-600' : ''
                  }`}
                />
                <span>סנכרון חי</span>
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-white/90 text-slate-700 border border-slate-200/60 text-[10px] sm:text-[11px]">
                  <Users className="w-3 h-3 text-indigo-600" />
                  <span dir="ltr">{syncStatus.onlineCount}</span>
                </span>
              </button>

              {/* Install App & Notification Settings Button */}
              {notificationsEnabled ? (
                <button
                  type="button"
                  onClick={onInstallAndNotify}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-2xs transition cursor-pointer shrink-0"
                  title="הגדרות התראות ואפליקציה"
                  aria-label="הגדרות התראות"
                >
                  <BellRing className="w-4 h-4 text-emerald-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onInstallAndNotify}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 transition cursor-pointer shrink-0"
                  title="הורד אפליקציה והפעל התראות על תקלות חדשות"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <BellRing className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                  <span>הורד אפליקציה + התראות</span>
                </button>
              )}

              {/* Admin Tools Button (Opens Centered Admin Tools Modal) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdminToolsModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-400 text-[11px] sm:text-xs font-extrabold transition cursor-pointer shrink-0 shadow-xs"
                  title="כלי ניהול ושליטה"
                >
                  <MoreHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>כלי מנהל</span>
                  {archivedSystems.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title="יש מערכות בארכיון" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Theme Mode Toggle (Light / Dark) */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer shrink-0"
                  title={theme === 'dark' ? 'עבור למצב יום (בהיר)' : 'עבור למצב לילה (כהה)'}
                  aria-label="החלף מצב כהה/בהיר"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 animate-in spin-in-180 duration-300" />
                  )}
                </button>
              )}

              {/* Logged-In User Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100 max-w-[100px] sm:max-w-[130px] truncate rtl-safe">
                  {currentUserName}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isAdmin
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : currentUserRole === 'dev'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  }`}
                >
                  {isAdmin ? 'מנהל' : currentUserRole === 'dev' ? 'מפתח' : 'בודק QA'}
                </span>
              </div>

              {/* Switch User / Logout Button */}
              <button
                type="button"
                onClick={onLogoutUser}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 text-[11px] sm:text-xs font-semibold transition cursor-pointer"
                title="התנתק / החלף משתמש"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">החלף משתמש</span>
              </button>

              {/* Desktop New Bug CTA (Only for QA & Admin) */}
              {canCreateOrEdit && (
                <button
                  type="button"
                  onClick={onOpenNewIssue}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>תקלה חדשה</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Fast System Switcher Bar (CARGO, נשקי ערד, etc.) */}
        <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Home Button */}
            <button
              type="button"
              onClick={() => onSelectSystem('HOME')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
                activeSystem === 'HOME' || !activeSystem
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="חזור לדף הבית לבחירת מערכת"
            >
              <Home className="w-3.5 h-3.5" />
              <span>דף הבית</span>
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

            {/* 2. Systems Label */}
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>מערכות:</span>
            </span>

            {/* 3. System Buttons */}
            {systems.map((sys) => {
              const isSelected = activeSystem === sys;
              const total = getCountForSystem(sys);
              const openCount = getOpenCountForSystem(sys);
              return (
                <div key={sys} className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectSystem(sys)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                      isAdmin && (onManageSystem || onRequestRemoveSystem) ? 'rounded-r-xl' : 'rounded-xl'
                    } ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="bidi-isolate">{sys}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] sm:text-[11px] font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {total}
                    </span>
                    {openCount > 0 && (
                      <span
                        className="w-2 h-2 rounded-full bg-red-500"
                        title={`${openCount} תקלות פתוחות`}
                      />
                    )}
                  </button>
                  {isAdmin && (onManageSystem || onRequestRemoveSystem) && (
                    <button
                      type="button"
                      onClick={() => (onManageSystem ? onManageSystem(sys) : onRequestRemoveSystem?.(sys))}
                      className={`px-2 py-1.5 rounded-l-xl border-r text-xs transition cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-slate-800 dark:bg-indigo-700 hover:bg-indigo-600 text-slate-300 hover:text-white border-slate-700 dark:border-indigo-500'
                          : 'bg-slate-200/80 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-600 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-500 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                      }`}
                      title={`ניהול מערכת ${sys}: עריכת שם, ארכיון או מחיקה (מנהל בלבד)`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Show badge if Admin is currently viewing an archived system */}
            {isAdmin && isViewingArchivedSystem && (
              <button
                type="button"
                onClick={() => onSelectSystem(activeSystem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shrink-0 cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span className="bidi-isolate">{activeSystem} (בארכיון)</span>
                <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-white/20">
                  {getCountForSystem(activeSystem)}
                </span>
              </button>
            )}



            {/* Admin-Only Controls: + Add System & Archive Drawer */}
            {isAdmin && (
              <>
                {!isAddingSystem ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingSystem(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-500 text-indigo-700 text-xs font-bold transition shrink-0 cursor-pointer"
                    title="הוסף מערכת חדשה לבדיקה (זמין למנהל בלבד)"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ הוספת מערכת</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateSystem} className="flex items-center gap-1 shrink-0">
                    <input
                      type="text"
                      value={newSystemName}
                      onChange={(e) => setNewSystemName(e.target.value)}
                      placeholder="שם מערכת חדשה..."
                      autoFocus
                      className="w-28 sm:w-32 px-2.5 py-1 text-xs rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rtl-safe"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingSystem(false)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
