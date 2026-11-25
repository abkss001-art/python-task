import React, { useState, useRef } from 'react';
import {
  KeyRound,
  User,
  ArrowLeft,
  BellRing,
  Download,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  HelpCircle,
  Send,
  AtSign
} from 'lucide-react';
import { FirebaseUserProfile, JoinRequest, TeamRole } from '../types/std';
import { computeUserAuthSignature } from '../utils/securityUtils';
import {
  getLastLoginIdentifier,
  isValidEmailAddress,
  isValidUsername,
  normalizeUsername,
  saveLastLoginIdentifier,
  storeBrowserPasswordCredential
} from '../utils/authHelpers';

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
    emailOrUsername: string,
    password: string
  ) => Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    resolvedEmail?: string;
    needsProfileBootstrap?: boolean;
    pendingApproval?: boolean;
    error?: string;
  }>;
  onRegisterJoinRequest: (
    fullName: string,
    email: string,
    password: string,
    username: string
  ) => Promise<{
    ok: boolean;
    request?: JoinRequest;
    profile?: FirebaseUserProfile;
    alreadyApproved?: boolean;
    error?: string;
  }>;
  onSendPasswordReset: (emailOrUsername: string) => Promise<{
    ok: boolean;
    normalizedEmail?: string;
    resolvedViaUsername?: boolean;
    maskedEmail?: string;
    error?: string;
  }>;
  onBootstrapAdminProfile: (fullName: string) => Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    error?: string;
  }>;
}

type AuthViewMode = 'login' | 'register' | 'reset';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onInstallAndNotify,
  notificationsEnabled,
  onFirebaseEmailLogin,
  onRegisterJoinRequest,
  onSendPasswordReset,
  onBootstrapAdminProfile
}) => {
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');
  const [email, setEmail] = useState<string>(() => getLastLoginIdentifier());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveToPasswordManager, setSaveToPasswordManager] = useState(true);

  // Self-registration state (Name + Username + Email + Password + Confirm Password)
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState<string>(() => getLastLoginIdentifier());
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Common feedback & initial admin bootstrap
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [bootstrapName, setBootstrapName] = useState('');
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const registerPasswordsMatch =
    registerPassword.length > 0 &&
    registerConfirmPassword.length > 0 &&
    registerPassword === registerConfirmPassword;
  const registerPasswordsMismatch =
    registerConfirmPassword.length > 0 && registerPassword !== registerConfirmPassword;

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
      role: isAdmin ? 'admin' : profile.role,
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
      setError('יש להזין שם מלא.');
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rawIdentifier = email.trim();
    if (!rawIdentifier || !password) {
      setError('נא להזין שם משתמש או אימייל וסיסמה.');
      return;
    }
    setIsSubmitting(true);
    const res = await onFirebaseEmailLogin(rawIdentifier, password);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'ההתחברות נכשלה. בדוק את הפרטים ונסה שוב.');
      return;
    }

    saveLastLoginIdentifier(rawIdentifier);
    if (saveToPasswordManager) {
      void storeBrowserPasswordCredential(
        res.resolvedEmail || rawIdentifier,
        password,
        res.profile?.fullName || rawIdentifier
      );
    }

    if (res.profile) {
      onLoginSuccess(buildAuthenticatedUserFromProfile(res.profile));
      return;
    }
    if (res.pendingApproval) {
      return;
    }
    if (res.needsProfileBootstrap) {
      setNeedsBootstrap(true);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = registerFullName.trim();
    const cleanUsername = normalizeUsername(registerUsername);
    const cleanEmail = registerEmail.trim().toLowerCase();
    if (cleanName.length < 2) {
      setError('נא להזין שם מלא (לפחות 2 תווים).');
      return;
    }
    if (!isValidUsername(cleanUsername)) {
      setError('שם המשתמש חייב להכיל 3–32 תווים באנגלית, ספרות, נקודה, מקף או קו תחתון (ללא רווחים או @).');
      return;
    }
    if (!isValidEmailAddress(cleanEmail)) {
      setError('יש להכניס כתובת מייל תקינה (למשל name@gmail.com) למקרה שיידרש שחזור סיסמה.');
      return;
    }
    if (registerPassword.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setError('הסיסמאות אינן תואמות. נא להזין את אותה הסיסמה בשני השדות.');
      return;
    }

    setIsSubmitting(true);
    const res = await onRegisterJoinRequest(cleanName, cleanEmail, registerPassword, cleanUsername);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'ההרשמה נכשלה. נסה שוב.');
      return;
    }

    saveLastLoginIdentifier(cleanUsername);
    if (saveToPasswordManager) {
      void storeBrowserPasswordCredential(cleanUsername, registerPassword, cleanName);
    }

    if (res.alreadyApproved && res.profile) {
      onLoginSuccess(buildAuthenticatedUserFromProfile(res.profile));
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccessMsg(null);
    const raw = resetEmail.trim();
    if (!raw) {
      setError('נא להזין שם משתמש או אימייל.');
      return;
    }
    setIsSubmitting(true);
    const res = await onSendPasswordReset(raw);
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'שליחת קישור האיפוס נכשלה.');
      return;
    }
    if (res.resolvedViaUsername && res.maskedEmail) {
      setResetSuccessMsg(
        `קישור לאיפוס סיסמה נשלח לכתובת המייל השמורה בחשבון (${res.maskedEmail}). בדוק גם בספאם.`
      );
    } else {
      setResetSuccessMsg(
        `קישור לאיפוס סיסמה נשלח אל ${res.normalizedEmail || raw}. בדוק גם בספאם.`
      );
    }
  };

  const switchMode = (nextMode: AuthViewMode) => {
    setViewMode(nextMode);
    setError(null);
    setResetSuccessMsg(null);
    if (nextMode === 'reset' && email.trim() && !resetEmail.trim()) {
      setResetEmail(email.trim());
    }
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
        {/* Clean Top Hero Brand Area */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-6 pt-7 pb-5 text-center border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 shadow-xl shadow-indigo-950/30 mb-3 p-2 border border-indigo-500/30">
            <img
              src="./icon.svg"
              alt="סמל צב מן"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">צב מן</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-snug">
            <span className="text-indigo-700 font-black">צ</span>וות{' '}
            <span className="text-indigo-700 font-black">ב</span>דיקות{' '}
            <span className="text-indigo-700 font-black">מ</span>דור{' '}
            <span className="text-indigo-700 font-black">נ</span>חשון
          </p>
        </div>

        {/* Mode Switcher Tabs (Login vs Join/Register) */}
        {!needsBootstrap && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  viewMode === 'login' || viewMode === 'reset'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>התחברות</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  viewMode === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>הרשמה</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. Initial Admin Bootstrap Form */}
        {needsBootstrap ? (
          <form onSubmit={handleBootstrapSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>הגדרת מנהל מערכת ראשי</span>
              </div>
              <p>הזן את שמך המלא להשלמת ההגדרה הראשונית.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                שם מלא <span className="text-red-500">*</span>
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
                  placeholder="שם פרטי ומשפחה"
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
              <span>{isSubmitting ? 'שומר...' : 'המשך למערכת'}</span>
            </button>
          </form>
        ) : viewMode === 'register' ? (
          /* 2. Self-Registration Form (Name + Email + Password + Confirm Password + Save Password) */
          <form onSubmit={handleRegisterSubmit} className="p-6 pt-4 space-y-3.5" autoComplete="on">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם מלא <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={registerFullName}
                  onChange={(e) => {
                    setRegisterFullName(e.target.value);
                    setError(null);
                  }}
                  placeholder="שם פרטי ומשפחה"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם משתמש <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  dir="ltr"
                  required
                  minLength={3}
                  maxLength={32}
                  autoComplete="username"
                  value={registerUsername}
                  onChange={(e) => {
                    setRegisterUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="למשל: david123"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-medium"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                אותיות באנגלית ומספרים (3+ תווים) — ישמש אותך להתחברות מהירה
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                מייל <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  dir="ltr"
                  required
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => {
                    setRegisterEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="name@gmail.com"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-medium"
                />
              </div>
              <p className="mt-1 text-[11px] text-indigo-700 font-semibold">
                יש להכניס כתובת מייל למקרה שיידרש שחזור סיסמה.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                סיסמה (לפחות 6 תווים) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  name="password"
                  dir="ltr"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="הזן סיסמה"
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showRegisterPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  aria-label={showRegisterPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showRegisterPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                אימות סיסמה <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  name="confirm-password"
                  dir="ltr"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={registerConfirmPassword}
                  onChange={(e) => {
                    setRegisterConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="הזן שוב את הסיסמה"
                  className={`w-full pr-10 pl-10 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 transition text-left font-mono ${
                    registerPasswordsMismatch
                      ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                      : registerPasswordsMatch
                      ? 'border-emerald-400 focus:ring-emerald-500/30 focus:border-emerald-500'
                      : 'border-slate-300 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showRegisterConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  aria-label={showRegisterConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showRegisterConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {registerPasswordsMismatch && (
                <p className="mt-1 text-[11px] font-bold text-red-600">הסיסמאות אינן תואמות</p>
              )}
              {registerPasswordsMatch && (
                <p className="mt-1 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>הסיסמאות תואמות</span>
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveToPasswordManager}
                onChange={(e) => setSaveToPasswordManager(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer shrink-0"
              />
              <span className="text-xs font-bold text-slate-700">שמירת סיסמה</span>
            </label>

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
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>הרשמה והתחברות</span>
                </>
              )}
            </button>
          </form>
        ) : viewMode === 'reset' ? (
          /* 3. Forgot Password Reset Form */
          <form onSubmit={handleResetSubmit} className="p-6 pt-4 space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>איפוס סיסמה</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                הזן את שם המשתמש או האימייל שלך ונשלח קישור לאיפוס הסיסמה לכתובת המייל השמורה בחשבון.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                שם משתמש או אימייל <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  inputMode="email"
                  dir="ltr"
                  required
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setError(null);
                    setResetSuccessMsg(null);
                  }}
                  placeholder="שם משתמש או name@gmail.com"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {resetSuccessMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white shadow-md cursor-pointer transition"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'שולח...' : 'שלח קישור לאיפוס'}</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-indigo-700 cursor-pointer transition"
              >
                חזרה להתחברות
              </button>
            </div>
          </form>
        ) : (
          /* 4. Existing User Login Form */
          <form onSubmit={handleLoginSubmit} className="p-6 pt-4 space-y-3.5" autoComplete="on">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם משתמש או אימייל <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  inputMode="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  autoComplete="username"
                  placeholder="שם משתמש או name@gmail.com"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-medium"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                ניתן להתחבר עם שם המשתמש שבחרת או עם כתובת האימייל
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  סיסמה <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  שכחתי סיסמה?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  dir="ltr"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  placeholder="הזן סיסמה"
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-left font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveToPasswordManager}
                onChange={(e) => setSaveToPasswordManager(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer shrink-0"
              />
              <span className="text-xs font-bold text-slate-700">שמירת סיסמה</span>
            </label>

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
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <span>התחברות</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => switchMode('register')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-800 text-xs font-extrabold cursor-pointer transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>משתמש חדש? הרשמה למערכת</span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex justify-center">
              {notificationsEnabled ? (
                <button
                  type="button"
                  onClick={onInstallAndNotify}
                  className="relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs transition cursor-pointer"
                  title="הגדרות התראות"
                >
                  <BellRing className="w-4 h-4 text-emerald-600" />
                  <span>התראות פעילות</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onInstallAndNotify}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                  <BellRing className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>התקן אפליקציה והפעל התראות</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-5 text-center relative z-10">
        צב מן • מדור נחשון
      </p>
    </div>
  );
};
