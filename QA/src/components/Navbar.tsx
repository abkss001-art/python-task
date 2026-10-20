import React, { useState } from 'react';
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
  Archive
} from 'lucide-react';
import { StdIssue, SyncStatusInfo, TeamRole } from '../types/std';

interface NavbarProps {
  systems: string[];
  archivedSystems: string[];
  activeSystem: string;
  onSelectSystem: (sys: string) => void;
  onAddSystem: (newSys: string) => void;
  onRequestRemoveSystem?: (sys: string) => void;
  onOpenArchiveModal?: () => void;
  issues: StdIssue[];
  syncStatus: SyncStatusInfo;
  currentUserName: string;
  currentUserRole: TeamRole;
  onUpdateUser: (name: string, role: TeamRole) => void;
  onOpenNewIssue: () => void;
  onOpenFirebaseModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: (code: string) => boolean;
  onLogoutAdmin: () => void;
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
  onRequestRemoveSystem,
  onOpenArchiveModal,
  issues,
  syncStatus,
  currentUserName,
  currentUserRole,
  onUpdateUser,
  onOpenNewIssue,
  onOpenFirebaseModal,
  isAdmin,
  onToggleAdmin,
  onLogoutAdmin
}) => {
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempName, setTempName] = useState(currentUserName);
  const [tempRole, setTempRole] = useState<TeamRole>(currentUserRole);

  // Admin Login Input State
  const [isEnteringAdmin, setIsEnteringAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminError, setAdminError] = useState(false);

  const handleCreateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newSystemName.trim();
    if (!cleaned) return;
    onAddSystem(cleaned);
    setNewSystemName('');
    setIsAddingSystem(false);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateUser(tempName.trim(), tempRole);
    }
    setIsEditingUser(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onToggleAdmin(adminCodeInput.trim());
    if (ok) {
      setAdminCodeInput('');
      setAdminError(false);
      setIsEnteringAdmin(false);
    } else {
      setAdminError(true);
    }
  };

  const getCountForSystem = (sys: string) => {
    if (sys === 'ALL') {
      return issues.filter((i) => !archivedSystems.includes(i.system)).length;
    }
    return issues.filter((i) => i.system === sys).length;
  };

  const getOpenCountForSystem = (sys: string) => {
    const list =
      sys === 'ALL'
        ? issues.filter((i) => !archivedSystems.includes(i.system))
        : issues.filter((i) => i.system === sys);
    return list.filter((i) => i.status === 'פתוח').length;
  };

  const isViewingArchivedSystem = archivedSystems.includes(activeSystem);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top Section: Responsive layout for Mobile & Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 py-2.5 sm:py-3 border-b border-slate-100">
          {/* Brand Block + Mobile CTA */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <TzavManEmblem />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-l from-slate-950 via-indigo-950 to-indigo-700 bg-clip-text text-transparent leading-tight">
                    צב מן
                  </h1>
                  {/* Desktop/Tablet Subtitle inline under title */}
                  <p className="hidden sm:block text-sm text-slate-600 mt-0.5 leading-snug">
                    <span>סביבת עבודה של </span>
                    <strong className="font-extrabold text-indigo-700">צ</strong>וות{' '}
                    <strong className="font-extrabold text-indigo-700">ב</strong>דיקות{' '}
                    <strong className="font-extrabold text-indigo-700">מ</strong>דור{' '}
                    <strong className="font-extrabold text-indigo-700">נ</strong>חשון
                  </p>
                </div>
              </div>

              {/* Mobile New Bug CTA (Aligned with logo & 'צב מן' so it never crowds the subtitle below!) */}
              <button
                type="button"
                onClick={onOpenNewIssue}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>תקלה חדשה</span>
              </button>
            </div>

            {/* Mobile Full-Width Subtitle: Never truncated or overlapped by '+ תקלה חדשה' */}
            <p className="sm:hidden text-xs text-slate-600 pr-0.5 leading-relaxed">
              <span>סביבת עבודה של </span>
              <strong className="font-extrabold text-indigo-700">צ</strong>וות{' '}
              <strong className="font-extrabold text-indigo-700">ב</strong>דיקות{' '}
              <strong className="font-extrabold text-indigo-700">מ</strong>דור{' '}
              <strong className="font-extrabold text-indigo-700">נ</strong>חשון
            </p>
          </div>

          {/* Row 2 on Mobile (Inline on Desktop): Sync Badge + User Identity + Admin Lock + Desktop CTA */}
          <div className="flex items-center justify-between lg:justify-end gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {/* Live Sync Indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold ${
                  syncStatus.connected
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
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
                <Cloud className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                <span>
                  {syncStatus.mode === 'firebase-rtdb'
                    ? `Firebase (${syncStatus.projectId})`
                    : syncStatus.mode === 'firebase-firestore'
                    ? `Firestore (${syncStatus.projectId})`
                    : 'סנכרון חי'}
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-white/90 text-slate-700 border border-slate-200/60 text-[10px] sm:text-[11px]">
                  <Users className="w-3 h-3 text-indigo-600" />
                  <span dir="ltr">{syncStatus.onlineCount}</span>
                </span>
              </div>

              {/* Admin-Only Cloud Settings Button */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenFirebaseModal}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] sm:text-xs font-bold transition cursor-pointer shrink-0"
                  title="הגדרות ענן (זמין למנהל בלבד)"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>הגדר ענן</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* User Identity Switcher */}
              {!isEditingUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setTempName(currentUserName);
                    setTempRole(currentUserRole);
                    setIsEditingUser(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 transition cursor-pointer"
                  title="לחץ לשינוי שם הבודק/מפתח"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-900 max-w-[85px] sm:max-w-[110px] truncate rtl-safe">
                    {currentUserName}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      currentUserRole === 'dev'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {currentUserRole === 'dev' ? 'מפתח' : 'QA'}
                  </span>
                </button>
              ) : (
                <form
                  onSubmit={handleSaveUser}
                  className="flex items-center gap-1 bg-white p-1 rounded-xl border border-indigo-300 shadow-sm"
                >
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="השם שלך..."
                    autoFocus
                    className="w-24 sm:w-28 px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 rtl-safe"
                  />
                  <select
                    value={tempRole}
                    onChange={(e) => setTempRole(e.target.value as TeamRole)}
                    className="text-xs px-1 py-1 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="qa">QA</option>
                    <option value="dev">מפתח</option>
                  </select>
                  <button
                    type="submit"
                    className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Admin Lock / Unlock Control */}
              {isAdmin ? (
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] sm:text-xs font-bold transition cursor-pointer"
                  title="לחץ ליציאה ממצב מנהל"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>מנהל</span>
                </button>
              ) : !isEnteringAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEnteringAdmin(true);
                    setAdminError(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 text-[11px] sm:text-xs font-medium transition cursor-pointer"
                  title="כניסת מנהל (להוספת מערכות, ארכיון והגדרת ענן)"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>מנהל</span>
                </button>
              ) : (
                <form
                  onSubmit={handleAdminSubmit}
                  className="flex items-center gap-1 bg-white p-1 rounded-xl border border-indigo-300 shadow-sm"
                >
                  <input
                    type="password"
                    inputMode="numeric"
                    value={adminCodeInput}
                    onChange={(e) => {
                      setAdminCodeInput(e.target.value);
                      setAdminError(false);
                    }}
                    placeholder="קוד מנהל..."
                    autoFocus
                    className={`w-20 sm:w-24 px-2 py-1 text-xs rounded-lg border focus:outline-none ${
                      adminError
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                    title="אשר קוד מנהל"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEnteringAdmin(false)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Desktop New Bug CTA */}
              <button
                type="button"
                onClick={onOpenNewIssue}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>תקלה חדשה</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Fast System Switcher Bar (CARGO, נשקי ערד, etc.) */}
        <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>מערכת:</span>
            </span>

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
                      isAdmin && systems.length > 1 ? 'rounded-r-xl' : 'rounded-xl'
                    } ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span className="bidi-isolate">{sys}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] sm:text-[11px] font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
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
                  {isAdmin && systems.length > 1 && onRequestRemoveSystem && (
                    <button
                      type="button"
                      onClick={() => onRequestRemoveSystem(sys)}
                      className={`px-1.5 py-1.5 rounded-l-xl border-r text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white border-slate-700'
                          : 'bg-slate-200/70 hover:bg-red-100 text-slate-500 hover:text-red-600 border-slate-300'
                      }`}
                      title={`העבר לארכיון או מחק את מערכת ${sys} (מנהל בלבד)`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

            <button
              type="button"
              onClick={() => onSelectSystem('ALL')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                activeSystem === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              <span>כל המערכות</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] sm:text-[11px] font-mono ${
                  activeSystem === 'ALL'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {getCountForSystem('ALL')}
              </span>
            </button>

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

                {onOpenArchiveModal && (
                  <button
                    type="button"
                    onClick={onOpenArchiveModal}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 cursor-pointer ${
                      archivedSystems.length > 0
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                    title="צפייה וניהול ארכיון מערכות (מנהל בלבד)"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-600" />
                    <span>ארכיון ({archivedSystems.length})</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
