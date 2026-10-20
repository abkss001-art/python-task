import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  DEFAULT_SYSTEMS,
  StdComment,
  StdIssue,
  StdPlatform,
  StdStatus,
  SyncStatusInfo,
  TeamRole
} from './types/std';
import { syncService } from './services/syncService';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { SmartTableView } from './components/SmartTableView';
import { IssueFormModal } from './components/IssueFormModal';
import { LightboxModal } from './components/LightboxModal';
import { FirebaseSetupModal } from './components/FirebaseSetupModal';
import { extractImagesFromClipboardEvent } from './utils/imageUtils';
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
  Eye
} from 'lucide-react';

const ADMIN_CODES = ['1108'];

export function App() {
  const [systems, setSystems] = useState<string[]>(DEFAULT_SYSTEMS);
  const [archivedSystems, setArchivedSystems] = useState<string[]>([]);
  const [activeSystem, setActiveSystem] = useState<string>('CARGO');
  const [issues, setIssues] = useState<StdIssue[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo>(syncService.getStatus());

  // Dismissible banners state (shown on entry, each has its own X button)
  const [showShortcutBanner, setShowShortcutBanner] = useState<boolean>(true);
  const [dismissedLastEventText, setDismissedLastEventText] = useState<string | null>(null);

  // Admin state (persisted only on the manager's browser)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (ADMIN_CODES.includes(params.get('admin') || '')) {
        localStorage.setItem('std_qa_is_admin_1108', 'true');
        return true;
      }
      return localStorage.getItem('std_qa_is_admin_1108') === 'true';
    } catch {
      return false;
    }
  });

  // User Profile (persisted per browser so comments carry tester/dev name)
  const [currentUserName, setCurrentUserName] = useState<string>(() => {
    return localStorage.getItem('std_qa_user_name') || 'בודק צוות';
  });
  const [currentUserRole, setCurrentUserRole] = useState<TeamRole>(() => {
    return (localStorage.getItem('std_qa_user_role') as TeamRole) || 'qa';
  });

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [testCaseFilter, setTestCaseFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState<StdPlatform | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<StdStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<StdIssue | null>(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  // Confirmation & Archive Modals
  const [issueToDelete, setIssueToDelete] = useState<StdIssue | null>(null);
  const [systemToRemove, setSystemToRemove] = useState<string | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);

  // Live Notification Toast & Highlight
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(null);
  const prevIssuesRef = useRef<StdIssue[]>([]);

  useEffect(() => {
    syncService.init();

    const unsubState = syncService.subscribeState((state, isRemoteUpdate) => {
      if (isRemoteUpdate && state.issues.length > 0) {
        const changed = state.issues.find((incoming) => {
          const prev = prevIssuesRef.current.find((p) => p.id === incoming.id);
          return !prev || prev.updatedAt !== incoming.updatedAt;
        });
        if (changed) {
          setHighlightedIssueId(changed.id);
          setTimeout(() => setHighlightedIssueId(null), 3000);
        }
        if (state.lastAction) {
          setLiveToast(`${state.lastUpdatedBy || 'חבר צוות'}: ${state.lastAction}`);
          setTimeout(() => setLiveToast(null), 4000);
        }
      }

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

  // Quick global Ctrl+V paste on the main board: opens New Issue Modal with the pasted screenshot!
  useEffect(() => {
    const handleBoardPaste = async (e: ClipboardEvent) => {
      if (
        isIssueModalOpen ||
        isFirebaseModalOpen ||
        lightboxData ||
        issueToDelete ||
        systemToRemove ||
        isArchiveModalOpen
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
          platform: 'אייפון',
          subject: '',
          description: '',
          status: 'פתוח',
          screenshots: pastedImages,
          comments: [],
          createdBy: currentUserName,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        setIsIssueModalOpen(true);
      }
    };

    window.addEventListener('paste', handleBoardPaste);
    return () => window.removeEventListener('paste', handleBoardPaste);
  });

  const handleToggleAdmin = (code: string): boolean => {
    if (ADMIN_CODES.includes(code)) {
      setIsAdmin(true);
      localStorage.setItem('std_qa_is_admin_1108', 'true');
      return true;
    }
    return false;
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('std_qa_is_admin_1108');
    if (archivedSystems.includes(activeSystem)) {
      setActiveSystem(systems[0] || 'ALL');
    }
  };

  const handleUpdateUser = (name: string, role: TeamRole) => {
    setCurrentUserName(name);
    setCurrentUserRole(role);
    localStorage.setItem('std_qa_user_name', name);
    localStorage.setItem('std_qa_user_role', role);
  };

  const handleAddSystem = (newSys: string) => {
    if (!isAdmin) return;
    if (systems.includes(newSys)) {
      setActiveSystem(newSys);
      return;
    }
    // If it was in archive, remove from archive and restore to active
    const nextArchived = archivedSystems.filter((s) => s !== newSys);
    const nextSystems = [...systems, newSys];
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    setActiveSystem(newSys);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues },
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
    const nextIssues = issues.filter((i) => i.system !== sysToDelete);
    setSystems(nextSystems);
    setArchivedSystems(nextArchived);
    if (activeSystem === sysToDelete) {
      setActiveSystem(nextSystems[0] || 'ALL');
    }
    setSystemToRemove(null);
    syncService.pushStateToCloud(
      { systems: nextSystems, archivedSystems: nextArchived, issues: nextIssues },
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

  // Suggested next Test Case ID
  const getSuggestedTestCaseId = () => {
    const nums = systemIssues
      .map((i) => parseInt(i.testCaseId, 10))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) return '10';
    return String(Math.max(...nums) + 1);
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
    subject: string;
    description: string;
    status: StdStatus;
    screenshots: string[];
    initialComment?: string;
  }) => {
    const isEditingExisting =
      editingIssue && editingIssue.id !== '__NEW_FROM_PASTE__';

    if (isEditingExisting) {
      const nextIssues = issues.map((item) =>
        item.id === editingIssue.id
          ? {
              ...item,
              system: formData.system,
              testCaseId: formData.testCaseId,
              platform: formData.platform,
              subject: formData.subject,
              description: formData.description,
              status: formData.status,
              screenshots: formData.screenshots,
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
          author: `${currentUserName} (${currentUserRole === 'dev' ? 'מפתח' : 'בודק'})`,
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
        subject: formData.subject,
        description: formData.description,
        status: formData.status,
        screenshots: formData.screenshots,
        comments,
        createdBy: `${currentUserName} (${currentUserRole === 'dev' ? 'מפתח' : 'בודק'})`,
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
    const nextIssues = issues.map((item) =>
      item.id === issueId
        ? { ...item, status: newStatus, updatedAt: Date.now() }
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
      author: `${currentUserName} (${currentUserRole === 'dev' ? 'מפתח' : 'בודק'})`,
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

  // Opens confirmation modal instead of deleting immediately!
  const handleRequestDeleteIssue = (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (target) {
      setIssueToDelete(target);
    }
  };

  const handleConfirmDeleteIssue = () => {
    if (!issueToDelete) return;
    const nextIssues = issues.filter((i) => i.id !== issueToDelete.id);
    syncService.pushStateToCloud(
      { systems, archivedSystems, issues: nextIssues },
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
      'מדווח',
      'מספר הערות',
      'הערה אחרונה'
    ];

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
        i.createdBy,
        String(i.comments.length),
        lastComment
      ].map((val) => `"${String(val).replace(/"/g, '""')}"`);
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
        issues={issues}
        syncStatus={syncStatus}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
        onUpdateUser={handleUpdateUser}
        onOpenNewIssue={() => {
          setEditingIssue(null);
          setIsIssueModalOpen(true);
        }}
        onOpenFirebaseModal={() => {
          if (isAdmin) setIsFirebaseModalOpen(true);
        }}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onLogoutAdmin={handleLogoutAdmin}
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
        {(showShortcutBanner || showLastEventBanner) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-4">
            {showShortcutBanner && (
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
              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-800 font-medium shadow-2xs shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="rtl-safe truncate">
                    פעולה אחרונה: {syncStatus.lastEventText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedLastEventText(syncStatus.lastEventText || '')}
                  className="p-1 rounded-lg text-emerald-600/70 hover:text-emerald-900 hover:bg-emerald-200/50 transition cursor-pointer shrink-0"
                  title="סגור חלונית פעולה אחרונה"
                >
                  <X className="w-3.5 h-3.5" />
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
              נסה לשנות את מילות החיפוש או לדווח על תקלה חדשה במערכת{' '}
              <span className="font-bold text-slate-800 bidi-isolate">
                {activeSystem === 'ALL' ? 'כל המערכות' : activeSystem}
              </span>
              .
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                איפוס סינונים
              </button>
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
                onStatusChange={handleStatusChange}
                onAddComment={handleAddComment}
                onEditIssue={(iss) => {
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
            onStatusChange={handleStatusChange}
            onAddComment={(id, text) => handleAddComment(id, text)}
            onEditIssue={(iss) => {
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

      {/* Create / Edit Issue Modal */}
      {isIssueModalOpen && (
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

      {/* Popup Confirmation Modal Before Deleting an Issue (Row or Card) */}
      {issueToDelete && (
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
    </div>
  );
}
export default App;
