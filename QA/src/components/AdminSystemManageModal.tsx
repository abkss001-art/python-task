import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  Pencil,
  Archive,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Save,
  Info
} from 'lucide-react';

interface AdminSystemManageModalProps {
  systemName: string;
  totalIssuesCount: number;
  openIssuesCount: number;
  canDeleteOrArchive: boolean;
  existingSystemNames: string[];
  onRenameSystem: (oldName: string, newName: string) => void;
  onArchiveSystem: (systemName: string) => void;
  onDeleteSystem: (systemName: string) => void;
  onClose: () => void;
}

export const AdminSystemManageModal: React.FC<AdminSystemManageModalProps> = ({
  systemName,
  totalIssuesCount,
  openIssuesCount,
  canDeleteOrArchive,
  existingSystemNames,
  onRenameSystem,
  onArchiveSystem,
  onDeleteSystem,
  onClose
}) => {
  const [newName, setNewName] = useState(systemName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = newName.trim();

    if (!clean) {
      setErrorMsg('שם המערכת אינו יכול להיות ריק.');
      return;
    }

    if (clean === systemName) {
      setErrorMsg('השם שהוזן זהה לשם הנוכחי.');
      return;
    }

    if (
      existingSystemNames.some(
        (name) => name.toLowerCase() === clean.toLowerCase() && name.toLowerCase() !== systemName.toLowerCase()
      )
    ) {
      setErrorMsg('כבר קיימת מערכת בשם זה (או בארכיון). נא לבחור שם ייחודי.');
      return;
    }

    onRenameSystem(systemName, clean);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">ניהול מערכת</h3>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 text-xs font-mono font-bold bidi-isolate">
                  {systemName}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {totalIssuesCount} תסריטי בדיקה מקושרים{' '}
                {openIssuesCount > 0 && `(${openIssuesCount} בסטטוס פתוח)`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Rename System */}
          <form
            onSubmit={handleRenameSubmit}
            className="p-4 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white border border-indigo-100/80 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
              <Pencil className="w-4 h-4 text-indigo-600" />
              <span>עריכת שם המערכת:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="הזן שם חדש למערכת..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!newName.trim() || newName.trim() === systemName}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs transition shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>שמור שם חדש</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>שינוי השם יעדכן מיידית את כל תסריטי הבדיקה ויסתנכרן בזמן אמת מול כל הצוות.</span>
            </p>
          </form>

          {/* Section 2: Archive & Delete */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 px-1">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>פעולות ארכיון ומחיקה:</span>
            </div>

            {canDeleteOrArchive ? (
              <div className="space-y-2.5">
                {/* Option A: Move to Archive */}
                <button
                  type="button"
                  onClick={() => {
                    onArchiveSystem(systemName);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/70 text-right transition cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-200 shrink-0 mt-0.5">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        העבר מערכת זו לארכיון (מומלץ)
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        המערכת והתסריטים שלה יוסתרו מהסרגל, וניתן יהיה לשחזר אותם בכל שלב.
                      </div>
                    </div>
                  </div>
                </button>

                {/* Option B: Permanent Delete */}
                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-red-200 bg-red-50/30 hover:bg-red-50 text-right transition cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 shrink-0 mt-0.5">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-red-700">
                          מחיקת מערכת לצמיתות
                        </div>
                        <div className="text-[11px] text-red-600/80 mt-0.5 leading-relaxed">
                          זהירות: מחיקה מוחקת את המערכת ואת כל {totalIssuesCount} התסריטים ללא אפשרות שחזור.
                        </div>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-red-500 bg-red-50 text-right space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>אישור סופי: האם למחוק את מערכת "{systemName}" לצמיתות?</span>
                    </div>
                    <p className="text-[11px] text-red-700 leading-relaxed">
                      פעולה זו תמחק מיידית את כל {totalIssuesCount} התסריטים המקושרים אליה ולא ניתן יהיה לבטל אותה.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        ביטול
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteSystem(systemName);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold cursor-pointer shadow-xs"
                      >
                        מחק לצמיתות עכשיו
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-2.5">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>זוהי המערכת הפעילה היחידה באפליקציה – לא ניתן למחוק אותה, אך ניתן לערוך את שמה למעלה.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
