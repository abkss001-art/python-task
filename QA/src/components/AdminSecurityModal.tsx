import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  Save,
  UserCheck,
  Clock
} from 'lucide-react';
import {
  verifyMasterSecurityPin,
  getStoredSecurityConfig,
  saveStoredSecurityConfig,
  getEffectiveSuperAdminName,
  setStoredSuperAdminName,
  resetSecurityConfigToDefaults,
  hashAccessCode,
  getMasterPinLockoutStatus,
  recordMasterPinAttempt
} from '../utils/securityUtils';

interface AdminSecurityModalProps {
  onSecurityUpdated: (newSuperAdminName: string) => void;
  onClose: () => void;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({
  onSecurityUpdated,
  onClose
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPinInput, setMasterPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [lockout, setLockout] = useState(() => getMasterPinLockoutStatus());

  useEffect(() => {
    if (!lockout.isLocked) return;
    const interval = setInterval(() => {
      const current = getMasterPinLockoutStatus();
      setLockout(current);
      if (!current.isLocked) {
        setPinError(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockout.isLocked]);

  // Form fields once unlocked
  const [superAdminName, setSuperAdminName] = useState(() => getEffectiveSuperAdminName());
  const [newQaCode, setNewQaCode] = useState('');
  const [newDevCode, setNewDevCode] = useState('');
  const [newAdminCode, setNewAdminCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    const currentLockout = getMasterPinLockoutStatus();
    if (currentLockout.isLocked) {
      setPinError(`הגישה נחסמה זמנית עקב ריבוי ניסיונות שגויים. נסה שוב בעוד ${currentLockout.remainingSeconds} שניות.`);
      setLockout(currentLockout);
      return;
    }

    if (!masterPinInput.trim()) {
      setPinError('נא להזין קוד אבטחה ראשי.');
      return;
    }

    const isValid = verifyMasterSecurityPin(masterPinInput.trim());
    const nextStatus = recordMasterPinAttempt(isValid);
    setLockout(nextStatus);

    if (isValid) {
      setIsUnlocked(true);
      setMasterPinInput('');
      setPinError(null);
    } else {
      if (nextStatus.isLocked) {
        setPinError(`קוד אבטחה ראשי שגוי. עקב 5 ניסיונות כושלים הגישה נחסמה ל-${nextStatus.remainingSeconds} שניות.`);
      } else {
        setPinError(`קוד אבטחה ראשי שגוי. נותרו עוד ${nextStatus.attemptsLeft} ניסיונות לפני נעילה זמנית.`);
      }
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanName = superAdminName.trim();
    if (!cleanName) {
      setStatusMessage({ text: 'שם מנהל-העל אינו יכול להיות ריק.', isError: true });
      return;
    }

    const currentConfig = getStoredSecurityConfig();
    const nextConfig = { ...currentConfig };

    nextConfig.superAdminName = cleanName;

    if (newQaCode.trim()) {
      if (newQaCode.trim().length < 4) {
        setStatusMessage({ text: 'קוד בודק QA חייב להכיל לפחות 4 תווים.', isError: true });
        return;
      }
      nextConfig.qaHash = hashAccessCode(newQaCode.trim());
    }

    if (newDevCode.trim()) {
      if (newDevCode.trim().length < 4) {
        setStatusMessage({ text: 'קוד מפתח חייב להכיל לפחות 4 תווים.', isError: true });
        return;
      }
      nextConfig.devHash = hashAccessCode(newDevCode.trim());
    }

    if (newAdminCode.trim()) {
      if (newAdminCode.trim().length < 4) {
        setStatusMessage({ text: 'קוד מנהל מערכת חייב להכיל לפחות 4 תווים.', isError: true });
        return;
      }
      nextConfig.adminHash = hashAccessCode(newAdminCode.trim());
    }

    saveStoredSecurityConfig(nextConfig);
    setStoredSuperAdminName(cleanName);
    onSecurityUpdated(cleanName);

    setNewQaCode('');
    setNewDevCode('');
    setNewAdminCode('');

    setStatusMessage({ text: 'הגדרות האבטחה וקודי הכניסה נשמרו ועודכנו בהצלחה!' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('האם אתה בטוח שברצונך לאפס את כל קודי הכניסה לברירת המחדל (QA: 9988, Dev: 1111, Admin: 1108) ולהחזיר את שם מנהל העל ל"שמעון אבקסיס"?')) {
      return;
    }
    resetSecurityConfigToDefaults();
    setSuperAdminName('שמעון אבקסיס');
    setNewQaCode('');
    setNewDevCode('');
    setNewAdminCode('');
    onSecurityUpdated('שמעון אבקסיס');
    setStatusMessage({ text: 'קודי הכניסה ושם מנהל העל אופסו לברירת המחדל.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5">
                <span>ניהול אבטחה, קודי כניסה ומנהל-על</span>
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-400">
                הגנה רב-שכבתית באמצעות קוד אבטחה ראשי
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                statusMessage.isError
                  ? 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {statusMessage.isError ? (
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Locked State: Require Master Security PIN */}
          {!isUnlocked ? (
            <div className="py-4 space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">אזור מוגן בקוד-על</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto font-medium">
                  כדי לשנות את קודי הכניסה למערכת או את שם מנהל-העל, נא להזין את קוד האבטחה הראשי שלך:
                </p>
              </div>

              <form onSubmit={handleUnlock} className="max-w-xs mx-auto space-y-3">
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    inputMode="numeric"
                    required
                    autoFocus
                    disabled={lockout.isLocked}
                    value={masterPinInput}
                    onChange={(e) => {
                      setMasterPinInput(e.target.value);
                      setPinError(null);
                    }}
                    placeholder={lockout.isLocked ? `נעול (${lockout.remainingSeconds} שניות)` : "הזן קוד אבטחה ראשי..."}
                    className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm font-mono text-center text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none transition ${
                      lockout.isLocked
                        ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-60 cursor-not-allowed'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500'
                    }`}
                  />
                </div>

                {lockout.isLocked && (
                  <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>נעילה פעילה: שחרור בעוד {lockout.remainingSeconds} שניות</span>
                  </div>
                )}

                {pinError && !lockout.isLocked && (
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/70 p-2 rounded-xl border border-red-200 dark:border-red-800">
                    {pinError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lockout.isLocked}
                  className={`w-full py-2.5 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition ${
                    lockout.isLocked
                      ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-l from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 cursor-pointer'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>אימות קוד אבטחה ופתיחת נעילה</span>
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked State: Edit Super Admin & Access Passwords */
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>נעילה שוחררה בהצלחה באמצעות קוד האבטחה הראשי</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                >
                  נעל מחדש
                </button>
              </div>

              {/* Super Admin Name */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 space-y-2">
                <label className="block text-xs font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>שם מנהל-העל:</span>
                </label>
                <input
                  type="text"
                  required
                  value={superAdminName}
                  onChange={(e) => setSuperAdminName(e.target.value)}
                  placeholder="הזן שם מנהל-על..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300 leading-relaxed">
                  שם זה מוגדר כמנהל הראשי של המערכת ולא ניתן למחיקה.
                </p>
              </div>

              {/* Change Passwords Fields */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>החלפת קודי כניסה:</span>
                </div>

                {/* QA Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    קוד כניסה לבודק QA
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newQaCode}
                    onChange={(e) => setNewQaCode(e.target.value)}
                    placeholder="הזן קוד בודק חדש..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Dev Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    קוד כניסה לצוות פיתוח
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newDevCode}
                    onChange={(e) => setNewDevCode(e.target.value)}
                    placeholder="הזן קוד מפתח חדש..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Admin Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    קוד כניסה למנהל מערכת
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newAdminCode}
                    onChange={(e) => setNewAdminCode(e.target.value)}
                    placeholder="הזן קוד מנהל חדש..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Save className="w-4 h-4" />
                  <span>שמור שינויים</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition border border-slate-200 dark:border-slate-700"
                  title="איפוס קודים לברירות מחדל"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>שחזר ברירות מחדל</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
