import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  ClipboardPaste,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  PenTool,
  Flame,
  Lock
} from 'lucide-react';
import {
  PLATFORMS,
  SEVERITIES,
  SEVERITY_CONFIG,
  STATUSES,
  STATUS_CONFIG,
  StdIssue,
  StdPlatform,
  StdSeverity,
  StdStatus
} from '../types/std';
import {
  extractImagesFromClipboardEvent,
  processScreenshotFile,
  readImagesFromSystemClipboard
} from '../utils/imageUtils';
import { PlatformIcon } from './IssueCard';
import { ScreenshotAnnotatorModal } from './ScreenshotAnnotatorModal';

interface IssueFormModalProps {
  systems: string[];
  defaultSystem: string;
  suggestedTestCaseId: string;
  editingIssue: StdIssue | null;
  existingIssues?: StdIssue[];
  onSave: (data: {
    system: string;
    testCaseId: string;
    platform: StdPlatform;
    severity: StdSeverity;
    subject: string;
    description: string;
    status: StdStatus;
    screenshots: string[];
    initialComment?: string;
  }) => void;
  onClose: () => void;
}

export const IssueFormModal: React.FC<IssueFormModalProps> = ({
  systems,
  defaultSystem,
  suggestedTestCaseId,
  editingIssue,
  existingIssues = [],
  onSave,
  onClose
}) => {
  const isEditing = Boolean(editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__');

  const availableSystems = systems.length > 0 ? systems : ['כללי'];
  const [system, setSystem] = useState(
    editingIssue?.system || (defaultSystem === 'ALL' ? availableSystems[0] : defaultSystem) || availableSystems[0]
  );

  // Compute next sequential ID for target system starting from 1 (natural numeric extraction)
  const getNextIdForSystem = (targetSys: string) => {
    const sysNums = existingIssues
      .filter((i) => i.system === targetSys)
      .map((i) => {
        const raw = (i.testCaseId || '').trim();
        const match = raw.match(/\d+/);
        return match ? parseInt(match[0], 10) : NaN;
      })
      .filter((n) => !isNaN(n) && n > 0);
    if (sysNums.length === 0) return '1';
    return String(Math.max(...sysNums) + 1);
  };

  const [testCaseId, setTestCaseId] = useState(() => {
    if (isEditing && editingIssue?.testCaseId) {
      return editingIssue.testCaseId;
    }
    const initialSys =
      editingIssue?.system ||
      (defaultSystem === 'ALL' ? availableSystems[0] : defaultSystem) ||
      availableSystems[0];
    return getNextIdForSystem(initialSys);
  });

  const handleSystemChange = (newSys: string) => {
    setSystem(newSys);
    if (!isEditing) {
      setTestCaseId(getNextIdForSystem(newSys));
    }
  };
  const [platform, setPlatform] = useState<StdPlatform>(
    editingIssue?.platform || 'IOS'
  );
  const [severity, setSeverity] = useState<StdSeverity>(
    editingIssue?.severity || 'בינונית'
  );
  const [subject, setSubject] = useState(editingIssue?.subject || '');
  const [description, setDescription] = useState(editingIssue?.description || '');
  const [status, setStatus] = useState<StdStatus>(editingIssue?.status || 'פתוח');
  const [screenshots, setScreenshots] = useState<string[]>(
    editingIssue?.screenshots || []
  );
  const [annotatingIndex, setAnnotatingIndex] = useState<number | null>(null);
  const [initialComment, setInitialComment] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const [clipboardHint, setClipboardHint] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync screenshots if editingIssue was opened via global board Ctrl+V
  useEffect(() => {
    if (editingIssue?.screenshots && editingIssue.screenshots.length > 0) {
      setScreenshots(editingIssue.screenshots);
    }
  }, [editingIssue]);

  // Listen to Ctrl + V in capture phase anywhere while modal is open
  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      const images = await extractImagesFromClipboardEvent(e);
      if (images.length > 0) {
        setClipboardHint(null);
        setScreenshots((prev) => [...prev, ...images]);
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 2500);
      }
    };

    document.addEventListener('paste', handleGlobalPaste, true);
    return () => document.removeEventListener('paste', handleGlobalPaste, true);
  }, []);

  const handleDirectClipboardButtonClick = async () => {
    setClipboardHint(null);
    try {
      const images = await readImagesFromSystemClipboard();
      if (images.length > 0) {
        setScreenshots((prev) => [...prev, ...images]);
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 2500);
      } else {
        setClipboardHint('לא נמצאה תמונה בלוח ההעתקה כרגע. צלם מסך או העתק תמונה ונסה שוב.');
      }
    } catch {
      setClipboardHint('לחץ כעת Ctrl + V במקלדת כדי להדביק את התמונה מהלוח.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const processed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        processed.push(await processScreenshotFile(files[i]));
      }
    }
    if (processed.length > 0) {
      setClipboardHint(null);
      setScreenshots((prev) => [...prev, ...processed]);
      setPasteNotice(true);
      setTimeout(() => setPasteNotice(false), 2500);
    }
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const processed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        processed.push(await processScreenshotFile(files[i]));
      }
    }
    if (processed.length > 0) {
      setClipboardHint(null);
      setScreenshots((prev) => [...prev, ...processed]);
      setPasteNotice(true);
      setTimeout(() => setPasteNotice(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCaseId.trim() || !subject.trim() || !description.trim()) return;

    onSave({
      system,
      testCaseId: testCaseId.trim(),
      platform,
      severity,
      subject: subject.trim(),
      description: description.trim(),
      status,
      screenshots,
      initialComment: initialComment.trim() || undefined
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">
              {editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__'
                ? `עריכת תקלה - תסריט #${editingIssue.testCaseId}`
                : 'דיווח תקלה חדשה'}
            </h2>
            <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
              להדבקת צילום מסך לחץ{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-800 text-indigo-300 font-mono">
                Ctrl + V
              </kbd>{' '}
              במקלדת או לחץ על כפתור "הדבק מהלוח" למטה
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[84vh] overflow-y-auto">
          {/* Top Row: System & Test Case ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                מערכת <span className="text-red-500">*</span>
              </label>
              <select
                value={system}
                onChange={(e) => handleSystemChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 focus:bg-white dark:focus:bg-slate-950 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition cursor-pointer"
              >
                {availableSystems.map((sys) => (
                  <option key={sys} value={sys} className="dark:bg-slate-900 dark:text-slate-100">
                    {sys}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>מזהה תסריט בדיקה</span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                  <span>מספור אוטומטי</span>
                </span>
              </label>
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-950/80 text-sm font-mono select-none shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-400 font-bold text-xs">תסריט #</span>
                  <span className="text-base font-black text-indigo-700 dark:text-indigo-400">{testCaseId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              פלטפורמה <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => {
                const isSelected = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <PlatformIcon
                      platform={p}
                      className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}
                    />
                    <span className="bidi-isolate">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status & Severity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selector Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                סטטוס תקלה <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const isSelected = status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? `${cfg.bgBadge} ${cfg.textBadge} ${cfg.borderBadge} ring-2 ${cfg.activeRing}`
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Selector Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                חומרת תקלה / עדיפות <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SEVERITIES.map((sev) => {
                  const sCfg = SEVERITY_CONFIG[sev];
                  const isSelected = severity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? `${sCfg.bgBadge} ${sCfg.textBadge} ${sCfg.borderBadge} ring-2 ring-indigo-500/20`
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sev === 'קריטית' ? (
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full ${sCfg.dotColor}`} />
                      )}
                      <span>{sev}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Issue Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              נושא התקלה <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="תיאור קצר וממוקד של התקלה..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
            />
          </div>

          {/* Detailed Error Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              מהות השגיאה ותיאור מפורט <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="פרט את שלבי השחזור, התוצאה שהתקבלה בפועל והתוצאה המצופה..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
            />
          </div>

          {/* Screenshot Paste (Ctrl+V / Direct Clipboard Button) & Drag-and-Drop Zone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                צילומי מסך והמחשות
              </label>
              {pasteNotice && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>צילום מסך נוסף בהצלחה!</span>
                </span>
              )}
            </div>

            <div
              tabIndex={0}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition focus:outline-none focus:border-indigo-500 focus:bg-indigo-50/30 ${
                isDraggingOver
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  הדבק צילום מסך ישירות מהלוח (<kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs">Ctrl + V</kbd>) או השתמש בכפתורים:
                </div>

                {/* Two Distinct Action Buttons: 1) Paste from Clipboard, 2) Choose File */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleDirectClipboardButtonClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span>הדבק תמונה מהלוח (Clipboard)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>בחר קובץ מהמחשב / מהנייד</span>
                  </button>
                </div>

                {clipboardHint && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{clipboardHint}</span>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  ניתן גם לגרור תמונות לכאן • לחץ על "סמן על התמונה" כדי לצייר חץ או להקיף את השגיאה
                </div>
              </div>
            </div>

            {/* Pasted / Uploaded Screenshots Preview with Built-In Annotator Button */}
            {screenshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {screenshots.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-700 h-36 p-1.5 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`צילום מסך ${idx + 1}`}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => setAnnotatingIndex(idx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/95 hover:bg-indigo-700 text-white text-[11px] font-bold shadow transition cursor-pointer"
                        title="צייר חץ, עיגול או הדגשה על צילום המסך"
                      >
                        <PenTool className="w-3 h-3" />
                        <span>סמן על התמונה</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setScreenshots((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow transition cursor-pointer"
                        title="הסר תמונה"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional Initial Comment (only when creating new issue) */}
          {(!editingIssue || editingIssue.id === '__NEW_FROM_PASTE__') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                הערה ראשונית
              </label>
              <input
                type="text"
                value={initialComment}
                onChange={(e) => setInitialComment(e.target.value)}
                placeholder="הערה נוספת לצוות..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
              />
            </div>
          )}

          {/* Form Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={!testCaseId.trim() || !subject.trim() || !description.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition ${
                !testCaseId.trim() || !subject.trim() || !description.trim()
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60 shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__'
                  ? 'שמור שינויים וסנכרן לצוות'
                  : 'פרסם תקלה וסנכרן בזמן אמת'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Built-in Screenshot Annotator Modal */}
      {annotatingIndex !== null && screenshots[annotatingIndex] && (
        <ScreenshotAnnotatorModal
          imageSrc={screenshots[annotatingIndex]}
          onSave={(annotatedUrl) => {
            setScreenshots((prev) =>
              prev.map((item, i) => (i === annotatingIndex ? annotatedUrl : item))
            );
            setAnnotatingIndex(null);
          }}
          onCancel={() => setAnnotatingIndex(null)}
        />
      )}
    </div>
  );
};
