import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  UserCog,
  KeyRound,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { syncService } from '../services/syncService';

interface AdminDevSettingsModalProps {
  currentAdminName: string;
  currentAdminEmail?: string;
  onAdminNameUpdated: (oldName: string, newName: string) => void;
  onBack?: () => void;
  onClose: () => void;
}

export const AdminDevSettingsModal: React.FC<AdminDevSettingsModalProps> = ({
  currentAdminName,
  currentAdminEmail,
  onAdminNameUpdated,
  onBack,
  onClose
}) => {
  // 1. Admin display name state
  const [adminNameInput, setAdminNameInput] = useState(currentAdminName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameFeedback, setNameFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // 2. Developer Vault password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  const passwordsMatch =
    newPassword.length >= 6 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSaveAdminName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameFeedback(null);
    const clean = adminNameInput.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) {
      setNameFeedback({ type: 'err', text: 'נא להזין שם מלא תקין (לפחות 2 תווים).' });
      return;
    }
    if (clean === currentAdminName.trim()) {
      setNameFeedback({ type: 'err', text: 'השם זהה לשם הנוכחי — לא בוצע שינוי.' });
      return;
    }
    setIsSavingName(true);
    const res = await syncService.updateOwnAdminDisplayName(clean);
    setIsSavingName(false);
    if (!res.ok) {
      setNameFeedback({ type: 'err', text: res.error || 'עדכון השם נכשל.' });
      return;
    }
    onAdminNameUpdated(res.oldName || currentAdminName, res.newName || clean);
    setNameFeedback({
      type: 'ok',
      text: `שם המנהל עודכן בהצלחה ל-"${res.newName || clean}" וסונכרן בכל הדיווחים וההערות שלך!`
    });
  };

  const handleSaveVaultPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (!currentPassword.trim()) {
      setPasswordFeedback({ type: 'err', text: 'נא להזין את הסיסמה הנוכחית.' });
      return;
    }
    if (newPassword.trim().length < 6) {
      setPasswordFeedback({ type: 'err', text: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'err', text: 'הסיסמה החדשה ואימות הסיסמה אינן תואמות.' });
      return;
    }
    setIsSavingPassword(true);
    const res = await syncService.updateDeveloperVaultPassword(currentPassword, newPassword);
    setIsSavingPassword(false);
    if (!res.ok) {
      setPasswordFeedback({ type: 'err', text: res.error || 'עדכון הסיסמה נכשל.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFeedback({
      type: 'ok',
      text: 'סיסמת סביבת המפתח עודכנה בהצלחה ונשמרה מוצפנת בענן לכל המכשירים!'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-l from-slate-950 via-amber-950/85 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור לסביבת מפתח"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
              <UserCog className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold truncate">הגדרות מנהל וסיסמת מפתח</h3>
              <p className="text-xs text-slate-300 truncate">
                עדכון שם המנהל המחובר ושינוי סיסמת הכניסה לסביבת מפתח
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0 transition"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Card 1: Change Logged-In Admin Name */}
          <form
            onSubmit={handleSaveAdminName}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>שינוי שם המנהל המחובר</span>
              </div>
              {currentAdminEmail && (
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400" dir="ltr">
                  {currentAdminEmail}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                שם מלא להצגה במערכת (יופיע בכל תקלה, תגובה ופעולה שלך):
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={adminNameInput}
                onChange={(e) => {
                  setAdminNameInput(e.target.value);
                  setNameFeedback(null);
                }}
                placeholder="שם פרטי ומשפחה..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 rtl-safe"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                כל מנהל במערכת פועל תחת השם האישי שלו; שינוי כאן יעדכן את שמך גם בדיווחים וההערות הקודמים שלך בלבד.
              </p>
            </div>

            {nameFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                  nameFeedback.type === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                }`}
              >
                {nameFeedback.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                )}
                <span>{nameFeedback.text}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingName || adminNameInput.trim().length < 2}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                {isSavingName && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>שמור שם מנהל</span>
              </button>
            </div>
          </form>

          {/* Card 2: Change Developer Vault Password */}
          <form
            onSubmit={handleSaveVaultPassword}
            className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/25 border border-amber-200/90 dark:border-amber-800/70 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>שינוי סיסמת סביבת מפתח</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>מוצפן בענן</span>
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  סיסמה נוכחית <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    autoComplete="off"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordFeedback(null);
                    }}
                    placeholder="הזן סיסמת מפתח נוכחית..."
                    className="w-full pr-3.5 pl-10 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showCurrent ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    סיסמה חדשה (6+ תווים) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordFeedback(null);
                      }}
                      placeholder="הזן סיסמה חדשה..."
                      className="w-full pr-3.5 pl-10 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showNew ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    אימות סיסמה חדשה <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordFeedback(null);
                      }}
                      placeholder="הזן שוב לאימות..."
                      className={`w-full pr-3.5 pl-10 py-2 rounded-xl bg-white dark:bg-slate-950 border text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                        passwordsMismatch
                          ? 'border-rose-400 focus:ring-rose-500/30 focus:border-rose-500'
                          : passwordsMatch
                          ? 'border-emerald-400 focus:ring-emerald-500/30 focus:border-emerald-500'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30 focus:border-amber-500'
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showConfirm ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="mt-1 text-[10px] font-bold text-rose-600">הסיסמאות אינן תואמות</p>
                  )}
                  {passwordsMatch && (
                    <p className="mt-1 text-[10px] font-bold text-emerald-600">הסיסמאות תואמות</p>
                  )}
                </div>
              </div>
            </div>

            {passwordFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                  passwordFeedback.type === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                }`}
              >
                {passwordFeedback.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                )}
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingPassword || !currentPassword.trim() || newPassword.trim().length < 6}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                {isSavingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>עדכן סיסמת מפתח</span>
              </button>
            </div>
          </form>
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
