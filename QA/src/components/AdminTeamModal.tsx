import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Trash2, CheckCircle2, ShieldCheck, Code, UserCheck, Lock, ShieldAlert } from 'lucide-react';
import { TeamMember } from '../utils/teamMembers';
import { TeamRole } from '../types/std';

interface AdminTeamModalProps {
  teamMembers: TeamMember[];
  onSaveTeamMembers: (members: TeamMember[]) => void;
  onClose: () => void;
}

export const AdminTeamModal: React.FC<AdminTeamModalProps> = ({
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
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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
      role: newRole
    };

    const nextMembers = [...members, newMember];
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);
    setNewFullName('');
    setStatusMsg(`נוסף בהצלחה: ${cleanName}`);
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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-extrabold">ניהול חברי צוות (מנהל)</h3>
              <p className="text-xs text-slate-300">
                הגדרת רשימת השמות המורשים להתחברות במערכת (מניעת שמות מומצאים)
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
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Add Member Form */}
          <form
            onSubmit={handleAddMember}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3"
          >
            <div className="text-xs font-extrabold text-slate-800">הוספת איש צוות חדש:</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="שם מלא (למשל: דניאל כהן)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewRole('qa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    newRole === 'qa'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>בודק QA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole('dev')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    newRole === 'dev'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>מפתח</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    newRole === 'admin'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>מנהל</span>
                </button>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>הוסף לצוות</span>
              </button>
            </div>
          </form>

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span>חברי צוות מורשים ({members.length}):</span>
              <span className="text-[11px] text-slate-400">השמות מופיעים בהשלמה האוטומטית בכניסה</span>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden max-h-64 overflow-y-auto">
              {members.map((m) => (
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
                      <div className="text-[10px] text-slate-500">
                        {m.role === 'admin'
                          ? 'הרשאות ניהול מערכת מלאות'
                          : m.role === 'dev'
                          ? 'צוות פיתוח'
                          : 'צוות בדיקות מדור נחשון'}
                      </div>
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
                        title="מנהל-על מוגן (לא ניתן למחיקה ברשימה)"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id, m.fullName)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="הסר איש צוות מהרשימה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
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
