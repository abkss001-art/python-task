import React, { useMemo, useState } from 'react';
import {
  X,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Calendar,
  MonitorSmartphone,
  Target,
  FileText,
  Printer,
  Copy,
  Check,
  Layers,
  Image as ImageIcon,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { StdIssue, StdPlatform, StdStatus, STATUSES } from '../types/std';
import { PlatformIcon } from './IssueCard';

interface AdminReportModalProps {
  systems: string[];
  issues: StdIssue[];
  initialSystem?: string;
  onClose: () => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export const AdminReportModal: React.FC<AdminReportModalProps> = ({
  systems,
  issues,
  initialSystem = 'ALL',
  onClose,
  onOpenLightbox
}) => {
  const [selectedScope, setSelectedScope] = useState<string>(initialSystem);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Filtered issues according to selected scope ('ALL' or specific system)
  const scopedIssues = useMemo(() => {
    if (selectedScope === 'ALL') return issues;
    return issues.filter((i) => i.system === selectedScope);
  }, [issues, selectedScope]);

  // Status statistics
  const stats = useMemo(() => {
    const total = scopedIssues.length;
    const open = scopedIssues.filter((i) => i.status === 'פתוח').length;
    const inProgress = scopedIssues.filter((i) => i.status === 'בטיפול').length;
    const readyToRetest = scopedIssues.filter((i) => i.status === 'ניתן לבדוק שוב').length;
    const passed = scopedIssues.filter((i) => i.status === 'נבדק תקין').length;

    const pct = (val: number) => (total > 0 ? Math.round((val / total) * 100) : 0);

    return {
      total,
      open,
      inProgress,
      readyToRetest,
      passed,
      openPct: pct(open),
      inProgressPct: pct(inProgress),
      readyToRetestPct: pct(readyToRetest),
      passedPct: pct(passed),
      handlingOrRetest: inProgress + readyToRetest,
      handlingOrRetestPct: pct(inProgress + readyToRetest)
    };
  }, [scopedIssues]);

  // Per-system breakdown for comparison
  const perSystemStats = useMemo(() => {
    return systems.map((sys) => {
      const sysIssues = issues.filter((i) => i.system === sys);
      const total = sysIssues.length;
      const open = sysIssues.filter((i) => i.status === 'פתוח').length;
      const inProgress = sysIssues.filter((i) => i.status === 'בטיפול').length;
      const readyToRetest = sysIssues.filter((i) => i.status === 'ניתן לבדוק שוב').length;
      const passed = sysIssues.filter((i) => i.status === 'נבדק תקין').length;
      const pct = (val: number) => (total > 0 ? Math.round((val / total) * 100) : 0);

      return {
        system: sys,
        total,
        open,
        inProgress,
        readyToRetest,
        passed,
        openPct: pct(open),
        inProgressPct: pct(inProgress),
        readyToRetestPct: pct(readyToRetest),
        passedPct: pct(passed)
      };
    });
  }, [systems, issues]);

  // Platform breakdown
  const platformStats = useMemo(() => {
    const platforms: StdPlatform[] = ['IOS', 'אנדרואיד', 'מחשב'];
    return platforms.map((p) => {
      const count = scopedIssues.filter((i) => i.platform === p).length;
      return {
        platform: p,
        count,
        pct: scopedIssues.length > 0 ? Math.round((count / scopedIssues.length) * 100) : 0
      };
    });
  }, [scopedIssues]);

  // Date range string
  const dateRangeLabel = useMemo(() => {
    const fmt = (ts: number) =>
      new Intl.DateTimeFormat('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(ts));

    if (scopedIssues.length === 0) {
      return fmt(Date.now());
    }
    const minDate = scopedIssues.reduce(
      (min, i) => {
        const ts = i.createdAt || Date.now();
        return ts < min ? ts : min;
      },
      scopedIssues[0].createdAt || Date.now()
    );
    const maxDate = scopedIssues.reduce(
      (max, i) => {
        const ts = i.updatedAt || Date.now();
        return ts > max ? ts : max;
      },
      scopedIssues[0].updatedAt || Date.now()
    );
    return `${fmt(minDate)} - ${fmt(maxDate)}`;
  }, [scopedIssues]);

  // Screenshots gallery extracted from issues
  const screenshotSamples = useMemo(() => {
    const list: {
      issueId: string;
      testCaseId: string;
      system: string;
      subject: string;
      status: StdStatus;
      platform: StdPlatform;
      image: string;
      allImages: string[];
    }[] = [];

    scopedIssues.forEach((iss) => {
      if (iss.screenshots && iss.screenshots.length > 0) {
        list.push({
          issueId: iss.id,
          testCaseId: iss.testCaseId,
          system: iss.system,
          subject: iss.subject,
          status: iss.status,
          platform: iss.platform,
          image: iss.screenshots[0],
          allImages: iss.screenshots
        });
      }
    });
    return list.slice(0, 4);
  }, [scopedIssues]);

  // SVG Donut Chart calculations
  const donutSegments = useMemo(() => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const total = stats.total || 1;

    const rawSegments = [
      { label: 'נבדק תקין', count: stats.passed, color: '#10b981' }, // emerald-500
      { label: 'ניתן לבדוק שוב', count: stats.readyToRetest, color: '#3b82f6' }, // blue-500
      { label: 'בטיפול', count: stats.inProgress, color: '#f59e0b' }, // amber-500
      { label: 'פתוח', count: stats.open, color: '#ef4444' } // red-500
    ];

    let accumulatedFraction = 0;
    return rawSegments.map((seg) => {
      const fraction = stats.total > 0 ? seg.count / total : 0;
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedFraction * circumference;
      accumulatedFraction += fraction;
      return {
        ...seg,
        radius,
        circumference,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [stats]);

  const handleCopySummaryText = async () => {
    const title =
      selectedScope === 'ALL'
        ? '📊 דוח התקדמות בדיקות QA - צב מן (כלל המערכות)'
        : `📊 דוח התקדמות בדיקות QA - מערכת ${selectedScope}`;

    const lines = [
      title,
      `📅 תקופת בדיקות: ${dateRangeLabel}`,
      `────────────────────`,
      `סה"כ תסריטים / דיווחים: ${stats.total}`,
      `🟢 נבדק תקין: ${stats.passed} (${stats.passedPct}%)`,
      `🔵 ניתן לבדוק שוב: ${stats.readyToRetest} (${stats.readyToRetestPct}%)`,
      `🟡 בטיפול פיתוח: ${stats.inProgress} (${stats.inProgressPct}%)`,
      `🔴 תקלות פתוחות: ${stats.open} (${stats.openPct}%)`,
      `────────────────────`
    ];

    if (selectedScope === 'ALL') {
      lines.push('פילוח לפי מערכות:');
      perSystemStats.forEach((s) => {
        lines.push(
          `• ${s.system}: סה"כ ${s.total} | תקין: ${s.passed} (${s.passedPct}%) | לבדיקה חוזרת: ${s.readyToRetest} | בטיפול: ${s.inProgress} | פתוח: ${s.open}`
        );
      });
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-5 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-[#f4f7fc] dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 w-full max-w-7xl my-auto overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action & Scope Selector Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold">
                מחולל דוחות התקדמות מנהלים – צב מן
              </h2>
              <p className="text-[11px] text-slate-400">
                בחר דוח מאוחד לכלל המערכות או דוח ייעודי לכל מערכת בנפרד
              </p>
            </div>
          </div>

          {/* System / All Systems Scope Pills */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-2xl border border-slate-700 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSelectedScope('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedScope === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>כלל המערכות ({issues.length})</span>
            </button>

            {systems.map((sys) => {
              const count = issues.filter((i) => i.system === sys).length;
              const isSelected = selectedScope === sys;
              return (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setSelectedScope(sys)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <span className="bidi-isolate">{sys}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Copy Summary, Print/PDF, Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummaryText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="העתק תקציר טקסטואלי לוואטסאפ או למייל"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">הועתק!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">העתק תקציר</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              title="הדפס דוח או שמור כקובץ PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">הדפס / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="סגור דוח"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Executive Dashboard Report Body */}
        <div className="p-4 sm:p-7 space-y-5 overflow-y-auto">
          {/* Report Header Banner (Matches Uploaded Infographic Layout) */}
          <div className="bg-gradient-to-l from-white via-indigo-50/40 to-sky-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 rounded-3xl p-5 sm:p-6 border border-indigo-100/90 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Right Title Block with Illustration */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 stroke-[1.8]" />
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-indigo-600 text-[9px] font-black text-white">
                    QA STD
                  </div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-[11px] font-extrabold mb-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>צב מן • צוות בדיקות מדור נחשון</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  דוח בדיקות QA
                </h1>
                <p className="text-base sm:text-xl font-extrabold text-blue-700 dark:text-indigo-400 mt-0.5">
                  {selectedScope === 'ALL'
                    ? `סקירת כלל המערכות (${systems.join(' • ')})`
                    : `מערכת ${selectedScope}`}
                </p>
              </div>
            </div>

            {/* Left Metadata Info Pills (Target, Platforms, Date Range) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-start gap-2.5 px-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">מטרת הבדיקות</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    וידוא תקינות פונקציונלית, זרימות עבודה ושיפור חוויית משתמש
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-2 sm:border-r border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <MonitorSmartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">פלטפורמות נבדקות</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    IOS • אנדרואיד • מחשב
                    <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold mt-0.5">
                      {platformStats.map((p) => `${p.platform}: ${p.count}`).join(' | ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-2 sm:border-r border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">תקופת בדיקות</div>
                  <div className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-1" dir="ltr">
                    {dateRangeLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Middle Executive Cards: Results Donut | Key Findings by Status | System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Card 1: סיכום תוצאות (Donut Chart + Legend) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">סיכום תוצאות</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {stats.passedPct}% הושלמו תקין
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-5 my-auto">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r="58"
                      fill="transparent"
                      stroke="#1e293b"
                      className="text-slate-100 dark:text-slate-800 stroke-current"
                      strokeWidth="18"
                    />
                    {donutSegments.map((seg, idx) =>
                      seg.count > 0 ? (
                        <circle
                          key={idx}
                          cx="70"
                          cy="70"
                          r={seg.radius}
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="18"
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                          strokeLinecap="butt"
                        />
                      ) : null
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                      {stats.total}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">בדיקות</span>
                  </div>
                </div>

                {/* Status Legend with Counts & Percentages */}
                <div className="w-full space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <span>נבדק תקין</span>
                    </div>
                    <span className="font-extrabold font-mono text-slate-900 dark:text-white" dir="ltr">
                      {stats.passed} ({stats.passedPct}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                      <span>פתוח (תקלה)</span>
                    </div>
                    <span className="font-extrabold font-mono text-slate-900 dark:text-white" dir="ltr">
                      {stats.open} ({stats.openPct}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      <span>בטיפול פיתוח</span>
                    </div>
                    <span className="font-extrabold font-mono text-slate-900 dark:text-white" dir="ltr">
                      {stats.inProgress} ({stats.inProgressPct}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                      <span>ניתן לבדוק שוב</span>
                    </div>
                    <span className="font-extrabold font-mono text-slate-900 dark:text-white" dir="ltr">
                      {stats.readyToRetest} ({stats.readyToRetestPct}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: עיקרי ממצאים לפי סטטוס עבודה */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">עיקרי ממצאים וסטטוס עבודה</h3>
              </div>

              <div className="space-y-3 my-auto">
                <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-red-50/50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white font-black font-mono text-base flex items-center justify-center shrink-0 shadow-xs">
                    {stats.open}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      תקלות פתוחות הדורשות התייחסות
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      מונעות או פוגעות בתהליך התקין וממתינות לטיפול פיתוח
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black font-mono text-base flex items-center justify-center shrink-0 shadow-xs">
                    {stats.inProgress}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      תקלות בטיפול צוות פיתוח
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      נמצאות כעת בעבודה אקטיבית של המפתחים לתיקון השגיאה
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-black font-mono text-base flex items-center justify-center shrink-0 shadow-xs">
                    {stats.readyToRetest}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      ניתן לבדוק שוב (מוכן לאימות QA)
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      תוקנו על ידי הפיתוח וממתינות לבדיקה חוזרת של צוות הבדיקות
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black font-mono text-base flex items-center justify-center shrink-0 shadow-xs">
                    {stats.passed}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      תסריטים שנבדקו ונמצאו תקינים
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      עובדים כמצופה לאחר אימות מלא של צוות בדיקות מדור נחשון
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: תמונת מצב והשוואה לפי מערכות */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    תמונת מצב והתקדמות לפי מערכת
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  תועדו סה"כ <strong>{stats.total}</strong> תסריטי בדיקה ב
                  {selectedScope === 'ALL' ? 'כלל המערכות הפעילות' : `מערכת ${selectedScope}`}{' '}
                  בפלטפורמות <strong>IOS, אנדרואיד ומחשב</strong>. כעת{' '}
                  <strong>{stats.passedPct}%</strong> מהתסריטים בסטטוס <strong>נבדק תקין</strong> ו-
                  <strong>{stats.handlingOrRetestPct}%</strong> נמצאים בטיפול או בבדיקה חוזרת.
                </p>
              </div>

              {/* Per-System Progress Bars */}
              <div className="space-y-3 bg-slate-50/90 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 my-auto">
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>התקדמות לפי מערכות:</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    לחץ על מערכת למיקוד הדוח
                  </span>
                </div>

                {perSystemStats.map((sysStat) => {
                  const isFocused = selectedScope === sysStat.system;
                  return (
                    <div
                      key={sysStat.system}
                      onClick={() =>
                        setSelectedScope(isFocused ? 'ALL' : sysStat.system)
                      }
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        isFocused
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-400/30'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white bidi-isolate">
                          {sysStat.system}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <span className="text-emerald-700 dark:text-emerald-400">{sysStat.passedPct}% תקין</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-600 dark:text-slate-400">{sysStat.total} בדיקות</span>
                        </div>
                      </div>

                      {/* Multi-colored stacked bar */}
                      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                        {sysStat.passed > 0 && (
                          <div
                            style={{ width: `${sysStat.passedPct}%` }}
                            className="bg-emerald-500 h-full"
                            title={`נבדק תקין: ${sysStat.passed}`}
                          />
                        )}
                        {sysStat.readyToRetest > 0 && (
                          <div
                            style={{ width: `${sysStat.readyToRetestPct}%` }}
                            className="bg-blue-500 h-full"
                            title={`ניתן לבדוק שוב: ${sysStat.readyToRetest}`}
                          />
                        )}
                        {sysStat.inProgress > 0 && (
                          <div
                            style={{ width: `${sysStat.inProgressPct}%` }}
                            className="bg-amber-500 h-full"
                            title={`בטיפול: ${sysStat.inProgress}`}
                          />
                        )}
                        {sysStat.open > 0 && (
                          <div
                            style={{ width: `${sysStat.openPct}%` }}
                            className="bg-red-500 h-full"
                            title={`פתוח: ${sysStat.open}`}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                        <span>🟢 תקין: {sysStat.passed}</span>
                        <span>🔵 לבדיקה: {sysStat.readyToRetest}</span>
                        <span>🟡 בטיפול: {sysStat.inProgress}</span>
                        <span>🔴 פתוח: {sysStat.open}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row: Main Findings Table + Visual Mobile/Desktop Screenshots Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Findings Table (7 columns on large screens, or 12 if no screenshots) */}
            <div
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs ${
                screenshotSamples.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    ריכוז ממצאים עיקריים וסטטוס ביצוע
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  מציג {scopedIssues.length} רשומות
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-l from-blue-700 to-indigo-600 text-white text-xs font-extrabold">
                      <th className="py-2.5 px-3 rounded-tr-xl">מס'</th>
                      {selectedScope === 'ALL' && <th className="py-2.5 px-3">מערכת</th>}
                      <th className="py-2.5 px-3">פלטפורמה</th>
                      <th className="py-2.5 px-3">נושא</th>
                      <th className="py-2.5 px-3">תיאור הבעיה</th>
                      <th className="py-2.5 px-3">מדווח</th>
                      <th className="py-2.5 px-3 text-center">סטטוס עבודה</th>
                      <th className="py-2.5 px-3 rounded-tl-xl text-center">חומרה</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {scopedIssues.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500">
                          אין תקלות מתועדות במערכת זו כעת.
                        </td>
                      </tr>
                    ) : (
                      scopedIssues.map((iss) => {
                        const badgeStyle =
                          iss.status === 'נבדק תקין'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : iss.status === 'ניתן לבדוק שוב'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : iss.status === 'בטיפול'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';

                        const sev = iss.severity || 'בינונית';
                        const sevBadge =
                          sev === 'קריטית' || sev === 'גבוהה'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : sev === 'בינונית'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

                        return (
                          <tr key={iss.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition">
                            <td className="py-2.5 px-3 font-mono font-extrabold text-slate-900 dark:text-white">
                              #{iss.testCaseId}
                            </td>
                            {selectedScope === 'ALL' && (
                              <td className="py-2.5 px-3 font-bold text-indigo-700 dark:text-indigo-400 bidi-isolate">
                                {iss.system}
                              </td>
                            )}
                            <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                              <span className="inline-flex items-center gap-1">
                                <PlatformIcon
                                  platform={iss.platform}
                                  className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400"
                                />
                                <span className="bidi-isolate">{iss.platform}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white max-w-[150px] rtl-safe">
                              {iss.subject}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-[230px] leading-relaxed rtl-safe">
                              {iss.description}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                              {iss.createdBy}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${badgeStyle}`}
                              >
                                {iss.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${sevBadge}`}
                              >
                                {sev}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Screenshots Showcase (Phone Mockup Cards like the Reference Image) */}
            {screenshotSamples.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        דוגמאות מסכים מהבדיקות
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">לחץ להגדלה</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                    {screenshotSamples.map((sample) => (
                      <div
                        key={sample.issueId}
                        onClick={() =>
                          onOpenLightbox(
                            sample.allImages,
                            0,
                            `תסריט #${sample.testCaseId} - ${sample.subject}`
                          )
                        }
                        className="group flex flex-col items-center cursor-pointer"
                      >
                        {/* Device Mockup Frame */}
                        <div className="w-full aspect-[9/16] rounded-2xl bg-slate-950 p-1.5 border-2 border-slate-800 shadow-md group-hover:scale-[1.02] transition overflow-hidden relative">
                          <div className="w-8 h-1 bg-slate-800 rounded-full mx-auto mb-1" />
                          <img
                            src={sample.image}
                            alt={sample.subject}
                            className="w-full h-[calc(100%-8px)] object-cover rounded-xl bg-slate-900"
                          />
                        </div>

                        {/* Caption Pill Below Device */}
                        <div className="w-full mt-2 p-2 rounded-xl bg-amber-50/90 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 text-center">
                          <div className="text-[10px] font-extrabold text-indigo-800 dark:text-indigo-400">
                            תסריט #{sample.testCaseId} ({sample.system})
                          </div>
                          <div className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold line-clamp-2 leading-snug mt-0.5 rtl-safe">
                            {sample.subject}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
