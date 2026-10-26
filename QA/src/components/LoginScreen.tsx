import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  User,
  ArrowLeft,
  BellRing,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertCircle,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { TeamRole } from '../types/std';
import {
  computeUserAuthSignature,
  verifyAccessCodeRole
} from '../utils/securityUtils';
import {
  TeamMember,
  getStoredTeamMembers,
  getRememberedLogin,
  saveRememberedLogin
} from '../utils/teamMembers';

export interface AuthenticatedUser {
  firstName: string;
  lastName: string;
  fullName: string;
  role: TeamRole;
  isAdmin: boolean;
  allowedSystems?: string[];
  authSignature?: string;
}

interface LoginScreenProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onInstallAndNotify: () => void;
  notificationsEnabled: boolean;
  teamMembers?: TeamMember[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onInstallAndNotify,
  notificationsEnabled,
  teamMembers: propTeamMembers
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    return propTeamMembers && propTeamMembers.length > 0
      ? propTeamMembers
      : getStoredTeamMembers();
  });

  useEffect(() => {
    if (propTeamMembers && propTeamMembers.length > 0) {
      setTeamMembers(propTeamMembers);
    }
  }, [propTeamMembers]);

  const remembered = getRememberedLogin();
  const [fullName, setFullName] = useState<string>(remembered?.fullName || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(
    remembered ? remembered.rememberMe : true
  );
  const [error, setError] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter team members when user typed at least 2 characters
  const cleanInput = fullName.trim().toLowerCase();
  const matchingMembers =
    cleanInput.length >= 2
      ? teamMembers.filter((m) => m.fullName.toLowerCase().includes(cleanInput))
      : [];

  const handleSelectMember = (member: TeamMember) => {
    setFullName(member.fullName);
    setIsDropdownOpen(false);
    setError(null);
    passwordInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanFullName = fullName.trim();
    const code = password.trim();

    if (!cleanFullName) {
      setError('נא להזין שם ושם משפחה.');
      return;
    }

    if (!code) {
      setError('נא להזין קוד כניסה.');
      return;
    }

    // Match against approved team member list
    const matchedMember = teamMembers.find(
      (m) => m.fullName.toLowerCase() === cleanFullName.toLowerCase()
    );

    if (!matchedMember) {
      setError(
        'השם שהוזן אינו מופיע ברשימת הצוות המורשית. יש לבחור שם מתוך ההשלמה האוטומטית או לפנות למנהל להוספה.'
      );
      return;
    }

    const authResult = verifyAccessCodeRole(code);
    if (!authResult.valid) {
      setError('קוד הכניסה שהוזן שגוי. נא לוודא את הקוד ולנסות שוב.');
      return;
    }

    // Role-matching enforcement (preventing privilege spoofing)
    if (matchedMember.role === 'admin') {
      if (!authResult.isAdmin) {
        setError('שם זה מוגדר כמנהל מערכת – נדרש קוד כניסה של מנהל.');
        return;
      }
    } else if (matchedMember.role === 'qa') {
      if (authResult.isAdmin) {
        setError('שם זה מוגדר כבודק QA – יש להזין קוד בודק ולא קוד מנהל.');
        return;
      }
      if (authResult.role !== 'qa') {
        setError('שם זה מוגדר כבודק QA – יש להזין קוד בודק.');
        return;
      }
    } else if (matchedMember.role === 'dev') {
      if (authResult.isAdmin) {
        setError('שם זה מוגדר כמפתח – יש להזין קוד מפתח ולא קוד מנהל.');
        return;
      }
      if (authResult.role !== 'dev') {
        setError('שם זה מוגדר כמפתח – יש להזין קוד מפתח.');
        return;
      }
    }

    const finalFullName = matchedMember.fullName;
    const parts = finalFullName.split(/\s+/);
    const fName = parts[0] || finalFullName;
    const lName = parts.slice(1).join(' ') || '';

    // Save or clear remembered login credentials
    saveRememberedLogin(finalFullName, rememberMe);

    const isAdmin = matchedMember.role === 'admin' || authResult.isAdmin;
    const userObj: AuthenticatedUser = {
      firstName: fName,
      lastName: lName,
      fullName: finalFullName,
      role: isAdmin ? 'qa' : matchedMember.role,
      isAdmin,
      allowedSystems:
        matchedMember.role === 'dev' && Array.isArray(matchedMember.allowedSystems)
          ? matchedMember.allowedSystems
          : undefined
    };
    userObj.authSignature = computeUserAuthSignature(userObj);
    onLoginSuccess(userObj);
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
          {/* Combined Full Name (First + Last Name in ONE field) with Autocomplete */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              שם מלא (שם פרטי ומשפחה) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setIsDropdownOpen(true);
                  setError(null);
                }}
                onFocus={() => {
                  if (cleanInput.length >= 2) {
                    setIsDropdownOpen(true);
                  }
                }}
                placeholder="הקלד 2-3 אותיות להשלמת השם מהצוות..."
                autoFocus={!remembered?.fullName}
                autoComplete="name"
                className="w-full pr-10 pl-9 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe font-medium"
              />
              {cleanInput.length >= 2 && (
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  <ChevronDown className={`w-4 h-4 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown List */}
            {isDropdownOpen && matchingMembers.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-1 z-30 bg-white rounded-2xl shadow-xl border border-indigo-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 bg-indigo-50/80 text-[11px] font-bold text-indigo-900 flex items-center justify-between">
                  <span>בחר את שמך מתוך רשימת הצוות:</span>
                  <span className="text-indigo-600">({matchingMembers.length} תוצאות)</span>
                </div>
                {matchingMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMember(m)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-right hover:bg-indigo-50 transition cursor-pointer text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-indigo-200 text-slate-600 group-hover:text-indigo-700 flex items-center justify-center shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-slate-900">{m.fullName}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : m.role === 'dev'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {m.role === 'admin' ? '👑 מנהל מערכת' : m.role === 'dev' ? 'מפתח' : 'בודק QA'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              סיסמא / קוד כניסה (בודק QA / מפתח / מנהל) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={passwordInputRef}
                type="password"
                inputMode="numeric"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                autoFocus={Boolean(remembered?.fullName)}
                placeholder="הזן קוד כניסה..."
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Remember Me on this device Checkbox */}
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
            />
            <span className="text-xs font-bold text-slate-700">
              זכור אותי במכשיר זה (שמור פרטי כניסה לפעם הבאה)
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
