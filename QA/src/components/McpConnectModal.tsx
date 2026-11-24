import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Bot,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Terminal,
  Sparkles,
  AlertTriangle,
  KeyRound,
  Lock
} from 'lucide-react';
import { TeamRole } from '../types/std';
import { syncService } from '../services/syncService';
import {
  buildClaudeCodeAddCommand,
  buildMcpServerConfigJson,
  getMcpScriptDownloadUrl,
  maskMcpTokenForDisplay
} from '../utils/mcpTokenUtils';

interface McpConnectModalProps {
  currentUserName: string;
  currentUserRole: TeamRole;
  isAdmin: boolean;
  allowedSystems?: string[];
  onOpenAdminMcpSetup?: () => void;
  onClose: () => void;
}

const SAVED_SCRIPT_PATH_KEY = 'tzavman_mcp_script_path_v1';

export const McpConnectModal: React.FC<McpConnectModalProps> = ({
  currentUserName,
  currentUserRole,
  isAdmin,
  allowedSystems,
  onOpenAdminMcpSetup,
  onClose
}) => {
  const [activeClientTab, setActiveClientTab] = useState<'antigravity' | 'claude'>('antigravity');
  const [scriptPath, setScriptPath] = useState<string>(() => {
    try {
      return (
        localStorage.getItem(SAVED_SCRIPT_PATH_KEY) ||
        'C:/Users/YOUR_USER/Downloads/tzavman-mcp.mjs'
      );
    } catch {
      return 'C:/Users/YOUR_USER/Downloads/tzavman-mcp.mjs';
    }
  });
  const [revealToken, setRevealToken] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mcpStatus, setMcpStatus] = useState(() => syncService.getMcpBridgeStatus());

  useEffect(() => {
    return syncService.subscribeMcpBridgeStatus((status) => {
      setMcpStatus(status);
    });
  }, []);

  const tokenResult = useMemo(
    () => syncService.generatePersonalMcpToken(),
    [mcpStatus.enabled, mcpStatus.configured]
  );
  const personalToken = tokenResult.ok && tokenResult.token ? tokenResult.token : '';
  const displayToken = revealToken ? personalToken : maskMcpTokenForDisplay(personalToken);

  const antigravityJsonReal = useMemo(
    () => (personalToken ? buildMcpServerConfigJson(scriptPath, personalToken) : ''),
    [scriptPath, personalToken]
  );
  const antigravityJsonDisplay = useMemo(
    () => (personalToken ? buildMcpServerConfigJson(scriptPath, displayToken) : ''),
    [scriptPath, personalToken, displayToken]
  );

  const claudeCliReal = useMemo(
    () => (personalToken ? buildClaudeCodeAddCommand(scriptPath, personalToken) : ''),
    [scriptPath, personalToken]
  );
  const claudeCliDisplay = useMemo(
    () => (personalToken ? buildClaudeCodeAddCommand(scriptPath, displayToken) : ''),
    [scriptPath, personalToken, displayToken]
  );

  const handleScriptPathChange = (val: string) => {
    setScriptPath(val);
    try {
      localStorage.setItem(SAVED_SCRIPT_PATH_KEY, val);
    } catch {
      // ignore storage errors
    }
  };

  const handleCopy = async (id: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  const handleDownloadScript = () => {
    const url = getMcpScriptDownloadUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tzavman-mcp.mjs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const roleLabel = isAdmin ? 'מנהל מערכת' : currentUserRole === 'dev' ? 'מפתח' : 'בודק QA';
  const canCreateIssues = isAdmin || currentUserRole === 'qa';
  const systemsSummary =
    isAdmin || !allowedSystems || allowedSystems.length === 0
      ? 'כל המערכות הפעילות'
      : allowedSystems.join(', ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-l from-slate-950 via-indigo-950 to-violet-950 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold flex items-center gap-2 truncate">
                <span>חיבור סוכן AI (MCP)</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 text-[11px] font-bold shrink-0">
                  {roleLabel}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                חבר את Antigravity או Claude ישירות לחשבון שלך ב״צב מן״ ({currentUserName})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Personal Permissions Card */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 min-w-0">
              <div className="font-extrabold text-indigo-950 dark:text-indigo-200">
                הסוכן פועל אך ורק לפי ההרשאות האישיות שלך:
              </div>
              <div className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed">
                <strong>פעולות מותרות:</strong>{' '}
                {canCreateIssues
                  ? 'צפייה בתקלות, פתיחת תקלות חדשות (כולל העלאת צילומי מסך), תגובות ועדכון סטטוסים.'
                  : 'צפייה בתקלות, הוספת תגובות ועדכון סטטוסים (ללא פתיחת תקלות חדשות).'}
              </div>
              <div className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed">
                <strong>מערכות פתוחות עבורך:</strong>{' '}
                <span className="bidi-isolate font-bold">{systemsSummary}</span>
              </div>
            </div>
          </div>

          {!tokenResult.ok ? (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-100">
                  חיבור סוכן AI עדיין לא הופעל
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
                  {tokenResult.error}
                </p>
              </div>
              {isAdmin && onOpenAdminMcpSetup && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminMcpSetup();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-xs cursor-pointer transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>הפעל כעת בסביבת מפתח</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Step 1: Download standalone MCP file */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      שלב 1 — הורד את קובץ החיבור (חד-פעמי, בלי התקנות)
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      קובץ עצמאי אחד (
                      <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono">
                        tzavman-mcp.mjs
                      </code>
                      ) — דורש רק Node.js במחשב, בלי npm install.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadScript}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-xs cursor-pointer transition shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>הורד tzavman-mcp.mjs</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    נתיב הקובץ אצלך במחשב (הפקודות למטה מתעדכנות אוטומטית):
                  </label>
                  <input
                    type="text"
                    value={scriptPath}
                    onChange={(e) => handleScriptPathChange(e.target.value)}
                    placeholder="C:/Users/YourName/Downloads/tzavman-mcp.mjs"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Step 2: Ready-to-copy client config with personal token */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    שלב 2 — העתק את ההגדרות (הטוקן האישי שלך כבר משולב)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRevealToken((prev) => !prev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                    >
                      {revealToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{revealToken ? 'הסתר טוקן' : 'הצג טוקן'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('token-only', personalToken)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer transition"
                    >
                      {copiedId === 'token-only' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">הועתק!</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>העתק טוקן בלבד</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Client Tabs: Antigravity vs Claude */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setActiveClientTab('antigravity')}
                    className={`py-2 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      activeClientTab === 'antigravity'
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Antigravity
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveClientTab('claude')}
                    className={`py-2 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      activeClientTab === 'claude'
                        ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Claude (Code / Desktop)
                  </button>
                </div>

                {activeClientTab === 'antigravity' ? (
                  <div className="space-y-2.5">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      באנטי גרביטי: פתח את הגדרות ה-<strong>MCP Servers</strong> ← ערוך את{' '}
                      <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono">
                        mcp_config.json
                      </code>{' '}
                      והדבק את ההגדרה:
                    </p>
                    <pre
                      className="p-3 rounded-xl bg-slate-950 text-indigo-200 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800"
                      dir="ltr"
                    >
                      {antigravityJsonDisplay}
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopy('antigravity-json', antigravityJsonReal)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
                    >
                      {copiedId === 'antigravity-json' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>הגדרות Antigravity הועתקו ללוח!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>העתק הגדרות מוכנות ל-Antigravity</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Claude Code CLI */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Claude Code (הכי מהיר — הדבק בטרמינל):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy('claude-cli', claudeCliReal)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold cursor-pointer transition"
                        >
                          {copiedId === 'claude-cli' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>הועתק!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>העתק פקודה</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre
                        className="p-3 rounded-xl bg-slate-950 text-amber-200 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap break-all"
                        dir="ltr"
                      >
                        {claudeCliDisplay}
                      </pre>
                    </div>

                    {/* Claude Desktop JSON */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                          Claude Desktop (קובץ claude_desktop_config.json):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy('claude-desktop', antigravityJsonReal)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-[11px] font-bold cursor-pointer transition"
                        >
                          {copiedId === 'claude-desktop' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 dark:text-emerald-400">הועתק!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>העתק JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre
                        className="p-3 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800"
                        dir="ltr"
                      >
                        {antigravityJsonDisplay}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Prompt Examples */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>מה אפשר לבקש מהסוכן מיד אחרי החיבור?</span>
                </div>
                <ul className="text-[11px] text-emerald-900/90 dark:text-emerald-300 space-y-1 list-disc pr-4 leading-relaxed">
                  {canCreateIssues ? (
                    <>
                      <li>&quot;תבדוק אילו תקלות כבר פתוחות ב-CARGO ותוסיף תקלה חדשה עם צילום המסך הזה&quot;</li>
                      <li>&quot;תעביר את תסריט #5 ב-CARGO לסטטוס נבדק תקין ותוסיף הערה שהבדיקה עברה&quot;</li>
                    </>
                  ) : (
                    <>
                      <li>&quot;תציג לי את כל התקלות הפתוחות במערכות שלי בצב מן&quot;</li>
                      <li>&quot;אחרי שתיקנו את הבאג, תעביר את תסריט #5 לסטטוס ניתן לבדוק שוב ותכתוב הערה מה תוקן&quot;</li>
                    </>
                  )}
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                הטוקן אישי לחשבון שלך (בלי סיסמה גלויה) — אל תשתף אותו עם אחרים. שינוי סיסמה או הסרה מהצוות מבטלים אותו מיד.
              </p>
            </>
          )}
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
