import React, { useState } from 'react';
import {
  ArrowUpDown,
  MessageSquare,
  Edit3,
  Trash2,
  Maximize2,
  Send,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import {
  STATUSES,
  STATUS_CONFIG,
  StdIssue,
  StdStatus,
  TeamRole
} from '../types/std';
import { PlatformIcon, formatHebrewDateTime } from './IssueCard';

interface SmartTableViewProps {
  issues: StdIssue[];
  showSystemColumn: boolean;
  highlightedId: string | null;
  currentUserName: string;
  currentUserRole: TeamRole;
  onStatusChange: (issueId: string, newStatus: StdStatus) => void;
  onAddComment: (issueId: string, text: string) => void;
  onEditIssue: (issue: StdIssue) => void;
  onDeleteIssue: (issueId: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

type SortKey = 'testCaseId' | 'platform' | 'status' | 'updatedAt';

export const SmartTableView: React.FC<SmartTableViewProps> = ({
  issues,
  showSystemColumn,
  highlightedId,
  currentUserName,
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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'testCaseId') {
      const numA = parseFloat(a.testCaseId);
      const numB = parseFloat(b.testCaseId);
      if (!isNaN(numA) && !isNaN(numB)) {
        cmp = numA - numB;
      } else {
        cmp = a.testCaseId.localeCompare(b.testCaseId, 'he');
      }
    } else if (sortKey === 'platform') {
      cmp = a.platform.localeCompare(b.platform, 'he');
    } else if (sortKey === 'status') {
      cmp = STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status);
    } else if (sortKey === 'updatedAt') {
      cmp = b.updatedAt - a.updatedAt;
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleQuickCommentSubmit = (e: React.FormEvent, issueId: string) => {
    e.preventDefault();
    if (!quickComment.trim()) return;
    onAddComment(issueId, quickComment.trim());
    setQuickComment('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs font-bold border-b border-slate-800">
              {showSystemColumn && <th className="py-3.5 px-4 whitespace-nowrap">מערכת</th>}
              <th className="py-3.5 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('testCaseId')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>מזהה תסריט</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('platform')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>פלטפורמה</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-4 min-w-[280px]">נושא התקלה ומהות השגיאה</th>
              <th className="py-3.5 px-4 whitespace-nowrap">צילומי מסך</th>
              <th className="py-3.5 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>סטטוס</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-4 whitespace-nowrap">הערות</th>
              <th className="py-3.5 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort('updatedAt')}
                  className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>עדכון אחרון</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-sm">
            {sortedIssues.map((issue) => {
              const statusStyle = STATUS_CONFIG[issue.status] || STATUS_CONFIG['פתוח'];
              const isExpanded = expandedRowId === issue.id;
              const isHighlighted = highlightedId === issue.id;
              const lastComment =
                issue.comments && issue.comments.length > 0
                  ? issue.comments[issue.comments.length - 1]
                  : null;

              return (
                <React.Fragment key={issue.id}>
                  <tr
                    className={`hover:bg-slate-50/90 transition ${
                      isHighlighted ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    {showSystemColumn && (
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs bidi-isolate">
                          {issue.system}
                        </span>
                      </td>
                    )}

                    {/* Test Case ID */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs">
                        #{issue.testCaseId}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        <PlatformIcon platform={issue.platform} className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="bidi-isolate">{issue.platform}</span>
                      </span>
                    </td>

                    {/* Subject & Description */}
                    <td className="py-3.5 px-4 align-top max-w-md">
                      <div className="font-bold text-slate-900 rtl-safe">{issue.subject}</div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2 rtl-safe">
                        {issue.description}
                      </div>
                    </td>

                    {/* Screenshots Preview */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
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
                              className="relative group/thumb w-14 h-11 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center cursor-zoom-in p-0.5 hover:border-indigo-500 transition"
                              title="לחץ להגדלה במסך מלא + זום"
                            >
                              <img
                                src={src}
                                alt=""
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
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                            >
                              +{issue.screenshots.length - 2}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ללא תמונה</span>
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={issue.status}
                          onChange={(e) => onStatusChange(issue.id, e.target.value as StdStatus)}
                          className={`appearance-none pr-6 pl-3 py-1 rounded-full border text-xs font-bold transition cursor-pointer focus:outline-none ${statusStyle.bgBadge} ${statusStyle.textBadge} ${statusStyle.borderBadge}`}
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-white text-slate-900">
                              {st}
                            </option>
                          ))}
                        </select>
                        <span
                          className={`w-2 h-2 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.dotColor}`}
                        />
                      </div>
                    </td>

                    {/* Comments Thread Trigger */}
                    <td className="py-3.5 px-4 align-top">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedRowId(isExpanded ? null : issue.id);
                          setQuickComment('');
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          issue.comments.length > 0
                            ? 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{issue.comments.length} הערות</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {lastComment && !isExpanded && (
                        <div className="text-[11px] text-slate-500 mt-1 max-w-[180px] truncate rtl-safe">
                          <span className="font-semibold">{lastComment.author}:</span>{' '}
                          {lastComment.text}
                        </div>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-500">
                      <div className="font-mono">{formatHebrewDateTime(issue.updatedAt)}</div>
                      <div className="text-[11px] text-slate-400 rtl-safe">{issue.createdBy}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditIssue(issue)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="ערוך תקלה"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteIssue(issue.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="מחק תקלה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Comments Drawer inside Smart Table */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90">
                      <td colSpan={showSystemColumn ? 9 : 8} className="p-4 border-t border-slate-200">
                        <div className="max-w-3xl space-y-3">
                          <div className="text-xs font-bold text-slate-700">
                            פירוט מלא ושרשור הערות לתסריט #{issue.testCaseId}:
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap rtl-safe">
                            {issue.description}
                          </div>

                          {issue.comments.length > 0 && (
                            <div className="space-y-2">
                              {issue.comments.map((c) => (
                                <div
                                  key={c.id}
                                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                                >
                                  <div className="space-y-0.5 rtl-safe">
                                    <span className="font-bold text-indigo-700 ml-2">
                                      {c.author}:
                                    </span>
                                    <span className="text-slate-700">{c.text}</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                    {formatHebrewDateTime(c.createdAt)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <form
                            onSubmit={(e) => handleQuickCommentSubmit(e, issue.id)}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={quickComment}
                              onChange={(e) => setQuickComment(e.target.value)}
                              placeholder={`כתוב הערה חדשה כ-${currentUserName}...`}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-indigo-500 rtl-safe"
                            />
                            <button
                              type="submit"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5 rotate-180" />
                              <span>שלח הערה</span>
                            </button>
                          </form>
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
    </div>
  );
};
