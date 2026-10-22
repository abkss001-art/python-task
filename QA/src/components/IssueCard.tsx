import React, { useState } from 'react';
import {
  Smartphone,
  Globe,
  Monitor,
  Compass,
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  Maximize2,
  Clock,
  ImagePlus,
  Hash,
  User,
  Flame
} from 'lucide-react';
import {
  SEVERITY_CONFIG,
  STATUSES,
  STATUS_CONFIG,
  StdIssue,
  StdPlatform,
  StdStatus,
  TeamRole
} from '../types/std';
import { extractImagesFromClipboardEvent } from '../utils/imageUtils';

interface IssueCardProps {
  issue: StdIssue;
  showSystemBadge?: boolean;
  isHighlighted?: boolean;
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

export const PlatformIcon: React.FC<{ platform: StdPlatform; className?: string }> = ({
  platform,
  className = 'w-3.5 h-3.5'
}) => {
  switch (platform) {
    case 'IOS':
    case 'אנדרואיד':
      return <Smartphone className={className} />;
    case 'מחשב':
    default:
      return <Monitor className={className} />;
  }
};

export function formatHebrewDateTime(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  showSystemBadge = false,
  isHighlighted = false,
  currentUserName,
  canEdit = true,
  canDelete = false,
  onStatusChange,
  onAddComment,
  onEditIssue,
  onDeleteIssue,
  onOpenLightbox
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentScreenshot, setCommentScreenshot] = useState<string | undefined>(undefined);
  const [showAllComments, setShowAllComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusStyle = STATUS_CONFIG[issue.status] || STATUS_CONFIG['פתוח'];
  const sev = issue.severity || 'בינונית';
  const sevStyle = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG['בינונית'];

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !commentScreenshot) return;
    onAddComment(issue.id, commentText.trim(), commentScreenshot);
    setCommentText('');
    setCommentScreenshot(undefined);
    setShowAllComments(true);
  };

  const handleCommentPaste = async (e: React.ClipboardEvent) => {
    const pastedImages = await extractImagesFromClipboardEvent(e);
    if (pastedImages.length > 0) {
      e.preventDefault();
      setCommentScreenshot(pastedImages[0]);
    }
  };

  const commentsList = issue.comments || [];
  const visibleComments = showAllComments ? commentsList : commentsList.slice(-2);

  return (
    <article
      dir="rtl"
      className={`group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        statusStyle.cardAccent
      } ${isHighlighted ? 'animate-live-highlight ring-2 ring-indigo-500' : ''}`}
    >
      {/* Top Body */}
      <div className="p-5 space-y-4">
        {/* Card Header: Test Case ID, Platform, System Badge & Status Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Test Case ID Badge */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold font-mono shadow-2xs"
              title="מזהה תסריט בדיקה"
            >
              <Hash className="w-3 h-3 text-indigo-400" />
              <span>תסריט {issue.testCaseId}</span>
            </span>

            {/* Platform Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-semibold">
              <PlatformIcon platform={issue.platform} className="w-3.5 h-3.5 text-indigo-600" />
              <span className="bidi-isolate">{issue.platform}</span>
            </span>

            {/* Severity Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-extrabold ${sevStyle.bgBadge} ${sevStyle.textBadge} ${sevStyle.borderBadge}`}
              title="חומרת תקלה"
            >
              {sev === 'קריטית' ? (
                <Flame className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dotColor}`} />
              )}
              <span>{sev}</span>
            </span>

            {showSystemBadge && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-bold bidi-isolate">
                {issue.system}
              </span>
            )}
          </div>

          {/* Direct Status Switcher */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <select
                value={issue.status}
                onChange={(e) => onStatusChange(issue.id, e.target.value as StdStatus)}
                aria-label="שינוי סטטוס תקלה"
                className={`appearance-none pr-6 pl-3 py-1 rounded-full border text-xs font-bold transition cursor-pointer focus:outline-none focus:ring-2 ${statusStyle.bgBadge} ${statusStyle.textBadge} ${statusStyle.borderBadge} ${statusStyle.activeRing}`}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-white text-slate-900 font-semibold">
                    {st}
                  </option>
                ))}
              </select>
              <span
                className={`w-2 h-2 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.dotColor}`}
              />
            </div>

            {/* Edit (QA & Admin only) & Delete (Admin only) Actions */}
            {canEdit && (
              <button
                type="button"
                onClick={() => onEditIssue(issue)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                title="ערוך תקלה / הוסף צילום מסך"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={() => onDeleteIssue(issue.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                title="מחק תקלה (מנהל בלבד)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Issue Subject & Full Description (RTL safe so English words never break alignment) */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug rtl-safe">
            {issue.subject}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap rtl-safe bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            {issue.description}
          </p>
        </div>

        {/* Uncropped Screenshots Preview Gallery */}
        {issue.screenshots && issue.screenshots.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>צילומי מסך מצורפים ({issue.screenshots.length})</span>
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                לחץ על תמונה לפתיחה במסך מלא וזום
              </span>
            </div>

            <div
              className={`grid gap-2.5 ${
                issue.screenshots.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {issue.screenshots.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    onOpenLightbox(
                      issue.screenshots,
                      idx,
                      `תסריט #${issue.testCaseId} - ${issue.subject}`
                    )
                  }
                  className="group/img relative rounded-xl overflow-hidden bg-slate-900/95 border border-slate-200 flex items-center justify-center h-48 sm:h-56 cursor-zoom-in p-1.5 transition hover:border-indigo-400"
                >
                  {/* object-contain ensures screenshots are NEVER squished or cropped */}
                  <img
                    src={src}
                    alt={`צילום מסך ${idx + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg transition duration-200 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover/img:bg-slate-950/30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover/img:opacity-100 transition transform translate-y-1 group-hover/img:translate-y-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>הגדל למסך מלא + זום</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Info Row: Reporter & Timestamp */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 rtl-safe">
            <User className="w-3 h-3" />
            <span>דווח ע"י: {issue.createdBy}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>עודכן: {formatHebrewDateTime(issue.updatedAt)}</span>
          </span>
        </div>
      </div>

      {/* Bottom Section: Developer-Tester Comments Thread */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>שרשור הערות בודקים / פיתוח ({commentsList.length})</span>
          </div>

          {commentsList.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAllComments((prev) => !prev)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              {showAllComments
                ? 'הסתר הערות קודמות'
                : `הצג את כל ${commentsList.length} ההערות`}
            </button>
          )}
        </div>

        {/* Comments List */}
        {visibleComments.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pl-1">
            {visibleComments.map((c) => {
              const isDev = c.role === 'dev' || c.author.includes('מפתח');
              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isDev
                      ? 'bg-purple-50/60 border-purple-200/70'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 rtl-safe">{c.author}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isDev
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {isDev ? 'פיתוח' : 'QA'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatHebrewDateTime(c.createdAt)}
                    </span>
                  </div>
                  {c.text && (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap rtl-safe">
                      {c.text}
                    </p>
                  )}
                  {c.screenshot && (
                    <div
                      onClick={() =>
                        onOpenLightbox(
                          [c.screenshot!],
                          0,
                          `הערה מאת ${c.author} (תסריט #${issue.testCaseId})`
                        )
                      }
                      className="mt-1.5 h-28 rounded-lg bg-slate-900 p-1 flex items-center justify-center cursor-zoom-in border border-slate-200"
                    >
                      <img
                        src={c.screenshot}
                        alt="צילום מסך בהערה"
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            אין עדיין הערות לתקלה זו. כתוב הערה או הדבק צילום מסך (Ctrl+V)...
          </p>
        )}

        {/* Pasted Comment Screenshot Preview */}
        {commentScreenshot && (
          <div className="relative inline-block bg-slate-900 p-1.5 rounded-xl border border-indigo-300">
            <img
              src={commentScreenshot}
              alt="תצוגה מקדימה"
              className="h-20 w-auto object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setCommentScreenshot(undefined)}
              className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow cursor-pointer"
              title="הסר תמונה"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Reply Input */}
        <form onSubmit={handleSendComment} className="flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPaste={handleCommentPaste}
            placeholder={`הוסף הערה כ-${currentUserName} (ניתן גם להדביק תמונה ב-Ctrl+V)...`}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
          />
          <button
            type="submit"
            disabled={!commentText.trim() && !commentScreenshot}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition cursor-pointer shrink-0"
            title="שלח הערה"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      </div>
    </article>
  );
};
