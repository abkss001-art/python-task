import React, { useState } from 'react';
import {
  STATUSES,
  STATUS_CONFIG,
  SEVERITY_CONFIG,
  StdIssue,
  StdStatus,
  TeamRole
} from '../types/std';
import { PlatformIcon, formatHebrewDateTime } from './IssueCard';
import {
  Hash,
  MessageSquare,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hourglass
} from 'lucide-react';

interface KanbanBoardProps {
  issues: StdIssue[];
  showSystemBadge?: boolean;
  highlightedId?: string | null;
  currentUserName: string;
  currentUserRole: TeamRole;
  canEdit?: boolean;
  canDelete?: boolean;
  onStatusChange: (issueId: string, newStatus: StdStatus) => void;
  onEditIssue: (issue: StdIssue) => void;
  onDeleteIssue: (issueId: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

const COLUMN_THEMES: Record<
  StdStatus,
  {
    headerBg: string;
    headerText: string;
    headerBorder: string;
    badgeBg: string;
    badgeText: string;
    dropAreaBorder: string;
    dropActiveBg: string;
    columnIcon: React.ReactNode;
  }
> = {
  פתוח: {
    headerBg: 'bg-rose-50 dark:bg-rose-950/40',
    headerText: 'text-rose-700 dark:text-rose-300',
    headerBorder: 'border-rose-200 dark:border-rose-800/60',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    dropAreaBorder: 'border-rose-300 dark:border-rose-700',
    dropActiveBg: 'bg-rose-50/60 dark:bg-rose-950/30',
    columnIcon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
  },
  בטיפול: {
    headerBg: 'bg-amber-50 dark:bg-amber-950/40',
    headerText: 'text-amber-700 dark:text-amber-300',
    headerBorder: 'border-amber-200 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    dropAreaBorder: 'border-amber-300 dark:border-amber-700',
    dropActiveBg: 'bg-amber-50/60 dark:bg-amber-950/30',
    columnIcon: <Hourglass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
  },
  'ניתן לבדוק שוב': {
    headerBg: 'bg-blue-50 dark:bg-blue-950/40',
    headerText: 'text-blue-700 dark:text-blue-300',
    headerBorder: 'border-blue-200 dark:border-blue-800/60',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-800 dark:text-blue-200',
    dropAreaBorder: 'border-blue-300 dark:border-blue-700',
    dropActiveBg: 'bg-blue-50/60 dark:bg-blue-950/30',
    columnIcon: <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
  },
  'נבדק תקין': {
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    headerText: 'text-emerald-700 dark:text-emerald-300',
    headerBorder: 'border-emerald-200 dark:border-emerald-800/60',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    dropAreaBorder: 'border-emerald-300 dark:border-emerald-700',
    dropActiveBg: 'bg-emerald-50/60 dark:bg-emerald-950/30',
    columnIcon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
  }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues,
  showSystemBadge,
  highlightedId,
  canEdit,
  canDelete,
  onStatusChange,
  onEditIssue,
  onDeleteIssue,
  onOpenLightbox
}) => {
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<StdStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData('text/plain', issueId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIssueId(issueId);
  };

  const handleDragEnd = () => {
    setDraggedIssueId(null);
    setActiveDropColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: StdStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: StdStatus) => {
    // Check if leaving the column element itself
    const related = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(related)) {
      if (activeDropColumn === status) {
        setActiveDropColumn(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, status: StdStatus) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (!issueId) return;

    const currentIssue = issues.find((i) => i.id === issueId);
    if (currentIssue && currentIssue.status !== status) {
      onStatusChange(issueId, status);
    }
    setDraggedIssueId(null);
  };

  return (
    <div className="w-full pb-8 overflow-x-auto" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start min-w-[320px]">
        {STATUSES.map((status) => {
          const theme = COLUMN_THEMES[status];
          const columnIssues = issues.filter((i) => i.status === status);
          const isDropActive = activeDropColumn === status;

          return (
            <div
              key={status}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={(e) => handleDragLeave(e, status)}
              onDrop={(e) => handleDrop(e, status)}
              className={`flex flex-col rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 overflow-hidden ${
                isDropActive
                  ? `${theme.dropAreaBorder} ${theme.dropActiveBg} ring-2 ring-indigo-500/40 shadow-md`
                  : ''
              }`}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 border-b ${theme.headerBg} ${theme.headerBorder}`}
              >
                <div className="flex items-center gap-2">
                  {theme.columnIcon}
                  <span className={`font-extrabold text-sm ${theme.headerText}`}>
                    {status}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {columnIssues.length}
                </span>
              </div>

              {/* Column Content / Issues List */}
              <div className="p-2.5 space-y-3 min-h-[420px] max-h-[calc(100vh-230px)] overflow-y-auto">
                {columnIssues.length === 0 ? (
                  <div
                    className={`h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition ${
                      isDropActive
                        ? `${theme.dropAreaBorder} bg-white/60 dark:bg-slate-800/60`
                        : 'border-slate-300/70 dark:border-slate-700/60 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {isDropActive ? 'שחרר כאן להעברה' : 'אין תקלות בסטטוס זה'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      גרור כרטיסייה לכאן כדי לעדכן סטטוס
                    </p>
                  </div>
                ) : (
                  columnIssues.map((issue) => {
                    const sev = issue.severity || 'בינונית';
                    const sevStyle = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG['בינונית'];
                    const isCardDragged = draggedIssueId === issue.id;
                    const isHighlighted = highlightedId === issue.id;
                    const currentStatusIdx = STATUSES.indexOf(issue.status);

                    return (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue.id)}
                        onDragEnd={handleDragEnd}
                        className={`group relative bg-white dark:bg-slate-800/95 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all duration-200 p-3.5 cursor-grab active:cursor-grabbing ${
                          isCardDragged ? 'opacity-40 scale-95' : 'opacity-100'
                        } ${
                          isHighlighted
                            ? 'ring-2 ring-indigo-500 animate-live-highlight'
                            : ''
                        }`}
                      >
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Test Case # */}
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-950 text-white text-[11px] font-mono font-bold shadow-2xs">
                              <Hash className="w-2.5 h-2.5 text-indigo-400" />
                              <span>{issue.testCaseId}</span>
                            </span>

                            {/* System Badge */}
                            {showSystemBadge && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                                {issue.system}
                              </span>
                            )}

                            {/* Platform */}
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                              <PlatformIcon
                                platform={issue.platform}
                                className="w-3 h-3 text-indigo-500 dark:text-indigo-400"
                              />
                              <span className="bidi-isolate">{issue.platform}</span>
                            </span>
                          </div>

                          {/* Severity Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${sevStyle.bgBadge} ${sevStyle.textBadge} ${sevStyle.borderBadge}`}
                          >
                            <Flame className="w-2.5 h-2.5" />
                            <span>{sev}</span>
                          </span>
                        </div>

                        {/* Subject */}
                        <h4
                          onClick={() => {
                            if (canEdit) onEditIssue(issue);
                          }}
                          className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 mb-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                          title="לחץ לעריכה / צפייה בפרטי התקלה"
                        >
                          {issue.subject}
                        </h4>

                        {/* Description Preview */}
                        {issue.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {issue.description}
                          </p>
                        )}

                        {/* Screenshots Thumbnail Preview */}
                        {issue.screenshots && issue.screenshots.length > 0 && (
                          <div className="mb-2.5">
                            <div
                              onClick={() =>
                                onOpenLightbox(
                                  issue.screenshots!,
                                  0,
                                  `תסריט #${issue.testCaseId} - ${issue.subject}`
                                )
                              }
                              className="relative h-20 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 cursor-pointer group/img"
                            >
                              <img
                                src={issue.screenshots[0]}
                                alt="צילום מסך"
                                className="w-full h-full object-cover transition duration-200 group-hover/img:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/35 transition flex items-center justify-center">
                                <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3 text-cyan-300" />
                                  <span>
                                    {issue.screenshots.length > 1
                                      ? `${issue.screenshots.length} תמונות`
                                      : 'הגדל תמונה'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer Info Row: Reporter, Comments & Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                          {/* Reporter / Date */}
                          <div className="flex items-center gap-1 min-w-0 truncate">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate" title={`דווח ע"י ${issue.createdBy}`}>
                              {issue.createdBy.split(' ')[0]}
                            </span>
                          </div>

                          {/* Comments count */}
                          <div className="flex items-center gap-2">
                            {(issue.comments?.length || 0) > 0 && (
                              <span
                                className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium"
                                title={`${issue.comments?.length} הערות`}
                              >
                                <MessageSquare className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                                <span>{issue.comments?.length}</span>
                              </span>
                            )}

                            {/* Action Buttons (Edit / Delete) */}
                            <div className="flex items-center gap-1">
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditIssue(issue);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                                  title="ערוך תקלה"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteIssue(issue.id);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                  title="מחק תקלה"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Status Shift Controls (especially convenient for mobile/touch) */}
                        <div className="mt-2 pt-1.5 flex items-center justify-between border-t border-dashed border-slate-100 dark:border-slate-700/40">
                          {currentStatusIdx > 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(issue.id, STATUSES[currentStatusIdx - 1]);
                              }}
                              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition cursor-pointer"
                              title={`העבר ל"${STATUSES[currentStatusIdx - 1]}"`}
                            >
                              <ArrowRight className="w-3 h-3" />
                              <span>{STATUSES[currentStatusIdx - 1]}</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          {currentStatusIdx < STATUSES.length - 1 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(issue.id, STATUSES[currentStatusIdx + 1]);
                              }}
                              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition cursor-pointer"
                              title={`העבר ל"${STATUSES[currentStatusIdx + 1]}"`}
                            >
                              <span>{STATUSES[currentStatusIdx + 1]}</span>
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          ) : (
                            <span />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
