import React, { useState } from 'react';
import {
  KeyRound,
  User,
  ArrowLeft,
  BellRing,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react';
import { TeamRole } from '../types/std';

export interface AuthenticatedUser {
  firstName: string;
  lastName: string;
  fullName: string;
  role: TeamRole;
  isAdmin: boolean;
}

interface LoginScreenProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onInstallAndNotify: () => void;
  notificationsEnabled: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onInstallAndNotify,
  notificationsEnabled
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = firstName.trim();
    const lName = lastName.trim();
    const code = password.trim();

    if (!fName || !lName) {
      setError('נא להזין שם פרטי ושם משפחה.');
      return;
    }

    const fullName = `${fName} ${lName}`;

    if (code === '9988') {
      onLoginSuccess({
        firstName: fName,
        lastName: lName,
        fullName,
        role: 'qa',
        isAdmin: false
      });
    } else if (code === '1111') {
      onLoginSuccess({
        firstName: fName,
        lastName: lName,
        fullName,
        role: 'dev',
        isAdmin: false
      });
    } else if (code === '1108') {
      onLoginSuccess({
        firstName: fName,
        lastName: lName,
        fullName,
        role: 'qa',
        isAdmin: true
      });
    } else {
      setError('סיסמת הכניסה שהוזנה שגויה. נא להזין קוד בודק QA, מפתח או מנהל.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 text-slate-900 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background decorative glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-10">
        {/* Top Hero Header with Logo & Explanation */}
        <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-indigo-50/80 to-white text-center border-b border-slate-100">
          {/* Large Tzav Man Emblem */}
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 opacity-45 blur-sm" />
            <div className="relative w-20 h-20 rounded-3xl bg-slate-950 p-2 shadow-xl border border-indigo-400/30 flex items-center justify-center mx-auto">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full drop-shadow"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="loginShieldGrad" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="52%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="loginInnerWing" x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path
                  d="M32 4L9 13.5V30.5C9 45.8 18.8 56.9 32 61C45.2 56.9 55 45.8 55 30.5V13.5L32 4Z"
                  fill="url(#loginShieldGrad)"
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
                  stroke="url(#loginInnerWing)"
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

          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-l from-slate-950 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
            צב מן
          </h1>

          <p className="text-sm text-slate-700 mt-1">
            <span>סביבת עבודה של </span>
            <strong className="font-extrabold text-indigo-700">צ</strong>וות{' '}
            <strong className="font-extrabold text-indigo-700">ב</strong>דיקות{' '}
            <strong className="font-extrabold text-indigo-700">מ</strong>דור{' '}
            <strong className="font-extrabold text-indigo-700">נ</strong>חשון
          </p>

          {/* Short App Explanation Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed text-right space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>ניהול ותיעוד בדיקות מערכת בזמן אמת</span>
            </div>
            <p>
              המערכת מחברת בזמן אמת בין <strong>בודקי ה-QA</strong> לבין <strong>צוות הפיתוח</strong>: כל דיווח תקלה, צילום מסך, שינוי סטטוס או הערה מתעדכנים מיד אצל כולם ללא צורך ברענון הדף.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                שם פרטי <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="למשל: דניאל"
                  autoFocus
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                שם משפחה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="למשל: כהן"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              סיסמא / קוד כניסה (בודק QA / מפתח / מנהל) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                inputMode="numeric"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="הזן סיסמת כניסה..."
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            <span>כניסה למערכת</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Install App & Enable Push Notifications Button */}
          <div className="pt-3 border-t border-slate-100 flex justify-center">
            {notificationsEnabled ? (
              <button
                type="button"
                onClick={onInstallAndNotify}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-2xs transition cursor-pointer"
                title="הגדרות התראות ואפליקציה (פעיל)"
                aria-label="הגדרות התראות"
              >
                <BellRing className="w-5 h-5 text-emerald-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onInstallAndNotify}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                <BellRing className="w-4 h-4 text-amber-500 shrink-0" />
                <span>הורד אפליקציה והפעל התראות על תקלות חדשות</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
