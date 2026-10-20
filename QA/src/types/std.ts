export type StdPlatform = 'אייפון' | 'Safari' | 'Chrome' | 'מחשב';

export type StdStatus = 'פתוח' | 'בטיפול' | 'ניתן לבדוק שוב' | 'נבדק תקין';

export type TeamRole = 'qa' | 'dev';

export interface StdComment {
  id: string;
  author: string;
  role?: TeamRole;
  text: string;
  screenshot?: string;
  createdAt: number;
}

export interface StdIssue {
  id: string;
  system: string; // e.g., 'CARGO' | 'נשקי ערד'
  testCaseId: string; // e.g., '10', '11', '12'
  platform: StdPlatform;
  subject: string;
  description: string;
  status: StdStatus;
  screenshots: string[]; // Base64/DataURL or Cloud URLs
  comments: StdComment[];
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
  projectId?: string;
  errorMessage?: string;
  lastSyncAt?: number;
  lastEventText?: string;
}

export const PLATFORMS: StdPlatform[] = ['אייפון', 'Safari', 'Chrome', 'מחשב'];

export const STATUSES: StdStatus[] = ['פתוח', 'בטיפול', 'ניתן לבדוק שוב', 'נבדק תקין'];

export const DEFAULT_SYSTEMS: string[] = ['CARGO', 'נשקי ערד'];

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
    bgBadge: 'bg-red-50 hover:bg-red-100/80',
    textBadge: 'text-red-700',
    borderBadge: 'border-red-200',
    dotColor: 'bg-red-500',
    cardAccent: 'border-r-4 border-r-red-500',
    activeRing: 'ring-red-500/30',
    solidBg: 'bg-red-600 text-white'
  },
  'בטיפול': {
    label: 'בטיפול',
    bgBadge: 'bg-amber-50 hover:bg-amber-100/80',
    textBadge: 'text-amber-800',
    borderBadge: 'border-amber-200',
    dotColor: 'bg-amber-500',
    cardAccent: 'border-r-4 border-r-amber-500',
    activeRing: 'ring-amber-500/30',
    solidBg: 'bg-amber-500 text-white'
  },
  'ניתן לבדוק שוב': {
    label: 'ניתן לבדוק שוב',
    bgBadge: 'bg-blue-50 hover:bg-blue-100/80',
    textBadge: 'text-blue-700',
    borderBadge: 'border-blue-200',
    dotColor: 'bg-blue-500',
    cardAccent: 'border-r-4 border-r-blue-500',
    activeRing: 'ring-blue-500/30',
    solidBg: 'bg-blue-600 text-white'
  },
  'נבדק תקין': {
    label: 'נבדק תקין',
    bgBadge: 'bg-emerald-50 hover:bg-emerald-100/80',
    textBadge: 'text-emerald-700',
    borderBadge: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    cardAccent: 'border-r-4 border-r-emerald-500',
    activeRing: 'ring-emerald-500/30',
    solidBg: 'bg-emerald-600 text-white'
  }
};
