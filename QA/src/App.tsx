import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import { syncService } from './services/syncService';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { SmartTableView } from './components/SmartTableView';
import { IssueFormModal } from './components/IssueFormModal';
import { LightboxModal } from './components/LightboxModal';
import { FirebaseSetupModal } from './components/FirebaseSetupModal';
import { AdminReportModal } from './components/AdminReportModal';
import { AdminBackupModal } from './components/AdminBackupModal';
import { LoginScreen, AuthenticatedUser } from './components/LoginScreen';
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
  Smartphone
} from 'lucide-react';
import {
  computeUserAuthSignature,
  isAdminAccessCode,
  verifyUserAuthSignature
} from './utils/securityUtils';

const AUTH_STORAGE_KEY = 'std_qa_auth_user_v1';

export function App() {
  const [systems, setSystems] = useState<string[]>(DEFAULT_SYSTEMS);
  const [archivedSystems, setArchivedSystems] = useState<string[]>([]);
  const [activeSystem, setActiveSystem] = useState<string>('CARGO');
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

  // Filters & View Mode (Default is Smart Table 'table' for everyone)
  const [searchQuery, setSearchQuery] = useState('');
  const [testCaseFilter, setTestCaseFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState<StdPlatform | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<StdStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

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
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [isAdminReportOpen, setIsAdminReportOpen] = useState<boolean>(false);
  const [isAdminBackupOpen, setIsAdminBackupOpen] = useState<boolean>(false);

  // Live Notification Toast & Highlight
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(null);
  const prevIssuesRef = useRef<StdIssue[]>([]);
  const hasLoadedInitialStateRef = useRef<boolean>(false);

  const isAdmin = Boolean(authUser?.isAdmin);
  const currentUserName = authUser?.fullName || 'חבר צוות';
  const currentUserRole = authUser?.role || 'qa';
  const userTeamTitle = currentUserRole === 'dev' && !isAdmin ? 'צוות פיתוח' : 'צוות בדיקות';
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

        if (state.lastAction) {
          setLiveToast(`${state.lastUpdatedBy || 'חבר צוות'}: ${state.lastAction}`);
          setTimeout(() => setLiveToast(null), 4000);
        }
      }

      hasLoadedInitialStateRef.current = true;
      prevIssuesRef.current = state.issues;
      setSystems(state.systems);
      setArchivedSystems(state.archivedSystems || []);
      setIssues(state.issues);
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
        isAdminBackupOpen
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
        const nextId = getSuggestedTestCaseId();
        setEditingIssue({
          id: '__NEW_FROM_PASTE__',
          system: activeSystem === 'ALL' ? systems[0] || 'CARGO' : activeSystem,
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
    activeSystem,
    systems,
    issues,
    formattedUserDisplay
  ]);

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setAuthUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const handleLogoutUser = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const handleToggleAdmin = (code: string): boolean => {
    if (isAdminAccessCode(code) && authUser) {
      const updatedUser: AuthenticatedUser = {
        ...authUser,
        isAdmin: true
      };
      updatedUser.authSignature = computeUserAuthSignature(updatedUser);
      setAuthUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      return true;
    }
    return false;
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

  const handleAddSystem = (newSys: string) => {
    if (!isAdmin) return;
    if (systems.includes(newSys)) {
      setActiveSystem(newSys);
      return;
    }
    const nextArchived = archivedSystems.filter((s) => s !== newSys);
    const nextDeletedSystems = (syncService.getState().deletedSystemIds || []).filter(
      (s) => s !== newSys
    );
    const nextSystems = [...systems, newSys];
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    setActiveSystem(newSys);
    syncService.pushStateToCloud(
      {
        systems: nextSystems,
        archivedSystems: nextArchived,
        deletedSystemIds: nextDeletedSystems,
        issues
      },
      `הוספת מערכת חדשה (${newSys})`,
      currentUserName
    );
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
      setActiveSystem(nextSystems[0] || 'ALL');
    }
    setSystemToRemove(null);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues },
      `העברת מערכת לארכיון (${sysToArchive})`,
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
    setActiveSystem(sysToRestore);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues },
      `שחזור מערכת מהארכיון (${sysToRestore})`,
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

    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    setIssues(nextIssues);
    if (activeSystem === sysToDelete) {
      setActiveSystem(nextSystems[0] || 'ALL');
    }
    setSystemToRemove(null);
    syncService.pushStateToCloud(
      {
        systems: nextSystems,
        archivedSystems: nextArchived,
        deletedIssueIds: nextDeletedIssues,
        deletedSystemIds: nextDeletedSystems,
        issues: nextIssues
      },
      `מחיקת מערכת לצמיתות (${sysToDelete})`,
      currentUserName
    );
  };

  // Issues belonging to the currently selected system tab (excluding archived systems when viewing 'ALL')
  const systemIssues = useMemo(() => {
    if (activeSystem === 'ALL') {
      return issues.filter((i) => !archivedSystems.includes(i.system));
    }
    return issues.filter((i) => i.system === activeSystem);
  }, [issues, activeSystem, archivedSystems]);

  // Unique testCaseIds for autocomplete suggestions
  const availableTestCaseIds = useMemo(() => {
    const set = new Set<string>();
    systemIssues.forEach((i) => {
      if (i.testCaseId) set.add(i.testCaseId);
    });
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [systemIssues]);

  // Suggested next Test Case ID (safe reduce loop for large Excel datasets)
  const getSuggestedTestCaseId = () => {
    const nums = systemIssues
      .map((i) => parseInt(i.testCaseId, 10))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) return '10';
    const maxId = nums.reduce((max, n) => (n > max ? n : max), 0);
    return String(maxId + 1);
  };

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return systemIssues
      .filter((issue) => {
        if (platformFilter !== 'ALL' && issue.platform !== platformFilter) {
          return false;
        }
        if (statusFilter !== 'ALL' && issue.status !== statusFilter) {
          return false;
        }
        if (testCaseFilter.trim()) {
          if (!issue.testCaseId.toLowerCase().includes(testCaseFilter.trim().toLowerCase())) {
            return false;
          }
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
  }, [systemIssues, platformFilter, statusFilter, testCaseFilter, searchQuery]);

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

    if (isEditingExisting) {
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
              testCaseId: formData.testCaseId,
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
        `עריכת תסריט #${formData.testCaseId} (${formData.system})`,
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
        testCaseId: formData.testCaseId,
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
        `תקלה חדשה בתסריט #${formData.testCaseId} (${formData.system})`,
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
    setTestCaseFilter('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
  };

  const showLastEventBanner =
    Boolean(syncStatus.lastEventText) &&
    syncStatus.lastEventText !== dismissedLastEventText;

  // Render Interactive Notification Settings & App Installation Modal
  const renderInstallModal = () => {
    if (!isInstallModalOpen) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
                  notificationsEnabled && notifPrefs.enabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {notificationsEnabled && notifPrefs.enabled ? (
                  <BellRing className="w-6 h-6" />
                ) : (
                  <BellOff className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  הגדרות התראות ואפליקציה
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  התאם אישית אילו התראות תרצה לקבל בזמן אמת למכשיר
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Permission Status Banner */}
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
              notificationsEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
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
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-xs font-extrabold text-slate-800 mb-1">
              ניהול העדפות התראות:
            </div>

            {/* Master Switch */}
            <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-indigo-200 transition">
              <div>
                <div className="text-xs font-bold text-slate-900">קבלת התראות פעילה</div>
                <div className="text-[11px] text-slate-500">כיבוי או הדלקה של כל ההתראות במכשיר זה</div>
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
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">התראה על תקלה חדשה</div>
                <div className="text-[11px] text-slate-500">קבל הודעה בכל פעם שבודק מעלה תקלה חדשה</div>
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
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">התראה על שינוי סטטוס</div>
                <div className="text-[11px] text-slate-500">עדכון כשסטטוס משתנה (למשל: ניתן לבדוק שוב / נבדק תקין)</div>
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
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">התראה על הערה חדשה</div>
                <div className="text-[11px] text-slate-500">קבל הודעה כשמפתח או בודק מוסיפים הערה לתקלה</div>
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
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer transition ${
                !notifPrefs.enabled ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {notifPrefs.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">צליל התראה</div>
                  <div className="text-[11px] text-slate-500">השמע צליל בעת קבלת התראה חדשה</div>
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
          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
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

          <div className="flex justify-end pt-2 border-t border-slate-100">
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
        />
        {renderInstallModal()}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      {/* Top Navigation & System Bar */}
      <Navbar
        systems={systems}
        archivedSystems={archivedSystems}
        activeSystem={activeSystem}
        onSelectSystem={setActiveSystem}
        onAddSystem={handleAddSystem}
        onRequestRemoveSystem={(sys) => setSystemToRemove(sys)}
        onOpenArchiveModal={() => setIsArchiveModalOpen(true)}
        onOpenAdminReport={() => {
          if (isAdmin) setIsAdminReportOpen(true);
        }}
        onOpenAdminBackup={() => {
          if (isAdmin) setIsAdminBackupOpen(true);
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
        onToggleAdmin={handleToggleAdmin}
        onLogoutUser={handleLogoutUser}
        notificationsEnabled={notificationsEnabled}
        onInstallAndNotify={handleInstallAndNotify}
      />

      {/* Floating Real-Time Event Toast (when another team member updates something) */}
      {liveToast && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl border border-indigo-500/40 animate-bounce">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span className="rtl-safe">{liveToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Archived System Notice Banner if Admin is viewing an archived system */}
        {isAdmin && archivedSystems.includes(activeSystem) && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold">
              <Archive className="w-4 h-4 text-amber-600 shrink-0" />
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
              <div className="flex-1 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-l from-indigo-50 via-white to-violet-50 border border-indigo-100 text-xs text-slate-600 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <ClipboardPaste className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">קיצור דרך:</strong> צילמת מסך? לחץ{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-indigo-700 font-bold">
                      Ctrl + V
                    </kbd>{' '}
                    בעמוד כדי לפתוח מיד דיווח תקלה עם הצילום מוכן!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShortcutBanner(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer shrink-0"
                  title="סגור חלונית קיצור דרך"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {showLastEventBanner && (
              <div className="w-full sm:w-auto flex items-start sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-800 font-medium shadow-2xs">
                <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="rtl-safe leading-relaxed break-words">
                    <strong className="font-bold">פעולה אחרונה:</strong> {syncStatus.lastEventText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedLastEventText(syncStatus.lastEventText || '')}
                  className="p-1 rounded-lg text-emerald-600/70 hover:text-emerald-900 hover:bg-emerald-200/50 transition cursor-pointer shrink-0"
                  title="סגור חלונית פעולה אחרונה"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search, Filter & View Switcher Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          testCaseFilter={testCaseFilter}
          onTestCaseFilterChange={setTestCaseFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          availableTestCaseIds={availableTestCaseIds}
          systemIssues={systemIssues}
          filteredCount={filteredIssues.length}
          onExportCsv={handleExportCsv}
          onResetFilters={resetFilters}
        />

        {/* Issues Display: Cards Grid OR Smart Table */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-8 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              לא נמצאו תקלות התואמות לסינון
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              נסה לשנות את מילות החיפוש או לבחור מערכת אחרת.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
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
      </main>

      {/* Create / Edit Issue Modal (QA & Admin only) */}
      {isIssueModalOpen && canCreateOrEdit && (
        <IssueFormModal
          systems={systems}
          defaultSystem={activeSystem}
          suggestedTestCaseId={getSuggestedTestCaseId()}
          editingIssue={editingIssue}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  האם למחוק את התקלה?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed rtl-safe">
                  אתה עומד למחוק את <strong>תסריט #{issueToDelete.testCaseId}</strong> (
                  <span className="font-semibold text-slate-800">{issueToDelete.subject}</span>
                  ) ממערכת <strong className="bidi-isolate">{issueToDelete.system}</strong>.
                </p>
                <p className="text-xs text-red-600 font-medium">
                  פעולה זו תסיר את השורה אצל כל חברי הצוות ולא ניתן לבטלה.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIssueToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition cursor-pointer"
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

      {/* Admin Popup Modal Before Removing a System: Archive OR Permanent Delete */}
      {systemToRemove && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    ניהול מערכת: <span className="bidi-isolate text-indigo-700">{systemToRemove}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    במערכת זו קיימות כעת{' '}
                    <strong>{issues.filter((i) => i.system === systemToRemove).length}</strong>{' '}
                    תקלות מתועדות. מה תרצה לעשות?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSystemToRemove(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Send to Archive (Recommended) */}
              <button
                type="button"
                onClick={() => handleArchiveSystem(systemToRemove)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-right transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Archive className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      העבר מערכת לארכיון (מומלץ)
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      המערכת תוסתר מהסרגל של הצוות, אך כל התקלות שלה יישמרו בארכיון המנהל ותוכל לשחזר אותה בכל עת.
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 2: Permanent Delete */}
              <button
                type="button"
                onClick={() => handlePermanentDeleteSystem(systemToRemove)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-200 bg-red-50/40 hover:bg-red-50 text-right transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-red-700">
                      מחק מערכת וכל התקלות בה לצמיתות
                    </div>
                    <div className="text-xs text-red-600/80 mt-0.5">
                      זהירות: פעולה זו תמחק לצמיתות את המערכת ואת כל התקלות המשויכות אליה ללא אפשרות שחזור.
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSystemToRemove(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Archive Management Modal */}
      {isArchiveModalOpen && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
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
                <div className="text-center py-8 text-slate-500 text-sm">
                  אין כרגע מערכות בארכיון.
                </div>
              ) : (
                archivedSystems.map((sys) => {
                  const count = issues.filter((i) => i.system === sys).length;
                  return (
                    <div
                      key={sys}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm bidi-isolate">
                          {sys}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
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
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
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

            <div className="flex justify-end px-6 py-3 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
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
