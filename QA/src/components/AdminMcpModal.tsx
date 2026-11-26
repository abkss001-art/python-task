import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Power
} from 'lucide-react';
import { syncService } from '../services/syncService';
import { useModalUx } from '../utils/modalViewportAndBack';

interface AdminMcpModalProps {
  onBack?: () => void;
  onClose: () => void;
}

export const AdminMcpModal: React.FC<AdminMcpModalProps> = ({ onBack, onClose }) => {
  const initialCfg = syncService.getAdminMcpBridgeConfig();
  const projectId = syncService.getActiveFirebaseConfig()?.projectId || 'tzavman-qa';

  const [debugToken, setDebugToken] = useState<string>(initialCfg.appCheckDebugToken);
  const [enabled, setEnabled] = useState<boolean>(initialCfg.enabled);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleTestToken = async () => {
    setStatusMsg(null);
    setIsTesting(true);
    const res = await syncService.testMcpDebugTokenLive(debugToken);
    setIsTesting(false);
    if (res.ok) {
      setStatusMsg({
        type: 'ok',
        text: 'הטוקן אומת בהצלחה מול Firebase App Check! לחץ על "שמור הגדרות" כדי להפעיל לכל הצוות.'
      });
    } else {
      setStatusMsg({ type: 'err', text: res.error || 'בדיקת הטוקן נכשלה.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsSaving(true);
    const res = await syncService.saveMcpBridgeConfig(debugToken, enabled);
    setIsSaving(false);
    if (res.ok) {
      setStatusMsg({
        type: 'ok',
        text:
          enabled && debugToken.trim()
            ? 'חיבור סוכני AI (MCP) פעיל כעת! כל חבר צוות יכול ללחוץ על כפתור "סוכן AI" ולקבל טוקן אישי.'
            : 'ההגדרות נשמרו (חיבור סוכני AI מושבת כרגע לצוות).'
      });
    } else {
      setStatusMsg({ type: 'err', text: res.error || 'שמירת ההגדרות נכשלה.' });
    }
  };

  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/appcheck/apps`;

  useModalUx(true, onBack || onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs modal-backdrop-safe overflow-hidden overscroll-none"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-auto modal-card-safe flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-l from-slate-950 via-violet-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור שלב אחד אחורה"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-400/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold truncate">הגדרות חיבור סוכני AI (MCP)</h3>
              <p className="text-xs text-slate-300">
                הגדרה חד-פעמית המאפשרת לכל עובד לחבר את Antigravity / Claude באופן עצמאי
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 min-h-0 overflow-y-auto flex-1 modal-scroll-area">
          {/* Status Indicator + Kill Switch */}
          <div
            className={`flex items-center justify-between gap-3 p-4 rounded-2xl border ${
              enabled && debugToken.trim()
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Power
                className={`w-5 h-5 shrink-0 ${
                  enabled && debugToken.trim()
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {enabled ? 'גשר סוכני AI מופעל לצוות' : 'גשר סוכני AI מושבת (מתג כיבוי)'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  כל חבר צוות מקבל טוקן אישי אך ורק לפי החשבון וההרשאות שלו.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnabled((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
                enabled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
              }`}
            >
              {enabled ? 'פעיל' : 'כבוי'}
            </button>
          </div>

          {/* 30-second Firebase Console Setup Instructions */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200">
                איך מפיקים טוקן חד-פעמי ב-Firebase Console (30 שניות):
              </span>
              <a
                href={consoleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition shrink-0"
              >
                <span>פתח App Check</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="text-[11px] text-indigo-900/90 dark:text-indigo-200 space-y-1 list-decimal pr-4 leading-relaxed">
              <li>לחץ על שלוש הנקודות ליד האפליקציה ובחר <strong>Manage debug tokens</strong>.</li>
              <li>לחץ <strong>Add debug token</strong>, תן לו שם (למשל <code className="font-mono">TzavMan-MCP</code>) ולחץ <strong>Generate token</strong> + <strong>Save</strong>.</li>
              <li>העתק את הטוקן שנוצר (פורמט UUID) והדבק אותו כאן למטה.</li>
            </ol>
          </div>

          {/* Token Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              App Check Debug Token עבור MCP
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={debugToken}
                onChange={(e) => {
                  setDebugToken(e.target.value);
                  if (statusMsg) setStatusMsg(null);
                }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full pr-3.5 pl-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowToken((prev) => !prev)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showToken ? 'הסתר טוקן' : 'הצג טוקן'}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              הטוקן לבדו לא מאפשר גישה לשום מידע — כל בקשה חייבת אימות של עובד מאושר ב-std_users.
            </p>
          </div>

          {/* Feedback */}
          {statusMsg && (
            <div
              className={`flex items-start gap-2 p-3.5 rounded-xl border text-xs font-bold leading-relaxed ${
                statusMsg.type === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              }`}
            >
              {statusMsg.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isTesting || !debugToken.trim()}
              onClick={handleTestToken}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold disabled:opacity-50 cursor-pointer transition"
            >
              {isTesting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>בדוק תקינות טוקן</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
              >
                סגור
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-xs cursor-pointer transition"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>שמור הגדרות</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
