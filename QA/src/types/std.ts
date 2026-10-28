export type StdPlatform = 'IOS' | 'אנדרואיד' | 'מחשב';

export type StdStatus = 'פתוח' | 'בטיפול' | 'ניתן לבדוק שוב' | 'נבדק תקין';

export type StdSeverity = 'קריטית' | 'גבוהה' | 'בינונית' | 'נמוכה';

export type TeamRole = 'qa' | 'dev' | 'admin';

export interface StdComment {
  id: string;
  author: string;
  role?: TeamRole;
  text: string;
  screenshot?: string;
  createdAt: number;
}

export interface StdAuditEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: number;
}

export interface StdIssue {
  id: string;
  system: string; // e.g., 'CARGO' | 'נשקי ערד'
  testCaseId: string; // e.g., '10', '11', '12'
  platform: StdPlatform;
  severity?: StdSeverity;
  subject: string;
  description: string;
  status: StdStatus;
  screenshots: string[]; // Base64/DataURL or Cloud URLs
  comments: StdComment[];
  auditLog?: StdAuditEntry[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseConfigData {
  apiKey: string;
  authDomain?: string;
  databaseURL?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  mode?: 'rtdb' | 'firestore';
}

export type SyncConnectionMode = 'firebase-rtdb' | 'firebase-firestore' | 'live-server' | 'connecting' | 'error';

export interface SyncStatusInfo {
  mode: SyncConnectionMode;
  connected: boolean;
  onlineCount: number;
  onlineUsers?: string[];
  projectId?: string;
  errorMessage?: string;
  lastSyncAt?: number;
  lastEventText?: string;
}

export const PLATFORMS: StdPlatform[] = ['IOS', 'אנדרואיד', 'מחשב'];

export const STATUSES: StdStatus[] = ['פתוח', 'בטיפול', 'ניתן לבדוק שוב', 'נבדק תקין'];

export const SEVERITIES: StdSeverity[] = ['קריטית', 'גבוהה', 'בינונית', 'נמוכה'];

export const DEFAULT_SYSTEMS: string[] = ['CARGO', 'נשקי ערד'];

export const SEVERITY_CONFIG: Record<
  StdSeverity,
  {
    label: StdSeverity;
    bgBadge: string;
    textBadge: string;
    borderBadge: string;
    dotColor: string;
  }
> = {
  'קריטית': {
    label: 'קריטית',
    bgBadge: 'bg-rose-100 dark:bg-rose-950/70',
    textBadge: 'text-rose-800 dark:text-rose-200',
    borderBadge: 'border-rose-300 dark:border-rose-800',
    dotColor: 'bg-rose-600 dark:bg-rose-400'
  },
  'גבוהה': {
    label: 'גבוהה',
    bgBadge: 'bg-red-50 dark:bg-red-950/60',
    textBadge: 'text-red-700 dark:text-red-300',
    borderBadge: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500 dark:bg-red-400'
  },
  'בינונית': {
    label: 'בינונית',
    bgBadge: 'bg-amber-50 dark:bg-amber-950/60',
    textBadge: 'text-amber-800 dark:text-amber-300',
    borderBadge: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500 dark:bg-amber-400'
  },
  'נמוכה': {
    label: 'נמוכה',
    bgBadge: 'bg-emerald-50 dark:bg-emerald-950/60',
    textBadge: 'text-emerald-700 dark:text-emerald-300',
    borderBadge: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500 dark:bg-emerald-400'
  }
};

export const STATUS_CONFIG: Record<
  StdStatus,
  {
    label: StdStatus;
    bgBadge: string;
    textBadge: string;
    borderBadge: string;
    dotColor: string;
    cardAccent: string;
    activeRing: string;
    solidBg: string;
  }
> = {
  'פתוח': {
    label: 'פתוח',
    bgBadge: 'bg-red-50 hover:bg-red-100/80 dark:bg-red-950/70 dark:hover:bg-red-900/60',
    textBadge: 'text-red-700 dark:text-rose-300',
    borderBadge: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500 dark:bg-rose-400',
    cardAccent: 'border-r-4 border-r-red-500 dark:border-r-rose-500',
    activeRing: 'ring-red-500/30 dark:ring-rose-500/40',
    solidBg: 'bg-red-600 dark:bg-rose-600 text-white'
  },
  'בטיפול': {
    label: 'בטיפול',
    bgBadge: 'bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/70 dark:hover:bg-amber-900/60',
    textBadge: 'text-amber-800 dark:text-amber-300',
    borderBadge: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500 dark:bg-amber-400',
    cardAccent: 'border-r-4 border-r-amber-500',
    activeRing: 'ring-amber-500/30 dark:ring-amber-500/40',
    solidBg: 'bg-amber-500 dark:bg-amber-600 text-white'
  },
  'ניתן לבדוק שוב': {
    label: 'ניתן לבדוק שוב',
    bgBadge: 'bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/70 dark:hover:bg-blue-900/60',
    textBadge: 'text-blue-700 dark:text-sky-300',
    borderBadge: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500 dark:bg-sky-400',
    cardAccent: 'border-r-4 border-r-blue-500 dark:border-r-sky-500',
    activeRing: 'ring-blue-500/30 dark:ring-sky-500/40',
    solidBg: 'bg-blue-600 dark:bg-sky-600 text-white'
  },
  'נבדק תקין': {
    label: 'נבדק תקין',
    bgBadge: 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/60',
    textBadge: 'text-emerald-700 dark:text-emerald-300',
    borderBadge: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500 dark:bg-emerald-400',
    cardAccent: 'border-r-4 border-r-emerald-500',
    activeRing: 'ring-emerald-500/30 dark:ring-emerald-500/40',
    solidBg: 'bg-emerald-600 text-white'
  }
};
