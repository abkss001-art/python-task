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
  Lock,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  FolderOpen,
  PlayCircle
} from 'lucide-react';
import { TeamRole } from '../types/std';
import { syncService } from '../services/syncService';
import {
  buildClaudeCodeAddCommand,
  buildMcpServerConfigJson,
  buildMcpServerEntrySnippet,
  getMcpScriptDownloadUrl,
  maskMcpTokenForDisplay
} from '../utils/mcpTokenUtils';
import { useModalUx } from '../utils/modalViewportAndBack';

interface McpConnectModalProps {
  currentUserName: string;
  currentUserRole: TeamRole;
  isAdmin: boolean;
  allowedSystems?: string[];
  onOpenAdminMcpSetup?: () => void;
  onClose: () => void;
}

const SAVED_SCRIPT_PATH_KEY = 'tzavman_mcp_script_path_v1';
const DEFAULT_SCRIPT_PATH_PLACEHOLDER = 'C:/Users/YOUR_USER/Downloads/tzavman-mcp.mjs';

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
      return localStorage.getItem(SAVED_SCRIPT_PATH_KEY) || DEFAULT_SCRIPT_PATH_PLACEHOLDER;
    } catch {
      return DEFAULT_SCRIPT_PATH_PLACEHOLDER;
    }
  });
  const [revealToken, setRevealToken] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
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

  const isUsingPlaceholderPath =
    !scriptPath.trim() ||
    scriptPath.includes('YOUR_USER') ||
    scriptPath.includes('YourName');

  const antigravityJsonReal = useMemo(
    () => (personalToken ? buildMcpServerConfigJson(scriptPath, personalToken) : ''),
    [scriptPath, personalToken]
  );
  const antigravityJsonDisplay = useMemo(
    () => (personalToken ? buildMcpServerConfigJson(scriptPath, displayToken) : ''),
    [scriptPath, personalToken, displayToken]
  );
  const entrySnippetReal = useMemo(
    () => (personalToken ? buildMcpServerEntrySnippet(scriptPath, personalToken) : ''),
    [scriptPath, personalToken]
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
  const primaryExampleSystem =
    allowedSystems && allowedSystems.length > 0 ? allowedSystems[0] : 'CARGO';
  const systemsSummary =
    isAdmin || !allowedSystems || allowedSystems.length === 0
      ? 'כל המערכות הפעילות'
      : allowedSystems.join(', ');

  const firstTestPrompt =
    'תבדוק ב-tzavman מי אני, אילו מערכות פתוחות עבורי וכמה תקלות פתוחות יש בכל אחת';

  const rolePrompts = canCreateIssues
    ? [
        {
          id: 'p-create',
          title: 'פתיחת תקלה חדשה (בלי כפילויות + צילום מסך)',
          text: `תבדוק קודם ב-tzavman אם כבר קיימת תקלה דומה במערכת ${primaryExampleSystem}, ואם לא — תפתח תקלה חדשה על [תאר את הבעיה] בחומרה גבוהה ותצרף את צילום המסך מהנתיב [נתיב התמונה].`
        },
        {
          id: 'p-batch',
          title: 'פתיחת כמה תקלות ברצף מדוח בדיקות',
          text: `הנה רשימת הבאגים שמצאתי עכשיו ב-${primaryExampleSystem}. תעבור עליהם אחד-אחד ותפתח לכל אחד תקלה מסודרת ב-tzavman עם כותרת ברורה, פירוט ושלבי שחזור.`
        },
        {
          id: 'p-close',
          title: 'אישור תיקון וסגירת תסריט',
          text: `תעביר את תסריט #5 במערכת ${primaryExampleSystem} ב-tzavman לסטטוס "נבדק תקין" ותוסיף הערה שהבדיקה החוזרת עברה בהצלחה.`
        }
      ]
    : [
        {
          id: 'p-list',
          title: 'רשימת תקלות פתוחות לטיפול',
          text: `תציג לי מ-tzavman את כל התקלות הפתוחות והקריטיות במערכת ${primaryExampleSystem}, מסודרות לפי חומרה.`
        },
        {
          id: 'p-retest',
          title: 'עדכון לאחר תיקון באג',
          text: `סיימתי לתקן את הבאג בתסריט #5 במערכת ${primaryExampleSystem}. תעביר אותו ב-tzavman לסטטוס "ניתן לבדוק שוב" ותכתוב הערה קצרה מה תוקן.`
        },
        {
          id: 'p-comment',
          title: 'הוספת תגובה / שאלה לבודק',
          text: `תוסיף תגובה בתסריט #5 במערכת ${primaryExampleSystem} ב-tzavman: "לא הצלחתי לשחזר בסביבת הטסטים, אפשר לפרט באיזה דפדפן ומשתמש זה קרה?"`
        }
      ];

  useModalUx(true, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs modal-backdrop-safe overflow-hidden overscroll-none"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-auto modal-card-safe flex flex-col animate-in fade-in zoom-in-95 duration-150">
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
                מדריך חיבור מהיר ל-Antigravity או Claude ישירות לחשבון שלך ({currentUserName})
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
        <div className="p-5 sm:p-6 space-y-4 min-h-0 overflow-y-auto flex-1 modal-scroll-area">
          {/* Personal Permissions & What This Gives You Card */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5 min-w-0">
              <div className="font-extrabold text-indigo-950 dark:text-indigo-200">
                מה זה מאפשר לך? לדבר עם סוכן ה-AI בעברית — והוא עובד ישירות מול ״צב מן״!
              </div>
              <div className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed">
                <strong>הרשאות החשבון שלך ({roleLabel}):</strong>{' '}
                {canCreateIssues
                  ? 'צפייה בתקלות, פתיחת תקלות חדשות (כולל העלאת צילומי מסך מהמחשב), הוספת תגובות ועדכון סטטוסים.'
                  : 'צפייה בתקלות קיימות, הוספת תגובות ועדכון סטטוסים (פתיחת תקלות חדשות פתוחה לבודקי QA ומנהלים בלבד).'}
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
              {/* Step 1: Download standalone MCP file + exact path helper */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black shrink-0">
                        1
                      </span>
                      <span>הורד את קובץ החיבור והזן את הנתיב שלו (חד-פעמי)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      קובץ עצמאי אחד (
                      <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono">
                        tzavman-mcp.mjs
                      </code>
                      ) — דורש רק <strong>Node.js</strong> במחשב (בלי התקנות נוספות ובלי{' '}
                      <code className="font-mono">npm install</code>).
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

                {/* Windows copy-as-path tip */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <FolderOpen className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>איך משיגים את הנתיב ב-3 שניות (Windows)?</strong> פתח את תיקיית ההורדות ← לחץ{' '}
                    <strong>קליק ימני</strong> על{' '}
                    <code className="font-mono text-slate-800 dark:text-slate-100">tzavman-mcp.mjs</code> ← בחר{' '}
                    <strong>&quot;העתק כנתיב&quot;</strong> (<span dir="ltr">Copy as path</span>) ← והדבק בתיבה למטה
                    (אנחנו מסדרים אוטומטית את המירכאות והלוכסנים).
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                    נתיב הקובץ אצלך במחשב (כל הפקודות בשלב 2 מתעדכנות אוטומטית):
                  </label>
                  <input
                    type="text"
                    value={scriptPath}
                    onChange={(e) => handleScriptPathChange(e.target.value)}
                    placeholder="C:/Users/YourName/Downloads/tzavman-mcp.mjs"
                    className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition ${
                      isUsingPlaceholderPath
                        ? 'border-amber-400 dark:border-amber-600 focus:ring-amber-500/30 focus:border-amber-500'
                        : 'border-emerald-400 dark:border-emerald-700 focus:ring-emerald-500/30 focus:border-emerald-500'
                    }`}
                    dir="ltr"
                  />
                  {isUsingPlaceholderPath ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        שים לב: עדיין מופיע נתיב לדוגמה (YOUR_USER). הדבק כאן את הנתיב האמיתי אצלך במחשב לפני ההעתקה!
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>הנתיב נקלט — ההגדרות בשלב 2 מוכנות להעתקה!</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2: Ready-to-copy client config with personal token */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black shrink-0">
                      2
                    </span>
                    <span>בחר את הסוכן שלך והעתק את ההגדרות (הטוקן האישי כבר משולב)</span>
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
                  <div className="space-y-3">
                    <ol className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal pr-4 leading-relaxed">
                      <li>
                        בתוך <strong>Antigravity</strong>, פתח את תפריט ה-<strong>MCP Servers</strong> ←{' '}
                        <strong>Manage MCP Servers</strong> ← <strong>View raw config</strong> (נפתח הקובץ{' '}
                        <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono">
                          mcp_config.json
                        </code>
                        ).
                      </li>
                      <li>
                        <strong>אם הקובץ ריק</strong> — לחץ על <strong>&quot;העתק הגדרה מלאה&quot;</strong> והדבק במקום כל התוכן.
                      </li>
                      <li>
                        <strong>אם כבר יש לך שרתי MCP אחרים</strong> בתוך{' '}
                        <code className="font-mono">mcpServers</code> — לחץ על{' '}
                        <strong>&quot;העתק רק בלוק tzavman-qa&quot;</strong> והדבק בפנים (אחרי פסיק).
                      </li>
                      <li>
                        שמור (<kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl+S</kbd>) ולחץ <strong>Refresh</strong> (או פתח שיחה חדשה).
                      </li>
                    </ol>

                    <pre
                      className="p-3 rounded-xl bg-slate-950 text-indigo-200 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800"
                      dir="ltr"
                    >
                      {antigravityJsonDisplay}
                    </pre>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy('antigravity-json', antigravityJsonReal)}
                        className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
                      >
                        {copiedId === 'antigravity-json' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ההגדרה המלאה הועתקה!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>העתק הגדרה מלאה ל-Antigravity</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy('antigravity-entry', entrySnippetReal)}
                        className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        {copiedId === 'antigravity-entry' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-400">הבלוק הפנימי הועתק!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>העתק רק בלוק tzavman-qa (אם יש שרתים)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* Option A: Claude Code CLI */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>אפשרות א׳ — Claude Code (הכי מהיר, פקודה אחת):</span>
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
                      <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal pr-4 leading-relaxed">
                        <li>פתח טרמינל (PowerShell / CMD / Terminal), הדבק את הפקודה למטה ולחץ <strong>Enter</strong>.</li>
                        <li>פתח שיחה חדשה ב-Claude Code — השרת <code className="font-mono">tzavman-qa</code> מחובר אוטומטית!</li>
                      </ol>
                      <pre
                        className="p-3 rounded-xl bg-slate-950 text-amber-200 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap break-all"
                        dir="ltr"
                      >
                        {claudeCliDisplay}
                      </pre>
                    </div>

                    {/* Option B: Claude Desktop JSON */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                          אפשרות ב׳ — Claude Desktop (אפליקציית שולחן עבודה):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy('claude-desktop', antigravityJsonReal)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-[11px] font-bold cursor-pointer transition"
                          >
                            {copiedId === 'claude-desktop' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 dark:text-emerald-400">הועתק!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>העתק JSON מלא</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy('claude-desktop-entry', entrySnippetReal)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold cursor-pointer transition"
                          >
                            {copiedId === 'claude-desktop-entry' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 dark:text-emerald-400">הועתק!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>רק בלוק פנימי</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal pr-4 leading-relaxed">
                        <li>
                          בתוך Claude Desktop היכנס ל-<strong>Settings</strong> ← <strong>Developer</strong> ←{' '}
                          <strong>Edit Config</strong> (ייפתח הקובץ{' '}
                          <code className="font-mono">claude_desktop_config.json</code>).
                        </li>
                        <li>הדבק את ה-JSON המלא (או רק את הבלוק הפנימי אם כבר יש שרתים) ושמור.</li>
                        <li><strong>סגור לגמרי</strong> את Claude Desktop (כולל מהסמל ליד השעון) ופתח אותו מחדש.</li>
                      </ol>
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

              {/* Step 3: First Test & Copyable Prompt Examples */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black shrink-0">
                    3
                  </span>
                  <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>בדיקה ראשונה ודוגמאות מה לכתוב לסוכן</span>
                </div>

                {/* First 10-second verification prompt */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>בדיקה ראשונה (תדע תוך 5 שניות שזה עובד!):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('first-test', firstTestPrompt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold cursor-pointer transition shrink-0"
                    >
                      {copiedId === 'first-test' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>הועתק!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>העתק הודעה</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    &quot;{firstTestPrompt}&quot;
                  </p>
                </div>

                {/* Tailored workflow prompts */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                    דוגמאות לשימוש יומיומי ({roleLabel}):
                  </div>
                  <div className="space-y-1.5">
                    {rolePrompts.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-emerald-200/70 dark:border-emerald-900/70 flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                            {item.title}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            &quot;{item.text}&quot;
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.text)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer transition shrink-0"
                          title="העתק דוגמה"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible FAQ & Troubleshooting */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsFaqOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-right hover:bg-slate-50 dark:hover:bg-slate-800/70 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>שאלות נפוצות ופתרון תקלות</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isFaqOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isFaqOpen && (
                  <div className="px-4 pb-4 pt-1 space-y-2.5 text-[11px] text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">
                        הסוכן אומר ש-&quot;node&quot; לא מזוהה?
                      </strong>{' '}
                      יש להתקין Node.js (גרסת LTS) מאתר{' '}
                      <span dir="ltr" className="font-mono text-indigo-600 dark:text-indigo-400">
                        nodejs.org
                      </span>
                      , ואז לסגור ולפתוח מחדש את Antigravity או Claude.
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">
                        שיניתי סיסמה או קיבלתי הודעה שהטוקן פג?
                      </strong>{' '}
                      שינוי סיסמה, הסרה מהצוות או החלפת מפתח מבטלים את הטוקן הישן אוטומטית. פשוט היכנס שוב ל<strong>סוכן AI</strong>, העתק את ההגדרה החדשה והדבק במקום הישנה.
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">
                        אפשר לצרף צילומי מסך דרך הסוכן?
                      </strong>{' '}
                      כן! ציין לסוכן את הנתיב של צילום המסך אצלך במחשב (PNG / JPG / WEBP) והוא יעלה אותו אוטומטית ל-Google Drive ויצרף לתקלה או לתגובה.
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">
                        אפשר לשתף את הטוקן שלי עם חבר צוות?
                      </strong>{' '}
                      <strong>לא!</strong> הטוקן אישי ומתעד כל פעולה על שמך. כל חבר צוות מפיק לעצמו טוקן משלו בלחיצה על <strong>סוכן AI</strong> מתוך החשבון שלו.
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                הטוקן אישי לחשבון שלך (ללא סיסמה גלויה) — אל תשתף אותו עם אחרים. כל פעולה של הסוכן מופיעה מיד בזמן אמת בלוח ומתועדת ביומן הפעולות.
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
