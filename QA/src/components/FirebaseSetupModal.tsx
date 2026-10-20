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
  Trash2
} from 'lucide-react';
import { FirebaseConfigData, SyncStatusInfo } from '../types/std';
import {
  createShareableTeamLink,
  parseFirebaseSnippet
} from '../firebaseConfig';

interface FirebaseSetupModalProps {
  currentConfig: FirebaseConfigData | null;
  syncStatus: SyncStatusInfo;
  onSaveConfig: (config: FirebaseConfigData) => Promise<{ ok: boolean; error?: string }>;
  onDisconnectFirebase: () => void;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({
  currentConfig,
  syncStatus,
  onSaveConfig,
  onDisconnectFirebase,
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
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
    const link = createShareableTeamLink(parsed);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-l from-indigo-600 to-violet-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">הגדרת סנכרון ענן חי (Firebase Realtime / Firestore)</h2>
              <p className="text-xs text-indigo-100">
                חיבור ישיר למסד נתונים בענן כך שכל הצוות יראה עדכונים בזמן אמת ללא רענון דף (ללא F5)
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
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-indigo-50/70 border-indigo-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                className={`w-5 h-5 shrink-0 ${
                  syncStatus.mode.startsWith('firebase') && syncStatus.connected
                    ? 'text-emerald-600'
                    : 'text-indigo-600'
                }`}
              />
              <div>
                <div className="font-semibold">
                  {syncStatus.mode === 'firebase-rtdb' && syncStatus.connected
                    ? `מחובר לענן Firebase Realtime Database (${syncStatus.projectId})`
                    : syncStatus.mode === 'firebase-firestore' && syncStatus.connected
                    ? `מחובר לענן Firebase Firestore (${syncStatus.projectId})`
                    : 'פועל כעת על שרת סנכרון חי מובנה (SSE Live Server)'}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {syncStatus.mode.startsWith('firebase')
                    ? 'כל שינוי משודר מיד דרך Firebase לכל המשתמשים המחוברים.'
                    : 'ניתן להדביק למטה את הגדרות ה-Firebase של הפרויקט שלך כדי לעבור לסנכרון ענן גלובלי.'}
                </div>
              </div>
            </div>

            {currentConfig && (
              <button
                type="button"
                onClick={onDisconnectFirebase}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium transition cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>נתק Firebase</span>
              </button>
            )}
          </div>

          {/* Choose Firebase Service Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              סוג מסד הנתונים ב-Firebase:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDbMode('rtdb')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition cursor-pointer ${
                  dbMode === 'rtdb'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    Realtime Database (מומלץ)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    סנכרון WebSockets מהיר במיוחד + חיווי משתמשים מחוברים בזמן אמת
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDbMode('firestore')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition cursor-pointer ${
                  dbMode === 'firestore'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Sparkles className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900">Cloud Firestore</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    סנכרון מסמכים בזמן אמת באמצעות onSnapshot של Firestore
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Snippet Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                הדבק את קוד ה-firebaseConfig מ-Firebase Console (או כתובת Database URL):
              </label>
              <span className="text-xs text-slate-500">מזהה אוטומטית JS / JSON / URL</span>
            </div>
            <textarea
              dir="ltr"
              rows={7}
              value={rawSnippet}
              onChange={(e) => setRawSnippet(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "your-project.firebaseapp.com",\n  databaseURL: "https://your-project-default-rtdb.firebaseio.com",\n  projectId: "your-project",\n  appId: "1:123456:web:abcdef"\n};`}
              className="w-full rounded-xl border border-slate-300 bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              טיפ: ב-Firebase Console היכנס ל-Project Settings &rarr; Your apps &rarr; העתק את `firebaseConfig` והדבק כאן. ודא שה-Rules ב-Database מוגדרים למצב Test (`read: true, write: true`).
            </p>
          </div>

          {(error || syncStatus.errorMessage) && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="rtl-safe">{error || syncStatus.errorMessage}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCopyShareLink}
              disabled={!rawSnippet.trim() && !currentConfig}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">קישור הצוות הועתק ללוח!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <span>העתק קישור ישיר לצוות (כולל חיבור אוטומטי)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition cursor-pointer"
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
