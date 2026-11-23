import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  Copy,
  Check,
  X,
  Database,
  Sparkles,
  AlertCircle,
  Link2,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { FirebaseConfigData, SyncStatusInfo } from '../types/std';
import {
  createShareableTeamLink,
  isValidAppCheckSiteKey,
  parseFirebaseSnippet
} from '../firebaseConfig';
import {
  FIREBASE_FIRESTORE_RULES,
  FIREBASE_RTDB_RULES_JSON
} from '../utils/firebaseRulesTemplates';

interface FirebaseSetupModalProps {
  currentConfig: FirebaseConfigData | null;
  syncStatus: SyncStatusInfo;
  onSaveConfig: (config: FirebaseConfigData) => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({
  currentConfig,
  syncStatus,
  onSaveConfig,
  onClose
}) => {
  const [rawSnippet, setRawSnippet] = useState(
    currentConfig
      ? JSON.stringify(currentConfig, null, 2)
      : ''
  );
  const [dbMode, setDbMode] = useState<'rtdb' | 'firestore'>(
    currentConfig?.mode || 'rtdb'
  );
  const [showRulesPanel, setShowRulesPanel] = useState<boolean>(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [appCheckKey, setAppCheckKey] = useState<string>(currentConfig?.appCheckSiteKey || '');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeRulesText =
    dbMode === 'firestore' ? FIREBASE_FIRESTORE_RULES : FIREBASE_RTDB_RULES_JSON;

  const handleCopyRules = async () => {
    try {
      await navigator.clipboard.writeText(activeRulesText);
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFirebaseSnippet(rawSnippet);
    if (!parsed) {
      setError(
        'לא הצלחנו לזהות הגדרות Firebase תקינות. ניתן להדביק את אובייקט ה-firebaseConfig מהקונסול של Firebase או כתובת Realtime Database URL.'
      );
      return;
    }

    parsed.mode = dbMode;
    parsed.requireFirebaseAuth = true;
    const cleanAppCheck = appCheckKey.trim();
    if (cleanAppCheck && !isValidAppCheckSiteKey(cleanAppCheck)) {
      setError('מפתח ה-reCAPTCHA v3 (App Check) אינו תקין. יש להדביק את ה-Site Key בלבד.');
      return;
    }
    parsed.appCheckSiteKey = cleanAppCheck || undefined;
    setIsConnecting(true);
    const res = await onSaveConfig(parsed);
    setIsConnecting(false);

    if (res.ok) {
      onClose();
    } else {
      setError(res.error || 'שגיאה בהתחברות ל-Firebase');
    }
  };

  const handleCopyShareLink = () => {
    const parsed = parseFirebaseSnippet(rawSnippet) || currentConfig;
    if (!parsed) return;
    parsed.mode = dbMode;
    parsed.requireFirebaseAuth = true;
    if (isValidAppCheckSiteKey(appCheckKey)) parsed.appCheckSiteKey = appCheckKey.trim();
    const link = createShareableTeamLink(parsed);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-l from-indigo-600 to-violet-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">הגדרות חיבור וסנכרון</h2>
              <p className="text-xs text-indigo-100">
                הגדרות סנכרון בזמן אמת לכל חברי הצוות
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConnect} className="p-6 space-y-5">
          {/* Current Status Banner */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-xl border ${
              syncStatus.mode.startsWith('firebase') && syncStatus.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                className={`w-5 h-5 shrink-0 ${
                  syncStatus.mode.startsWith('firebase') && syncStatus.connected
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              />
              <div>
                <div className="font-semibold">
                  {syncStatus.connected ? 'החיבור בזמן אמת פעיל ותקין' : 'ממתין לחיבור'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  כל שינוי מתעדכן אוטומטית אצל כל הצוות.
                </div>
              </div>
            </div>
          </div>

          {/* Choose Firebase Service Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              סוג מסד הנתונים ב-Firebase:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDbMode('rtdb')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition cursor-pointer ${
                  dbMode === 'rtdb'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Realtime Database (מומלץ)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    סנכרון WebSockets מהיר במיוחד + חיווי משתמשים מחוברים בזמן אמת
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDbMode('firestore')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition cursor-pointer ${
                  dbMode === 'firestore'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Cloud Firestore</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    סנכרון מסמכים בזמן אמת באמצעות onSnapshot של Firestore
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Snippet Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                הדבק את קוד ה-firebaseConfig מ-Firebase Console (או כתובת Database URL):
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">מזהה אוטומטית JS / JSON / URL</span>
            </div>
            <textarea
              dir="ltr"
              rows={7}
              value={rawSnippet}
              onChange={(e) => setRawSnippet(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "your-project.firebaseapp.com",\n  databaseURL: "https://your-project-default-rtdb.firebaseio.com",\n  projectId: "your-project",\n  appId: "1:123456:web:abcdef"\n};`}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              טיפ: ב-Firebase Console היכנס ל-Project Settings &rarr; Your apps &rarr; העתק את `firebaseConfig` והדבק כאן.
            </p>
          </div>

          {/* Phase 2+ Server-Side Security Mode (Permanently Enforced) */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                  <span>אבטחה והרשאות פעילות</span>
                </div>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                  גישה למערכת מותרת למשתמשים מאומתים בלבד עם הפרדת הרשאות לפי מערכת.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-800/50 space-y-1.5">
              <label className="block text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
                מפתח הגנה (Site Key):
              </label>
              <input
                type="text"
                dir="ltr"
                value={appCheckKey}
                onChange={(e) => setAppCheckKey(e.target.value)}
                placeholder="6Ld..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-left"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/70 dark:border-emerald-800/50">
              <button
                type="button"
                onClick={() => setShowRulesPanel((p) => !p)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:underline cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {showRulesPanel
                    ? 'הסתר הוראות וחוקי אבטחה לשרת (Security Rules)'
                    : 'הצג חוקי אבטחה מוכנים להדבקה ב-Firebase Console'}
                </span>
              </button>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {dbMode === 'firestore' ? 'firestore.rules' : 'database.rules.json'}
              </span>
            </div>

            {showRulesPanel && (
              <div className="space-y-2.5 pt-1">
                <ol className="text-[11px] text-slate-700 dark:text-slate-300 list-decimal list-inside space-y-1 leading-relaxed">
                  <li>
                    ב-Firebase Console פתח <strong>Authentication &rarr; Sign-in method</strong> והפעל <strong>Email/Password</strong> (מומלץ להוסיף את משתמשי הצוות מראש ב-Users או במסך "ניהול צוות").
                  </li>
                  <li>
                    פתח ב-{dbMode === 'firestore' ? 'Firestore Database' : 'Realtime Database'} את לשונית <strong>Rules</strong>, הדבק את החוקים שלמטה ולחץ <strong>Publish</strong>.
                  </li>
                  <li>
                    לאבטחה מרבית של קוד המקור, מומלץ להעביר את מאגר ה-GitHub מ-Public ל-<strong>Private</strong> בהגדרות המאגר.
                  </li>
                </ol>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyRules}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-[11px] font-bold border border-slate-600 transition cursor-pointer"
                  >
                    {copiedRules ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>החוקים הועתקו!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>העתק Rules</span>
                      </>
                    )}
                  </button>
                  <pre
                    dir="ltr"
                    className="w-full max-h-48 overflow-auto rounded-xl bg-slate-950 text-sky-300 font-mono text-[11px] p-3 text-left border border-slate-800"
                  >
                    {activeRulesText}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {(error || syncStatus.errorMessage) && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="rtl-safe">{error || syncStatus.errorMessage}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCopyShareLink}
              disabled={!rawSnippet.trim() && !currentConfig}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">קישור הצוות הועתק ללוח!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>העתק קישור ישיר לצוות (כולל חיבור אוטומטי)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition cursor-pointer"
              >
                סגור
              </button>
              <button
                type="submit"
                disabled={isConnecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>{isConnecting ? 'מתחבר לענן...' : 'שמור והתחבר ל-Firebase'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
