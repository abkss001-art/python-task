import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Lock,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Plus,
  RotateCcw
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
import {
  downloadSampleCsvTemplate,
  parseCsvBufferToIssues
} from '../utils/csvImportUtils';
import { PlatformIcon } from './IssueCard';
import { ScreenshotAnnotatorModal } from './ScreenshotAnnotatorModal';
import { useModalUx } from '../utils/modalViewportAndBack';

interface IssueFormModalProps {
  systems: string[];
  defaultSystem: string;
  suggestedTestCaseId: string;
  editingIssue: StdIssue | null;
  existingIssues?: StdIssue[];
  currentUserDisplay?: string;
  isAdmin?: boolean;
  onImportIssues?: (importedIssues: StdIssue[]) => void;
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
  currentUserDisplay = 'חבר צוות',
  isAdmin = false,
  onImportIssues,
  onSave,
  onClose
}) => {
  const isEditing = Boolean(editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__');
  const canShowCsvImport = !isEditing && Boolean(onImportIssues);
  const [activeMode, setActiveMode] = useState<'single' | 'csv'>('single');
  const [uploadedCsvFile, setUploadedCsvFile] = useState<{
    name: string;
    buffer: ArrayBuffer;
  } | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isCsvDragging, setIsCsvDragging] = useState<boolean>(false);
  const csvFileInputRef = useRef<HTMLInputElement | null>(null);

  const availableSystems = systems.length > 0 ? systems : ['כללי'];
  const [system, setSystem] = useState(() => {
    if (editingIssue?.system) return editingIssue.system;
    if (defaultSystem && defaultSystem !== 'HOME' && defaultSystem !== 'ALL') {
      return defaultSystem;
    }
    return '';
  });

  // Compute next sequential ID for target system starting from 1 (natural numeric extraction)
  const getNextIdForSystem = (targetSys: string) => {
    if (!targetSys) return '';
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
      (defaultSystem && defaultSystem !== 'HOME' && defaultSystem !== 'ALL'
        ? defaultSystem
        : '');
    return getNextIdForSystem(initialSys);
  });

  const handleSystemChange = (newSys: string) => {
    setSystem(newSys);
    if (!isEditing) {
      setTestCaseId(getNextIdForSystem(newSys));
    }
  };
  const [platform, setPlatform] = useState<StdPlatform>(
    editingIssue?.platform || 'מחשב'
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
        return;
      }
    } catch {
      // Clipboard read rejected or not supported
    }

    // If on a phone or tablet: screenshots are saved as files in the phone's gallery!
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setClipboardHint('בטלפון צילום מסך נשמר בגלריה – פותח את תיקיית התמונות לבחירה מהירה...');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 350);
    } else {
      setClipboardHint('לא נמצאה תמונה בלוח ההעתקה כרגע. צלם מסך או בחר קובץ.');
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
    if (!system.trim() || !testCaseId.trim() || !subject.trim() || !description.trim()) return;

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

  // Re-evaluate CSV preview automatically whenever file or target system changes
  const csvParseResult = useMemo(() => {
    if (!uploadedCsvFile) return null;
    if (!system.trim()) {
      return { ok: false as const, error: 'נא לבחור מערכת יעד למעלה לפני אישור הייבוא.' };
    }
    return parseCsvBufferToIssues({
      buffer: uploadedCsvFile.buffer,
      fileName: uploadedCsvFile.name,
      targetSystem: system,
      existingIssues,
      currentUserDisplay,
      permittedSystems: availableSystems,
      allowNewSystems: false
    });
  }, [uploadedCsvFile, system, existingIssues, currentUserDisplay, availableSystems]);

  const previewIssues = csvParseResult && csvParseResult.ok ? csvParseResult.issues : [];
  const remappedCount = csvParseResult && csvParseResult.ok ? csvParseResult.remappedToTargetCount : 0;
  const effectiveCsvError =
    csvError || (csvParseResult && !csvParseResult.ok ? csvParseResult.error : null);

  const loadCsvFileObject = (file: File | undefined) => {
    if (!file) return;
    setCsvError(null);
    if (/\.xlsx?$/i.test(file.name)) {
      setUploadedCsvFile(null);
      setCsvError(
        'קובץ זה שמור בפורמט אקסל (.xlsx). באקסל לחץ על "שמור בשם" (Save As) ובחר "CSV UTF-8 (מופרד בפסיקים)" ואז העלה אותו לכאן.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      setUploadedCsvFile({ name: file.name, buffer });
    };
    reader.onerror = () => {
      setCsvError('לא ניתן לקרוא את הקובץ שנבחר.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCsvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadCsvFileObject(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleCsvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCsvDragging(false);
    loadCsvFileObject(e.dataTransfer.files?.[0]);
  };

  const handleConfirmCsvImport = () => {
    if (!onImportIssues || previewIssues.length === 0) return;
    onImportIssues(previewIssues);
    onClose();
  };

  useModalUx(true, onClose);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-hidden overscroll-none"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-auto max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">
              {isEditing
                ? `עריכת תקלה - תסריט #${editingIssue?.testCaseId}`
                : activeMode === 'csv'
                ? 'ייבוא תסריטי בדיקה מאקסל / CSV'
                : 'דיווח תקלה חדשה'}
            </h2>
            <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
              {activeMode === 'csv' ? (
                'העלה קובץ CSV מאקסל כדי להוסיף מספר תסריטי בדיקה או תקלות בבת אחת'
              ) : (
                <>
                  להדבקת צילום מסך לחץ{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-800 text-indigo-300 font-mono">
                    Ctrl + V
                  </kbd>{' '}
                  במקלדת או לחץ על כפתור "הדבק מהלוח" למטה
                </>
              )}
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

        {/* Mode Tabs inside New Issue Modal: Single Issue vs Excel/CSV Import */}
        {canShowCsvImport && (
          <div className="px-5 sm:px-6 pt-3.5 pb-2 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveMode('single')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                  activeMode === 'single'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>תקלה בודדת</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('csv')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                  activeMode === 'csv'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>ייבוא מאקסל / CSV</span>
              </button>
            </div>
          </div>
        )}

        {activeMode === 'csv' && canShowCsvImport ? (
          <div className="p-5 sm:p-6 space-y-4 min-h-0 flex-1 overflow-y-auto modal-scroll-area">
            {/* Target System Selector (scoped strictly to permitted systems) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>
                  מערכת יעד לייבוא <span className="text-red-500">*</span>
                </span>
                {!system && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    חובה לבחור מערכת
                  </span>
                )}
              </label>
              <select
                value={system}
                onChange={(e) => handleSystemChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                  !system
                    ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:ring-emerald-500/30 focus:border-emerald-500'
                }`}
              >
                <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                  -- בחר מערכת לייבוא התקלות --
                </option>
                {availableSystems.map((sys) => (
                  <option key={sys} value={sys} className="dark:bg-slate-900 dark:text-slate-100 font-bold">
                    {sys}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  ניתן לייבא תקלות אך ורק למערכות שאושרו עבורך.
                </p>
              )}
            </div>

            {/* Sample Template Download Card (Bonus) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70">
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
                  רוצה תבנית מוכנה לאקסל?
                </div>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                  עמודות נתמכות: מזהה תסריט, פלטפורמה, חומרה, נושא, מהות השגיאה, סטטוס.
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadSampleCsvTemplate(system || undefined)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-extrabold transition cursor-pointer shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>הורד קובץ דוגמה לאקסל</span>
              </button>
            </div>

            {/* CSV Dropzone / Upload Button */}
            <input
              ref={csvFileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleCsvInputChange}
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsCsvDragging(true);
              }}
              onDragLeave={() => setIsCsvDragging(false)}
              onDrop={handleCsvDrop}
              onClick={() => csvFileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-5 sm:p-6 text-center transition cursor-pointer ${
                isCsvDragging
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50/70 dark:bg-slate-950/50'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2.5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {uploadedCsvFile
                  ? `נבחר קובץ: ${uploadedCsvFile.name}`
                  : 'לחץ לבחירת קובץ CSV או גרור לכאן'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                באקסל: שמור בשם ← CSV UTF-8 (מופרד בפסיקים) • עברית ומספור תסריטים מזוהים אוטומטית
              </p>
            </div>

            {/* Error Feedback */}
            {effectiveCsvError && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{effectiveCsvError}</span>
              </div>
            )}

            {/* Live Preview before Confirming Import (Bonus) */}
            {previewIssues.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-950/60 overflow-hidden shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-emerald-50/90 dark:bg-emerald-950/50 border-b border-emerald-200/80 dark:border-emerald-800/70">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      תצוגה מקדימה: {previewIssues.length} תקלות מוכנות לייבוא
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedCsvFile(null);
                      setCsvError(null);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>בחר קובץ אחר</span>
                  </button>
                </div>

                {remappedCount > 0 && (
                  <div className="px-4 py-2 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/70 dark:border-amber-800/60 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    {remappedCount} שורות ללא מערכת מורשית תואמת שויכו אוטומטית למערכת{' '}
                    <span className="bidi-isolate underline">{system}</span>.
                  </div>
                )}

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {previewIssues.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[11px] shrink-0">
                          #{item.testCaseId}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {item.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold bidi-isolate">
                          {item.system}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          {item.platform}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {previewIssues.length > 5 && (
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center">
                    + ועוד {previewIssues.length - 5} תקלות נוספות בקובץ
                  </div>
                )}
              </div>
            )}

            {/* CSV Import Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                disabled={previewIssues.length === 0 || !system.trim()}
                onClick={handleConfirmCsvImport}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition ${
                  previewIssues.length === 0 || !system.trim()
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60 shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 cursor-pointer'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {previewIssues.length > 0
                    ? `אשר וייבא ${previewIssues.length} תקלות`
                    : 'אשר וייבא תקלות'}
                </span>
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 min-h-0 flex-1 overflow-y-auto modal-scroll-area">
          {/* Top Row: System & Test Case ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>
                  מערכת <span className="text-red-500">*</span>
                </span>
                {!system && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    חובה לבחור מערכת
                  </span>
                )}
              </label>
              <select
                value={system}
                onChange={(e) => handleSystemChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                  !system
                    ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              >
                <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                  -- בחר מערכת לתקלה --
                </option>
                {availableSystems.map((sys) => (
                  <option key={sys} value={sys} className="dark:bg-slate-900 dark:text-slate-100 font-bold">
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
                  <span className="text-base font-black text-indigo-700 dark:text-indigo-400">
                    {testCaseId ? testCaseId : 'יש לבחור מערכת'}
                  </span>
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
                    <span>בחר צילום מסך מהגלריה / מהנייד</span>
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
              disabled={!system.trim() || !testCaseId.trim() || !subject.trim() || !description.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition ${
                !system.trim() || !testCaseId.trim() || !subject.trim() || !description.trim()
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
        )}
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
