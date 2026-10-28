import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { TeamMember } from '../utils/teamMembers';
import { TeamRole } from '../types/std';

interface AdminTeamModalProps {
  systems: string[];
  teamMembers: TeamMember[];
  onSaveTeamMembers: (
    members: TeamMember[],
    renameInfo?: { oldName: string; newName: string }
  ) => void;
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

  // Form state for adding new member
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>('qa');
  const [newAllowedSystems, setNewAllowedSystems] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Filters state: role filter + system filter
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'dev' | 'qa' | 'admin'>('ALL');
  const [systemFilter, setSystemFilter] = useState<string>('ALL');

  // Editing state for an existing member
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingFullName, setEditingFullName] = useState<string>('');
  const [editingRole, setEditingRole] = useState<TeamRole>('qa');
  const [editingAllowedSystems, setEditingAllowedSystems] = useState<string[]>([]);

  // Deletion confirmation warning state
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Sync systemFilter if systems change (e.g. system was deleted from workspace)
  useEffect(() => {
    if (systemFilter !== 'ALL' && !systems.includes(systemFilter)) {
      setSystemFilter('ALL');
    }
  }, [systems, systemFilter]);

  // Helper to determine if a member has access to a specific system
  const memberHasAccessToSystem = (m: TeamMember, sys: string): boolean => {
    // Admin has access to all systems
    if (m.role === 'admin') return true;
    // If allowedSystems is undefined or empty, the member has access to all systems
    if (!m.allowedSystems || m.allowedSystems.length === 0) return true;
    // If allowedSystems is defined, check if sys is in allowedSystems
    return m.allowedSystems.includes(sys);
  };

  // Helper to count how many members have access to each system
  const getSystemMemberCount = (sys: string) => {
    return members.filter((m) => memberHasAccessToSystem(m, sys)).length;
  };

  // First filter by system
  const systemFilteredMembers = useMemo(() => {
    if (systemFilter === 'ALL') return members;
    return members.filter((m) => memberHasAccessToSystem(m, systemFilter));
  }, [members, systemFilter]);

  // Dynamic role counts based on the current system filter!
  const devCount = systemFilteredMembers.filter((m) => m.role === 'dev').length;
  const qaCount = systemFilteredMembers.filter((m) => m.role === 'qa').length;
  const adminCount = systemFilteredMembers.filter((m) => m.role === 'admin').length;

  // Final filtered members list (System Filter + Role Filter)
  const filteredMembers = useMemo(() => {
    return systemFilteredMembers.filter((m) => {
      if (roleFilter === 'ALL') return true;
      return m.role === roleFilter;
    });
  }, [systemFilteredMembers, roleFilter]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFullName.trim();
    if (!cleanName) return;

    if (members.some((m) => m.fullName.trim().toLowerCase() === cleanName.toLowerCase())) {
      setStatusMsg('איש צוות בשם זה כבר קיים ברשימה.');
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      fullName: cleanName,
      role: newRole,
      allowedSystems:
        newRole !== 'admin' && newAllowedSystems.length > 0
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
    setEditingFullName(m.fullName);
    setEditingRole(m.role);
    setEditingAllowedSystems(m.allowedSystems || []);
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditingFullName('');
  };

  const handleSaveEdit = (id: string) => {
    const cleanName = editingFullName.trim();
    if (!cleanName) {
      setStatusMsg('יש להזין שם מלא תקין.');
      return;
    }

    if (
      members.some(
        (m) => m.id !== id && m.fullName.trim().toLowerCase() === cleanName.toLowerCase()
      )
    ) {
      setStatusMsg('איש צוות בשם זה כבר קיים ברשימה.');
      return;
    }

    const original = members.find((m) => m.id === id);
    const oldName = original ? original.fullName.trim() : '';
    const isRenamed = oldName && oldName !== cleanName;
    const renameInfo = isRenamed ? { oldName, newName: cleanName } : undefined;

    const nextMembers = members.map((m) => {
      if (m.id !== id) return m;
      return {
        ...m,
        fullName: cleanName,
        role: editingRole,
        allowedSystems:
          editingRole !== 'admin' && editingAllowedSystems.length > 0
            ? editingAllowedSystems
            : undefined
      };
    });

    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers, renameInfo);
    setEditingMemberId(null);
    setEditingFullName('');
    setStatusMsg(
      isRenamed
        ? `השם עודכן ל-"${cleanName}" וסונכרן בהצלחה בכל הדיווחים וההערות במערכת!`
        : 'פרטי איש הצוות וההרשאות עודכנו בהצלחה!'
    );
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleRequestDelete = (m: TeamMember) => {
    if (m.isSuperAdmin) {
      setStatusMsg(
        'לא ניתן למחוק את מנהל-העל מהרשימה. שינוי שמו מתבצע באזור ניהול אבטחה באמצעות קוד-העל.'
      );
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }
    if (members.length <= 1) {
      setStatusMsg('חייב להישאר לפחות איש צוות אחד ברשימה.');
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }
    setMemberToDelete(m);
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    const id = memberToDelete.id;
    const name = memberToDelete.fullName;
    setMemberToDelete(null);

    const nextMembers = members.filter((m) => m.id !== id);
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);
    setStatusMsg(`איש הצוות ${name} הוסר מהרשימה.`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-extrabold">ניהול חברי צוות והרשאות מערכת</h3>
              <p className="text-xs text-slate-300 dark:text-slate-400">
                עריכת שמות, הקצאת מערכות מורשות לבודקים ומפתחים וניהול הגישה
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
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Add Member Form */}
          <form
            onSubmit={handleAddMember}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>הוספת איש צוות חדש:</span>
              </span>
            </div>

            {/* Row 1: Name Input & Submit Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="הכנס שם מלא (פרטי ומשפחה)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-semibold shadow-2xs"
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
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                בחר תפקיד:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewRole('qa')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    newRole === 'qa'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>מנהל</span>
                </button>
              </div>
            </div>

            {/* Role-Specific Systems Picker (available for Dev and QA!) */}
            {newRole === 'dev' || newRole === 'qa' ? (
              <div
                className={`p-3 rounded-xl space-y-2 animate-in fade-in border ${
                  newRole === 'dev'
                    ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                    : 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      newRole === 'dev'
                        ? 'text-purple-900 dark:text-purple-300'
                        : 'text-sky-900 dark:text-sky-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      מערכות מורשות ({newRole === 'dev' ? 'למפתח' : 'לבחירת מערכות הבודק'}):
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewAllowedSystems([...systems])}
                      className={`text-[11px] font-bold hover:underline cursor-pointer ${
                        newRole === 'dev'
                          ? 'text-purple-700 dark:text-purple-400'
                          : 'text-sky-700 dark:text-sky-400'
                      }`}
                    >
                      בחר הכל
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setNewAllowedSystems([])}
                      className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
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
                            ? newRole === 'dev'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-sky-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center text-[10px] bg-white dark:bg-slate-900 font-extrabold">
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className="bidi-isolate">{sys}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {newAllowedSystems.length === 0
                    ? `💡 אם לא סומנה אף מערכת, ${
                        newRole === 'dev' ? 'המפתח' : 'הבודק'
                      } יוכל לפעול בכל המערכות כברירת מחדל.`
                    : `סומנו ${newAllowedSystems.length} מערכות מורשות: הגישה תוגבל אך ורק למערכות אלו.`}
                </p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>מנהל מערכת – גישה מלאה לכלל המערכות וכלי הניהול באופן מובנה.</span>
              </div>
            )}
          </form>

          {/* Filters & Team Members List */}
          <div className="space-y-3 pt-1">
            {/* 1. System Filter Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>סינון לפי מערכת:</span>
                </span>
                {systemFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSystemFilter('ALL')}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>הצג את כל המערכות</span>
                  </button>
                )}
              </div>

              {/* Horizontal pills for systems */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSystemFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    systemFilter === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>כלל המערכות</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      systemFilter === 'ALL'
                        ? 'bg-indigo-800 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {members.length}
                  </span>
                </button>

                {systems.map((sys) => {
                  const count = getSystemMemberCount(sys);
                  const isSelected = systemFilter === sys;
                  return (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setSystemFilter(sys)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="bidi-isolate">{sys}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                          isSelected
                            ? 'bg-indigo-800 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {systemFilter !== 'ALL' && (
                <div className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span>
                    מסנן צוות במערכת <strong>{systemFilter}</strong>: סה"כ{' '}
                    <strong>{systemFilteredMembers.length}</strong> חברי צוות מורשים
                  </span>
                </div>
              )}
            </div>

            {/* 2. Role Filter Tabs (Developers / QA / Admins) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                חברי צוות ({filteredMembers.length} מתוך {members.length}):
              </span>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setRoleFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    roleFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>הכל</span>
                  <span className="text-[10px] opacity-75">
                    ({systemFilteredMembers.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('dev')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    roleFilter === 'dev'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>מפתחים</span>
                  <span className="text-[10px] opacity-75">({devCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('qa')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    roleFilter === 'qa'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>בודקים</span>
                  <span className="text-[10px] opacity-75">({qaCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('admin')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    roleFilter === 'admin'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>מנהלים</span>
                  <span className="text-[10px] opacity-75">({adminCount})</span>
                </button>
              </div>
            </div>

            {/* 3. Members List Container */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden max-h-80 overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium space-y-2">
                  <p>לא נמצאו אנשי צוות התואמים לסינון הנוכחי.</p>
                  {(systemFilter !== 'ALL' || roleFilter !== 'ALL') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSystemFilter('ALL');
                        setRoleFilter('ALL');
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      נקה את כל הסינונים
                    </button>
                  )}
                </div>
              ) : (
                filteredMembers.map((m) => {
                  const isEditing = editingMemberId === m.id;

                  if (isEditing) {
                    return (
                      <div
                        key={m.id}
                        className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 space-y-3 animate-in fade-in"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>עריכת פרטי איש צוות: {m.fullName}</span>
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(m.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>שמור שינויים</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                            >
                              ביטול
                            </button>
                          </div>
                        </div>

                        {/* Edit Full Name */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            שם מלא (פרטי ומשפחה):
                          </label>
                          <input
                            type="text"
                            value={editingFullName}
                            onChange={(e) => setEditingFullName(e.target.value)}
                            placeholder="שם מלא..."
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-500 dark:text-slate-300 mt-1">
                            💡 שינוי השם יסנכרן באופן אוטומטי את כל הדיווחים, ההערות ויומן הפעולות של איש הצוות.
                          </p>
                        </div>

                        {/* Edit Role */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                            תפקיד:
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingRole('qa')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              editingRole === 'qa'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            בודק QA
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRole('dev')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              editingRole === 'dev'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            מפתח
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRole('admin')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              editingRole === 'admin'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            מנהל
                          </button>
                        </div>

                        {/* Edit Allowed Systems (for both Dev and QA!) */}
                        {editingRole !== 'admin' ? (
                          <div
                            className={`p-2.5 rounded-xl border space-y-2 ${
                              editingRole === 'dev'
                                ? 'bg-purple-50/60 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                                : 'bg-sky-50/60 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                            }`}
                          >
                            <div
                              className={`flex items-center justify-between text-xs font-bold ${
                                editingRole === 'dev'
                                  ? 'text-purple-900 dark:text-purple-300'
                                  : 'text-sky-900 dark:text-sky-300'
                              }`}
                            >
                              <span>
                                מערכות מורשות ({editingRole === 'dev' ? 'מפתח' : 'בודק QA'}):
                              </span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingAllowedSystems([...systems])}
                                  className="text-[11px] font-bold hover:underline cursor-pointer"
                                >
                                  בחר הכל
                                </button>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <button
                                  type="button"
                                  onClick={() => setEditingAllowedSystems([])}
                                  className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
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
                                        isChecked
                                          ? prev.filter((s) => s !== sys)
                                          : [...prev, sys]
                                      );
                                    }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                      isChecked
                                        ? editingRole === 'dev'
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-sky-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                  >
                                    <span className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center text-[9px] bg-white dark:bg-slate-900 font-extrabold">
                                      {isChecked ? '✓' : ''}
                                    </span>
                                    <span className="bidi-isolate">{sys}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {editingAllowedSystems.length === 0
                                ? '💡 אם לא סומנה אף מערכת, תהיה גישה לכלל המערכות כברירת מחדל.'
                                : `מוגבל ל-${editingAllowedSystems.length} מערכות מורשות בלבד.`}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                            מנהל מערכת – גישה מלאה לכלל המערכות באופן מובנה.
                          </p>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{m.fullName}</span>
                            {m.isSuperAdmin && (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                                מנהל ראשי
                              </span>
                            )}
                          </div>

                          {/* Allowed Systems Badges */}
                          {m.role === 'admin' ? (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                              גישה מלאה לכלל המערכות
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-slate-500 dark:text-slate-300 font-semibold">
                                מערכות מורשות:
                              </span>
                              {(() => {
                                const validSystems = (m.allowedSystems || []).filter((s) =>
                                  systems.includes(s)
                                );
                                if (validSystems.length > 0) {
                                  return validSystems.map((sys) => {
                                    const isHighlighted = systemFilter === sys;
                                    return (
                                      <span
                                        key={sys}
                                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold bidi-isolate ${
                                          m.role === 'dev'
                                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                            : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                        } ${isHighlighted ? 'ring-2 ring-indigo-500' : ''}`}
                                      >
                                        {sys}
                                      </span>
                                    );
                                  });
                                }
                                return (
                                  <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">
                                    כל המערכות
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            m.role === 'admin'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : m.role === 'dev'
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                              : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          }`}
                        >
                          {m.role === 'admin'
                            ? 'מנהל מערכת'
                            : m.role === 'dev'
                            ? 'מפתח'
                            : 'בודק QA'}
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
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="ערוך שם, תפקיד והרשאות מערכת"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestDelete(m)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="מחק איש צוות מהמערכת"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>

      {/* Warning Confirmation Modal Before Deleting a Member */}
      {memberToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  האם למחוק את איש הצוות?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  אתה עומד למחוק את <strong>{memberToDelete.fullName}</strong> (
                  {memberToDelete.role === 'admin'
                    ? 'מנהל מערכת'
                    : memberToDelete.role === 'dev'
                    ? 'מפתח'
                    : 'בודק QA'}
                  ) מרשימת הצוות.
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  פעולה זו תבטל את הרשאת הכניסה שלו למערכת. (כל הדיווחים וההערות הקודמות שלו יישמרו בהיסטוריה).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>כן, מחק איש צוות</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
