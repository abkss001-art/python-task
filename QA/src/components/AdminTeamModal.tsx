import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Code,
  UserCheck,
  Lock,
  ShieldAlert,
  Layers,
  Pencil,
  Check
} from 'lucide-react';
import { TeamMember } from '../utils/teamMembers';
import { TeamRole } from '../types/std';

interface AdminTeamModalProps {
  systems: string[];
  teamMembers: TeamMember[];
  onSaveTeamMembers: (members: TeamMember[]) => void;
  onClose: () => void;
}

export const AdminTeamModal: React.FC<AdminTeamModalProps> = ({
  systems,
  teamMembers,
  onSaveTeamMembers,
  onClose
}) => {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setMembers(teamMembers);
    }
  }, [teamMembers]);

  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>('qa');
  const [newAllowedSystems, setNewAllowedSystems] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Editing state for an existing member
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<TeamRole>('qa');
  const [editingAllowedSystems, setEditingAllowedSystems] = useState<string[]>([]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFullName.trim();
    if (!cleanName) return;

    if (members.some((m) => m.fullName.toLowerCase() === cleanName.toLowerCase())) {
      setStatusMsg('איש צוות בשם זה כבר קיים ברשימה.');
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      fullName: cleanName,
      role: newRole,
      allowedSystems:
        newRole === 'dev' && newAllowedSystems.length > 0
          ? newAllowedSystems
          : undefined
    };

    const nextMembers = [...members, newMember];
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);
    setNewFullName('');
    setNewAllowedSystems([]);
    setStatusMsg(`נוסף בהצלחה: ${cleanName}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartEdit = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setEditingRole(m.role);
    setEditingAllowedSystems(m.allowedSystems || []);
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
  };

  const handleSaveEdit = (id: string) => {
    const nextMembers = members.map((m) => {
      if (m.id !== id) return m;
      return {
        ...m,
        role: editingRole,
        allowedSystems:
          editingRole === 'dev' && editingAllowedSystems.length > 0
            ? editingAllowedSystems
            : undefined
      };
    });
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);
    setEditingMemberId(null);
    setStatusMsg('הרשאות איש הצוות עודכנו בהצלחה!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleRemoveMember = (id: string, name: string) => {
    const target = members.find((m) => m.id === id);
    if (target?.isSuperAdmin) {
      setStatusMsg('לא ניתן למחוק את מנהל-העל מהרשימה. שינוי שמו מתבצע באזור ניהול אבטחה באמצעות קוד-העל.');
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }
    if (members.length <= 1) {
      setStatusMsg('חייב להישאר לפחות איש צוות אחד ברשימה.');
      return;
    }
    const nextMembers = members.filter((m) => m.id !== id);
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);
    setStatusMsg(`הוסר מהצוות: ${name}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-extrabold">ניהול חברי צוות והרשאות מערכת</h3>
              <p className="text-xs text-slate-300">
                הגדרת רשימת השמות המורשים והקצאת מערכות ייעודיות למפתחים
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
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Add Member Form */}
          <form
            onSubmit={handleAddMember}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>הוספת איש צוות חדש למערכת:</span>
              </span>
            </div>

            {/* Row 1: Name Input & Submit Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="שם מלא (למשל: דניאל כהן)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-semibold shadow-2xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>הוסף לצוות</span>
              </button>
            </div>

            {/* Row 2: Role Selector Buttons */}
            <div className="pt-2 border-t border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-600 mb-1.5">בחר תפקיד:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewRole('qa')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    newRole === 'qa'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>בודק QA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole('dev')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    newRole === 'dev'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>מפתח</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole('admin')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    newRole === 'admin'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>מנהל</span>
                </button>
              </div>
            </div>

            {/* Role-Specific Systems Picker */}
            {newRole === 'dev' ? (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>מערכות מורשות למפתח (סמן את המערכות שהוא יכול לראות):</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewAllowedSystems([...systems])}
                      className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                    >
                      בחר הכל
                    </button>
                    <span className="text-purple-300">|</span>
                    <button
                      type="button"
                      onClick={() => setNewAllowedSystems([])}
                      className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                    >
                      נקה
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {systems.map((sys) => {
                    const isChecked = newAllowedSystems.includes(sys);
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => {
                          setNewAllowedSystems((prev) =>
                            isChecked ? prev.filter((s) => s !== sys) : [...prev, sys]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] bg-white text-purple-600 font-extrabold">
                          {isChecked ? '✓' : ''}
                        </span>
                        <span>{sys}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-purple-700/80">
                  {newAllowedSystems.length === 0
                    ? '💡 אם לא מסומנת אף מערכת, המפתח יוכל לראות את כל המערכות כברירת מחדל.'
                    : `סומנו ${newAllowedSystems.length} מערכות מורשות: המפתח יראה אך ורק אותן בעת התחברות.`}
                </p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {newRole === 'admin'
                    ? 'מנהל מערכת – גישה מלאה לכלל המערכות וכלי הניהול באופן מובנה.'
                    : 'בודק QA – גישה מלאה לכלל המערכות בסביבת הבדיקות באופן מובנה.'}
                </span>
              </div>
            )}
          </form>

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span>חברי צוות מורשים ({members.length}):</span>
              <span className="text-[11px] text-slate-400">השמות מופיעים בהשלמה האוטומטית בכניסה</span>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden max-h-72 overflow-y-auto">
              {members.map((m) => {
                const isEditing = editingMemberId === m.id;

                if (isEditing) {
                  return (
                    <div key={m.id} className="p-3.5 bg-indigo-50/50 border-b border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">
                          עריכת הרשאות: {m.fullName}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(m.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>שמור</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                          >
                            ביטול
                          </button>
                        </div>
                      </div>

                      {/* Edit Role */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-600 ml-1">תפקיד:</span>
                        <button
                          type="button"
                          onClick={() => setEditingRole('qa')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            editingRole === 'qa'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          בודק QA
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRole('dev')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            editingRole === 'dev'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          מפתח
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRole('admin')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            editingRole === 'admin'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          מנהל
                        </button>
                      </div>

                      {/* Edit Allowed Systems (only if dev) */}
                      {editingRole === 'dev' ? (
                        <div className="p-2.5 bg-white rounded-xl border border-purple-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                            <span>מערכות מורשות:</span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingAllowedSystems([...systems])}
                                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                              >
                                בחר הכל
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => setEditingAllowedSystems([])}
                                className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                              >
                                נקה
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {systems.map((sys) => {
                              const isChecked = editingAllowedSystems.includes(sys);
                              return (
                                <button
                                  key={sys}
                                  type="button"
                                  onClick={() => {
                                    setEditingAllowedSystems((prev) =>
                                      isChecked ? prev.filter((s) => s !== sys) : [...prev, sys]
                                    );
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                    isChecked
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <span className="w-3 h-3 rounded border flex items-center justify-center text-[9px] bg-white text-purple-600 font-extrabold">
                                    {isChecked ? '✓' : ''}
                                  </span>
                                  <span>{sys}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          גישה מלאה לכלל המערכות באופן מובנה.
                        </p>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{m.fullName}</span>
                          {m.isSuperAdmin && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              מנהל ראשי
                            </span>
                          )}
                        </div>

                        {/* Allowed Systems Badges */}
                        {m.role === 'dev' ? (
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              מערכות מורשות:
                            </span>
                            {(() => {
                              const validSystems = (m.allowedSystems || []).filter((s) => systems.includes(s));
                              if (validSystems.length > 0) {
                                return validSystems.map((sys) => (
                                  <span
                                    key={sys}
                                    className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold"
                                  >
                                    {sys}
                                  </span>
                                ));
                              }
                              return (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  כל המערכות
                                </span>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            גישה מלאה לכלל המערכות
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          m.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : m.role === 'dev'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {m.role === 'admin' ? 'מנהל מערכת' : m.role === 'dev' ? 'מפתח' : 'בודק QA'}
                      </span>

                      {m.isSuperAdmin ? (
                        <div
                          className="p-1 text-slate-400 select-none"
                          title="מנהל-על מוגן (לא ניתן לעריכה או מחיקה ברשימה)"
                        >
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                            title="ערוך הרשאות ומערכות"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(m.id, m.fullName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="הסר איש צוות מהרשימה"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
