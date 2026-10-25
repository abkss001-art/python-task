import React, { useRef, useState } from 'react';
import {
  X,
  DatabaseBackup,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Sparkles,
  Trash2
} from 'lucide-react';
import { StdIssue, StdPlatform, StdSeverity, StdStatus } from '../types/std';
import {
  GOOGLE_APPS_SCRIPT_CODE,
  getSavedGoogleDriveUrl,
  isDataUrlImage,
  saveAutoBackupToGoogleDrive,
  setSavedGoogleDriveUrl,
  testGoogleDriveConnection,
  uploadImageToGoogleDrive
} from '../services/googleDriveService';

interface AdminBackupModalProps {
  systems: string[];
  archivedSystems: string[];
  issues: StdIssue[];
  activeSystem: string;
  currentUserDisplay: string;
  onRestoreBackup: (data: {
    systems: string[];
    archivedSystems: string[];
    issues: StdIssue[];
  }) => void;
  onImportIssues: (importedIssues: StdIssue[]) => void;
  onClose: () => void;
}

export const AdminBackupModal: React.FC<AdminBackupModalProps> = ({
  systems,
  archivedSystems,
  issues,
  activeSystem,
  currentUserDisplay,
  onRestoreBackup,
  onImportIssues,
  onClose
}) => {
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const csvFileInputRef = useRef<HTMLInputElement | null>(null);

  const [driveUrlInput, setDriveUrlInput] = useState<string>(getSavedGoogleDriveUrl());
  const [isConnectedDrive, setIsConnectedDrive] = useState<boolean>(
    Boolean(getSavedGoogleDriveUrl())
  );
  const [driveFolderUrl, setDriveFolderUrl] = useState<string>('');
  const [showScriptInstructions, setShowScriptInstructions] = useState<boolean>(
    !getSavedGoogleDriveUrl()
  );
  const [copiedScript, setCopiedScript] = useState(false);
  const [isTestingDrive, setIsTestingDrive] = useState(false);
  const [isMigratingImages, setIsMigratingImages] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<string>('');

  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Count how many screenshots are currently Base64 vs already on Google Drive
  const base64ImagesCount = issues.reduce((acc, iss) => {
    const inIssue = (iss.screenshots || []).filter(isDataUrlImage).length;
    const inComments = (iss.comments || []).filter(
      (c) => c.screenshot && isDataUrlImage(c.screenshot)
    ).length;
    return acc + inIssue + inComments;
  }, 0);

  const driveImagesCount = issues.reduce((acc, iss) => {
    const inIssue = (iss.screenshots || []).filter((s) => !isDataUrlImage(s)).length;
    const inComments = (iss.comments || []).filter(
      (c) => c.screenshot && !isDataUrlImage(c.screenshot)
    ).length;
    return acc + inIssue + inComments;
  }, 0);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleTestAndSaveDrive = async () => {
    const cleaned = driveUrlInput.trim();
    if (!cleaned) {
      setStatusMsg({
        type: 'error',
        text: 'נא להדביק את כתובת ה-Web App של Google Apps Script'
      });
      return;
    }

    setIsTestingDrive(true);
    setStatusMsg(null);
    const result = await testGoogleDriveConnection(cleaned);
    setIsTestingDrive(false);

    if (result.ok) {
      setSavedGoogleDriveUrl(cleaned);
      setIsConnectedDrive(true);
      if (result.folderUrl) setDriveFolderUrl(result.folderUrl);
      setShowScriptInstructions(false);

      // Sync the new Google Drive URL to all devices in the team & save initial backup!
      saveAutoBackupToGoogleDrive({ systems, archivedSystems, issues });
      onRestoreBackup({ systems, archivedSystems, issues });

      setStatusMsg({
        type: 'success',
        text: `חובר בהצלחה ל-Google Drive שלך (תיקייה: "${result.folderName || 'צב מן - צילומי מסך וגיבויים'}")! מעכשיו כל צילום מסך מכל מכשיר בצוות יישמר אוטומטית בדרייב שלך.`
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: result.error || 'החיבור ל-Google Drive נכשל'
      });
    }
  };

  const handleMigrateExistingImagesToDrive = async () => {
    if (!getSavedGoogleDriveUrl()) return;
    setIsMigratingImages(true);
    setStatusMsg(null);

    try {
      let migratedCount = 0;
      const updatedIssues: StdIssue[] = [];

      for (let idx = 0; idx < issues.length; idx++) {
        const iss = issues[idx];
        const nextScreenshots: string[] = [];

        for (let sIdx = 0; sIdx < (iss.screenshots || []).length; sIdx++) {
          const sc = iss.screenshots[sIdx];
          if (isDataUrlImage(sc)) {
            setMigrationProgress(
              `מעלה תמונה ${migratedCount + 1} מתוך ${base64ImagesCount} ל-Google Drive...`
            );
            const url = await uploadImageToGoogleDrive(sc, {
              system: iss.system,
              testCaseId: `${iss.testCaseId}_${sIdx + 1}`
            });
            if (url !== sc) migratedCount++;
            nextScreenshots.push(url);
          } else {
            nextScreenshots.push(sc);
          }
        }

        const nextComments = [];
        for (const c of iss.comments || []) {
          if (c.screenshot && isDataUrlImage(c.screenshot)) {
            setMigrationProgress(
              `מעלה תמונה ${migratedCount + 1} מתוך ${base64ImagesCount} ל-Google Drive...`
            );
            const url = await uploadImageToGoogleDrive(c.screenshot, {
              system: iss.system,
              testCaseId: `${iss.testCaseId}_הערה`
            });
            if (url !== c.screenshot) migratedCount++;
            nextComments.push({ ...c, screenshot: url });
          } else {
            nextComments.push(c);
          }
        }

        updatedIssues.push({
          ...iss,
          screenshots: nextScreenshots,
          comments: nextComments
        });
      }

      onRestoreBackup({
        systems,
        archivedSystems,
        issues: updatedIssues
      });

      setIsMigratingImages(false);
      setMigrationProgress('');
      setStatusMsg({
        type: 'success',
        text: `הועברו בהצלחה ${migratedCount} צילומי מסך ל-Google Drive שלך! המערכת כעת קלה ומהירה פי 10.`
      });
    } catch (err: any) {
      setIsMigratingImages(false);
      setMigrationProgress('');
      setStatusMsg({
        type: 'error',
        text: err?.message || 'שגיאה בהעברת התמונות ל-Google Drive'
      });
    }
  };

  const handleDisconnectDrive = () => {
    setSavedGoogleDriveUrl('');
    setDriveUrlInput('');
    setIsConnectedDrive(false);
    setDriveFolderUrl('');
    onRestoreBackup({ systems, archivedSystems, issues });
    setStatusMsg({
      type: 'success',
      text: 'החיבור ל-Google Drive נותק.'
    });
  };

  const handleDownloadFullJsonBackup = () => {
    const backupPayload = {
      app: 'tzav-man-qa-std',
      exportedAt: new Date().toISOString(),
      systems,
      archivedSystems,
      issues
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tzavman-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({
      type: 'success',
      text: `קובץ גיבוי מלא (${issues.length} תקלות וכל צילומי המסך) הורד בהצלחה!`
    });
  };

  const handleUploadJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || !Array.isArray(parsed.issues)) {
          throw new Error('מבנה קובץ הגיבוי אינו תקין');
        }
        onRestoreBackup({
          systems:
            Array.isArray(parsed.systems) && parsed.systems.length > 0
              ? parsed.systems
              : systems,
          archivedSystems: Array.isArray(parsed.archivedSystems)
            ? parsed.archivedSystems
            : archivedSystems,
          issues: parsed.issues
        });
        setStatusMsg({
          type: 'success',
          text: `שוחזרו בהצלחה ${parsed.issues.length} תקלות וכל המערכות מתוך הגיבוי!`
        });
      } catch (err: any) {
        setStatusMsg({
          type: 'error',
          text: err?.message || 'שגיאה בקריאת קובץ הגיבוי JSON'
        });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  /**
   * מנתח CSV / TSV מלא לפי תקן RFC-4180 התומך בירידות שורה (Alt+Enter באקסל) בתוך תאים ממוסגרים במירכאות
   */
  const parseFullCsvRows = (rawText: string): string[][] => {
    const firstNewlineIdx = rawText.search(/\r?\n/);
    const firstLine = firstNewlineIdx !== -1 ? rawText.slice(0, firstNewlineIdx) : rawText;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;

    const delimiter =
      tabCount > commaCount && tabCount >= semiCount
        ? '\t'
        : semiCount > commaCount
        ? ';'
        : ',';

    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < rawText.length; i++) {
      const ch = rawText[i];

      if (ch === '"') {
        if (inQuotes && rawText[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && rawText[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += ch;
      }
    }

    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }

    return rows;
  };

  const handleUploadCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (/\.xlsx?$/i.test(file.name)) {
      setStatusMsg({
        type: 'error',
        text: 'קובץ זה שמור בפורמט בינארי (.xlsx). באקסל לחץ על "שמור בשם" (Save As) ובחר "CSV UTF-8 (מופרד בפסיקים)" ואז העלה אותו לכאן.'
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        let text = '';
        try {
          // ניסיון ראשון: פענוח UTF-8 תקני
          const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
          text = utf8Decoder.decode(buffer);
        } catch {
          // גיבוי אוטומטי לקובצי אקסל בעברית ב-Windows (קידוד Windows-1255 / ANSI) למניעת ג'יבריש!
          const hebDecoder = new TextDecoder('windows-1255');
          text = hebDecoder.decode(buffer);
        }

        text = text.replace(/^\uFEFF/, '');
        const rows = parseFullCsvRows(text);

        if (rows.length < 2) {
          throw new Error('קובץ ה-CSV ריק או שאינו מכיל שורות נתונים');
        }

        const headerCols = rows[0].map((h) => h.trim().toLowerCase());
        const findColIdx = (keywords: string[]) =>
          headerCols.findIndex((h) => keywords.some((kw) => h.includes(kw)));

        const sysCol = findColIdx(['מערכת', 'system']);
        const idCol = findColIdx(['מזהה', 'תסריט', 'מספר', 'id', 'test']);
        const platCol = findColIdx(['פלטפורמה', 'מכשיר', 'platform']);
        const sevCol = findColIdx(['חומרה', 'עדיפות', 'severity', 'priority']);
        const subjCol = findColIdx(['נושא', 'כותרת', 'שם תסריט', 'subject', 'title']);
        const descCol = findColIdx(['מהות', 'תיאור', 'פירוט', 'שגיאה', 'description', 'details']);
        const statusCol = findColIdx(['סטטוס', 'מצב', 'status']);

        const hasRecognizedHeaders =
          subjCol !== -1 || descCol !== -1 || idCol !== -1 || sysCol !== -1;

        const targetSys = activeSystem === 'ALL' ? systems[0] || 'CARGO' : activeSystem;
        const imported: StdIssue[] = [];

        for (let idx = 1; idx < rows.length; idx++) {
          const cols = rows[idx];
          if (cols.length < 2) continue;

          let sys = targetSys;
          let testCaseId = String(idx);
          let rawPlat = 'מחשב';
          let rawSev = 'בינונית';
          let subject = '';
          let description = '';
          let rawStatus = 'פתוח';

          if (hasRecognizedHeaders) {
            if (sysCol !== -1 && cols[sysCol]) sys = cols[sysCol];
            if (idCol !== -1 && cols[idCol]) testCaseId = cols[idCol];
            if (platCol !== -1 && cols[platCol]) rawPlat = cols[platCol];
            if (sevCol !== -1 && cols[sevCol]) rawSev = cols[sevCol];
            if (subjCol !== -1 && cols[subjCol]) subject = cols[subjCol];
            if (descCol !== -1 && cols[descCol]) description = cols[descCol];
            if (statusCol !== -1 && cols[statusCol]) rawStatus = cols[statusCol];

            if (!subject && description) subject = description.slice(0, 80);
            if (!description && subject) description = subject;
            if (!subject) subject = `תסריט בדיקה #${testCaseId}`;
          } else {
            const isExportFormat = cols.length >= 6;
            sys = isExportFormat && cols[0] ? cols[0] : targetSys;
            testCaseId = isExportFormat ? cols[1] || String(idx) : cols[0] || String(idx);
            rawPlat = isExportFormat ? cols[2] : cols[3] || 'מחשב';
            subject = isExportFormat ? cols[3] : cols[1] || `תסריט בדיקה #${testCaseId}`;
            description = isExportFormat ? cols[4] : cols[2] || subject;
            rawStatus = isExportFormat ? cols[5] : 'פתוח';
          }

          const normPlat = rawPlat.trim().toLowerCase();
          const platform: StdPlatform =
            normPlat === 'ios' || rawPlat.includes('אייפון')
              ? 'IOS'
              : rawPlat.includes('אנדרואיד') || normPlat === 'android'
              ? 'אנדרואיד'
              : 'מחשב';

          const status: StdStatus =
            rawStatus === 'פתוח' ||
            rawStatus === 'בטיפול' ||
            rawStatus === 'ניתן לבדוק שוב' ||
            rawStatus === 'נבדק תקין'
              ? rawStatus
              : 'פתוח';

          const severity: StdSeverity =
            rawSev === 'קריטית' ||
            rawSev === 'גבוהה' ||
            rawSev === 'בינונית' ||
            rawSev === 'נמוכה'
              ? rawSev
              : 'בינונית';

          imported.push({
            id: `std-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            system: sys.trim() || targetSys,
            testCaseId: testCaseId.trim() || String(idx),
            platform,
            severity,
            subject: subject.trim(),
            description: description.trim() || subject.trim(),
            status,
            screenshots: [],
            comments: [],
            auditLog: [
              {
                id: `aud-${Date.now()}-${idx}`,
                actor: currentUserDisplay,
                action: 'יובא מתוך קובץ CSV / Excel',
                timestamp: Date.now()
              }
            ],
            createdBy: currentUserDisplay,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        }

        if (imported.length === 0) {
          throw new Error('לא נמצאו שורות תקינות לייבוא בקובץ ה-CSV');
        }

        onImportIssues(imported);
        setStatusMsg({
          type: 'success',
          text: `יובאו בהצלחה ${imported.length} תסריטים / תקלות (קידוד עברית זוהה אוטומטית) וסונכרנו לכל הצוות!`
        });
      } catch (err: any) {
        setStatusMsg({
          type: 'error',
          text: err?.message || 'שגיאה בייבוא קובץ ה-CSV'
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <DatabaseBackup className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-extrabold">
                אחסון Google Drive (5TB), גיבוי וייבוא אקסל (מנהל)
              </h3>
              <p className="text-xs text-slate-300">
                חיבור אוטומטי של כל צילומי המסך והגיבויים ל-Google Drive שלך ללא הגבלת מקום
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

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {statusMsg && (
            <div
              className={`flex items-start gap-2 p-3.5 rounded-xl border text-xs font-bold leading-relaxed ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* 0. Google Drive 5TB Integration Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/80 border-2 border-indigo-200 space-y-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      אחסון אוטומטי ב-Google Drive שלך (5TB)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isConnectedDrive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isConnectedDrive ? 'מחובר ופעיל לכל הצוות' : 'ממתין לחיבור חד-פעמי'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    שומר אוטומטית כל צילום מסך בתיקייה מסודרת לפי מערכת אצלך בדרייב ומשאיר את המערכת מהירה גם עם 10 מערכות ומאות תמונות!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowScriptInstructions((prev) => !prev)}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
              >
                {showScriptInstructions ? 'הסתר הוראות הגדרה' : 'איך מחברים ב-30 שניות?'}
              </button>
            </div>

            {/* Stats Pill */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                תמונות השמורות ב-Google Drive: <strong className="text-emerald-700">{driveImagesCount}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                תמונות מקומיות שממתינות להעברה לדרייב: <strong className="text-indigo-700">{base64ImagesCount}</strong>
              </span>
            </div>

            {showScriptInstructions && (
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <div className="font-extrabold text-slate-900">
                  חיבור חד-פעמי ל-Google Drive שלך (לוקח 40 שניות):
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] sm:text-xs">
                  <li>
                    לחץ על הכפתור למטה <strong>"1. העתק קוד סקריפט"</strong> ואז לחץ על{' '}
                    <strong>"2. פתח את Google Apps Script"</strong>.
                  </li>
                  <li>
                    לחץ על <strong>פרויקט חדש (New Project)</strong>, מחק את השורה שכתובה שם והדבק (<strong>Ctrl+V</strong>) את הקוד שהעתקת.
                  </li>
                  <li>
                    לחץ למעלה בכחול על <strong>Deploy (פריסה) &larr; New deployment (פריסה חדשה)</strong>, בחר בסמל גלגל השיניים <strong>Web app (אפליקציית אינטרנט)</strong>.
                  </li>
                  <li>
                    בשדה <strong>Who has access (למי יש גישה)</strong> בחר <strong>Anyone (כל אחד)</strong>, לחץ <strong>Deploy</strong>, אשר הרשאה לחשבון הדרייב שלך, והעתק את כתובת ה-<strong>Web app URL</strong> לכאן למטה!
                  </li>
                </ol>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>הקוד הועתק! כעת הדבק ב-Apps Script</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>1. העתק קוד סקריפט מוכן</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://script.google.com/home"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>2. פתח את Google Apps Script</span>
                  </a>
                </div>
              </div>
            )}

            {/* URL Input & Connect Button */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">
                כתובת ה-Web App של Google Drive שלך:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  dir="ltr"
                  value={driveUrlInput}
                  onChange={(e) => setDriveUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:border-indigo-500 focus:outline-none text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  disabled={isTestingDrive}
                  onClick={handleTestAndSaveDrive}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-xs transition cursor-pointer shrink-0"
                >
                  {isTestingDrive ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>בודק חיבור...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>בדוק חיבור ושמור לכל הצוות</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions when connected */}
            {isConnectedDrive && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100">
                <div className="flex flex-wrap items-center gap-2">
                  {base64ImagesCount > 0 && (
                    <button
                      type="button"
                      disabled={isMigratingImages}
                      onClick={handleMigrateExistingImagesToDrive}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      {isMigratingImages ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{migrationProgress || 'מעביר תמונות לדרייב...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>העבר {base64ImagesCount} תמונות קיימות לדרייב כעת</span>
                        </>
                      )}
                    </button>
                  )}

                  {driveFolderUrl && (
                    <a
                      href={driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>פתח תיקייה ב-Google Drive</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDisconnectDrive}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-[11px] font-bold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>נתק דרייב</span>
                </button>
              </div>
            )}
          </div>

          {/* 1. Full JSON Backup Download */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-sm font-extrabold text-slate-900">
              1. הורדת גיבוי מלא למחשב (JSON)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              שומר קובץ גיבוי מלא הכולל את כל המערכות, הארכיון, {issues.length} התקלות, ההערות וכל צילומי המסך המצורפים.
            </p>
            <button
              type="button"
              onClick={handleDownloadFullJsonBackup}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>הורד קובץ גיבוי מלא כעת</span>
            </button>
          </div>

          {/* 2. Restore from JSON Backup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-sm font-extrabold text-slate-900">
              2. שחזור מסד נתונים מקובץ גיבוי (JSON)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              בחר קובץ גיבוי שהורדת בעבר כדי לשחזר ולסנכרן את כל הנתונים לענן.
            </p>
            <input
              ref={jsonFileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleUploadJsonBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => jsonFileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>בחר קובץ גיבוי JSON לשחזור</span>
            </button>
          </div>

          {/* 3. Import Test Cases from CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-sm font-extrabold text-slate-900">
              3. ייבוא תסריטי בדיקה מקובץ Excel / CSV
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ייבא רשימת תסריטים מקובץ CSV (תומך בקובץ שיוצא מהמערכת או בקובץ עם עמודות:{' '}
              <code className="bg-white px-1 rounded border">מזהה תסריט, נושא, תיאור, פלטפורמה</code>).
            </p>
            <input
              ref={csvFileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleUploadCsvFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => csvFileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ייבא תסריטים מקובץ CSV</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
