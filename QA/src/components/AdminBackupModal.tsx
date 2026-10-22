import React, { useRef, useState } from 'react';
import {
  X,
  DatabaseBackup,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StdIssue, StdPlatform, StdSeverity, StdStatus } from '../types/std';

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
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleUploadCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '').replace(/^\uFEFF/, '');
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        if (lines.length < 2) {
          throw new Error('קובץ ה-CSV ריק או שאינו מכיל שורות נתונים');
        }

        const targetSys = activeSystem === 'ALL' ? systems[0] || 'CARGO' : activeSystem;
        const imported: StdIssue[] = [];

        for (let idx = 1; idx < lines.length; idx++) {
          const cols = parseCsvLine(lines[idx]);
          if (cols.length < 3) continue;

          // Supports either exported CSV format:
          // [מערכת, מזהה תסריט, פלטפורמה, נושא התקלה, מהות השגיאה, סטטוס, מדווח...]
          // OR simple 3-4 column CSV: [מזהה תסריט, נושא, תיאור, פלטפורמה]
          const isExportFormat = cols.length >= 6 && systems.includes(cols[0]);
          const sys = isExportFormat ? cols[0] : targetSys;
          const testCaseId = isExportFormat ? cols[1] || String(idx) : cols[0] || String(idx);
          const rawPlat = isExportFormat ? cols[2] : cols[3] || 'מחשב';
          const subject = isExportFormat ? cols[3] : cols[1] || `תסריט בדיקה #${testCaseId}`;
          const description = isExportFormat ? cols[4] : cols[2] || subject;
          const rawStatus = isExportFormat ? cols[5] : 'פתוח';

          const platform: StdPlatform =
            rawPlat === 'IOS' || rawPlat === 'אנדרואיד' || rawPlat === 'מחשב'
              ? rawPlat
              : 'מחשב';
          const status: StdStatus =
            rawStatus === 'פתוח' ||
            rawStatus === 'בטיפול' ||
            rawStatus === 'ניתן לבדוק שוב' ||
            rawStatus === 'נבדק תקין'
              ? rawStatus
              : 'פתוח';
          const severity: StdSeverity = 'בינונית';

          imported.push({
            id: `std-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
            system: sys,
            testCaseId,
            platform,
            severity,
            subject,
            description,
            status,
            screenshots: [],
            comments: [],
            auditLog: [
              {
                id: `aud-${Date.now()}-${idx}`,
                actor: currentUserDisplay,
                action: 'יובא מתוך קובץ CSV',
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
          text: `יובאו בהצלחה ${imported.length} תסריטים / תקלות מתוך קובץ ה-CSV!`
        });
      } catch (err: any) {
        setStatusMsg({
          type: 'error',
          text: err?.message || 'שגיאה בייבוא קובץ ה-CSV'
        });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <DatabaseBackup className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-extrabold">
                גיבוי, שחזור וייבוא נתונים (סביבת מנהל)
              </h3>
              <p className="text-xs text-slate-300">
                ניהול גיבויים מלאים של מסד הנתונים וייבוא תסריטים מאקסל / CSV
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

        <div className="p-6 space-y-4">
          {statusMsg && (
            <div
              className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs font-bold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* 1. Full JSON Backup Download */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="text-sm font-extrabold text-slate-900">
              3. ייבוא תסריטי בדיקה מקובץ Excel / CSV
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ייבא רשימת תסריטים מקובץ CSV (תומך בקובץ שיוצא מהמערכת או בקובץ עם עמודות: <code className="bg-white px-1 rounded border">מזהה תסריט, נושא, תיאור, פלטפורמה</code>).
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

        <div className="flex justify-end px-6 py-3 bg-slate-50 border-t border-slate-200">
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
