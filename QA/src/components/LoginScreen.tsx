import React, { useState, useRef } from 'react';
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
  Mail,
  Lock,
  Loader2
} from 'lucide-react';
import { FirebaseUserProfile, TeamRole } from '../types/std';
import { computeUserAuthSignature } from '../utils/securityUtils';

export interface AuthenticatedUser {
  firstName: string;
  lastName: string;
  fullName: string;
  role: TeamRole;
  isAdmin: boolean;
  allowedSystems?: string[];
  uid?: string;
  email?: string;
  authSignature?: string;
}

interface LoginScreenProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onInstallAndNotify: () => void;
  notificationsEnabled: boolean;
  onFirebaseEmailLogin: (
    email: string,
    password: string
  ) => Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    needsProfileBootstrap?: boolean;
    error?: string;
  }>;
  onBootstrapAdminProfile: (fullName: string) => Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    error?: string;
  }>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onInstallAndNotify,
  notificationsEnabled,
  onFirebaseEmailLogin,
  onBootstrapAdminProfile
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [bootstrapName, setBootstrapName] = useState('');
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const buildAuthenticatedUserFromProfile = (profile: FirebaseUserProfile): AuthenticatedUser => {
    const cleanFullName = profile.fullName.trim();
    const parts = cleanFullName.split(/\s+/);
    const fName = parts[0] || cleanFullName;
    const lName = parts.slice(1).join(' ') || '';
    const isAdmin = profile.role === 'admin';
    const userObj: AuthenticatedUser = {
      firstName: fName,
      lastName: lName,
      fullName: cleanFullName,
      role: isAdmin ? 'qa' : profile.role,
      isAdmin,
      uid: profile.uid,
      email: profile.email,
      allowedSystems:
        !isAdmin && Array.isArray(profile.allowedSystems) && profile.allowedSystems.length > 0
          ? profile.allowedSystems
          : undefined
    };
    userObj.authSignature = computeUserAuthSignature(userObj);
    return userObj;
  };

  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = bootstrapName.trim();
    if (!clean) {
      setError('יש להזין שם מלא להגדרת מנהל המערכת הראשי.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const res = await onBootstrapAdminProfile(clean);
    setIsSubmitting(false);
    if (!res.ok || !res.profile) {
      setError(res.error || 'לא ניתן היה ליצור פרופיל מנהל ראשוני.');
      return;
    }
    onLoginSuccess(buildAuthenticatedUserFromProfile(res.profile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('נא להזין כתובת אימייל וסיסמה.');
      return;
    }
    setIsSubmitting(true);
    const res = await onFirebaseEmailLogin(cleanEmail, password);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'האימות מול השרת נכשל.');
      return;
    }
    if (res.needsProfileBootstrap) {
      setNeedsBootstrap(true);
      return;
    }
    if (!res.profile) {
      setError('חשבון זה אומת אך אין לו עדיין פרופיל הרשאות ב-std_users. פנה למנהל המערכת.');
      return;
    }
    onLoginSuccess(buildAuthenticatedUserFromProfile(res.profile));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 relative overflow-hidden"
      dir="rtl"
    >
      {/* Subtle Ambient Background Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10">
        {/* Top Hero Brand Area */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-6 pt-8 pb-6 text-center border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950 shadow-xl shadow-indigo-950/30 mb-4 p-2 border border-indigo-500/30">
            <img
              src="./icon.svg"
              alt="סמל צב מן"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">צב מן</h1>
          <p className="text-sm font-bold text-slate-600 mt-1.5 leading-snug">
            סביבת עבודה של <span className="text-indigo-700 font-black">צ</span>וות{' '}
            <span className="text-indigo-700 font-black">ב</span>דיקות{' '}
            <span className="text-indigo-700 font-black">מ</span>דור{' '}
            <span className="text-indigo-700 font-black">נ</span>חשון
          </p>

          <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-600 leading-relaxed text-right">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>ניהול ותיעוד בדיקות מערכת בזמן אמת</span>
            </div>
            <p>
              המערכת מחברת בזמן אמת בין <strong>בודקי ה-QA</strong> לבין{' '}
              <strong>צוות הפיתוח</strong>: כל דיווח תקלה, צילום מסך, שינוי סטטוס או הערה
              מתעדכנים מיד אצל כולם ללא צורך ברענון הדף.
            </p>
          </div>
        </div>

        {/* Firebase Auth Login / Initial Admin Bootstrap Form */}
        {needsBootstrap ? (
          <form onSubmit={handleBootstrapSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>אתחול מנהל מערכת ראשוני ב-Firebase</span>
              </div>
              <p>
                חשבון האימייל שלך אומת בהצלחה! הזן את שמך המלא כדי להירשם כמנהל המערכת הראשי בשרת
                (`std_users`).
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                שם פרטי ומשפחה <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={bootstrapName}
                  onChange={(e) => {
                    setBootstrapName(e.target.value);
                    setError(null);
                  }}
                  placeholder="למשל: שמעון אבקסיס"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe font-medium"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm shadow-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white shadow-indigo-600/25 cursor-pointer transition"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'שומר פרופיל...' : 'צור פרופיל מנהל והיכנס'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>מצב אבטחה מלא (Firebase Auth): נדרש אימות אימייל וסיסמה מול השרת</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                כתובת אימייל <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  autoComplete="username"
                  placeholder="name@company.com"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                סיסמה <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={passwordInputRef}
                  type="password"
                  dir="ltr"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  placeholder="הזן סיסמת Firebase..."
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-mono"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm shadow-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white shadow-indigo-600/25 cursor-pointer transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מאמת מול השרת...</span>
                </>
              ) : (
                <>
                  <span>התחברות מאובטחת</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

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
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-5 text-center relative z-10">
        צב מן • מדור נחשון • מאובטח באמצעות Firebase Auth + הרשאות שרת
      </p>
    </div>
  );
};
