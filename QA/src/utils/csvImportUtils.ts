import type { StdIssue, StdPlatform, StdSeverity, StdStatus } from '../types/std';

/**
 * מנתח CSV / TSV מלא לפי תקן RFC-4180 התומך בירידות שורה (Alt+Enter באקסל) בתוך תאים ממוסגרים במירכאות
 */
export function parseFullCsvRows(rawText: string): string[][] {
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
}

export function decodeCsvBuffer(buffer: ArrayBuffer): string {
  let text = '';
  try {
    const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
    text = utf8Decoder.decode(buffer);
  } catch {
    // גיבוי אוטומטי לקובצי אקסל בעברית ב-Windows (קידוד Windows-1255 / ANSI) למניעת ג'יבריש
    const hebDecoder = new TextDecoder('windows-1255');
    text = hebDecoder.decode(buffer);
  }
  return text.replace(/^\uFEFF/, '');
}

export interface ParseCsvIssuesOptions {
  buffer: ArrayBuffer;
  fileName?: string;
  targetSystem: string;
  existingIssues: StdIssue[];
  currentUserDisplay: string;
  permittedSystems?: string[];
  allowNewSystems?: boolean;
  forceTargetSystem?: boolean;
}

export type ParseCsvIssuesResult =
  | { ok: true; issues: StdIssue[]; remappedToTargetCount: number }
  | { ok: false; error: string };

export function parseCsvBufferToIssues(options: ParseCsvIssuesOptions): ParseCsvIssuesResult {
  const {
    buffer,
    fileName = '',
    targetSystem,
    existingIssues,
    currentUserDisplay,
    permittedSystems,
    allowNewSystems = false,
    forceTargetSystem = false
  } = options;

  if (fileName && /\.xlsx?$/i.test(fileName)) {
    return {
      ok: false,
      error:
        'קובץ זה שמור בפורמט בינארי (.xlsx). באקסל לחץ על "שמור בשם" (Save As) ובחר "CSV UTF-8 (מופרד בפסיקים)" ואז העלה אותו לכאן.'
    };
  }

  const cleanTargetSys = targetSystem.trim();
  if (!cleanTargetSys && !allowNewSystems) {
    return {
      ok: false,
      error: 'נא לבחור תחילה מערכת יעד לייבוא.'
    };
  }

  try {
    const text = decodeCsvBuffer(buffer);
    const rows = parseFullCsvRows(text);

    if (rows.length < 2) {
      return {
        ok: false,
        error: 'קובץ ה-CSV ריק או שאינו מכיל שורות נתונים.'
      };
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

    const permittedLookup = new Map<string, string>();
    if (Array.isArray(permittedSystems)) {
      for (const s of permittedSystems) {
        const trimmed = s.trim();
        if (trimmed) permittedLookup.set(trimmed.toLowerCase(), trimmed);
      }
    }

    const imported: StdIssue[] = [];
    let remappedToTargetCount = 0;

    // Track used IDs per system to guarantee every imported scenario gets a unique ID per system
    const usedBySys = new Map<string, Set<string>>();
    const maxNumBySys = new Map<string, number>();
    for (const iss of existingIssues) {
      const sys = iss.system;
      if (!usedBySys.has(sys)) usedBySys.set(sys, new Set());
      if (iss.testCaseId) usedBySys.get(sys)!.add(iss.testCaseId.trim().toLowerCase());
      const num = parseInt(iss.testCaseId, 10);
      if (!isNaN(num) && num > (maxNumBySys.get(sys) || 0)) {
        maxNumBySys.set(sys, num);
      }
    }

    const nowBase = Date.now();

    for (let idx = 1; idx < rows.length; idx++) {
      const cols = rows[idx];
      if (cols.length < 2) continue;

      let rawSys = cleanTargetSys;
      let testCaseId = String(idx);
      let rawPlat = 'מחשב';
      let rawSev = 'בינונית';
      let subject = '';
      let description = '';
      let rawStatus = 'פתוח';

      if (hasRecognizedHeaders) {
        if (sysCol !== -1 && cols[sysCol]) rawSys = cols[sysCol];
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
        rawSys = isExportFormat && cols[0] ? cols[0] : cleanTargetSys;
        testCaseId = isExportFormat ? cols[1] || String(idx) : cols[0] || String(idx);
        rawPlat = isExportFormat ? cols[2] : cols[3] || 'מחשב';
        subject = isExportFormat ? cols[3] : cols[1] || `תסריט בדיקה #${testCaseId}`;
        description = isExportFormat ? cols[4] : cols[2] || subject;
        rawStatus = isExportFormat ? cols[5] : 'פתוח';
      }

      // Resolve target system while strictly enforcing user permissions
      let resolvedSys = rawSys.trim() || cleanTargetSys;
      if (forceTargetSystem && cleanTargetSys) {
        if (resolvedSys.toLowerCase() !== cleanTargetSys.toLowerCase()) {
          remappedToTargetCount++;
        }
        resolvedSys = cleanTargetSys;
      } else if (!allowNewSystems && permittedLookup.size > 0) {
        const matched = permittedLookup.get(resolvedSys.toLowerCase());
        if (matched) {
          resolvedSys = matched;
        } else {
          if (resolvedSys && resolvedSys.toLowerCase() !== cleanTargetSys.toLowerCase()) {
            remappedToTargetCount++;
          }
          resolvedSys = cleanTargetSys;
        }
      }

      const normPlat = rawPlat.trim().toLowerCase();
      const platform: StdPlatform =
        normPlat === 'ios' || rawPlat.includes('אייפון')
          ? 'IOS'
          : rawPlat.includes('אנדרואיד') || normPlat === 'android'
          ? 'אנדרואיד'
          : 'מחשב';

      const cleanStatus = rawStatus.trim();
      const status: StdStatus =
        cleanStatus === 'פתוח' ||
        cleanStatus === 'בטיפול' ||
        cleanStatus === 'ניתן לבדוק שוב' ||
        cleanStatus === 'נבדק תקין'
          ? cleanStatus
          : 'פתוח';

      const cleanSev = rawSev.trim();
      const severity: StdSeverity =
        cleanSev === 'קריטית' ||
        cleanSev === 'גבוהה' ||
        cleanSev === 'בינונית' ||
        cleanSev === 'נמוכה'
          ? cleanSev
          : 'בינונית';

      if (!usedBySys.has(resolvedSys)) usedBySys.set(resolvedSys, new Set());
      const sysSet = usedBySys.get(resolvedSys)!;

      let finalTestCaseId = testCaseId.trim();
      if (!finalTestCaseId || sysSet.has(finalTestCaseId.toLowerCase())) {
        let nextN = (maxNumBySys.get(resolvedSys) || 0) + 1;
        while (sysSet.has(String(nextN).toLowerCase())) {
          nextN++;
        }
        maxNumBySys.set(resolvedSys, nextN);
        finalTestCaseId = String(nextN);
      } else {
        const parsedNum = parseInt(finalTestCaseId, 10);
        if (!isNaN(parsedNum) && parsedNum > (maxNumBySys.get(resolvedSys) || 0)) {
          maxNumBySys.set(resolvedSys, parsedNum);
        }
      }
      sysSet.add(finalTestCaseId.toLowerCase());

      imported.push({
        id: `std-${nowBase}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        system: resolvedSys,
        testCaseId: finalTestCaseId,
        platform,
        severity,
        subject: subject.trim(),
        description: description.trim() || subject.trim(),
        status,
        screenshots: [],
        comments: [],
        auditLog: [
          {
            id: `aud-${nowBase}-${idx}`,
            actor: currentUserDisplay,
            action: 'יובא מתוך קובץ CSV / Excel',
            timestamp: nowBase
          }
        ],
        createdBy: currentUserDisplay,
        createdAt: nowBase,
        updatedAt: nowBase
      });
    }

    if (imported.length === 0) {
      return {
        ok: false,
        error: 'לא נמצאו שורות תקינות לייבוא בקובץ ה-CSV.'
      };
    }

    return { ok: true, issues: imported, remappedToTargetCount };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'שגיאה בפענוח קובץ ה-CSV.'
    };
  }
}

export function buildSampleCsvContent(): string {
  const headers = ['מזהה תסריט', 'פלטפורמה', 'חומרה', 'נושא', 'מהות השגיאה', 'סטטוס'];
  const sampleRows = [
    [
      '1',
      'מחשב',
      'גבוהה',
      'כפתור שמירה לא מגיב במסך טופס',
      'לאחר מילוי כל שדות החובה ולחיצה על שמור, הפעולה אינה מתבצעת.',
      'פתוח'
    ],
    [
      '2',
      'אנדרואיד',
      'בינונית',
      'טקסט נחתך בתצוגה סלולרית',
      'כותרת הטבלה גולשת מעבר לגבולות המסך במצב אנכי.',
      'פתוח'
    ]
  ];
  const escapeCell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return (
    '\uFEFF' +
    [headers, ...sampleRows].map((row) => row.map(escapeCell).join(',')).join('\r\n')
  );
}

export function downloadSampleCsvTemplate(systemName?: string): void {
  const content = buildSampleCsvContent();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeSys = (systemName || 'tzavman').replace(/[^\p{L}\p{N}_-]+/gu, '_');
  a.href = url;
  a.download = `תבנית_ייבוא_תקלות_${safeSys}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
