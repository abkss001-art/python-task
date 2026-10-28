import React, { useMemo, useState, useRef } from 'react';
import {
  ArrowUpDown,
  MessageSquare,
  Edit3,
  Trash2,
  Maximize2,
  Send,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ImagePlus,
  History,
  X,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal
} from 'lucide-react';
import {
  SEVERITIES,
  SEVERITY_CONFIG,
  STATUSES,
  STATUS_CONFIG,
  StdIssue,
  StdStatus,
  TeamRole
} from '../types/std';
import { PlatformIcon, formatHebrewDateTime } from './IssueCard';
import {
  extractImagesFromClipboardEvent,
  processScreenshotFile
} from '../utils/imageUtils';

interface SmartTableViewProps {
  issues: StdIssue[];
  showSystemColumn: boolean;
  highlightedId: string | null;
  currentUserName: string;
  currentUserRole: TeamRole;
  canEdit?: boolean;
  canDelete?: boolean;
  onStatusChange: (issueId: string, newStatus: StdStatus) => void;
  onAddComment: (issueId: string, text: string, screenshot?: string) => void;
  onEditIssue: (issue: StdIssue) => void;
  onDeleteIssue: (issueId: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

type SortKey = 'testCaseId' | 'platform' | 'severity' | 'status' | 'updatedAt';

const READ_COMMENTS_STORAGE_KEY = 'tzavman_read_comments_v1';

function loadReadCommentCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(READ_COMMENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

export const SmartTableView: React.FC<SmartTableViewProps> = ({
  issues,
  showSystemColumn,
  highlightedId,
  currentUserName,
  canEdit = true,
  canDelete = false,
  onStatusChange,
  onAddComment,
  onEditIssue,
  onDeleteIssue,
  onOpenLightbox
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('testCaseId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [quickComment, setQuickComment] = useState('');
  const [commentScreenshot, setCommentScreenshot] = useState<string | undefined>(undefined);
  const [readCounts, setReadCounts] = useState<Record<string, number>>(() =>
    loadReadCommentCounts()
  );
  const commentFileRef = useRef<HTMLInputElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollByDelta = (delta: number) => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToRightEdge = () => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollTo({ left: 10000, behavior: 'smooth' });
  };

  const scrollToLeftEdge = () => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollTo({ left: -10000, behavior: 'smooth' });
  };

  const scrollToColumnRatio = (ratio: number) => {
    if (!tableContainerRef.current) return;
    const el = tableContainerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: -ratio * maxScroll, behavior: 'smooth' });
  };

  const markIssueCommentsRead = (issueId: string, count: number) => {
    setReadCounts((prev) => {
      const next = { ...prev, [issueId]: count };
      try {
        localStorage.setItem(READ_COMMENTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'testCaseId') {
        const matchA = (a.testCaseId || '').match(/\d+/);
        const matchB = (b.testCaseId || '').match(/\d+/);
        const numA = matchA ? parseInt(matchA[0], 10) : NaN;
        const numB = matchB ? parseInt(matchB[0], 10) : NaN;
        if (!isNaN(numA) && !isNaN(numB)) {
          cmp = numA - numB;
        } else {
          cmp = (a.testCaseId || '').localeCompare(b.testCaseId || '', 'he', { numeric: true });
        }
      } else if (sortKey === 'platform') {
        cmp = a.platform.localeCompare(b.platform, 'he');
      } else if (sortKey === 'severity') {
        const sevA = a.severity || 'בינונית';
        const sevB = b.severity || 'בינונית';
        cmp = SEVERITIES.indexOf(sevA) - SEVERITIES.indexOf(sevB);
      } else if (sortKey === 'status') {
        cmp = STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status);
      } else if (sortKey === 'updatedAt') {
        cmp = b.updatedAt - a.updatedAt;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [issues, sortKey, sortAsc]);

  const handleQuickCommentSubmit = (e: React.FormEvent, issue: StdIssue) => {
    e.preventDefault();
    if (!quickComment.trim() && !commentScreenshot) return;
    onAddComment(
      issue.id,
      quickComment.trim() || 'צורף צילום מסך להערה',
      commentScreenshot
    );
    markIssueCommentsRead(issue.id, (issue.comments?.length || 0) + 1);
    setQuickComment('');
    setCommentScreenshot(undefined);
  };

  const handleCommentPaste = async (e: React.ClipboardEvent) => {
    const pasted = await extractImagesFromClipboardEvent(e);
    if (pasted.length > 0) {
      setCommentScreenshot(pasted[0]);
    }
  };

  const handleCommentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const processed = await processScreenshotFile(file);
    setCommentScreenshot(processed);
    e.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden" dir="rtl">
      {/* Mobile Horizontal Scroll Controller & Quick Navigation Bar */}
      <div className="block lg:hidden bg-slate-50 dark:bg-slate-950 p-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>פס גלילה לטבלה</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={scrollToRightEdge}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer text-xs flex items-center gap-0.5"
              title="קפוץ לתחילת הטבלה (ימין)"
            >
              <ChevronsRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold">התחלה</span>
            </button>

            <button
              type="button"
              onClick={() => scrollByDelta(220)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
              title="גלול ימינה"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollByDelta(-220)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer"
              title="גלול שמאלה"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToLeftEdge}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer text-xs flex items-center gap-0.5"
              title="קפוץ לסוף הטבלה (פעולות)"
            >
              <span className="text-[10px] font-bold">סוף</span>
              <ChevronsLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Quick Column Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-bold">
          <button
            type="button"
            onClick={scrollToRightEdge}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition cursor-pointer"
          >
            🎯 מזהה תסריט
          </button>
          <button
            type="button"
            onClick={() => scrollToColumnRatio(0.35)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            📝 נושא התקלה
          </button>
          <button
            type="button"
            onClick={() => scrollToColumnRatio(0.7)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            🚦 סטטוס
          </button>
          <button
            type="button"
            onClick={scrollToLeftEdge}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition cursor-pointer"
          >
            ⚙️ פעולות ועריכה
          </button>
        </div>
      </div>

      <div
        ref={tableContainerRef}
        className="overflow-x-auto mobile-table-scrollbar"
      >
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-900 dark:bg-slate-950 text-white text-xs font-bold border-b border-slate-800 dark:border-slate-800">
              {showSystemColumn && <th className="py-3.5 px-3.5 whitespace-nowrap">מערכת</th>}
              <th className="py-3.5 px-3.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('testCaseId')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>מזהה תסריט</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('platform')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>פלטפורמה</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('severity')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>חומרה</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-4 min-w-[260px]">נושא התקלה ומהות השגיאה</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">צילומי מסך</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>סטטוס</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">הערות והיסטוריה</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('updatedAt')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>עדכון אחרון</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              {(canEdit || canDelete) && (
                <th className="py-3.5 px-3.5 text-center whitespace-nowrap">פעולות</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-sm">
            {sortedIssues.map((issue) => {
              const statusStyle = STATUS_CONFIG[issue.status] || STATUS_CONFIG['פתוח'];
              const sev = issue.severity || 'בינונית';
              const sevStyle = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG['בינונית'];
              const isExpanded = expandedRowId === issue.id;
              const isHighlighted = highlightedId === issue.id;
              const lastComment =
                issue.comments && issue.comments.length > 0
                  ? issue.comments[issue.comments.length - 1]
                  : null;

              const seenCount = readCounts[issue.id] ?? 0;
              const hasUnreadComments =
                issue.comments.length > seenCount &&
                lastComment &&
                !lastComment.author.startsWith(currentUserName);

              return (
                <React.Fragment key={issue.id}>
                  <tr
                    className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition ${
                      isHighlighted ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : ''
                    }`}
                  >
                    {showSystemColumn && (
                      <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs bidi-isolate">
                          {issue.system}
                        </span>
                      </td>
                    )}

                    {/* Test Case ID */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-950 text-white font-mono font-bold text-xs">
                        #{issue.testCaseId}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <PlatformIcon platform={issue.platform} className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="bidi-isolate">{issue.platform}</span>
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${sevStyle.bgBadge} ${sevStyle.textBadge} ${sevStyle.borderBadge}`}
                      >
                        {sev === 'קריטית' ? (
                          <Flame className="w-3 h-3 text-rose-600" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dotColor}`} />
                        )}
                        <span>{sev}</span>
                      </span>
                    </td>

                    {/* Subject & Description */}
                    <td className="py-3.5 px-4 align-top max-w-md">
                      <div className="font-bold text-slate-900 dark:text-slate-100 rtl-safe">{issue.subject}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 rtl-safe">
                        {issue.description}
                      </div>
                    </td>

                    {/* Screenshots Preview */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      {issue.screenshots && issue.screenshots.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {issue.screenshots.slice(0, 2).map((src, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                onOpenLightbox(
                                  issue.screenshots,
                                  idx,
                                  `תסריט #${issue.testCaseId} - ${issue.subject}`
                                )
                              }
                              className="relative group/thumb w-14 h-11 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center cursor-zoom-in p-0.5 hover:border-indigo-500 transition"
                              title="לחץ להגדלה במסך מלא + זום"
                            >
                              <img
                                src={src}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="max-w-full max-h-full object-contain"
                              />
                              <span className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                                <Maximize2 className="w-3.5 h-3.5 text-white" />
                              </span>
                            </button>
                          ))}
                          {issue.screenshots.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenLightbox(
                                  issue.screenshots,
                                  2,
                                  `תסריט #${issue.testCaseId} - ${issue.subject}`
                                )
                              }
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              +{issue.screenshots.length - 2}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ללא תמונה</span>
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={issue.status}
                          onChange={(e) => onStatusChange(issue.id, e.target.value as StdStatus)}
                          className={`appearance-none pr-6 pl-3 py-1 rounded-full border text-xs font-bold transition cursor-pointer focus:outline-none ${statusStyle.bgBadge} ${statusStyle.textBadge} ${statusStyle.borderBadge}`}
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold">
                              {st}
                            </option>
                          ))}
                        </select>
                        <span
                          className={`w-2 h-2 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.dotColor}`}
                        />
                      </div>
                    </td>

                    {/* Comments Thread Trigger + Unread Indicator */}
                    <td className="py-3.5 px-3.5 align-top">
                      <button
                        type="button"
                        onClick={() => {
                          const nextExpand = isExpanded ? null : issue.id;
                          setExpandedRowId(nextExpand);
                          setQuickComment('');
                          setCommentScreenshot(undefined);
                          if (nextExpand) {
                            markIssueCommentsRead(issue.id, issue.comments.length);
                          }
                        }}
                        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          hasUnreadComments
                            ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
                            : issue.comments.length > 0
                            ? 'bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{issue.comments.length} הערות</span>
                        {hasUnreadComments && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-extrabold animate-pulse">
                            חדש
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {lastComment && !isExpanded && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 max-w-[180px] truncate rtl-safe font-medium">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{lastComment.author}:</span>{' '}
                          {lastComment.text}
                        </div>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-3.5 align-top whitespace-nowrap text-xs text-slate-500 dark:text-slate-300">
                      <div className="font-mono">{formatHebrewDateTime(issue.updatedAt)}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 rtl-safe">{issue.createdBy}</div>
                    </td>

                    {/* Actions (QA/Admin Edit, Admin Delete) */}
                    {(canEdit || canDelete) && (
                      <td className="py-3.5 px-3.5 align-top whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onEditIssue(issue)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="ערוך תקלה"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => onDeleteIssue(issue.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="מחק תקלה (מנהל בלבד)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Expandable Comments + Screenshot + Audit History Drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90 dark:bg-slate-950/70">
                      <td colSpan={showSystemColumn ? 10 : 9} className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          {/* Right 8 cols: Full description + Comments + Add Comment with Screenshot */}
                          <div className="lg:col-span-8 space-y-3">
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              פירוט מלא ושרשור הערות לתסריט #{issue.testCaseId}:
                            </div>
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap rtl-safe">
                              {issue.description}
                            </div>

                            {issue.comments.length > 0 && (
                              <div className="space-y-2">
                                {issue.comments.map((c) => (
                                  <div
                                    key={c.id}
                                    className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="space-y-0.5 rtl-safe">
                                        <span className="font-bold text-indigo-700 dark:text-indigo-400 ml-2">
                                          {c.author}:
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">{c.text}</span>
                                      </div>
                                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                        {formatHebrewDateTime(c.createdAt)}
                                      </span>
                                    </div>
                                    {c.screenshot && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onOpenLightbox(
                                            [c.screenshot!],
                                            0,
                                            `צילום מסך בהערה של ${c.author}`
                                          )
                                        }
                                        className="self-start mt-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 max-w-[160px] max-h-24 p-0.5 cursor-zoom-in"
                                      >
                                        <img
                                          src={c.screenshot}
                                          alt="צילום בהערה"
                                          loading="lazy"
                                          decoding="async"
                                          className="max-h-22 w-auto object-contain rounded"
                                        />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Attached Comment Screenshot Preview */}
                            {commentScreenshot && (
                              <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
                                <img
                                  src={commentScreenshot}
                                  alt="תצוגה מקדימה"
                                  className="h-12 w-auto rounded object-contain bg-slate-900"
                                />
                                <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                                  צילום מסך מצורף להערה
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCommentScreenshot(undefined)}
                                  className="p-1 rounded-lg text-slate-500 hover:text-red-600 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <form
                              onSubmit={(e) => handleQuickCommentSubmit(e, issue)}
                              className="flex items-center gap-2"
                            >
                              <input
                                ref={commentFileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCommentFileUpload}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => commentFileRef.current?.click()}
                                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shrink-0"
                                title="צרף צילום מסך להערה (או הדבק ב-Ctrl+V בשדה הטקסט)"
                              >
                                <ImagePlus className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                value={quickComment}
                                onChange={(e) => setQuickComment(e.target.value)}
                                onPaste={handleCommentPaste}
                                placeholder={`כתוב הערה כ-${currentUserName}...`}
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 rtl-safe"
                              />
                              <button
                                type="submit"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shrink-0"
                              >
                                <Send className="w-3.5 h-3.5 rotate-180" />
                                <span>שלח הערה</span>
                              </button>
                            </form>
                          </div>

                          {/* Left 4 cols: Audit Log Timeline (היסטוריית שינויים) */}
                          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                              <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>ציר זמן והיסטוריית תקלה</span>
                            </div>
                            <div className="space-y-2 max-h-44 overflow-y-auto text-[11px]">
                              <div className="flex items-start justify-between gap-2 text-slate-600 dark:text-slate-400">
                                <span>
                                  נוצר ע"י <strong className="text-slate-800 dark:text-slate-200">{issue.createdBy}</strong>
                                </span>
                                <span className="font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                  {formatHebrewDateTime(issue.createdAt)}
                                </span>
                              </div>
                              {(issue.auditLog || []).map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-start justify-between gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                >
                                  <span className="rtl-safe">
                                    <strong className="text-indigo-700 dark:text-indigo-400">{entry.actor}:</strong>{' '}
                                    {entry.action}
                                  </span>
                                  <span className="font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                    {formatHebrewDateTime(entry.timestamp)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Bottom Quick Scroll Bar Indicator */}
      <div className="block lg:hidden bg-slate-50 dark:bg-slate-950 px-3 py-2 border-t border-slate-200 dark:border-slate-800 text-center">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          💡 גרור את הטבלה ימינה/שמאלה עם האצבע או השתמש בחצים למעלה כדי לעבור בין העמודות
        </span>
      </div>
    </div>
  );
};
