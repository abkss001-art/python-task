import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  DEFAULT_SYSTEMS,
  StdAuditEntry,
  StdComment,
  StdIssue,
  StdPlatform,
  StdSeverity,
  StdStatus,
  SyncStatusInfo
} from './types/std';
import { syncService, isSystemAdminAction } from './services/syncService';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { SmartTableView } from './components/SmartTableView';
import { KanbanBoard } from './components/KanbanBoard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { IssueFormModal } from './components/IssueFormModal';
import { LightboxModal } from './components/LightboxModal';
import { FirebaseSetupModal } from './components/FirebaseSetupModal';
import { AdminReportModal } from './components/AdminReportModal';
import { AdminBackupModal } from './components/AdminBackupModal';
import { AdminTeamModal } from './components/AdminTeamModal';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import { AdminSystemManageModal } from './components/AdminSystemManageModal';
import { AdminToolsModal } from './components/AdminToolsModal';
import { SystemSelectorHome } from './components/SystemSelectorHome';
import { LoginScreen, AuthenticatedUser } from './components/LoginScreen';
import {
  TeamMember,
  getStoredTeamMembers,
  saveStoredTeamMembers,
  mergeCloudTeamMembers,
  saveRememberedLogin
} from './utils/teamMembers';
import { extractImagesFromClipboardEvent } from './utils/imageUtils';
import {
  getNotificationPermissionState,
  loadNotificationPreferences,
  NotificationPreferences,
  registerPwaServiceWorker,
  requestAppNotificationPermission,
  saveNotificationPreferences,
  sendSystemNotification
} from './utils/notificationUtils';
import {
  Plus,
  Radio,
  Sparkles,
  CheckCircle2,
  ClipboardPaste,
  X,
  AlertTriangle,
  Archive,
  RotateCcw,
  Trash2,
  Eye,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Download,
  Smartphone,
  ShieldAlert,
  FolderPlus,
  Home,
  ArrowLeft,
  Layers,
  ChevronDown,
  Check,
  Flame
} from 'lucide-react';
import {
  computeUserAuthSignature,
  isAdminAccessCode,
  verifyUserAuthSignature,
  getStoredSecurityConfig,
  mergeCloudSecurityConfig
} from './utils/securityUtils';

const AUTH_STORAGE_KEY = 'std_qa_auth_user_v1';
const LAST_ACTIVE_SYSTEM_KEY = 'std_qa_last_active_system_v1';

export function App() {
  const [systems, setSystems] = useState<string[]>(DEFAULT_SYSTEMS);
  const [archivedSystems, setArchivedSystems] = useState<string[]>([]);
  const [activeSystem, setActiveSystem] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LAST_ACTIVE_SYSTEM_KEY);
      if (saved && saved !== 'HOME' && saved !== 'ALL') {
        return saved;
      }
    } catch {}
    return 'HOME';
  });
  const [issues, setIssues] = useState<StdIssue[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo>(syncService.getStatus());

  // Authenticated User State (First Name + Last Name + Role from Password + Tamper-Proof Signature)
  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AuthenticatedUser;
        if (
          parsed &&
          parsed.firstName &&
          parsed.lastName &&
          parsed.fullName &&
          parsed.role &&
          parsed.fullName !== 'בודק צוות'
        ) {
          if (!parsed.authSignature) {
            parsed.authSignature = computeUserAuthSignature(parsed);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
            return parsed;
          }
          if (verifyUserAuthSignature(parsed)) {
            return parsed;
          }
          // If localStorage was tampered with in DevTools (e.g. changing isAdmin: true), downgrade to non-admin
          const downgraded: AuthenticatedUser = {
            ...parsed,
            isAdmin: false
          };
          downgraded.authSignature = computeUserAuthSignature(downgraded);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(downgraded));
          return downgraded;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Dismissible banners state (shown on entry, each has its own X button)
  const [showShortcutBanner, setShowShortcutBanner] = useState<boolean>(true);
  const [dismissedLastEventText, setDismissedLastEventText] = useState<string | null>(null);

  // PWA Install Prompt & Notification Preferences State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(() =>
    loadNotificationPreferences()
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return getNotificationPermissionState() === 'granted';
  });
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('tzavman_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tzavman_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Filters & View Mode (Default is Smart Table 'table' for everyone)
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<StdPlatform | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<StdStatus | 'ALL'>('ALL');
  const [quickPreset, setQuickPreset] = useState<'ALL' | 'MY_ISSUES' | 'CRITICAL'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'kanban'>('table');

  // Modals State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<StdIssue | null>(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  // Confirmation, Archive, Admin Report & Backup Modals
  const [issueToDelete, setIssueToDelete] = useState<StdIssue | null>(null);
  const [systemToRemove, setSystemToRemove] = useState<string | null>(null);
  const [systemToManage, setSystemToManage] = useState<string | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [isAdminReportOpen, setIsAdminReportOpen] = useState<boolean>(false);
  const [isAdminBackupOpen, setIsAdminBackupOpen] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isAdminSecurityOpen, setIsAdminSecurityOpen] = useState<boolean>(false);
  const [isAdminToolsOpen, setIsAdminToolsOpen] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => getStoredTeamMembers());

  // Live Notification Toast & Highlight
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(null);
  const [isSystemSwitcherOpen, setIsSystemSwitcherOpen] = useState(false);
  const systemSwitcherRef = useRef<HTMLDivElement>(null);

  // Close system switcher on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        systemSwitcherRef.current &&
        !systemSwitcherRef.current.contains(e.target as Node)
      ) {
        setIsSystemSwitcherOpen(false);
      }
    };
    if (isSystemSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSystemSwitcherOpen]);
  const prevIssuesRef = useRef<StdIssue[]>([]);
  const hasLoadedInitialStateRef = useRef<boolean>(false);

  const isAdmin = Boolean(authUser?.isAdmin);
  const currentUserName = authUser?.fullName || 'חבר צוות';
  const currentUserRole = authUser?.role || 'qa';
  const userTeamTitle = isAdmin ? 'מנהל מערכת' : currentUserRole === 'dev' ? 'צוות פיתוח' : 'צוות בדיקות';
  const formattedUserDisplay = `${currentUserName} ${userTeamTitle}`;
  // QA testers and Admins can create/edit issues; Developers (1111) only update status and add comments
  const canCreateOrEdit = Boolean(authUser && (authUser.isAdmin || authUser.role === 'qa'));

  // Register Service Worker and capture PWA install prompt
  useEffect(() => {
    registerPwaServiceWorker();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    syncService.init();

    const unsubState = syncService.subscribeState((state, isRemoteUpdate) => {
      if (isRemoteUpdate && hasLoadedInitialStateRef.current && state.issues.length > 0) {
        const activePrefs = loadNotificationPreferences();

        // Detect if a brand new issue was added!
        const newlyAddedIssue = state.issues.find(
          (incoming) => !prevIssuesRef.current.some((p) => p.id === incoming.id)
        );

        if (newlyAddedIssue) {
          setHighlightedIssueId(newlyAddedIssue.id);
          setTimeout(() => setHighlightedIssueId(null), 3500);
          if (activePrefs.enabled && activePrefs.notifyOnNewIssue) {
            sendSystemNotification(
              `🚨 תקלה חדשה עלתה ב"צב מן" (${newlyAddedIssue.system})`,
              `תסריט #${newlyAddedIssue.testCaseId}: ${newlyAddedIssue.subject} • דווח ע"י ${newlyAddedIssue.createdBy}`,
              activePrefs.soundEnabled
            );
          }
        } else {
          const changed = state.issues.find((incoming) => {
            const prev = prevIssuesRef.current.find((p) => p.id === incoming.id);
            return prev && prev.updatedAt !== incoming.updatedAt;
          });
          if (changed) {
            setHighlightedIssueId(changed.id);
            setTimeout(() => setHighlightedIssueId(null), 3000);

            const prev = prevIssuesRef.current.find((p) => p.id === changed.id);
            if (prev && activePrefs.enabled) {
              if (prev.status !== changed.status && activePrefs.notifyOnStatusChange) {
                sendSystemNotification(
                  `🔄 עדכון סטטוס ב"צב מן" (${changed.system})`,
                  `תסריט #${changed.testCaseId} עבר לסטטוס "${changed.status}"`,
                  activePrefs.soundEnabled
                );
              } else if (
                (changed.comments?.length || 0) > (prev.comments?.length || 0) &&
                activePrefs.notifyOnNewComment
              ) {
                const latestComment = changed.comments[changed.comments.length - 1];
                sendSystemNotification(
                  `💬 הערה חדשה בתסריט #${changed.testCaseId} (${changed.system})`,
                  `${latestComment.author}: ${latestComment.text}`,
                  activePrefs.soundEnabled
                );
              }
            }
          }
        }

        if (state.lastAction && !isSystemAdminAction(state.lastAction)) {
          setLiveToast(`${state.lastUpdatedBy || 'חבר צוות'}: ${state.lastAction}`);
          setTimeout(() => setLiveToast(null), 4000);
        }
      }

      hasLoadedInitialStateRef.current = true;
      prevIssuesRef.current = state.issues;
      setSystems(state.systems);
      setArchivedSystems(state.archivedSystems || []);
      setIssues(state.issues);

      if (state.teamMembers && state.teamMembers.length > 0) {
        try {
          const mergedMembers = mergeCloudTeamMembers(state.teamMembers);
          setTeamMembers(mergedMembers);
        } catch {
          // ignore
        }
      }

      if (state.securityConfig) {
        try {
          mergeCloudSecurityConfig(state.securityConfig);
        } catch {
          // ignore
        }
      }
    });

    const unsubStatus = syncService.subscribeStatus((status) => {
      setSyncStatus(status);
    });

    return () => {
      unsubState();
      unsubStatus();
    };
  }, []);

  // Quick global Ctrl+V paste on the main board (Only for QA testers & Admin!)
  useEffect(() => {
    const handleBoardPaste = async (e: ClipboardEvent) => {
      if (!authUser || !canCreateOrEdit) return;
      if (
        isIssueModalOpen ||
        isFirebaseModalOpen ||
        lightboxData ||
        issueToDelete ||
        systemToRemove ||
        isArchiveModalOpen ||
        isInstallModalOpen ||
        isAdminReportOpen ||
        isAdminBackupOpen ||
        isTeamModalOpen ||
        isAdminSecurityOpen ||
        isAdminToolsOpen ||
        systemToManage
      ) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const pastedImages = await extractImagesFromClipboardEvent(e);
      if (pastedImages.length > 0) {
        if (visibleSystems.length === 0) {
          alert('לא ניתן להדביק תקלה – אין מערכות פעילות או מורשות במערכת.');
          return;
        }
        const targetSys = activeSystem === 'ALL' ? visibleSystems[0] : activeSystem;
        const nextId = getNextTestCaseIdForSystem(targetSys);
        setEditingIssue({
          id: '__NEW_FROM_PASTE__',
          system: targetSys,
          testCaseId: nextId,
          platform: 'IOS',
          subject: '',
          description: '',
          status: 'פתוח',
          screenshots: pastedImages,
          comments: [],
          createdBy: formattedUserDisplay,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        setIsIssueModalOpen(true);
      }
    };

    window.addEventListener('paste', handleBoardPaste);
    return () => window.removeEventListener('paste', handleBoardPaste);
  }, [
    authUser,
    canCreateOrEdit,
    isIssueModalOpen,
    isFirebaseModalOpen,
    lightboxData,
    issueToDelete,
    systemToRemove,
    isArchiveModalOpen,
    isInstallModalOpen,
    isAdminReportOpen,
    isAdminBackupOpen,
    isTeamModalOpen,
    isAdminSecurityOpen,
    isAdminToolsOpen,
    systemToManage,
    activeSystem,
    systems,
    issues,
    formattedUserDisplay
  ]);

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setAuthUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const handleSaveTeamMembers = (
    updated: TeamMember[],
    renameInfo?: { oldName: string; newName: string }
  ) => {
    setTeamMembers(updated);
    saveStoredTeamMembers(updated);

    let nextIssues = issues;
    const renameStats = { issues: 0, comments: 0, audits: 0 };

    if (renameInfo && renameInfo.oldName.trim() !== renameInfo.newName.trim()) {
      const oldName = renameInfo.oldName.trim();
      const newName = renameInfo.newName.trim();

      nextIssues = issues.map((iss) => {
        let changed = false;
        let createdBy = iss.createdBy;
        if (iss.createdBy && (iss.createdBy.trim() === oldName || iss.createdBy.includes(oldName))) {
          createdBy = iss.createdBy.replace(oldName, newName);
          changed = true;
          renameStats.issues++;
        }

        let comments = iss.comments;
        if (Array.isArray(iss.comments) && iss.comments.length > 0) {
          let commentsChanged = false;
          comments = iss.comments.map((c) => {
            if (c.author && (c.author.trim() === oldName || c.author.includes(oldName))) {
              commentsChanged = true;
              renameStats.comments++;
              return { ...c, author: c.author.replace(oldName, newName) };
            }
            return c;
          });
          if (commentsChanged) changed = true;
        }

        let auditLog = iss.auditLog;
        if (Array.isArray(iss.auditLog) && iss.auditLog.length > 0) {
          let auditChanged = false;
          auditLog = iss.auditLog.map((a) => {
            if (a.actor && (a.actor.trim() === oldName || a.actor.includes(oldName))) {
              auditChanged = true;
              renameStats.audits++;
              return { ...a, actor: a.actor.replace(oldName, newName) };
            }
            return a;
          });
          if (auditChanged) changed = true;
        }

        if (changed) {
          return {
            ...iss,
            createdBy,
            comments,
            auditLog,
            updatedAt: Date.now()
          };
        }
        return iss;
      });

      setIssues(nextIssues);

      // If current logged-in user is the renamed member, update session
      if (authUser && authUser.fullName.trim() === oldName) {
        const parts = newName.split(/\s+/);
        const updatedAuth: AuthenticatedUser = {
          ...authUser,
          firstName: parts[0] || newName,
          lastName: parts.slice(1).join(' ') || '',
          fullName: newName
        };
        updatedAuth.authSignature = computeUserAuthSignature(updatedAuth);
        setAuthUser(updatedAuth);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));
        saveRememberedLogin(newName, true);
      }
    }

    const toastText =
      renameInfo && renameInfo.oldName.trim() !== renameInfo.newName.trim()
        ? `✏️ עודכן שם איש צוות מ-${renameInfo.oldName} ל-${renameInfo.newName} (סונכרנו ${renameStats.issues} דיווחים ו-${renameStats.comments} הערות)`
        : undefined;

    syncService.pushStateToCloud(
      {
        systems,
        archivedSystems,
        issues: nextIssues,
        teamMembers: updated,
        securityConfig: getStoredSecurityConfig()
      },
      toastText,
      currentUserName
    );
  };

  const handleLogoutUser = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const handleSecurityUpdated = (newSuperAdminName: string) => {
    const updatedMembers = getStoredTeamMembers();
    setTeamMembers(updatedMembers);
    const secConfig = getStoredSecurityConfig();
    if (authUser && (authUser.isAdmin || authUser.fullName === newSuperAdminName)) {
      const parts = newSuperAdminName.split(/\s+/);
      const updatedUser: AuthenticatedUser = {
        ...authUser,
        fullName: newSuperAdminName,
        firstName: parts[0] || newSuperAdminName,
        lastName: parts.slice(1).join(' ') || ''
      };
      updatedUser.authSignature = computeUserAuthSignature(updatedUser);
      setAuthUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    syncService.pushStateToCloud(
      {
        systems,
        archivedSystems,
        issues,
        teamMembers: updatedMembers,
        securityConfig: secConfig
      },
      undefined,
      newSuperAdminName
    );
  };

  const updateNotifPref = (patch: Partial<NotificationPreferences>) => {
    setNotifPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveNotificationPreferences(next);
      return next;
    });
  };

  const handleInstallAndNotify = async () => {
    if (!notificationsEnabled) {
      const granted = await requestAppNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        updateNotifPref({ enabled: true });
      }
    }
    setIsInstallModalOpen(true);
  };

  const handleSelectSystem = useCallback((sys: string) => {
    setActiveSystem(sys);
    setSearchQuery('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
    setQuickPreset('ALL');
    try {
      if (sys && sys !== 'HOME' && sys !== 'ALL') {
        localStorage.setItem(LAST_ACTIVE_SYSTEM_KEY, sys);
      } else {
        localStorage.setItem(LAST_ACTIVE_SYSTEM_KEY, 'HOME');
      }
    } catch {}
  }, []);

  const handleAddSystem = (newSys: string) => {
    if (!isAdmin) return;
    if (systems.includes(newSys)) {
      handleSelectSystem(newSys);
      return;
    }
    const nextArchived = archivedSystems.filter((s) => s !== newSys);
    const nextDeletedSystems = (syncService.getState().deletedSystemIds || []).filter(
      (s) => s !== newSys
    );
    const nextSystems = [...systems, newSys];
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    handleSelectSystem(newSys);
    syncService.pushStateToCloud(
      {
        systems: nextSystems,
        archivedSystems: nextArchived,
        deletedSystemIds: nextDeletedSystems,
        issues
      },
      undefined,
      currentUserName
    );
  };

  const handleRenameSystem = (oldName: string, newName: string) => {
    const cleanNewName = newName.trim();
    if (!cleanNewName || cleanNewName === oldName) return;

    if (systems.includes(cleanNewName) || archivedSystems.includes(cleanNewName)) {
      setLiveToast('כבר קיימת מערכת בשם זה במערכת או בארכיון.');
      setTimeout(() => setLiveToast(null), 3000);
      return;
    }

    const nextSystems = systems.map((s) => (s === oldName ? cleanNewName : s));
    setSystems(nextSystems);

    const nextIssues = issues.map((i) =>
      i.system === oldName
        ? {
            ...i,
            system: cleanNewName,
            auditLog: [
              ...(i.auditLog || []),
              {
                id: `aud-${Date.now()}`,
                actor: formattedUserDisplay,
                action: `שם המערכת עודכן מ-"${oldName}" ל-"${cleanNewName}"`,
                timestamp: Date.now()
              }
            ],
            updatedAt: Date.now()
          }
        : i
    );
    setIssues(nextIssues);

    if (activeSystem === oldName) {
      setActiveSystem(cleanNewName);
    }

    const prevState = syncService.getState();
    const nextDeletedSystems = Array.from(
      new Set([...(prevState.deletedSystemIds || []), oldName])
    );

    // Update team members' allowedSystems to replace oldName with cleanNewName
    const updatedTeamMembers = teamMembers.map((m) => {
      if (m.allowedSystems && m.allowedSystems.includes(oldName)) {
        return {
          ...m,
          allowedSystems: m.allowedSystems.map((s) => (s === oldName ? cleanNewName : s))
        };
      }
      return m;
    });
    setTeamMembers(updatedTeamMembers);
    saveStoredTeamMembers(updatedTeamMembers);

    syncService.pushStateToCloud(
      {
        systems: nextSystems,
        archivedSystems,
        deletedSystemIds: nextDeletedSystems,
        issues: nextIssues,
        teamMembers: updatedTeamMembers
      },
      undefined,
      currentUserName
    );

    setLiveToast(`שם המערכת עודכן ל-"${cleanNewName}" בהצלחה!`);
    setTimeout(() => setLiveToast(null), 3500);
  };

  const handleArchiveSystem = (sysToArchive: string) => {
    if (!isAdmin || systems.length <= 1) return;
    const nextSystems = systems.filter((s) => s !== sysToArchive);
    const nextArchived = archivedSystems.includes(sysToArchive)
      ? archivedSystems
      : [...archivedSystems, sysToArchive];
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    if (activeSystem === sysToArchive) {
      handleSelectSystem('HOME');
    }
    setSystemToRemove(null);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues },
      undefined,
      currentUserName
    );
  };

  const handleRestoreSystemFromArchive = (sysToRestore: string) => {
    if (!isAdmin) return;
    const nextArchived = archivedSystems.filter((s) => s !== sysToRestore);
    const nextSystems = systems.includes(sysToRestore)
      ? systems
      : [...systems, sysToRestore];
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    handleSelectSystem(sysToRestore);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues },
      undefined,
      currentUserName
    );
  };

  const handlePermanentDeleteSystem = (sysToDelete: string) => {
    if (!isAdmin) return;
    const isFromActive = systems.includes(sysToDelete);
    if (isFromActive && systems.length <= 1) return;

    const nextSystems = systems.filter((s) => s !== sysToDelete);
    const nextArchived = archivedSystems.filter((s) => s !== sysToDelete);
    const removedIssueIds = issues
      .filter((i) => i.system === sysToDelete)
      .map((i) => i.id);
    const nextIssues = issues.filter((i) => i.system !== sysToDelete);

    const prevState = syncService.getState();
    const nextDeletedIssues = Array.from(
      new Set([...(prevState.deletedIssueIds || []), ...removedIssueIds])
    );
    const nextDeletedSystems = Array.from(
      new Set([...(prevState.deletedSystemIds || []), sysToDelete])
    );

    // Clean deleted system from all team members' allowedSystems
    const updatedTeamMembers = teamMembers.map((m) => {
      if (m.allowedSystems && m.allowedSystems.includes(sysToDelete)) {
        const filtered = m.allowedSystems.filter((s) => s !== sysToDelete);
        return {
          ...m,
          allowedSystems: filtered.length > 0 ? filtered : undefined
        };
      }
      return m;
    });
    setTeamMembers(updatedTeamMembers);
    saveStoredTeamMembers(updatedTeamMembers);

    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    setIssues(nextIssues);
    if (activeSystem === sysToDelete) {
      handleSelectSystem('HOME');
    }
    setSystemToRemove(null);
    syncService.pushStateToCloud(
      {
        systems: nextSystems,
        archivedSystems: nextArchived,
        deletedIssueIds: nextDeletedIssues,
        deletedSystemIds: nextDeletedSystems,
        issues: nextIssues,
        teamMembers: updatedTeamMembers
      },
      undefined,
      currentUserName
    );
  };

  // Find current logged in member's record to get latest allowed systems in real-time
  const currentMember = useMemo(() => {
    if (!authUser) return null;
    return teamMembers.find(
      (m) => m.fullName.trim().toLowerCase() === authUser.fullName.trim().toLowerCase()
    );
  }, [authUser, teamMembers]);

  // If user has allowedSystems defined, restrict systems (applies to both Dev and QA)
  const userAllowedSystems = useMemo(() => {
    if (!authUser || authUser.isAdmin) {
      return null; // No restrictions for Admin
    }
    const rawAllowed = currentMember?.allowedSystems || authUser.allowedSystems;
    if (Array.isArray(rawAllowed) && rawAllowed.length > 0) {
      // Filter by systems that actually exist in the current workspace
      const valid = rawAllowed.filter((s) => systems.includes(s));
      return valid.length > 0 ? valid : null;
    }
    return null; // fallback: all systems
  }, [authUser, currentMember, systems]);

  const visibleSystems = useMemo(() => {
    if (!userAllowedSystems) return systems;
    return systems.filter((s) => userAllowedSystems.includes(s));
  }, [systems, userAllowedSystems]);

  // Automatically adjust activeSystem when userAllowedSystems is restricted
  useEffect(() => {
    if (userAllowedSystems && userAllowedSystems.length > 0) {
      if (userAllowedSystems.length === 1) {
        if (activeSystem !== userAllowedSystems[0]) {
          handleSelectSystem(userAllowedSystems[0]);
        }
      } else {
        if (activeSystem !== 'HOME' && !userAllowedSystems.includes(activeSystem)) {
          handleSelectSystem('HOME');
        }
      }
    }
  }, [userAllowedSystems, activeSystem, handleSelectSystem]);

  // Fallback to HOME if active system is not valid in workspace
  useEffect(() => {
    if (activeSystem && activeSystem !== 'HOME' && activeSystem !== 'ALL') {
      if (
        visibleSystems.length > 0 &&
        !visibleSystems.includes(activeSystem) &&
        !archivedSystems.includes(activeSystem)
      ) {
        handleSelectSystem('HOME');
      }
    }
  }, [visibleSystems, archivedSystems, activeSystem, handleSelectSystem]);

  // Issues belonging to the currently selected system tab (respecting developer allowed systems & archived systems)
  const systemIssues = useMemo(() => {
    let baseIssues = issues;
    if (userAllowedSystems) {
      baseIssues = baseIssues.filter((i) => userAllowedSystems.includes(i.system));
    }
    if (activeSystem === 'ALL' || activeSystem === 'HOME' || !activeSystem) {
      return baseIssues.filter((i) => !archivedSystems.includes(i.system));
    }
    return baseIssues.filter((i) => i.system === activeSystem);
  }, [issues, activeSystem, archivedSystems, userAllowedSystems]);

  // Next Test Case ID per system starting from 1 in ascending order (natural numeric extraction)
  const getNextTestCaseIdForSystem = useCallback(
    (targetSystem: string, currentIssues: StdIssue[] = issues) => {
      const nums = currentIssues
        .filter((i) => i.system === targetSystem)
        .map((i) => {
          const raw = (i.testCaseId || '').trim();
          const match = raw.match(/\d+/);
          return match ? parseInt(match[0], 10) : NaN;
        })
        .filter((n) => !isNaN(n) && n > 0);
      if (nums.length === 0) return '1';
      return String(Math.max(...nums) + 1);
    },
    [issues]
  );

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return systemIssues
      .filter((issue) => {
        // Quick Presets
        if (quickPreset === 'MY_ISSUES') {
          const authorMatch = issue.createdBy.toLowerCase().includes(currentUserName.toLowerCase());
          const commentMatch = (issue.comments || []).some((c) =>
            c.author.toLowerCase().includes(currentUserName.toLowerCase())
          );
          if (!authorMatch && !commentMatch) return false;
        }
        if (quickPreset === 'CRITICAL') {
          const isCritical = issue.severity === 'קריטית';
          const isUnresolved = issue.status !== 'נבדק תקין';
          if (!isCritical || !isUnresolved) return false;
        }

        if (platformFilter !== 'ALL' && issue.platform !== platformFilter) {
          return false;
        }
        if (statusFilter !== 'ALL' && issue.status !== statusFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const inSubject = issue.subject.toLowerCase().includes(q);
          const inDesc = issue.description.toLowerCase().includes(q);
          const inId = issue.testCaseId.toLowerCase().includes(q);
          const inAuthor = issue.createdBy.toLowerCase().includes(q);
          const inComments = issue.comments.some(
            (c) => c.text.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
          );
          if (!inSubject && !inDesc && !inId && !inAuthor && !inComments) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [systemIssues, quickPreset, currentUserName, platformFilter, statusFilter, searchQuery]);

  // Quick Preset Counts
  const myIssuesCount = useMemo(() => {
    if (!currentUserName) return 0;
    const lowerName = currentUserName.toLowerCase();
    return systemIssues.filter((issue) => {
      const authorMatch = issue.createdBy.toLowerCase().includes(lowerName);
      const commentMatch = (issue.comments || []).some((c) =>
        c.author.toLowerCase().includes(lowerName)
      );
      return authorMatch || commentMatch;
    }).length;
  }, [systemIssues, currentUserName]);

  const criticalIssuesCount = useMemo(() => {
    return systemIssues.filter(
      (issue) => issue.severity === 'קריטית' && issue.status !== 'נבדק תקין'
    ).length;
  }, [systemIssues]);

  // CRUD Handlers with Instant Live Cloud Sync
  const handleSaveIssue = (formData: {
    system: string;
    testCaseId: string;
    platform: StdPlatform;
    severity: StdSeverity;
    subject: string;
    description: string;
    status: StdStatus;
    screenshots: string[];
    initialComment?: string;
  }) => {
    if (!canCreateOrEdit) return;

    const isEditingExisting =
      editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__';

    // Assign next sequential ID per system starting from 1 (or keep existing ID if editing)
    let finalTestCaseId = formData.testCaseId.trim();
    if (!isEditingExisting || !finalTestCaseId) {
      finalTestCaseId = getNextTestCaseIdForSystem(formData.system);
    }

    if (isEditingExisting) {
      const isStillInState = issues.some((item) => item.id === editingIssue.id);
      const isMarkedDeleted = (syncService.getState().deletedIssueIds || []).includes(editingIssue.id);

      if (!isStillInState || isMarkedDeleted) {
        alert('תקלה זו נמחקה מהמערכת על ידי משתמש אחר, ולכן השינויים לא נשמרו.');
        setIsIssueModalOpen(false);
        setEditingIssue(null);
        return;
      }

      const auditEntry: StdAuditEntry = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        actor: formattedUserDisplay,
        action:
          editingIssue.status !== formData.status
            ? `ערך תקלה והעביר סטטוס מ-"${editingIssue.status}" ל-"${formData.status}"`
            : 'ערך פרטי תקלה / צילום מסך',
        timestamp: Date.now()
      };

      const nextIssues = issues.map((item) =>
        item.id === editingIssue.id
          ? {
              ...item,
              system: formData.system,
              testCaseId: finalTestCaseId,
              platform: formData.platform,
              severity: formData.severity,
              subject: formData.subject,
              description: formData.description,
              status: formData.status,
              screenshots: formData.screenshots,
              auditLog: [...(item.auditLog || []), auditEntry],
              updatedAt: Date.now()
            }
          : item
      );
      syncService.pushStateToCloud(
        { systems, archivedSystems, issues: nextIssues },
        `עריכת תסריט #${finalTestCaseId} (${formData.system})`,
        currentUserName
      );
    } else {
      const comments: StdComment[] = [];
      if (formData.initialComment) {
        comments.push({
          id: `c-${Date.now()}`,
          author: formattedUserDisplay,
          role: currentUserRole,
          text: formData.initialComment,
          createdAt: Date.now()
        });
      }

      const newIssue: StdIssue = {
        id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        system: formData.system,
        testCaseId: finalTestCaseId,
        platform: formData.platform,
        severity: formData.severity,
        subject: formData.subject,
        description: formData.description,
        status: formData.status,
        screenshots: formData.screenshots,
        comments,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            actor: formattedUserDisplay,
            action: `פתח תקלה חדשה בסטטוס "${formData.status}" (חומרה: ${formData.severity})`,
            timestamp: Date.now()
          }
        ],
        createdBy: formattedUserDisplay,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const nextIssues = [newIssue, ...issues];
      if (activeSystem !== 'ALL' && activeSystem !== formData.system) {
        setActiveSystem(formData.system);
      }
      setHighlightedIssueId(newIssue.id);
      setTimeout(() => setHighlightedIssueId(null), 2500);

      syncService.pushStateToCloud(
        { systems, archivedSystems, issues: nextIssues },
        `תקלה חדשה בתסריט #${finalTestCaseId} (${formData.system})`,
        currentUserName
      );
    }

    setIsIssueModalOpen(false);
    setEditingIssue(null);
  };

  const handleStatusChange = (issueId: string, newStatus: StdStatus) => {
    const target = issues.find((i) => i.id === issueId);
    const auditEntry: StdAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      actor: formattedUserDisplay,
      action: `שינה סטטוס מ-"${target?.status || ''}" ל-"${newStatus}"`,
      timestamp: Date.now()
    };

    const nextIssues = issues.map((item) =>
      item.id === issueId
        ? {
            ...item,
            status: newStatus,
            auditLog: [...(item.auditLog || []), auditEntry],
            updatedAt: Date.now()
          }
        : item
    );

    syncService.pushStateToCloud(
      { systems, archivedSystems, issues: nextIssues },
      `שינוי סטטוס תסריט #${target?.testCaseId || ''} ל-"${newStatus}"`,
      currentUserName
    );
  };

  const handleAddComment = (issueId: string, text: string, screenshot?: string) => {
    const target = issues.find((i) => i.id === issueId);
    const newComment: StdComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      author: formattedUserDisplay,
      role: currentUserRole,
      text,
      screenshot,
      createdAt: Date.now()
    };

    const nextIssues = issues.map((item) =>
      item.id === issueId
        ? {
            ...item,
            comments: [...(item.comments || []), newComment],
            updatedAt: Date.now()
          }
        : item
    );

    syncService.pushStateToCloud(
      { systems, archivedSystems, issues: nextIssues },
      `הערה חדשה בתסריט #${target?.testCaseId || ''}`,
      currentUserName
    );
  };

  // Opens confirmation modal instead of deleting immediately (Admin only!)
  const handleRequestDeleteIssue = (issueId: string) => {
    if (!isAdmin) return;
    const target = issues.find((i) => i.id === issueId);
    if (target) {
      setIssueToDelete(target);
    }
  };

  const handleConfirmDeleteIssue = () => {
    if (!issueToDelete || !isAdmin) return;
    const nextIssues = issues.filter((i) => i.id !== issueToDelete.id);
    const prevDeleted = syncService.getState().deletedIssueIds || [];
    const nextDeleted = Array.from(new Set([...prevDeleted, issueToDelete.id]));
    syncService.pushStateToCloud(
      { systems, archivedSystems, deletedIssueIds: nextDeleted, issues: nextIssues },
      `מחיקת תסריט #${issueToDelete.testCaseId}`,
      currentUserName
    );
    setIssueToDelete(null);
  };

  const handleExportCsv = () => {
    const headers = [
      'מערכת',
      'מזהה תסריט',
      'פלטפורמה',
      'נושא התקלה',
      'מהות השגיאה',
      'סטטוס',
      'חומרה',
      'מדווח',
      'מספר הערות',
      'הערה אחרונה'
    ];

    const sanitizeCsvCell = (rawVal: unknown): string => {
      let str = String(rawVal ?? '');
      // Prevent Excel Formula Injection (#NAME? errors) when text starts with =, +, -, @
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredIssues.map((i) => {
      const lastComment =
        i.comments.length > 0
          ? `${i.comments[i.comments.length - 1].author}: ${i.comments[i.comments.length - 1].text}`
          : '';
      return [
        i.system,
        i.testCaseId,
        i.platform,
        i.subject,
        i.description,
        i.status,
        i.severity || 'בינונית',
        i.createdBy,
        String(i.comments.length),
        lastComment
      ].map(sanitizeCsvCell);
    });

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `STD-${activeSystem}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
    setQuickPreset('ALL');
  };

  const showLastEventBanner =
    Boolean(syncStatus.lastEventText) &&
    !isSystemAdminAction(syncStatus.lastEventText) &&
    syncStatus.lastEventText !== dismissedLastEventText;

  // Render Interactive Notification Settings & App Installation Modal
  const renderInstallModal = () => {
    if (!isInstallModalOpen) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4"
        dir="rtl"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
                  notificationsEnabled && notifPrefs.enabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {notificationsEnabled && notifPrefs.enabled ? (
                  <BellRing className="w-6 h-6" />
                ) : (
                  <BellOff className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  הגדרות התראות ואפליקציה
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  התאם אישית אילו התראות תרצה לקבל בזמן אמת למכשיר
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Permission Status Banner */}
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
              notificationsEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 shrink-0" />
              <span>
                {notificationsEnabled
                  ? 'הרשאת התראות דפדפן מאושרת ופעילה!'
                  : 'התראות טרם אושרו בדפדפן שלך'}
              </span>
            </div>
            {!notificationsEnabled ? (
              <button
                type="button"
                onClick={async () => {
                  const ok = await requestAppNotificationPermission();
                  setNotificationsEnabled(ok);
                  if (ok) updateNotifPref({ enabled: true });
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                אשר התראות
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  sendSystemNotification(
                    '🚨 בדיקת התראה - צב מן',
                    'המערכת מחוברת! כך תיראה ההתראה בזמן אמת.',
                    notifPrefs.soundEnabled
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
              >
                שלח התראת בדיקה
              </button>
            )}
          </div>

          {/* Interactive Notification Preferences Toggles */}
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1">
              ניהול העדפות התראות:
            </div>

            {/* Master Switch */}
            <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/50 transition">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">קבלת התראות פעילה</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">כיבוי או הדלקה של כל ההתראות במכשיר זה</div>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.enabled}
                onChange={(e) => updateNotifPref({ enabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            {/* New Issue Toggle */}
            <label
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200 dark:hover:border-indigo-500/50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">התראה על תקלה חדשה</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">קבל הודעה בכל פעם שבודק מעלה תקלה חדשה</div>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.notifyOnNewIssue}
                onChange={(e) => updateNotifPref({ notifyOnNewIssue: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* Status Change Toggle */}
            <label
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200 dark:hover:border-indigo-500/50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">התראה על שינוי סטטוס</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">עדכון כשסטטוס משתנה (למשל: ניתן לבדוק שוב / נבדק תקין)</div>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.notifyOnStatusChange}
                onChange={(e) => updateNotifPref({ notifyOnStatusChange: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* New Comment Toggle */}
            <label
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200 dark:hover:border-indigo-500/50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">התראה על הערה חדשה</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">קבל הודעה כשמפתח או בודק מוסיפים הערה לתקלה</div>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.notifyOnNewComment}
                onChange={(e) => updateNotifPref({ notifyOnNewComment: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* Sound Toggle */}
            <label
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200 dark:hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {notifPrefs.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">צליל התראה</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">השמע צליל בעת קבלת התראה חדשה</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.soundEnabled}
                onChange={(e) => updateNotifPref({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Direct Install Button if supported or Guide */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>התקנת האפליקציה למסך הבית / מחשב:</span>
              </div>
              {deferredInstallPrompt && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      deferredInstallPrompt.prompt();
                      const choice = await deferredInstallPrompt.userChoice;
                      if (choice.outcome === 'accepted') {
                        setDeferredInstallPrompt(null);
                      }
                    } catch {
                      // ignore
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
                >
                  התקן כעת
                </button>
              )}
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>
                <strong>במחשב (Chrome / Edge):</strong> לחץ על סמל ההתקנה בשורת הכתובת למעלה ובחר <strong>"התקן"</strong>.
              </li>
              <li>
                <strong>באנדרואיד (Chrome):</strong> לחץ על תפריט 3 הנקודות ובחר <strong>"התקן אפליקציה"</strong>.
              </li>
              <li>
                <strong>באייפון (Safari):</strong> לחץ על כפתור השיתוף בתחתית המסך ובחר <strong>"הוסף למסך הבית"</strong>.
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              שמור וסגור
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If user is not logged in yet, show the Login Screen!
  if (!authUser) {
    return (
      <>
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onInstallAndNotify={handleInstallAndNotify}
          notificationsEnabled={notificationsEnabled}
          teamMembers={teamMembers}
        />
        {renderInstallModal()}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors" dir="rtl">
      {/* Top Navigation & System Bar */}
      <Navbar
        systems={visibleSystems}
        archivedSystems={archivedSystems}
        activeSystem={activeSystem}
        onSelectSystem={handleSelectSystem}
        onAddSystem={handleAddSystem}
        onManageSystem={(sys) => setSystemToManage(sys)}
        onRequestRemoveSystem={(sys) => setSystemToManage(sys)}
        onOpenArchiveModal={() => setIsArchiveModalOpen(true)}
        onOpenAdminReport={() => {
          if (isAdmin) setIsAdminReportOpen(true);
        }}
        onOpenAdminBackup={() => {
          if (isAdmin) setIsAdminBackupOpen(true);
        }}
        onOpenTeamModal={() => {
          if (isAdmin) setIsTeamModalOpen(true);
        }}
        onOpenSecurityModal={() => {
          if (isAdmin) setIsAdminSecurityOpen(true);
        }}
        onOpenAdminToolsModal={() => {
          if (isAdmin) setIsAdminToolsOpen(true);
        }}
        onManualSync={() => {
          syncService.requestManualSync();
          setLiveToast('🔄 מושך נתונים עדכניים מהענן...');
          setTimeout(() => setLiveToast(null), 2500);
        }}
        issues={issues}
        syncStatus={syncStatus}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
        canCreateOrEdit={canCreateOrEdit}
        onOpenNewIssue={() => {
          if (!canCreateOrEdit) return;
          setEditingIssue(null);
          setIsIssueModalOpen(true);
        }}
        onOpenFirebaseModal={() => {
          if (isAdmin) setIsFirebaseModalOpen(true);
        }}
        isAdmin={isAdmin}
        onLogoutUser={handleLogoutUser}
        notificationsEnabled={notificationsEnabled}
        onInstallAndNotify={handleInstallAndNotify}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Floating Real-Time Event Toast (when another team member updates something) */}
      {liveToast && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl border border-indigo-500/40 animate-bounce">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span className="rtl-safe">{liveToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-8">
        {/* Archived System Notice Banner if Admin is viewing an archived system */}
        {isAdmin && archivedSystems.includes(activeSystem) && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold">
              <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                הנך צופה במערכת <span className="underline bidi-isolate">{activeSystem}</span> שנמצאת בארכיון (מוסתרת משאר הצוות).
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRestoreSystemFromArchive(activeSystem)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>שחזר מערכת לפעילות</span>
            </button>
          </div>
        )}

        {/* Dismissible Info Banners (Shortcut Tip & Last Action - each with its own X button) */}
        {((showShortcutBanner && canCreateOrEdit) || showLastEventBanner) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-4">
            {showShortcutBanner && canCreateOrEdit && (
              <div className="flex-1 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-l from-indigo-50 via-white to-violet-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <ClipboardPaste className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">קיצור דרך:</strong> צילמת מסך? לחץ{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-indigo-700 dark:text-indigo-400 font-bold">
                      Ctrl + V
                    </kbd>{' '}
                    בעמוד כדי לפתוח מיד דיווח תקלה עם הצילום מוכן!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShortcutBanner(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                  title="סגור חלונית קיצור דרך"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {showLastEventBanner && (
              <div className="w-full sm:w-auto flex items-start sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium shadow-2xs">
                <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="rtl-safe leading-relaxed break-words">
                    <strong className="font-bold">פעולה אחרונה:</strong> {syncStatus.lastEventText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedLastEventText(syncStatus.lastEventText || '')}
                  className="p-1 rounded-lg text-emerald-600/70 hover:text-emerald-900 dark:hover:text-emerald-200 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/40 transition cursor-pointer shrink-0"
                  title="סגור חלונית פעולה אחרונה"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* System Selection Home Page OR System Issues Dashboard */}
        {activeSystem === 'HOME' || !activeSystem ? (
          <SystemSelectorHome
            systems={visibleSystems}
            archivedSystems={archivedSystems}
            issues={issues}
            currentUserName={currentUserName}
            userTeamTitle={userTeamTitle}
            isAdmin={isAdmin}
            canCreateOrEdit={canCreateOrEdit}
            onSelectSystem={handleSelectSystem}
            onAddSystem={handleAddSystem}
            onManageSystem={isAdmin ? (sys) => setSystemToManage(sys) : undefined}
            onOpenArchiveModal={isAdmin ? () => setIsArchiveModalOpen(true) : undefined}
            onOpenNewIssue={() => {
              setEditingIssue(null);
              setIsIssueModalOpen(true);
            }}
          />
        ) : (
          <>
            {/* System Breadcrumb & Switcher Bar */}
            <div className="flex items-center justify-between gap-3 mb-3 px-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => handleSelectSystem('HOME')}
                  className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  title="חזור לדף הבית לבחירת מערכת"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>דף הבית</span>
                </button>
                <span>/</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 bidi-isolate">
                  מערכת {activeSystem}
                </span>
              </div>

              {/* System Switcher Button & Dropdown */}
              <div className="relative" ref={systemSwitcherRef}>
                <button
                  type="button"
                  onClick={() => setIsSystemSwitcherOpen((prev) => !prev)}
                  className={`text-xs font-bold transition flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 rounded-xl border shadow-2xs ${
                    isSystemSwitcherOpen
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                  }`}
                  title="החלף למערכת אחרת"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>החלף מערכת</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSystemSwitcherOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu of all Systems */}
                {isSystemSwitcherOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span>בחר מערכת לעבודה:</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {visibleSystems.length} מערכות
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                      {visibleSystems.map((sys) => {
                        const isCurrent = activeSystem === sys;
                        const count = issues.filter((i) => i.system === sys).length;
                        const criticalCount = issues.filter(
                          (i) => i.system === sys && i.severity === 'קריטית' && i.status !== 'נבדק תקין'
                        ).length;

                        return (
                          <button
                            key={sys}
                            type="button"
                            onClick={() => {
                              handleSelectSystem(sys);
                              setIsSystemSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-right ${
                              isCurrent
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isCurrent ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                              />
                              <span className="truncate bidi-isolate">{sys}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {criticalCount > 0 && (
                                <span className="flex items-center text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                                  <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                                  <span>{criticalCount}</span>
                                </span>
                              )}
                              <span
                                className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                                  isCurrent
                                    ? 'bg-indigo-200/60 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {count}
                              </span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-1" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom option to return to Home Page */}
                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectSystem('HOME');
                          setIsSystemSwitcherOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>חזור לדף הבית הראשי</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search, Filter & View Switcher Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          quickPreset={quickPreset}
          onQuickPresetChange={setQuickPreset}
          myIssuesCount={myIssuesCount}
          criticalIssuesCount={criticalIssuesCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          systemIssues={systemIssues}
          filteredCount={filteredIssues.length}
          onExportCsv={handleExportCsv}
          onResetFilters={resetFilters}
        />

        {/* Issues Display: Empty Systems OR Empty Filter OR Cards Grid OR Kanban Board OR Smart Table */}
        {visibleSystems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto my-10 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
              {!isAdmin && currentUserRole === 'dev'
                ? 'אין לך הרשאות צפייה באף מערכת'
                : 'לא קיימות מערכות פעילות במערכת'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {!isAdmin && currentUserRole === 'dev'
                ? 'משתמש זה מוגדר כמפתח ללא מערכות משויכות. יש לפנות למנהל המערכת על מנת להגדיר עבורך מערכות לצפייה בהגדרות הצוות.'
                : 'כל המערכות הועברו לארכיון או נמחקו. באפשרות מנהל המערכת להוסיף מערכת חדשה או לשחזר מערכת מהארכיון בסרגל העליון.'}
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  const name = window.prompt('הזן שם עבור מערכת חדשה:');
                  if (name && name.trim()) {
                    handleAddSystem(name.trim());
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>הוסף מערכת חדשה</span>
              </button>
            )}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-8 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              לא נמצאו תקלות התואמות לסינון
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              נסה לשנות את מילות החיפוש או לבחור מערכת אחרת.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
              >
                איפוס סינונים
              </button>
              {canCreateOrEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingIssue(null);
                    setIsIssueModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>דווח תקלה חדשה</span>
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                showSystemBadge={activeSystem === 'ALL'}
                isHighlighted={highlightedIssueId === issue.id}
                currentUserName={currentUserName}
                currentUserRole={currentUserRole}
                canEdit={canCreateOrEdit}
                canDelete={isAdmin}
                onStatusChange={handleStatusChange}
                onAddComment={handleAddComment}
                onEditIssue={(iss) => {
                  if (!canCreateOrEdit) return;
                  setEditingIssue(iss);
                  setIsIssueModalOpen(true);
                }}
                onDeleteIssue={handleRequestDeleteIssue}
                onOpenLightbox={(images, index, title) =>
                  setLightboxData({ images, index, title })
                }
              />
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            issues={filteredIssues}
            showSystemBadge={activeSystem === 'ALL'}
            highlightedId={highlightedIssueId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            canEdit={canCreateOrEdit}
            canDelete={isAdmin}
            onStatusChange={handleStatusChange}
            onEditIssue={(iss) => {
              if (!canCreateOrEdit) return;
              setEditingIssue(iss);
              setIsIssueModalOpen(true);
            }}
            onDeleteIssue={handleRequestDeleteIssue}
            onOpenLightbox={(images, index, title) =>
              setLightboxData({ images, index, title })
            }
          />
        ) : (
          <SmartTableView
            issues={filteredIssues}
            showSystemColumn={activeSystem === 'ALL'}
            highlightedId={highlightedIssueId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            canEdit={canCreateOrEdit}
            canDelete={isAdmin}
            onStatusChange={handleStatusChange}
            onAddComment={(id, text, screenshot) => handleAddComment(id, text, screenshot)}
            onEditIssue={(iss) => {
              if (!canCreateOrEdit) return;
              setEditingIssue(iss);
              setIsIssueModalOpen(true);
            }}
            onDeleteIssue={handleRequestDeleteIssue}
            onOpenLightbox={(images, index, title) =>
              setLightboxData({ images, index, title })
            }
          />
        )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile/tablet screens) */}
      <MobileBottomNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        systems={visibleSystems}
        activeSystem={activeSystem}
        onSelectSystem={handleSelectSystem}
        canCreateOrEdit={canCreateOrEdit}
        onOpenNewIssue={() => {
          if (!canCreateOrEdit) return;
          setEditingIssue(null);
          setIsIssueModalOpen(true);
        }}
        syncStatus={syncStatus}
        onManualSync={() => {
          syncService.requestManualSync();
          setLiveToast('🔄 מושך נתונים עדכניים מהענן...');
          setTimeout(() => setLiveToast(null), 2500);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Create / Edit Issue Modal (QA & Admin only) */}
      {isIssueModalOpen && canCreateOrEdit && (
        <IssueFormModal
          systems={visibleSystems}
          defaultSystem={activeSystem === 'HOME' ? '' : activeSystem}
          suggestedTestCaseId={
            activeSystem && activeSystem !== 'HOME' && activeSystem !== 'ALL'
              ? getNextTestCaseIdForSystem(activeSystem)
              : ''
          }
          editingIssue={editingIssue}
          existingIssues={issues}
          onSave={handleSaveIssue}
          onClose={() => {
            setIsIssueModalOpen(false);
            setEditingIssue(null);
          }}
        />
      )}

      {/* Popup Confirmation Modal Before Deleting an Issue (Admin Only) */}
      {issueToDelete && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  האם למחוק את התקלה?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed rtl-safe">
                  אתה עומד למחוק את <strong>תסריט #{issueToDelete.testCaseId}</strong> (
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{issueToDelete.subject}</span>
                  ) ממערכת <strong className="bidi-isolate">{issueToDelete.system}</strong>.
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  פעולה זו תסיר את השורה אצל כל חברי הצוות ולא ניתן לבטלה.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIssueToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteIssue}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>כן, מחק תקלה</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin System Management Modal: Rename, Archive or Delete */}
      {(systemToManage || systemToRemove) && isAdmin && (
        <AdminSystemManageModal
          systemName={(systemToManage || systemToRemove)!}
          totalIssuesCount={
            issues.filter((i) => i.system === (systemToManage || systemToRemove)).length
          }
          openIssuesCount={
            issues.filter(
              (i) =>
                i.system === (systemToManage || systemToRemove) &&
                i.status !== 'נבדק תקין'
            ).length
          }
          canDeleteOrArchive={systems.length > 1}
          existingSystemNames={[...systems, ...archivedSystems]}
          onRenameSystem={handleRenameSystem}
          onArchiveSystem={(sys) => handleArchiveSystem(sys)}
          onDeleteSystem={(sys) => handlePermanentDeleteSystem(sys)}
          onClose={() => {
            setSystemToManage(null);
            setSystemToRemove(null);
          }}
        />
      )}

      {/* Admin Archive Management Modal */}
      {isArchiveModalOpen && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Archive className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-extrabold">ארכיון מערכות (סביבת מנהל)</h3>
                  <p className="text-xs text-slate-300">
                    מערכות בארכיון מוסתרות מהצוות וזמינות לצפייה או שחזור רק למנהל
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {archivedSystems.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                  אין כרגע מערכות בארכיון.
                </div>
              ) : (
                archivedSystems.map((sys) => {
                  const count = issues.filter((i) => i.system === sys).length;
                  return (
                    <div
                      key={sys}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-750"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm bidi-isolate">
                          {sys}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {count} תקלות שמורות בארכיון
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSystem(sys);
                            setIsArchiveModalOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>צפה בתקלות</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRestoreSystemFromArchive(sys)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>שחזר לפעילות</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePermanentDeleteSystem(sys)}
                          className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 transition cursor-pointer"
                          title="מחק לצמיתות מהארכיון"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Executive QA Progress Report Modal (Admin Only) */}
      {isAdminReportOpen && isAdmin && (
        <AdminReportModal
          systems={systems}
          issues={issues.filter((i) => !archivedSystems.includes(i.system))}
          initialSystem={activeSystem}
          onClose={() => setIsAdminReportOpen(false)}
          onOpenLightbox={(images, index, title) =>
            setLightboxData({ images, index, title })
          }
        />
      )}

      {/* Admin Backup, Restore & CSV Import Modal (Admin Only) */}
      {isAdminBackupOpen && isAdmin && (
        <AdminBackupModal
          systems={systems}
          archivedSystems={archivedSystems}
          issues={issues}
          activeSystem={activeSystem}
          currentUserDisplay={formattedUserDisplay}
          onRestoreBackup={(restored) => {
            const liveState = syncService.getState();
            setSystems(restored.systems);
            setArchivedSystems(restored.archivedSystems);
            setIssues(restored.issues);
            syncService.pushStateToCloud(
              {
                systems: restored.systems,
                archivedSystems: restored.archivedSystems,
                deletedIssueIds: liveState.deletedIssueIds || [],
                deletedSystemIds: liveState.deletedSystemIds || [],
                issues: restored.issues,
                replaceAll: true
              },
              `שחזור/עדכון מסד נתונים (${restored.issues.length} תקלות)`,
              currentUserName
            );
          }}
          onImportIssues={(imported) => {
            const liveState = syncService.getState();
            const baseSystems = liveState.systems?.length ? liveState.systems : systems;
            const baseIssues = liveState.issues?.length ? liveState.issues : issues;
            const nextSystems = [...baseSystems];
            const nextDeletedSystems = (liveState.deletedSystemIds || []).filter(
              (s) => !imported.some((item) => item.system === s)
            );
            for (const item of imported) {
              if (item.system && !nextSystems.includes(item.system)) {
                nextSystems.push(item.system);
              }
            }
            const nextIssues = [...imported, ...baseIssues];
            setSystems(nextSystems);
            setIssues(nextIssues);
            syncService.pushStateToCloud(
              {
                systems: nextSystems,
                archivedSystems,
                deletedSystemIds: nextDeletedSystems,
                issues: nextIssues
              },
              `ייבוא ${imported.length} תסריטים מקובץ אקסל / CSV`,
              currentUserName
            );
          }}
          onClose={() => setIsAdminBackupOpen(false)}
        />
      )}

      {/* Admin Team Members Management Modal (Admin Only) */}
      {isTeamModalOpen && isAdmin && (
        <AdminTeamModal
          systems={systems}
          teamMembers={teamMembers}
          onSaveTeamMembers={handleSaveTeamMembers}
          onClose={() => setIsTeamModalOpen(false)}
        />
      )}

      {/* Admin Central Tools Hub Modal (Admin Only) */}
      {isAdminToolsOpen && isAdmin && (
        <AdminToolsModal
          archivedCount={archivedSystems.length}
          onOpenReport={() => setIsAdminReportOpen(true)}
          onOpenBackup={() => setIsAdminBackupOpen(true)}
          onOpenTeam={() => setIsTeamModalOpen(true)}
          onOpenCloud={() => setIsFirebaseModalOpen(true)}
          onOpenSecurity={() => setIsAdminSecurityOpen(true)}
          onOpenArchive={() => setIsArchiveModalOpen(true)}
          onClose={() => setIsAdminToolsOpen(false)}
        />
      )}

      {/* Admin Security, Master Key & Passcodes Management Modal (Admin Only) */}
      {isAdminSecurityOpen && isAdmin && (
        <AdminSecurityModal
          onSecurityUpdated={handleSecurityUpdated}
          onClose={() => setIsAdminSecurityOpen(false)}
        />
      )}

      {/* Fullscreen Lightbox with Zoom & Pan for Mobile Details */}
      {lightboxData && (
        <LightboxModal
          images={lightboxData.images}
          initialIndex={lightboxData.index}
          title={lightboxData.title}
          onClose={() => setLightboxData(null)}
        />
      )}

      {/* Firebase Cloud Setup Wizard Modal (Admin Only) */}
      {isFirebaseModalOpen && isAdmin && (
        <FirebaseSetupModal
          currentConfig={syncService.getActiveFirebaseConfig()}
          syncStatus={syncStatus}
          onSaveConfig={(cfg) => syncService.connectFirebase(cfg)}
          onDisconnectFirebase={() => {
            syncService.disconnectFirebaseAndUseLiveServer();
            setIsFirebaseModalOpen(false);
          }}
          onClose={() => setIsFirebaseModalOpen(false)}
        />
      )}

      {/* App Install & Notifications Modal */}
      {renderInstallModal()}
    </div>
  );
}
export default App;
