import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  History,
  UserCheck,
  Database,
  HardDrive
} from 'lucide-react';
import { ServerAuditLogEntry } from '../types/std';
import { syncService } from '../services/syncService';
import { getSavedGoogleDriveUrl } from '../services/googleDriveService';

interface AdminSecurityModalProps {
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ServerAuditLogEntry['category'], { label: string; cls: string }> = {
  auth: {
    label: 'התחברות',
    cls: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  },
  issue: {
    label: 'תקלות',
    cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  team: {
    label: 'צוות והרשאות',
    cls: 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border-violet-200 dark:border-violet-800'
  },
  system: {
    label: 'מערכות',
    cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  backup: {
    label: 'גיבוי ודרייב',
    cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  security: {
    label: 'אבטחה',
    cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  }
};

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<ServerAuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appCheckHealth, setAppCheckHealth] = useState<{
    checked: boolean;
    ok: boolean;
    error?: string;
  }>({ checked: false, ok: false });

  const fbConfig = syncService.getActiveFirebaseConfig();
  const hasAppCheck = Boolean(fbConfig?.appCheckSiteKey);
  const hasDrive = Boolean(getSavedGoogleDriveUrl());
  const projectId = fbConfig?.projectId || 'tzavman-qa';

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const entries = await syncService.fetchRecentAuditLogs(80);
      setLogs(entries);
    } catch (err: any) {
      setError(err?.message || 'לא ניתן לטעון את יומן הביקורת מהשרת.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    syncService
      .checkAppCheckHealth()
      .then((res) => setAppCheckHealth({ checked: true, ok: res.ok, error: res.error }))
      .catch(() => setAppCheckHealth({ checked: true, ok: false, error: 'בדיקה נכשלה' }));
  }, [loadLogs]);

  const formatTime = (ts: number) => {
    try {
      return new Date(ts).toLocaleString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">אבטחת המערכת ויומן ביקורת שרת (Audit Log)</h3>
              <p className="text-xs text-slate-300">
                יומן תיעוד בלתי-ניתן למחיקה בצד השרת (`std_audit_log`) ומצב שכבות ההגנה
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

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Security Layers Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-extrabold text-emerald-950 dark:text-emerald-200">
                  Firebase Auth + חוקי שרת פעילים
                </div>
                <div className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5">
                  גישה אנונימית ו-MQTT פומבי הוסרו לצמיתות.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-extrabold text-emerald-950 dark:text-emerald-200">
                  הפרדת מערכות בצד השרת
                </div>
                <div className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5">
                  משתמשים מוגבלים קוראים רק את `std_systems` המורשים להם.
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                hasDrive
                  ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30'
                  : 'border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30'
              }`}
            >
              <HardDrive
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  hasDrive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              />
              <div className="text-xs">
                <div className="font-extrabold text-slate-900 dark:text-slate-100">
                  Google Drive + אימות Firebase Token
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {hasDrive
                    ? 'מחובר ל-std_private_config ללא סוד משותף בדפדפן.'
                    : 'טרם הוגדרה כתובת Google Drive במסך הגיבוי.'}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                hasAppCheck && (!appCheckHealth.checked || appCheckHealth.ok)
                  ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30'
                  : 'border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30'
              }`}
            >
              {hasAppCheck && (!appCheckHealth.checked || appCheckHealth.ok) ? (
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="font-extrabold text-slate-900 dark:text-slate-100">
                  Firebase App Check (Fraud Defense / reCAPTCHA)
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {!hasAppCheck
                    ? 'אופציונלי — ניתן להוסיף מפתח Site Key בהגדרות Firebase.'
                    : !appCheckHealth.checked
                    ? 'בודק הנפקת טוקן App Check מול השרת...'
                    : appCheckHealth.ok
                    ? 'מאומת חי — טוקן App Check תקין ופעיל להגנה מפני בוטים.'
                    : `המפתח מוגדר אך הנפקת הטוקן נכשלה: ${appCheckHealth.error || 'שגיאה לא ידועה'}`}
                </div>
              </div>
            </div>
          </div>

          {/* Password Management Link */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>איפוס סיסמאות והשבתת חשבונות מתבצעים מאובטח ב-Firebase Authentication Console:</span>
            </div>
            <a
              href={`https://console.firebase.google.com/project/${encodeURIComponent(projectId)}/authentication/users`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
            >
              <span>פתח ניהול משתמשים</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Immutable Server Audit Log */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  יומן ביקורת שרת ({logs.length} פעולות אחרונות)
                </h4>
              </div>
              <button
                type="button"
                onClick={loadLogs}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>רענן יומן</span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto bg-white dark:bg-slate-950">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-slate-500">טוען יומן ביקורת מהשרת...</div>
              ) : logs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  אין עדיין רשומות ביומן הביקורת (`std_audit_log`). פעולות רגישות שיתבצעו מעכשיו יירשמו כאן אוטומטית בלי יכולת מחיקה.
                </div>
              ) : (
                logs.map((entry) => {
                  const badge = CATEGORY_LABELS[entry.category] || CATEGORY_LABELS.security;
                  return (
                    <div
                      key={entry.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50/70 dark:hover:bg-slate-900/70"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 break-words">
                            {entry.action}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                          <span>מבצע: <strong>{entry.actorName}</strong></span>
                          {entry.actorEmail && <span dir="ltr" className="font-mono">({entry.actorEmail})</span>}
                          {entry.target && <span>• יעד: {entry.target}</span>}
                        </div>
                      </div>
                      <span
                        dir="ltr"
                        className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0"
                      >
                        {formatTime(entry.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
