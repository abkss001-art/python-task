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
  RotateCcw,
  Mail,
  KeyRound,
  Copy,
  Share2,
  BellRing,
  ArrowRight,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  Send,
  Loader2
} from 'lucide-react';
import { TeamMember } from '../utils/teamMembers';
import { FirebaseUserProfile, TeamRole } from '../types/std';
import { syncService } from '../services/syncService';
import { buildWhatsAppInviteMessage, normalizeLoginEmail } from '../utils/authHelpers';

interface AdminTeamModalProps {
  systems: string[];
  teamMembers: TeamMember[];
  pendingJoinRequestsCount?: number;
  onOpenJoinRequests?: () => void;
  onSaveTeamMembers: (
    members: TeamMember[],
    renameInfo?: { oldName: string; newName: string }
  ) => void;
  onBack?: () => void;
  onClose: () => void;
}

export const AdminTeamModal: React.FC<AdminTeamModalProps> = ({
  systems,
  teamMembers,
  pendingJoinRequestsCount = 0,
  onOpenJoinRequests,
  onSaveTeamMembers,
  onBack,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [userProfiles, setUserProfiles] = useState<FirebaseUserProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(false);

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setMembers(teamMembers);
    }
  }, [teamMembers]);

  const loadCloudUserProfiles = async () => {
    if (!syncService.isFirebaseAuthRequired()) return;
    setIsLoadingProfiles(true);
    try {
      const list = await syncService.fetchAdminUserProfiles();
      setUserProfiles(list);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  useEffect(() => {
    void loadCloudUserProfiles();
  }, []);

  // Resolve login email for any team member by UID first, then normalized fullName
  const emailByMemberKey = useMemo(() => {
    const byUid = new Map<string, string>();
    const byName = new Map<string, string>();
    for (const p of userProfiles) {
      if (p.email) {
        if (p.uid) byUid.set(p.uid, p.email);
        if (p.fullName) byName.set(p.fullName.trim().toLowerCase(), p.email);
      }
    }
    return { byUid, byName };
  }, [userProfiles]);

  const getMemberEmail = (m: TeamMember): string | undefined => {
    if (m.uid && emailByMemberKey.byUid.has(m.uid)) {
      return emailByMemberKey.byUid.get(m.uid);
    }
    return emailByMemberKey.byName.get(m.fullName.trim().toLowerCase());
  };

  // Form state for adding new member (Tab 2)
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>('qa');
  const [newSystemsMode, setNewSystemsMode] = useState<'all' | 'specific'>('all');
  const [newAllowedSystems, setNewAllowedSystems] = useState<string[]>([]);
  const [newAuthEmail, setNewAuthEmail] = useState('');
  const [newAuthPassword, setNewAuthPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isProvisioningAuth, setIsProvisioningAuth] = useState(false);

  // Feedback & invite state
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [sendingResetForId, setSendingResetForId] = useState<string | null>(null);
  const [inviteMessageToShare, setInviteMessageToShare] = useState<{
    fullName: string;
    text: string;
    copied: boolean;
  } | null>(null);

  const isFirebaseAuthActive = syncService.isFirebaseAuthRequired();
  const normalizedNewAuthPreview = useMemo(
    () => normalizeLoginEmail(newAuthEmail),
    [newAuthEmail]
  );

  // Filters state (Tab 1)
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'dev' | 'qa' | 'admin'>('ALL');
  const [systemFilter, setSystemFilter] = useState<string>('ALL');
  const [isSystemFilterOpen, setIsSystemFilterOpen] = useState<boolean>(false);

  // Editing state for an existing member
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingFullName, setEditingFullName] = useState<string>('');
  const [editingRole, setEditingRole] = useState<TeamRole>('qa');
  const [editingAllowedSystems, setEditingAllowedSystems] = useState<string[]>([]);
  const [editingAuthEmail, setEditingAuthEmail] = useState<string>('');
  const [editingAuthPassword, setEditingAuthPassword] = useState<string>('');
  const [isProvisioningEditAuth, setIsProvisioningEditAuth] = useState(false);

  // Deletion confirmation warning state
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (systemFilter !== 'ALL' && !systems.includes(systemFilter)) {
      setSystemFilter('ALL');
    }
  }, [systems, systemFilter]);

  const showToast = (text: string, type: 'ok' | 'err' = 'ok', durationMs = 4000) => {
    setStatusMsg({ type, text });
    if (durationMs > 0) {
      setTimeout(() => {
        setStatusMsg((prev) => (prev?.text === text ? null : prev));
      }, durationMs);
    }
  };

  const memberHasAccessToSystem = (m: TeamMember, sys: string): boolean => {
    if (m.role === 'admin') return true;
    if (!m.allowedSystems || m.allowedSystems.length === 0) return true;
    return m.allowedSystems.includes(sys);
  };

  const getSystemMemberCount = (sys: string) => {
    return members.filter((m) => memberHasAccessToSystem(m, sys)).length;
  };

  const systemFilteredMembers = useMemo(() => {
    if (systemFilter === 'ALL') return members;
    return members.filter((m) => memberHasAccessToSystem(m, systemFilter));
  }, [members, systemFilter]);

  const devCount = systemFilteredMembers.filter((m) => m.role === 'dev').length;
  const qaCount = systemFilteredMembers.filter((m) => m.role === 'qa').length;
  const adminCount = systemFilteredMembers.filter((m) => m.role === 'admin').length;

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return systemFilteredMembers.filter((m) => {
      if (roleFilter !== 'ALL' && m.role !== roleFilter) return false;
      if (!q) return true;
      const memberEmail = (getMemberEmail(m) || '').toLowerCase();
      return m.fullName.toLowerCase().includes(q) || memberEmail.includes(q);
    });
  }, [systemFilteredMembers, roleFilter, searchQuery, emailByMemberKey]);

  const handleCopyEmail = async (memberId: string, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmailId(memberId);
      setTimeout(() => setCopiedEmailId((prev) => (prev === memberId ? null : prev)), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSendPasswordReset = async (m: TeamMember, email: string) => {
    setSendingResetForId(m.id);
    const res = await syncService.sendFirebasePasswordReset(email);
    setSendingResetForId(null);
    if (res.ok) {
      showToast(`קישור לאיפוס סיסמה נשלח בהצלחה אל ${email} (${m.fullName}).`, 'ok', 5000);
    } else {
      showToast(res.error || 'שליחת מייל איפוס הסיסמה נכשלה.', 'err', 5000);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFullName.trim();
    if (cleanName.length < 2) {
      showToast('נא להזין שם מלא (לפחות 2 תווים).', 'err');
      return;
    }

    if (members.some((m) => m.fullName.trim().toLowerCase() === cleanName.toLowerCase())) {
      showToast('איש צוות בשם זה כבר קיים ברשימה.', 'err');
      return;
    }

    const effectiveAllowedSystems =
      newRole !== 'admin' && newSystemsMode === 'specific' ? newAllowedSystems : [];

    if (newRole !== 'admin' && newSystemsMode === 'specific' && effectiveAllowedSystems.length === 0) {
      showToast('בחרת "מערכות ספציפיות" — נא לסמן לפחות מערכת אחת או לבחור "כל המערכות".', 'err');
      return;
    }

    const cleanEmail = newAuthEmail.trim();
    let provisionedUid: string | undefined;
    let provisionedEmail: string | undefined;

    if (isFirebaseAuthActive && cleanEmail) {
      if (newAuthPassword.length < 6) {
        showToast('נדרשת סיסמה ראשונית באורך 6 תווים לפחות.', 'err');
        return;
      }
      setIsProvisioningAuth(true);
      const provRes = await syncService.registerTeamMemberInFirebaseAuth(
        cleanEmail,
        newAuthPassword,
        cleanName,
        newRole,
        effectiveAllowedSystems.length > 0 ? effectiveAllowedSystems : undefined
      );
      setIsProvisioningAuth(false);
      if (!provRes.ok) {
        showToast(provRes.error || 'שגיאה ביצירת החשבון', 'err', 5000);
        return;
      }
      provisionedUid = provRes.uid;
      provisionedEmail = provRes.normalizedEmail || normalizeLoginEmail(cleanEmail).email;
      setInviteMessageToShare({
        fullName: cleanName,
        text: buildWhatsAppInviteMessage({
          fullName: cleanName,
          email: provisionedEmail,
          password: newAuthPassword,
          role: newRole
        }),
        copied: false
      });
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      fullName: cleanName,
      role: newRole,
      ...(provisionedUid ? { uid: provisionedUid } : {}),
      allowedSystems: effectiveAllowedSystems.length > 0 ? effectiveAllowedSystems : undefined
    };

    const nextMembers = [...members, newMember];
    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers);

    if (provisionedUid && provisionedEmail) {
      setUserProfiles((prev) => [
        ...prev.filter((p) => p.uid !== provisionedUid),
        {
          uid: provisionedUid!,
          email: provisionedEmail,
          fullName: cleanName,
          role: newRole
        }
      ]);
    }

    setNewFullName('');
    setNewAuthEmail('');
    setNewAuthPassword('');
    setShowNewPassword(false);
    setNewSystemsMode('all');
    setNewAllowedSystems([]);
    setActiveTab('list');
    showToast(
      isFirebaseAuthActive && cleanEmail
        ? `נוצר חשבון ונוסף לצוות בהצלחה: ${cleanName}`
        : `נוסף לצוות בהצלחה: ${cleanName}`
    );
  };

  const handleStartEdit = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setEditingFullName(m.fullName);
    setEditingRole(m.role);
    setEditingAllowedSystems(m.allowedSystems || []);
    setEditingAuthEmail('');
    setEditingAuthPassword('');
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditingFullName('');
    setEditingAuthEmail('');
    setEditingAuthPassword('');
  };

  const handleSaveEdit = async (id: string) => {
    const cleanName = editingFullName.trim();
    if (!cleanName) {
      showToast('יש להזין שם מלא תקין.', 'err');
      return;
    }

    if (
      members.some(
        (m) => m.id !== id && m.fullName.trim().toLowerCase() === cleanName.toLowerCase()
      )
    ) {
      showToast('איש צוות בשם זה כבר קיים ברשימה.', 'err');
      return;
    }

    const original = members.find((m) => m.id === id);
    const oldName = original ? original.fullName.trim() : '';
    const isRenamed = oldName && oldName !== cleanName;
    const renameInfo = isRenamed ? { oldName, newName: cleanName } : undefined;

    let linkedUid = original?.uid;
    let linkedEmail: string | undefined;
    const cleanEditEmail = editingAuthEmail.trim();
    if (isFirebaseAuthActive && !linkedUid && cleanEditEmail) {
      if (editingAuthPassword.length < 6) {
        showToast('נדרשת סיסמה באורך 6 תווים לפחות.', 'err');
        return;
      }
      setIsProvisioningEditAuth(true);
      const provRes = await syncService.registerTeamMemberInFirebaseAuth(
        cleanEditEmail,
        editingAuthPassword,
        cleanName,
        editingRole,
        editingRole !== 'admin' && editingAllowedSystems.length > 0
          ? editingAllowedSystems
          : undefined
      );
      setIsProvisioningEditAuth(false);
      if (!provRes.ok) {
        showToast(provRes.error || 'שגיאה ביצירת החשבון', 'err', 5000);
        return;
      }
      linkedUid = provRes.uid;
      linkedEmail = provRes.normalizedEmail || normalizeLoginEmail(cleanEditEmail).email;
      setInviteMessageToShare({
        fullName: cleanName,
        text: buildWhatsAppInviteMessage({
          fullName: cleanName,
          email: linkedEmail,
          password: editingAuthPassword,
          role: editingRole
        }),
        copied: false
      });
    }

    const nextMembers = members.map((m) => {
      if (m.id !== id) return m;
      return {
        ...m,
        fullName: cleanName,
        role: editingRole,
        ...(linkedUid ? { uid: linkedUid } : {}),
        allowedSystems:
          editingRole !== 'admin' && editingAllowedSystems.length > 0
            ? editingAllowedSystems
            : undefined
      };
    });

    if (linkedUid && linkedEmail) {
      setUserProfiles((prev) => [
        ...prev.filter((p) => p.uid !== linkedUid),
        {
          uid: linkedUid!,
          email: linkedEmail,
          fullName: cleanName,
          role: editingRole
        }
      ]);
    }

    setMembers(nextMembers);
    onSaveTeamMembers(nextMembers, renameInfo);
    setEditingMemberId(null);
    setEditingFullName('');
    setEditingAuthEmail('');
    setEditingAuthPassword('');
    showToast(
      linkedUid && cleanEditEmail
        ? `נוצר וקישר חשבון עבור "${cleanName}" והרשאותיו עודכנו!`
        : isRenamed
        ? `השם עודכן ל-"${cleanName}" וסונכרן בכל הדיווחים וההערות במערכת!`
        : 'פרטי איש הצוות וההרשאות עודכנו בהצלחה!'
    );
  };

  const handleRequestDelete = (m: TeamMember) => {
    if (m.isSuperAdmin) {
      showToast('לא ניתן למחוק את מנהל-העל מהרשימה.', 'err');
      return;
    }
    if (members.length <= 1) {
      showToast('חייב להישאר לפחות איש צוות אחד ברשימה.', 'err');
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
    showToast(`איש הצוות ${name} הוסר מהרשימה.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-l from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור שלב אחד אחורה"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold truncate">ניהול חברי צוות והרשאות מערכת</h3>
              <p className="text-xs text-slate-300 dark:text-slate-400 truncate">
                עיון בצוות, כתובות התחברות, הקצאת מערכות והוספת עובדים חדשים
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0 transition"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean 2-Tab Navigation Bar */}
        <div className="px-5 sm:px-6 pt-3.5 pb-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/75 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>חברי הצוות</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'list'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-300/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {members.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>הוספת איש צוות חדש</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {pendingJoinRequestsCount > 0 && onOpenJoinRequests && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-rose-900 dark:text-rose-200">
                <BellRing className="w-4 h-4 text-rose-600 animate-bounce shrink-0" />
                <span>
                  ממתינות {pendingJoinRequestsCount} בקשות הצטרפות חדשות מעובדים שמחכים לאישור שלך!
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenJoinRequests();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer transition"
              >
                פתח בקשות
              </button>
            </div>
          )}

          {inviteMessageToShare && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>הזמנה מוכנה לשליחה בוואטסאפ עבור {inviteMessageToShare.fullName}:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteMessageToShare(null)}
                  className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 text-[11px] font-sans whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed">
                {inviteMessageToShare.text}
              </pre>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteMessageToShare.text);
                      setInviteMessageToShare((prev) => (prev ? { ...prev, copied: true } : null));
                    } catch {
                      // ignore
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  {inviteMessageToShare.copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {inviteMessageToShare.copied
                      ? 'הועתק! הדבק בוואטסאפ'
                      : 'העתק הזמנה לוואטסאפ'}
                  </span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(inviteMessageToShare.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>פתח בוואטסאפ</span>
                </a>
              </div>
            </div>
          )}

          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                statusMsg.type === 'err'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'
              }`}
            >
              {statusMsg.type === 'err' ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: TEAM DIRECTORY & PERMISSIONS MANAGEMENT */}
          {activeTab === 'list' ? (
            <div className="space-y-3.5">
              {/* Compact Search + Role Pills + Collapsible System Filter */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Quick Search by Name or Email */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חפש לפי שם מלא או אימייל התחברות..."
                      className="w-full pr-9 pl-8 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                        aria-label="נקה חיפוש"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Collapsible System Filter Toggle */}
                  {systems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsSystemFilterOpen((prev) => !prev)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
                        systemFilter !== 'ALL'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="bidi-isolate">
                        {systemFilter === 'ALL' ? 'סינון לפי מערכת' : `מערכת: ${systemFilter}`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSystemFilterOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Collapsible System Filter Chips */}
                {isSystemFilterOpen && systems.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSystemFilter('ALL')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
                  </div>
                )}

                {/* Spacious Non-Truncating Role Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    מציג {filteredMembers.length} מתוך {members.length} חברי צוות
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRoleFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        roleFilter === 'ALL'
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>הכל</span>
                      <span className="text-[10px] opacity-80 font-mono">
                        ({systemFilteredMembers.length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFilter('qa')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        roleFilter === 'qa'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/70 hover:bg-sky-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>בודקים</span>
                      <span className="text-[10px] opacity-80 font-mono">({qaCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFilter('dev')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        roleFilter === 'dev'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/70 hover:bg-purple-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5 shrink-0" />
                      <span>מפתחים</span>
                      <span className="text-[10px] opacity-80 font-mono">({devCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFilter('admin')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        roleFilter === 'admin'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/70 hover:bg-amber-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>מנהלים</span>
                      <span className="text-[10px] opacity-80 font-mono">({adminCount})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Members Directory List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {filteredMembers.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-500 dark:text-slate-400 font-medium space-y-2">
                    <p>לא נמצאו אנשי צוות התואמים לחיפוש או לסינון הנוכחי.</p>
                    {(systemFilter !== 'ALL' || roleFilter !== 'ALL' || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSystemFilter('ALL');
                          setRoleFilter('ALL');
                          setSearchQuery('');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>נקה את כל הסינונים</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredMembers.map((m) => {
                    const isEditing = editingMemberId === m.id;
                    const memberEmail = getMemberEmail(m);

                    if (isEditing) {
                      return (
                        <div
                          key={m.id}
                          className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 space-y-3 animate-in fade-in"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>עריכת פרטי איש צוות: {m.fullName}</span>
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                disabled={isProvisioningEditAuth}
                                onClick={() => handleSaveEdit(m.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{isProvisioningEditAuth ? 'יוצר חשבון...' : 'שמור שינויים'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
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
                              שינוי השם יסנכרן אוטומטית את כל הדיווחים, ההערות ויומן הפעולות של איש הצוות.
                            </p>
                          </div>

                          {/* Edit Role */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                              תפקיד:
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingRole('qa')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                editingRole === 'admin'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              מנהל
                            </button>
                          </div>

                          {/* Edit Allowed Systems */}
                          {editingRole !== 'admin' ? (
                            <div
                              className={`p-3 rounded-xl border space-y-2 ${
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
                                    נקה (כל המערכות)
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
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
                                  ? 'כאשר לא נבחרה אף מערכת — תהיה גישה לכלל המערכות כברירת מחדל.'
                                  : `מוגבל ל-${editingAllowedSystems.length} מערכות מורשות בלבד.`}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              מנהל מערכת – גישה מלאה לכלל המערכות באופן מובנה.
                            </p>
                          )}

                          {/* Linked account info / provisioning */}
                          {isFirebaseAuthActive && (
                            <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-2">
                              {m.uid ? (
                                <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 flex-wrap">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>חשבון פעיל ומקושר</span>
                                  {memberEmail && (
                                    <span className="font-mono text-emerald-900 dark:text-emerald-200" dir="ltr">
                                      ({memberEmail})
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-200">
                                    יצירת פרטי התחברות לאיש הצוות (אימייל + סיסמה):
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      inputMode="email"
                                      dir="ltr"
                                      value={editingAuthEmail}
                                      onChange={(e) => setEditingAuthEmail(e.target.value)}
                                      placeholder="david או name@gmail.com"
                                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-left text-slate-900 dark:text-slate-100"
                                    />
                                    <input
                                      type="password"
                                      dir="ltr"
                                      value={editingAuthPassword}
                                      onChange={(e) => setEditingAuthPassword(e.target.value)}
                                      placeholder="סיסמה ראשונית (6+ תווים)"
                                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-left text-slate-900 dark:text-slate-100"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border ${
                              m.role === 'admin'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : m.role === 'dev'
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                            }`}
                          >
                            {m.role === 'admin' ? (
                              <UserCheck className="w-4 h-4" />
                            ) : m.role === 'dev' ? (
                              <Code className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            {/* Name + SuperAdmin Badge */}
                            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                              <span>{m.fullName}</span>
                              {m.isSuperAdmin && (
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                  מנהל ראשי
                                </span>
                              )}
                            </div>

                            {/* Login Email Row with 1-Click Copy & Password Reset (Tip 1!) */}
                            {isFirebaseAuthActive && (
                              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                                {memberEmail ? (
                                  <>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[11px]">
                                      <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                                      <span dir="ltr" className="select-all">
                                        {memberEmail}
                                      </span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyEmail(m.id, memberEmail)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold cursor-pointer transition"
                                      title="העתק כתובת אימייל התחברות"
                                    >
                                      {copiedEmailId === m.id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span className="text-emerald-700 dark:text-emerald-400">הועתק</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>העתק</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={sendingResetForId === m.id}
                                      onClick={() => handleSendPasswordReset(m, memberEmail)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold disabled:opacity-60 cursor-pointer transition"
                                      title="שלח מייל איפוס סיסמה לכתובת זו"
                                    >
                                      {sendingResetForId === m.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Send className="w-3 h-3" />
                                      )}
                                      <span>איפוס סיסמה</span>
                                    </button>
                                  </>
                                ) : isLoadingProfiles ? (
                                  <span className="text-[11px] text-slate-400">טוען אימייל התחברות...</span>
                                ) : (
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                    ללא אימייל התחברות מקושר
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Allowed Systems Badges */}
                            {m.role === 'admin' ? (
                              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                גישה מלאה לכלל המערכות
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
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
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold bidi-isolate ${
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
                                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                                      כל המערכות
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Role Badge + Actions */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap ${
                              m.role === 'admin'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : m.role === 'dev'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
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
                              className="p-1.5 text-slate-400 select-none"
                              title="מנהל-על מוגן (לא ניתן לעריכה או מחיקה ברשימה)"
                            >
                              <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(m)}
                                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="ערוך שם, תפקיד והרשאות מערכת"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestDelete(m)}
                                className="p-2 rounded-xl text-slate-500 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="מחק איש צוות מהמערכת"
                              >
                                <Trash2 className="w-4 h-4" />
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
          ) : (
            /* TAB 2: CLEAN STEP-BY-STEP ADD MEMBER FORM */
            <form onSubmit={handleAddMember} className="space-y-4">
              {/* Step 1: Member Identity & Login Credentials */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black shrink-0">
                    1
                  </span>
                  <span>פרטי העובד וההתחברות</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    שם מלא (פרטי ומשפחה) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="למשל: דוד כהן"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold"
                  />
                </div>

                {isFirebaseAuthActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        אימייל או שם משתמש להתחברות
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          inputMode="email"
                          dir="ltr"
                          value={newAuthEmail}
                          onChange={(e) => setNewAuthEmail(e.target.value)}
                          placeholder="david או member@gmail.com"
                          className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono text-left text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        />
                      </div>
                      {normalizedNewAuthPreview.usedDefaultDomain && normalizedNewAuthPreview.email && (
                        <p className="mt-1 text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold">
                          כתובת מלאה:{' '}
                          <span className="font-mono font-bold" dir="ltr">
                            {normalizedNewAuthPreview.email}
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        סיסמה ראשונית (6+ תווים)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          dir="ltr"
                          value={newAuthPassword}
                          onChange={(e) => setNewAuthPassword(e.target.value)}
                          disabled={isProvisioningAuth}
                          placeholder="בחר סיסמה..."
                          className="w-full pr-9 pl-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono text-left text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                          aria-label={showNewPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Role Selection */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black shrink-0">
                    2
                  </span>
                  <span>בחר תפקיד במערכת</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewRole('qa')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      newRole === 'qa'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>בודק QA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('dev')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      newRole === 'dev'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Code className="w-4 h-4 shrink-0" />
                    <span>מפתח</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      newRole === 'admin'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>מנהל</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Allowed Systems (Clean All vs Specific toggle!) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black shrink-0">
                      3
                    </span>
                    <span>מערכות מורשות</span>
                  </div>

                  {newRole !== 'admin' && systems.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setNewSystemsMode('all');
                          setNewAllowedSystems([]);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          newSystemsMode === 'all'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        כל המערכות
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSystemsMode('specific')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          newSystemsMode === 'specific'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        בחירה ספציפית
                      </button>
                    </div>
                  )}
                </div>

                {newRole === 'admin' ? (
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>מנהל מערכת מקבל גישה מלאה לכלל המערכות וכלי הניהול באופן אוטומטי.</span>
                  </div>
                ) : newSystemsMode === 'all' ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ל{newRole === 'dev' ? 'מפתח' : 'בודק'} תהיה גישה לכל המערכות הפעילות. אם ברצונך להגביל למערכת מסוימת — לחץ על <strong>בחירה ספציפית</strong>.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1 animate-in fade-in">
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              isChecked
                                ? newRole === 'dev'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-sky-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {newAllowedSystems.length === 0
                        ? 'סמן לפחות מערכת אחת מרשימת המערכות.'
                        : `נבחרו ${newAllowedSystems.length} מערכות מורשות בלבד.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Natural Bottom Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
                >
                  חזרה לרשימת הצוות
                </button>
                <button
                  type="submit"
                  disabled={isProvisioningAuth}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition"
                >
                  {isProvisioningAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>יוצר חשבון...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {isFirebaseAuthActive && newAuthEmail.trim()
                          ? 'צור חשבון והוסף לצוות'
                          : 'הוסף לצוות'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {activeTab === 'list' ? (
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold cursor-pointer transition shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ הוסף איש צוות</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
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
