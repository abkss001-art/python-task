import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  Database
} from 'firebase/database';
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  Firestore
} from 'firebase/firestore';
import mqtt, { MqttClient } from 'mqtt';
import {
  DEFAULT_SYSTEMS,
  FirebaseConfigData,
  StdIssue,
  StdSeverity,
  SyncStatusInfo
} from '../types/std';
import {
  isValidFirebaseConfig,
  loadActiveFirebaseConfig,
  saveFirebaseConfigLocally
} from '../firebaseConfig';
import {
  loadWorkspaceFromIndexedDB,
  saveWorkspaceToIndexedDB
} from '../utils/idbStorage';
import {
  getSavedGoogleDriveUrl,
  isDataUrlImage,
  saveAutoBackupToGoogleDrive,
  setSavedGoogleDriveUrl,
  uploadImageToGoogleDrive
} from './googleDriveService';
import {
  decodeProtectedUrl,
  encodeProtectedUrl,
  sanitizeImageUrl,
  CustomSecurityConfig,
  getStoredSecurityConfig,
  mergeCloudSecurityConfig,
  encryptSyncPayload,
  decryptSyncPayload
} from '../utils/securityUtils';
import {
  TeamMember,
  getStoredTeamMembers,
  mergeCloudTeamMembers
} from '../utils/teamMembers';

export interface SyncStatePayload {
  systems: string[];
  archivedSystems?: string[];
  deletedIssueIds?: string[];
  deletedSystemIds?: string[];
  issues: StdIssue[];
  teamMembers?: TeamMember[];
  securityConfig?: CustomSecurityConfig;
  lastUpdatedBy?: string;
  lastAction?: string;
  updatedAt?: number;
  revision?: number;
  clientId?: string;
  bytebinKey?: string;
  googleDriveUrl?: string;
}

type StateListener = (state: SyncStatePayload, isRemoteUpdate: boolean) => void;
type StatusListener = (status: SyncStatusInfo) => void;

const CLOUD_TOPIC_STATE = 'std_qa_cloud_abkss001_v2/workspace_state';
const CLOUD_TOPIC_STATE_V3 = 'std_qa_cloud_tzavman_v3/workspace_state';
const CLOUD_TOPIC_PRESENCE = 'std_qa_cloud_abkss001_v2/presence_active/';
const CLOUD_TOPIC_PRESENCE_LEGACY = 'std_qa_cloud_abkss001_v2/presence/';
const CLOUD_TOPIC_PRESENCE_V3 = 'std_qa_cloud_tzavman_v3/presence/';
const CLOUD_TOPIC_PING = 'std_qa_cloud_abkss001_v2/presence_ping';

const MAX_SAFE_MQTT_BYTES = 210_000; // Safe limit under broker.emqx.io 256KB max packet size
const BYTEBIN_POST_URL = 'https://bytebin.lucko.me/post';
const BYTEBIN_GET_BASE = 'https://bytebin.lucko.me/';
const REGISTRY_OBJECT_URL =
  'https://api.restful-api.dev/objects/ff808181a09d98f701a162fda3985338';

const AUTO_REFRESH_INTERVAL_MS = 5000; // Time-based auto-refresh every 5 seconds

function getPersistentClientId(): string {
  try {
    const saved = localStorage.getItem('std_qa_client_id');
    if (saved && saved.length > 4) return saved;
    const next = `client-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('std_qa_client_id', next);
    return next;
  } catch {
    return `client-${Math.random().toString(36).substring(2, 9)}`;
  }
}

function formatLegacyAuthor(rawName: string | undefined): string {
  if (!rawName || typeof rawName !== 'string') return 'צוות בדיקות';
  let cleaned = rawName.trim();
  if (cleaned === 'בודק צוות (בודק)' || cleaned === 'בודק צוות' || cleaned === 'בודק') {
    return 'צוות בדיקות';
  }
  cleaned = cleaned
    .replace(/\(\s*בודק\s*\)/g, 'צוות בדיקות')
    .replace(/\(\s*בודקת\s*\)/g, 'צוות בדיקות')
    .replace(/\(\s*מפתח\s*\)/g, 'צוות פיתוח')
    .replace(/^בודק צוות\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || 'צוות בדיקות';
}

function normalizePlatform(rawPlatform: string | undefined): 'IOS' | 'אנדרואיד' | 'מחשב' {
  if (!rawPlatform) return 'מחשב';
  const trimmed = rawPlatform.trim();
  if (
    trimmed === 'IOS' ||
    trimmed.toLowerCase() === 'ios' ||
    trimmed === 'אייפון' ||
    trimmed === 'Safari'
  ) {
    return 'IOS';
  }
  if (trimmed === 'אנדרואיד' || trimmed.toLowerCase() === 'android') {
    return 'אנדרואיד';
  }
  return 'מחשב';
}

const INITIAL_DEMO_ISSUES: StdIssue[] = [
  {
    id: 'std-101',
    system: 'CARGO',
    testCaseId: '1',
    platform: 'IOS',
    severity: 'גבוהה',
    subject: 'כפתור אישור משלוח נחתך במסך סיכום הזמנה',
    description:
      'בעת גלילה לתחתית מסך סיכום המשלוח במכשיר אייפון 15, כפתור "אשר ושלח" מוסתר חלקית על ידי סרגל הניווט התחתון ולא ניתן ללחוץ עליו במצב אנכי.',
    status: 'פתוח',
    screenshots: [],
    comments: [
      {
        id: 'c-1',
        author: 'דניאל צוות בדיקות',
        role: 'qa',
        text: 'שוחזר גם באייפון 14 וגם באייפון 15 Pro בגרסת iOS 17.4.',
        createdAt: 1700000000000 - 3600000 * 3
      },
      {
        id: 'c-2',
        author: 'רועי צוות פיתוח',
        role: 'dev',
        text: 'בודק את ה-Safe Area padding בתחתית המסך, מעלה תיקון לסביבת הבדיקות בקרוב.',
        createdAt: 1700000000000 - 3600000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: 1700000000000 - 3600000 * 4,
    updatedAt: 1700000000000 - 3600000
  },
  {
    id: 'std-102',
    system: 'CARGO',
    testCaseId: '2',
    platform: 'מחשב',
    severity: 'בינונית',
    subject: 'שגיאת חישוב משקל כולל בעת הוספת מכולה שנייה',
    description:
      'כאשר מוסיפים שתי מכולות באותה תעודת משלוח, השדה "משקל כולל (ק"ג)" מציג רק את המשקל של המכולה האחרונה במקום סכום המשקלים.',
    status: 'בטיפול',
    screenshots: [],
    comments: [
      {
        id: 'c-3',
        author: 'מיכל צוות בדיקות',
        role: 'qa',
        text: 'שימו לב שזה קורה רק כשמזינים משקל עם נקודה עשרונית.',
        createdAt: 1700000000000 - 7200000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: 1700000000000 - 8600000,
    updatedAt: 1700000000000 - 7200000
  },
  {
    id: 'std-103',
    system: 'CARGO',
    testCaseId: '3',
    platform: 'אנדרואיד',
    severity: 'בינונית',
    subject: 'ייצוא תעודת משלוח ל-PDF מציג גופן הפוך בעברית',
    description:
      'בלחיצה על "הורד PDF" במכשיר אנדרואיד, כותרות הטבלה בעברית מודפסות משמאל לימין.',
    status: 'ניתן לבדוק שוב',
    screenshots: [],
    comments: [
      {
        id: 'c-4',
        author: 'רועי צוות פיתוח',
        role: 'dev',
        text: 'עודכן הפונט המוטמע ב-PDF ותוקן כיוון ה-RTL. אשמח לבדיקה חוזרת.',
        createdAt: 1700000000000 - 1800000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: 1700000000000 - 14400000,
    updatedAt: 1700000000000 - 1800000
  },
  {
    id: 'std-201',
    system: 'נשקי ערד',
    testCaseId: '1',
    platform: 'מחשב',
    severity: 'נמוכה',
    subject: 'איטיות בטעינת קטלוג דגמים בחיפוש לפי מספר סידורי',
    description:
      'חיפוש מספר סידורי מלא בטבלת המלאי לוקח מעל 6 שניות וגורם לקפיאה זמנית של הממשק.',
    status: 'נבדק תקין',
    screenshots: [],
    comments: [
      {
        id: 'c-5',
        author: 'אלון צוות פיתוח',
        role: 'dev',
        text: 'נוסף אינדקס לחיפוש מהיר ובוצע Debounce לשדה החיפוש.',
        createdAt: 1700000000000 - 5400000
      },
      {
        id: 'c-6',
        author: 'מיכל צוות בדיקות',
        role: 'qa',
        text: 'נבדק שוב – התוצאות עולות תוך פחות מ-200ms. תקין!',
        createdAt: 1700000000000 - 2400000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: 1700000000000 - 18000000,
    updatedAt: 1700000000000 - 2400000
  }
];

class RealtimeSyncService {
  private clientId = getPersistentClientId();
  private stateListeners = new Set<StateListener>();
  private statusListeners = new Set<StatusListener>();

  private currentState: SyncStatePayload = {
    systems: DEFAULT_SYSTEMS,
    issues: INITIAL_DEMO_ISSUES,
    teamMembers: getStoredTeamMembers(),
    securityConfig: getStoredSecurityConfig(),
    revision: 0
  };

  private hasReceivedInitialCloud = false;
  private hasCheckedInitialRegistry = false;
  private highestSeenRevision = 0;
  private lastBytebinFetched = '';
  private lastAppliedFingerprint = '';
  private isOffloadingImages = false;
  private uploadedDriveUrlCache = new Map<string, string>();

  private statusInfo: SyncStatusInfo = {
    mode: 'connecting',
    connected: false,
    onlineCount: 1
  };

  private firebaseApp: FirebaseApp | null = null;
  private rtdb: Database | null = null;
  private firestore: Firestore | null = null;
  private unsubscribeFirebase: (() => void) | null = null;
  private unsubscribePresence: (() => void) | null = null;
  private eventSource: EventSource | null = null;
  private mqttClient: MqttClient | null = null;

  private activePeers = new Map<string, number>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private autoRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private activeFirebaseConfig: FirebaseConfigData | null = null;

  public init() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('std_qa_live_channel');
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'STATE_UPDATE' && data.payload) {
          const isRemote = data.payload.clientId !== this.clientId;
          const normalized = this.normalizePayload(data.payload);
          this.highestSeenRevision = Math.max(
            this.highestSeenRevision,
            normalized.revision || 0
          );
          this.currentState = normalized;
          this.notifyState(isRemote);
        }
      };
    }

    if (typeof window !== 'undefined') {
      const announceOffline = () => {
        if (this.mqttClient && this.mqttClient.connected) {
          try {
            const offMsg = JSON.stringify({ online: false });
            this.mqttClient.publish(`${CLOUD_TOPIC_PRESENCE}${this.clientId}`, offMsg, {
              qos: 0,
              retain: true
            });
            this.mqttClient.publish(`${CLOUD_TOPIC_PRESENCE_LEGACY}${this.clientId}`, offMsg, {
              qos: 0,
              retain: true
            });
            this.mqttClient.publish(`${CLOUD_TOPIC_PRESENCE_V3}${this.clientId}`, offMsg, {
              qos: 0,
              retain: true
            });
          } catch {
            // ignore
          }
        }
      };
      window.addEventListener('beforeunload', announceOffline);
      window.addEventListener('pagehide', announceOffline);

      // Instant pull from cloud whenever phone screen wakes up or user switches back to tab!
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.pullLatestFromCloud(true);
        }
      });
      window.addEventListener('focus', () => {
        this.pullLatestFromCloud(true);
      });
    }

    const initialFbConfig = loadActiveFirebaseConfig();
    if (initialFbConfig && isValidFirebaseConfig(initialFbConfig)) {
      this.connectFirebase(initialFbConfig);
    } else {
      this.connectBuiltInCloudAndServer();
    }
  }

  public getActiveFirebaseConfig(): FirebaseConfigData | null {
    return this.activeFirebaseConfig;
  }

  public getStatus(): SyncStatusInfo {
    return this.statusInfo;
  }

  public getState(): SyncStatePayload {
    return this.currentState;
  }

  public subscribeState(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    if (this.currentState.issues.length > 0 || this.currentState.systems.length > 0) {
      listener(this.currentState, false);
    }
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.statusInfo);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyState(isRemoteUpdate: boolean) {
    for (const listener of this.stateListeners) {
      listener(this.currentState, isRemoteUpdate);
    }
  }

  private updateStatus(partial: Partial<SyncStatusInfo>) {
    this.statusInfo = { ...this.statusInfo, ...partial };
    for (const listener of this.statusListeners) {
      listener(this.statusInfo);
    }
  }

  private persistLocally(payload: SyncStatePayload) {
    if (payload.teamMembers && payload.teamMembers.length > 0) {
      try {
        mergeCloudTeamMembers(payload.teamMembers);
      } catch {
        // ignore
      }
    }
    if (payload.securityConfig) {
      try {
        mergeCloudSecurityConfig(payload.securityConfig);
      } catch {
        // ignore
      }
    }
    saveWorkspaceToIndexedDB(payload);
    try {
      localStorage.setItem('std_qa_fallback_cache', JSON.stringify(payload));
    } catch {
      // If localStorage is full, save a stripped metadata cache (exclude heavy base64 strings)
      try {
        const lightCache: SyncStatePayload = {
          ...payload,
          issues: (payload.issues || []).map((iss) => ({
            ...iss,
            screenshots: (iss.screenshots || []).filter((s) => !isDataUrlImage(s)),
            comments: (iss.comments || []).map((c) => ({
              ...c,
              screenshot: c.screenshot && !isDataUrlImage(c.screenshot) ? c.screenshot : undefined
            }))
          }))
        };
        localStorage.setItem('std_qa_fallback_cache', JSON.stringify(lightCache));
      } catch {
        // IndexedDB handles full offline dataset
      }
    }
  }

  private computeFingerprint(state: SyncStatePayload): string {
    const tmCount = state.teamMembers ? state.teamMembers.length : 0;
    const tmHash = state.teamMembers ? state.teamMembers.map((m) => m.fullName).join('|') : '';
    return `${state.revision || 0}_${state.updatedAt || 0}_${state.issues.length}_${state.systems.join(',')}_${tmCount}_${tmHash}_${state.lastAction || ''}`;
  }

  private cleanupConnections() {
    if (this.unsubscribeFirebase) {
      this.unsubscribeFirebase();
      this.unsubscribeFirebase = null;
    }
    if (this.unsubscribePresence) {
      this.unsubscribePresence();
      this.unsubscribePresence = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
    if (this.mqttClient) {
      try {
        this.mqttClient.end(true);
      } catch {
        // ignore
      }
      this.mqttClient = null;
    }
  }

  public async connectFirebase(
    config: FirebaseConfigData
  ): Promise<{ ok: boolean; error?: string }> {
    this.cleanupConnections();
    this.activeFirebaseConfig = config;
    saveFirebaseConfigLocally(config);

    const useFirestore = config.mode === 'firestore';
    this.updateStatus({
      mode: useFirestore ? 'firebase-firestore' : 'firebase-rtdb',
      connected: false,
      projectId: config.projectId,
      errorMessage: undefined
    });

    try {
      const existingApps = getApps();
      for (const app of existingApps) {
        await deleteApp(app);
      }

      const firebaseOptions = {
        apiKey: config.apiKey,
        authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
        databaseURL:
          config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      };

      this.firebaseApp = initializeApp(firebaseOptions);

      if (useFirestore) {
        this.firestore = getFirestore(this.firebaseApp);
        const workspaceDocRef = doc(this.firestore, 'std_workspaces', 'main_workspace');

        this.unsubscribeFirebase = onSnapshot(
          workspaceDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as SyncStatePayload;
              const normalized = this.normalizePayload(data);
              const isRemote = Boolean(normalized.clientId && normalized.clientId !== this.clientId);
              this.currentState = normalized;
              this.persistLocally(normalized);
              this.updateStatus({
                mode: 'firebase-firestore',
                connected: true,
                projectId: config.projectId,
                lastSyncAt: Date.now(),
                lastEventText: normalized.lastAction
                  ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
                  : undefined,
                errorMessage: undefined
              });
              this.notifyState(isRemote);
            } else {
              this.pushStateToCloud(this.currentState, 'אתחול מסד נתונים בענן');
              this.updateStatus({
                mode: 'firebase-firestore',
                connected: true,
                projectId: config.projectId,
                lastSyncAt: Date.now()
              });
            }
          },
          (error) => {
            this.updateStatus({
              mode: 'error',
              connected: false,
              projectId: config.projectId,
              errorMessage: `שגיאת Firestore: ${error.message}`
            });
          }
        );
      } else {
        this.rtdb = getDatabase(this.firebaseApp);
        const stateRef = ref(this.rtdb, 'std_workspace');

        try {
          const myPresenceRef = ref(this.rtdb, `std_presence/${this.clientId}`);
          const allPresenceRef = ref(this.rtdb, 'std_presence');
          set(myPresenceRef, { online: true, seenAt: Date.now() }).catch(() => {});
          onDisconnect(myPresenceRef).remove().catch(() => {});

          this.unsubscribePresence = onValue(allPresenceRef, (snap) => {
            const val = snap.val();
            const count = val ? Object.keys(val).length : 1;
            this.updateStatus({ onlineCount: Math.max(1, count) });
          });
        } catch {
          // ignore
        }

        this.unsubscribeFirebase = onValue(
          stateRef,
          (snapshot) => {
            const data = snapshot.val() as SyncStatePayload | null;
            if (data) {
              const normalized = this.normalizePayload(data);
              const isRemote = Boolean(normalized.clientId && normalized.clientId !== this.clientId);
              this.currentState = normalized;
              this.persistLocally(normalized);
              this.updateStatus({
                mode: 'firebase-rtdb',
                connected: true,
                projectId: config.projectId,
                lastSyncAt: Date.now(),
                lastEventText: normalized.lastAction
                  ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
                  : undefined,
                errorMessage: undefined
              });
              this.notifyState(isRemote);
            } else {
              this.pushStateToCloud(this.currentState, 'אתחול נתונים ראשוני ב-Firebase');
              this.updateStatus({
                mode: 'firebase-rtdb',
                connected: true,
                projectId: config.projectId,
                lastSyncAt: Date.now()
              });
            }
          },
          (error) => {
            this.updateStatus({
              mode: 'error',
              connected: false,
              projectId: config.projectId,
              errorMessage: `שגיאת התחברות ל-Firebase Realtime DB: ${error.message}`
            });
          }
        );
      }

      return { ok: true };
    } catch (err: any) {
      const msg = err?.message || String(err);
      this.updateStatus({
        mode: 'error',
        connected: false,
        errorMessage: msg
      });
      return { ok: false, error: msg };
    }
  }

  public disconnectFirebaseAndUseLiveServer() {
    saveFirebaseConfigLocally(null);
    this.activeFirebaseConfig = null;
    this.connectBuiltInCloudAndServer();
  }

  /**
   * כפתור "סנכרון חי" או רענון יזום: מושך (Pull) את המצב העדכני ביותר מהענן מבלי לדרוס עם זיכרון מקומי ישן!
   */
  public requestManualSync() {
    this.pullLatestFromCloud(true);
  }

  /**
   * מנגנון הגנת "אפס מחיקה שקטה" (Anti-Wipe Union Merge):
   * שום תקלה או בקשה מאקסל לא יכולה להיעלם מעצמה לעולם!
   * תקלה מוסרת אך ורק אם המזהה שלה נמצא ברשימת המחוקים הרשמית של המנהל (deletedIssueIds / deletedSystemIds).
   */
  private mergeWorkspaceStates(
    localState: SyncStatePayload,
    incomingState: SyncStatePayload
  ): SyncStatePayload {
    const incomingIsNewer =
      (incomingState.revision || 0) >= (localState.revision || 0);
    const primary = incomingIsNewer ? incomingState : localState;

    const deletedIssueSet = new Set<string>([
      ...(localState.deletedIssueIds || []),
      ...(incomingState.deletedIssueIds || [])
    ]);

    const deletedSystemSet = new Set<string>([
      ...(localState.deletedSystemIds || []),
      ...(incomingState.deletedSystemIds || [])
    ]);

    // If a system was explicitly re-added in the newer state, un-delete it
    for (const s of primary.systems || []) {
      deletedSystemSet.delete(s);
    }

    const demoIds = new Set(['std-101', 'std-102', 'std-103', 'std-201']);
    const localIsInitialDemo =
      (localState.revision || 0) === 0 && (incomingState.revision || 0) > 0;
    const incomingIsInitialDemo =
      (incomingState.revision || 0) === 0 && (localState.revision || 0) > 0;

    const issueMap = new Map<string, StdIssue>();

    const mergeSingleIssue = (existing: StdIssue, candidate: StdIssue): StdIssue => {
      const winner =
        (candidate.updatedAt || 0) >= (existing.updatedAt || 0) ? candidate : existing;
      const loser = winner === candidate ? existing : candidate;

      // Preserve screenshots if one packet had stripped screenshots, and prefer Google Drive URLs
      const rawScreenshots =
        winner.screenshots && winner.screenshots.length > 0
          ? winner.screenshots
          : loser.screenshots || [];
      const mergedScreenshots = rawScreenshots.map(
        (sc) => this.uploadedDriveUrlCache.get(sc) || sc
      );

      // Union-merge comments by ID so no comment is ever lost
      const commentMap = new Map<string, any>();
      for (const c of loser.comments || []) {
        if (c && c.id) {
          commentMap.set(c.id, {
            ...c,
            screenshot: c.screenshot
              ? this.uploadedDriveUrlCache.get(c.screenshot) || c.screenshot
              : undefined
          });
        }
      }
      for (const c of winner.comments || []) {
        if (c && c.id) {
          const prev = commentMap.get(c.id);
          const sc = c.screenshot || prev?.screenshot;
          commentMap.set(c.id, {
            ...c,
            screenshot: sc ? this.uploadedDriveUrlCache.get(sc) || sc : undefined
          });
        }
      }
      const mergedComments = Array.from(commentMap.values()).sort(
        (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
      );

      // Union-merge auditLog by ID
      const auditMap = new Map<string, any>();
      for (const a of [...(loser.auditLog || []), ...(winner.auditLog || [])]) {
        if (a && a.id) auditMap.set(a.id, a);
      }
      const mergedAudit = Array.from(auditMap.values()).sort(
        (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
      );

      return {
        ...winner,
        screenshots: mergedScreenshots,
        comments: mergedComments,
        auditLog: mergedAudit
      };
    };

    // 1. Add all valid issues from localState
    for (const iss of localState.issues || []) {
      if (!iss || !iss.id) continue;
      if (deletedIssueSet.has(iss.id) || deletedSystemSet.has(iss.system)) continue;
      if (localIsInitialDemo && demoIds.has(iss.id)) continue;
      issueMap.set(iss.id, iss);
    }

    // 2. Merge all valid issues from incomingState
    for (const iss of incomingState.issues || []) {
      if (!iss || !iss.id) continue;
      if (deletedIssueSet.has(iss.id) || deletedSystemSet.has(iss.system)) continue;
      if (incomingIsInitialDemo && demoIds.has(iss.id)) continue;

      const existing = issueMap.get(iss.id);
      if (existing) {
        issueMap.set(iss.id, mergeSingleIssue(existing, iss));
      } else {
        issueMap.set(iss.id, {
          ...iss,
          screenshots: (iss.screenshots || []).map(
            (sc) => this.uploadedDriveUrlCache.get(sc) || sc
          )
        });
      }
    }

    const mergedIssues = Array.from(issueMap.values()).sort(
      (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
    );

    // Guarantee that every scenario within each system is uniquely numbered from 1 ascending
    const seenMergeBySys = new Map<string, Set<string>>();
    const maxMergeBySys = new Map<string, number>();
    for (const iss of mergedIssues) {
      const sys = iss.system;
      const num = parseInt(iss.testCaseId, 10);
      if (!isNaN(num) && num > (maxMergeBySys.get(sys) || 0)) {
        maxMergeBySys.set(sys, num);
      }
    }
    const chronologicalIssues = [...mergedIssues].sort(
      (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
    );
    for (const iss of chronologicalIssues) {
      const sys = iss.system;
      if (!seenMergeBySys.has(sys)) {
        seenMergeBySys.set(sys, new Set());
      }
      const seenSet = seenMergeBySys.get(sys)!;
      const trimmed = (iss.testCaseId || '').trim();
      if (!trimmed || seenSet.has(trimmed.toLowerCase())) {
        let nextN = (maxMergeBySys.get(sys) || 0) + 1;
        while (seenSet.has(String(nextN).toLowerCase())) {
          nextN++;
        }
        maxMergeBySys.set(sys, nextN);
        iss.testCaseId = String(nextN);
      } else {
        iss.testCaseId = trimmed;
      }
      seenSet.add(iss.testCaseId.toLowerCase());
    }

    const archivedSet = new Set<string>(
      (primary.archivedSystems || []).filter((s) => !deletedSystemSet.has(s))
    );

    const systemsSet = new Set<string>();
    for (const s of [...(primary.systems || []), ...(localState.systems || []), ...(incomingState.systems || [])]) {
      if (s && !deletedSystemSet.has(s) && !archivedSet.has(s)) {
        systemsSet.add(s);
      }
    }
    // Ensure any system that has active issues is visible in the systems bar
    for (const iss of mergedIssues) {
      if (iss.system && !deletedSystemSet.has(iss.system) && !archivedSet.has(iss.system)) {
        systemsSet.add(iss.system);
      }
    }
    // Explicitly purge any deleted or renamed systems from systemsSet
    for (const d of deletedSystemSet) {
      systemsSet.delete(d);
    }

    const finalSystems =
      systemsSet.size > 0 ? Array.from(systemsSet) : DEFAULT_SYSTEMS;

    const chosenTeamMembers =
      primary.teamMembers && primary.teamMembers.length > 0
        ? primary.teamMembers
        : incomingState.teamMembers && incomingState.teamMembers.length > 0
        ? incomingState.teamMembers
        : localState.teamMembers && localState.teamMembers.length > 0
        ? localState.teamMembers
        : getStoredTeamMembers();

    const mergedTeamMembers = mergeCloudTeamMembers(chosenTeamMembers);

    const mergedSecurityConfig: CustomSecurityConfig = {
      ...getStoredSecurityConfig(),
      ...(localState.securityConfig || {}),
      ...(incomingState.securityConfig || {})
    };
    if (Object.keys(mergedSecurityConfig).length > 0) {
      mergeCloudSecurityConfig(mergedSecurityConfig);
    }

    return {
      systems: finalSystems,
      archivedSystems: Array.from(archivedSet),
      deletedIssueIds: Array.from(deletedIssueSet),
      deletedSystemIds: Array.from(deletedSystemSet),
      issues: mergedIssues,
      teamMembers: mergedTeamMembers,
      securityConfig: Object.keys(mergedSecurityConfig).length > 0 ? mergedSecurityConfig : undefined,
      lastUpdatedBy: primary.lastUpdatedBy || localState.lastUpdatedBy,
      lastAction: primary.lastAction || localState.lastAction,
      updatedAt: Math.max(incomingState.updatedAt || 0, localState.updatedAt || 0),
      revision: Math.max(incomingState.revision || 0, localState.revision || 0),
      clientId: primary.clientId || this.clientId,
      bytebinKey: incomingState.bytebinKey || localState.bytebinKey,
      googleDriveUrl:
        incomingState.googleDriveUrl ||
        localState.googleDriveUrl ||
        getSavedGoogleDriveUrl() ||
        undefined
    };
  }

  /**
   * משיכה שקטה מהענן (פועלת אוטומטית כל 5 שניות, בעת פתיחת מסך הטלפון, ובלחיצה על "סנכרון חי")
   */
  private async pullLatestFromCloud(forceMqttResubscribe = false) {
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        if (forceMqttResubscribe || !this.hasReceivedInitialCloud) {
          this.mqttClient.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
        }
        // Ask all connected peers if anyone has a newer revision or more issues
        this.mqttClient.publish(
          CLOUD_TOPIC_PING,
          JSON.stringify({
            type: 'STATE_SYNC_CHECK',
            clientId: this.clientId,
            revision: this.currentState.revision || 0,
            issueCount: this.currentState.issues.length
          }),
          { qos: 0, retain: false }
        );
      } catch {
        // ignore
      }
    }

    // Only check the public fallback registry once on initial load if MQTT hasn't delivered yet
    if (this.hasReceivedInitialCloud || this.hasCheckedInitialRegistry) {
      return;
    }
    this.hasCheckedInitialRegistry = true;

    try {
      const regRes = await fetch(REGISTRY_OBJECT_URL, { cache: 'no-store' });
      if (!regRes.ok) return;
      const regJson = await regRes.json();
      const regData = regJson?.data;
      if (!regData || !regData.bytebinKey) return;

      const cloudRev = Number(regData.revision || 0);
      const localRev = Number(this.currentState.revision || 0);

      if (!this.hasReceivedInitialCloud && cloudRev >= localRev) {
        const bRes = await fetch(`${BYTEBIN_GET_BASE}${regData.bytebinKey}`, {
          cache: 'no-store'
        });
        if (!bRes.ok) return;
        const bText = await bRes.text();
        const decryptedText = await decryptSyncPayload(bText);
        const fullData = JSON.parse(decryptedText);
        if (fullData && Array.isArray(fullData.issues)) {
          this.lastBytebinFetched = regData.bytebinKey;
          const normalized = this.normalizePayload(fullData);
          if (cloudRev > (normalized.revision || 0)) {
            normalized.revision = cloudRev;
          }
          this.handleIncomingCloudState(normalized);
        }
      }
    } catch {
      // ignore network error during initial fallback check
    }
  }

  private handleIncomingCloudState(normalized: SyncStatePayload) {
    const incomingRev = Number(normalized.revision || 0);
    const localRev = Number(this.currentState.revision || 0);
    const isFirstLoad = !this.hasReceivedInitialCloud;

    // Always merge using Anti-Wipe Union Merge so no Excel rows or issues can ever be wiped by a stale device!
    const merged = this.mergeWorkspaceStates(this.currentState, normalized);
    const mergedFp = this.computeFingerprint(merged);

    this.hasReceivedInitialCloud = true;
    this.highestSeenRevision = Math.max(
      this.highestSeenRevision,
      incomingRev,
      localRev,
      merged.revision || 0
    );

    // If a remote device sent us a stale/partial list that was missing issues we already have (e.g. Excel rows),
    // heal the cloud immediately by re-publishing the complete merged list!
    const remoteWasMissingOurIssues =
      !isFirstLoad &&
      normalized.clientId &&
      normalized.clientId !== this.clientId &&
      merged.issues.length > normalized.issues.length;

    if (remoteWasMissingOurIssues) {
      const healedRev = this.highestSeenRevision + 1;
      this.highestSeenRevision = healedRev;
      merged.revision = healedRev;
    }

    if (mergedFp === this.lastAppliedFingerprint && !isFirstLoad && !remoteWasMissingOurIssues) {
      return;
    }
    this.lastAppliedFingerprint = this.computeFingerprint(merged);

    const isRemote = Boolean(
      !isFirstLoad && normalized.clientId && normalized.clientId !== this.clientId
    );

    this.currentState = merged;
    this.persistLocally(merged);

    this.updateStatus({
      mode: 'live-server',
      connected: true,
      lastSyncAt: Date.now(),
      lastEventText: merged.lastAction
        ? `${merged.lastUpdatedBy || 'צוות'}: ${merged.lastAction}`
        : undefined
    });
    this.notifyState(isRemote);

    if (remoteWasMissingOurIssues) {
      this.publishStateToMqtt(merged);
    }

    // If payload had heavy screenshots offloaded to bytebinKey, fetch and merge them seamlessly
    if (normalized.bytebinKey && normalized.bytebinKey !== this.lastBytebinFetched) {
      this.lastBytebinFetched = normalized.bytebinKey;
      fetch(`${BYTEBIN_GET_BASE}${normalized.bytebinKey}`)
        .then((r) => (r.ok ? r.text() : null))
        .then(async (bodyText) => {
          if (!bodyText) return;
          const decrypted = await decryptSyncPayload(bodyText);
          const fullData = JSON.parse(decrypted);
          if (fullData && Array.isArray(fullData.issues)) {
            const fullNorm = this.normalizePayload(fullData);
            const fullMerged = this.mergeWorkspaceStates(this.currentState, fullNorm);
            this.lastAppliedFingerprint = this.computeFingerprint(fullMerged);
            this.currentState = fullMerged;
            this.persistLocally(fullMerged);
            this.notifyState(false);
          }
        })
        .catch(() => {});
    }
  }

  /**
   * סנכרון ענן מובנה אוטומטי + רענון מחזורי לפי זמן (כל 5 שניות)
   */
  public connectBuiltInCloudAndServer() {
    this.cleanupConnections();
    this.hasReceivedInitialCloud = false;
    this.hasCheckedInitialRegistry = false;
    this.updateStatus({
      mode: 'live-server',
      connected: false,
      errorMessage: undefined
    });

    // 1. Load cached state locally for instant display ONLY (NEVER push on page load/refresh!)
    const cached = localStorage.getItem('std_qa_fallback_cache');
    if (cached) {
      try {
        const parsed = this.normalizePayload(JSON.parse(cached));
        this.currentState = parsed;
        this.highestSeenRevision = Math.max(this.highestSeenRevision, parsed.revision || 0);
        this.notifyState(false);
      } catch {
        // ignore
      }
    }

    loadWorkspaceFromIndexedDB<SyncStatePayload>().then((idbState) => {
      if (idbState && Array.isArray(idbState.issues)) {
        const normIdb = this.normalizePayload(idbState);
        const mergedLocal = this.mergeWorkspaceStates(this.currentState, normIdb);
        this.currentState = mergedLocal;
        this.highestSeenRevision = Math.max(
          this.highestSeenRevision,
          mergedLocal.revision || 0
        );
        this.notifyState(false);
      }
    });

    // 2. Start Time-Based Auto-Refresh every 5 seconds (suspended when tab is hidden to save mobile battery)
    this.autoRefreshTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      this.pullLatestFromCloud(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    // 3. Connect to built-in Cloud WebSocket Broker (wss://broker.emqx.io:8084/mqtt)
    try {
      const mqttSessionId = `std_qa_${this.clientId}_${Math.random().toString(36).substring(2, 6)}`;
      const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
        clientId: mqttSessionId,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 3000,
        will: {
          topic: `${CLOUD_TOPIC_PRESENCE}${this.clientId}`,
          payload: JSON.stringify({ online: false }),
          qos: 0,
          retain: true
        }
      });

      this.mqttClient = client;

      const publishPresenceOnline = () => {
        if (!client.connected) return;
        this.activePeers.set(this.clientId, Date.now());
        const onMsg = JSON.stringify({ online: true, clientId: this.clientId });
        client.publish(`${CLOUD_TOPIC_PRESENCE}${this.clientId}`, onMsg, {
          qos: 0,
          retain: true
        });
        client.publish(`${CLOUD_TOPIC_PRESENCE_LEGACY}${this.clientId}`, onMsg, {
          qos: 0,
          retain: true
        });
        client.publish(`${CLOUD_TOPIC_PRESENCE_V3}${this.clientId}`, onMsg, {
          qos: 0,
          retain: true
        });
        this.updateStatus({
          onlineCount: Math.max(1, this.activePeers.size)
        });
      };

      client.on('connect', () => {
        this.updateStatus({
          mode: 'live-server',
          connected: true,
          errorMessage: undefined
        });

        client.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE}+`, { qos: 0 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE_LEGACY}+`, { qos: 0 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE_V3}+`, { qos: 0 });
        client.subscribe(CLOUD_TOPIC_PING, { qos: 0 });

        publishPresenceOnline();

        client.publish(
          CLOUD_TOPIC_PING,
          JSON.stringify({
            type: 'STATE_SYNC_CHECK',
            clientId: this.clientId,
            revision: this.currentState.revision || 0,
            issueCount: this.currentState.issues.length
          }),
          { qos: 0, retain: false }
        );

        // Only if this device had an interrupted user save ('std_qa_pending_push' === '1'), complete it now
        if (localStorage.getItem('std_qa_pending_push') === '1') {
          this.publishStateToMqtt(this.currentState);
        }
      });

      this.heartbeatTimer = setInterval(() => {
        if (typeof document === 'undefined' || document.visibilityState === 'visible') {
          publishPresenceOnline();
        }
        const nowLocal = Date.now();
        for (const [id, seenAtLocal] of this.activePeers.entries()) {
          if (id !== this.clientId && nowLocal - seenAtLocal > 70000) {
            this.activePeers.delete(id);
          }
        }
        this.updateStatus({
          onlineCount: Math.max(1, this.activePeers.size)
        });
      }, 20000);

      client.on('message', async (topic, message) => {
        try {
          const rawStr = message.toString();
          if (!rawStr) return;

          if (topic === CLOUD_TOPIC_STATE) {
            const decryptedStr = await decryptSyncPayload(rawStr);
            const parsed = JSON.parse(decryptedStr);
            const normalized = this.normalizePayload(parsed);
            this.handleIncomingCloudState(normalized);
          } else if (topic === CLOUD_TOPIC_PING) {
            const data = JSON.parse(rawStr);
            if (data && data.clientId) {
              this.activePeers.set(data.clientId, Date.now());
              this.activePeers.set(this.clientId, Date.now());
              this.updateStatus({
                onlineCount: Math.max(1, this.activePeers.size)
              });
              if (data.clientId !== this.clientId) {
                if (data.type === 'PING') {
                  publishPresenceOnline();
                } else if (data.type === 'STATE_SYNC_CHECK') {
                  publishPresenceOnline();
                  const peerRev = Number(data.revision || 0);
                  const peerIssueCount = Number(data.issueCount || 0);
                  const myRev = Number(this.currentState.revision || 0);
                  const myIssueCount = this.currentState.issues.length;
                  // If we have a newer revision OR more non-deleted issues than the peer, broadcast our state!
                  if (myRev > peerRev || (myRev > 0 && myIssueCount > peerIssueCount)) {
                    this.publishStateToMqtt(this.currentState);
                  }
                }
              }
            }
          } else if (
            topic.startsWith(CLOUD_TOPIC_PRESENCE) ||
            topic.startsWith(CLOUD_TOPIC_PRESENCE_LEGACY) ||
            topic.startsWith(CLOUD_TOPIC_PRESENCE_V3)
          ) {
            const peerId = topic
              .replace(CLOUD_TOPIC_PRESENCE, '')
              .replace(CLOUD_TOPIC_PRESENCE_LEGACY, '')
              .replace(CLOUD_TOPIC_PRESENCE_V3, '');
            if (!peerId) return;

            const data = JSON.parse(rawStr);
            if (data && data.online) {
              this.activePeers.set(peerId, Date.now());
            } else {
              this.activePeers.delete(peerId);
            }
            this.activePeers.set(this.clientId, Date.now());
            this.updateStatus({
              onlineCount: Math.max(1, this.activePeers.size)
            });
          }
        } catch {
          // ignore malformed payload
        }
      });
    } catch {
      // ignore MQTT errors
    }
  }

  private async publishStateToMqtt(payload: SyncStatePayload) {
    try {
      const protectedPayload: SyncStatePayload = {
        ...payload,
        googleDriveUrl: encodeProtectedUrl(payload.googleDriveUrl)
      };
      const fullJsonStr = JSON.stringify(protectedPayload);
      let bytebinKey = protectedPayload.bytebinKey || '';

      // 1. If payload exceeds MQTT safe packet size (210KB), offload full snapshot to Bytebin
      if (fullJsonStr.length > MAX_SAFE_MQTT_BYTES) {
        try {
          const encryptedFullStr = await encryptSyncPayload(fullJsonStr);
          const bRes = await fetch(BYTEBIN_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: encryptedFullStr
          });
          if (bRes.ok) {
            const bJson = await bRes.json();
            if (bJson && bJson.key) {
              bytebinKey = String(bJson.key);
              this.lastBytebinFetched = bytebinKey;
            }
          }
        } catch {
          // ignore bytebin error
        }
      }

      // 2. Publish to primary MQTT state channel
      if (this.mqttClient && this.mqttClient.connected) {
        let mqttJsonStr = fullJsonStr;
        if (mqttJsonStr.length > MAX_SAFE_MQTT_BYTES) {
          const lightPayload: SyncStatePayload = {
            ...protectedPayload,
            bytebinKey: bytebinKey || undefined,
            issues: protectedPayload.issues.map((iss) => ({
              ...iss,
              screenshots: (iss.screenshots || []).filter((s) => !isDataUrlImage(s)),
              comments: (iss.comments || []).map((c) => ({
                ...c,
                screenshot:
                  c.screenshot && !isDataUrlImage(c.screenshot) ? c.screenshot : undefined
              }))
            }))
          };
          mqttJsonStr = JSON.stringify(lightPayload);
        }

        const encryptedMqttStr = await encryptSyncPayload(mqttJsonStr);
        this.mqttClient.publish(CLOUD_TOPIC_STATE, encryptedMqttStr, {
          qos: 1,
          retain: true
        });
      }

      localStorage.removeItem('std_qa_pending_push');
    } catch {
      // ignore
    }
  }

  private normalizePayload(raw: any): SyncStatePayload {
    const systems =
      Array.isArray(raw?.systems) && raw.systems.length > 0
        ? raw.systems
        : DEFAULT_SYSTEMS;

    const archivedSystems: string[] = Array.isArray(raw?.archivedSystems)
      ? raw.archivedSystems
      : raw?.archivedSystems && typeof raw.archivedSystems === 'object'
      ? Object.values(raw.archivedSystems)
      : [];

    const deletedIssueIds: string[] = Array.isArray(raw?.deletedIssueIds)
      ? raw.deletedIssueIds.map(String)
      : raw?.deletedIssueIds && typeof raw.deletedIssueIds === 'object'
      ? Object.values(raw.deletedIssueIds).map(String)
      : [];

    const deletedSystemIds: string[] = Array.isArray(raw?.deletedSystemIds)
      ? raw.deletedSystemIds.map(String)
      : raw?.deletedSystemIds && typeof raw.deletedSystemIds === 'object'
      ? Object.values(raw.deletedSystemIds).map(String)
      : [];

    let rawIssues: any[] = [];
    if (Array.isArray(raw?.issues)) {
      rawIssues = raw.issues;
    } else if (raw?.issues && typeof raw.issues === 'object') {
      rawIssues = Object.values(raw.issues);
    }

    const validSeverities: StdSeverity[] = ['קריטית', 'גבוהה', 'בינונית', 'נמוכה'];

    const issues: StdIssue[] = rawIssues
      .filter(Boolean)
      .map((item: any) => ({
        id: String(item.id || `std-${Date.now()}`),
        system: String(item.system || systems[0] || 'CARGO'),
        testCaseId: String(item.testCaseId || ''),
        platform: normalizePlatform(item.platform),
        severity: validSeverities.includes(item.severity) ? item.severity : 'בינונית',
        subject: String(item.subject || ''),
        description: String(item.description || ''),
        status: item.status || 'פתוח',
        screenshots: ((Array.isArray(item.screenshots)
          ? item.screenshots
          : item.screenshots && typeof item.screenshots === 'object'
          ? Object.values(item.screenshots)
          : []) as unknown[])
          .map(sanitizeImageUrl)
          .filter((s: string | null): s is string => Boolean(s)),
        comments: (Array.isArray(item.comments)
          ? item.comments
          : item.comments && typeof item.comments === 'object'
          ? Object.values(item.comments)
          : []
        ).map((c: any) => ({
          ...c,
          author: formatLegacyAuthor(c?.author),
          screenshot: sanitizeImageUrl(c?.screenshot) || undefined
        })),
        auditLog: Array.isArray(item.auditLog)
          ? item.auditLog
          : item.auditLog && typeof item.auditLog === 'object'
          ? Object.values(item.auditLog)
          : [],
        createdBy: formatLegacyAuthor(item.createdBy),
        createdAt: Number(item.createdAt || Date.now()),
        updatedAt: Number(item.updatedAt || Date.now())
      }));

    // Guarantee testCaseId is sequentially numbered per system starting from 1
    const seenNormBySys = new Map<string, Set<string>>();
    const maxNormBySys = new Map<string, number>();
    for (const iss of issues) {
      const sys = iss.system;
      const num = parseInt(iss.testCaseId, 10);
      if (!isNaN(num) && num > (maxNormBySys.get(sys) || 0)) {
        maxNormBySys.set(sys, num);
      }
    }
    const chronologicalNorm = [...issues].sort(
      (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
    );
    for (const iss of chronologicalNorm) {
      const sys = iss.system;
      if (!seenNormBySys.has(sys)) {
        seenNormBySys.set(sys, new Set());
      }
      const seenSet = seenNormBySys.get(sys)!;
      const trimmed = (iss.testCaseId || '').trim();
      if (!trimmed || seenSet.has(trimmed.toLowerCase())) {
        let nextN = (maxNormBySys.get(sys) || 0) + 1;
        while (seenSet.has(String(nextN).toLowerCase())) {
          nextN++;
        }
        maxNormBySys.set(sys, nextN);
        iss.testCaseId = String(nextN);
      } else {
        iss.testCaseId = trimmed;
      }
      seenSet.add(iss.testCaseId.toLowerCase());
    }

    const decodedDriveUrl = decodeProtectedUrl(raw?.googleDriveUrl);
    if (decodedDriveUrl) {
      setSavedGoogleDriveUrl(decodedDriveUrl);
    }

    let teamMembers: TeamMember[] | undefined = undefined;
    if (Array.isArray(raw?.teamMembers)) {
      teamMembers = raw.teamMembers;
    } else if (raw?.teamMembers && typeof raw.teamMembers === 'object') {
      teamMembers = Object.values(raw.teamMembers);
    }

    let securityConfig: CustomSecurityConfig | undefined = undefined;
    if (raw?.securityConfig && typeof raw.securityConfig === 'object') {
      securityConfig = raw.securityConfig;
    }

    return {
      systems,
      archivedSystems,
      deletedIssueIds,
      deletedSystemIds,
      issues,
      teamMembers,
      securityConfig,
      lastUpdatedBy: raw?.lastUpdatedBy,
      lastAction: raw?.lastAction,
      updatedAt: raw?.updatedAt,
      revision: Number(raw?.revision || 0),
      clientId: raw?.clientId,
      bytebinKey: raw?.bytebinKey,
      googleDriveUrl: decodedDriveUrl || getSavedGoogleDriveUrl() || undefined
    };
  }

  /**
   * מעלה אוטומטית ברקע תמונות Base64 חדשות ל-Google Drive (5TB) של המנהל ומחליף אותן בקישור קל!
   * בטוח לחלוטין מפני דריסת בקשות/אקסל שנוספו בזמן העלאת התמונות (מעדכן אך ורק קישורי תמונות על המצב החי הנוכחי).
   */
  private async offloadNewImagesToGoogleDriveInBackground(): Promise<void> {
    const driveUrl = getSavedGoogleDriveUrl();
    if (!driveUrl || this.isOffloadingImages) return;

    this.isOffloadingImages = true;
    try {
      let anyUploaded = false;
      const snapshotIssues = this.currentState.issues || [];

      for (const iss of snapshotIssues) {
        for (let i = 0; i < (iss.screenshots || []).length; i++) {
          const sc = iss.screenshots[i];
          if (isDataUrlImage(sc) && !this.uploadedDriveUrlCache.has(sc)) {
            const uploadedUrl = await uploadImageToGoogleDrive(sc, {
              system: iss.system,
              testCaseId: `${iss.testCaseId}_${i + 1}`
            });
            if (uploadedUrl && uploadedUrl !== sc) {
              this.uploadedDriveUrlCache.set(sc, uploadedUrl);
              anyUploaded = true;
            }
          }
        }

        for (const c of iss.comments || []) {
          if (
            c.screenshot &&
            isDataUrlImage(c.screenshot) &&
            !this.uploadedDriveUrlCache.has(c.screenshot)
          ) {
            const uploadedCommentUrl = await uploadImageToGoogleDrive(c.screenshot, {
              system: iss.system,
              testCaseId: `${iss.testCaseId}_הערה`
            });
            if (uploadedCommentUrl && uploadedCommentUrl !== c.screenshot) {
              this.uploadedDriveUrlCache.set(c.screenshot, uploadedCommentUrl);
              anyUploaded = true;
            }
          }
        }
      }

      if (anyUploaded) {
        // Apply uploaded Drive URLs directly onto the CURRENT live state without ever overwriting newly imported Excel rows!
        const liveIssues = (this.currentState.issues || []).map((iss) => ({
          ...iss,
          screenshots: (iss.screenshots || []).map(
            (sc) => this.uploadedDriveUrlCache.get(sc) || sc
          ),
          comments: (iss.comments || []).map((c) => ({
            ...c,
            screenshot: c.screenshot
              ? this.uploadedDriveUrlCache.get(c.screenshot) || c.screenshot
              : undefined
          }))
        }));

        const driveRev =
          Math.max(this.currentState.revision || 0, this.highestSeenRevision) + 1;
        this.highestSeenRevision = driveRev;

        const drivePayload: SyncStatePayload = {
          ...this.currentState,
          issues: liveIssues,
          revision: driveRev,
          updatedAt: Date.now(),
          googleDriveUrl: getSavedGoogleDriveUrl() || undefined
        };

        this.currentState = drivePayload;
        this.lastAppliedFingerprint = this.computeFingerprint(drivePayload);
        this.notifyState(false);
        this.persistLocally(drivePayload);
        await this.publishStateToMqtt(drivePayload);
      }

      // Always save the latest complete state to Google Drive auto-backup!
      saveAutoBackupToGoogleDrive(this.currentState);
    } catch {
      // ignore background drive error
    } finally {
      this.isOffloadingImages = false;
    }
  }

  public async pushStateToCloud(
    nextState: {
      systems: string[];
      archivedSystems?: string[];
      deletedIssueIds?: string[];
      deletedSystemIds?: string[];
      issues: StdIssue[];
      teamMembers?: TeamMember[];
      securityConfig?: CustomSecurityConfig;
      replaceAll?: boolean;
    },
    actionSummary: string,
    actorName = 'חבר צוות'
  ) {
    const nextRevision =
      Math.max(this.currentState.revision || 0, this.highestSeenRevision) + 1;
    this.highestSeenRevision = nextRevision;

    const effectiveTeamMembers =
      nextState.teamMembers ||
      this.currentState.teamMembers ||
      getStoredTeamMembers();
    const effectiveSecurityConfig =
      nextState.securityConfig ||
      this.currentState.securityConfig ||
      getStoredSecurityConfig();

    const candidatePayload: SyncStatePayload = {
      systems: nextState.systems,
      archivedSystems: nextState.archivedSystems ?? this.currentState.archivedSystems ?? [],
      deletedIssueIds:
        nextState.deletedIssueIds ?? this.currentState.deletedIssueIds ?? [],
      deletedSystemIds:
        nextState.deletedSystemIds ?? this.currentState.deletedSystemIds ?? [],
      issues: nextState.issues,
      teamMembers: effectiveTeamMembers,
      securityConfig: effectiveSecurityConfig,
      lastUpdatedBy: actorName,
      lastAction: actionSummary,
      updatedAt: Date.now(),
      revision: nextRevision,
      clientId: this.clientId,
      googleDriveUrl: getSavedGoogleDriveUrl() || undefined
    };

    // Apply Anti-Wipe Union Merge unless Admin explicitly requested a full backup replacement
    const payload: SyncStatePayload = nextState.replaceAll
      ? candidatePayload
      : this.mergeWorkspaceStates(this.currentState, candidatePayload);

    if (nextState.teamMembers) {
      payload.teamMembers = nextState.teamMembers;
    }
    if (nextState.securityConfig) {
      payload.securityConfig = nextState.securityConfig;
    }

    payload.revision = nextRevision;
    payload.lastUpdatedBy = actorName;
    payload.lastAction = actionSummary;
    payload.updatedAt = Date.now();
    payload.clientId = this.clientId;

    try {
      localStorage.setItem('std_qa_pending_push', '1');
    } catch {
      // ignore
    }

    this.currentState = payload;
    this.hasReceivedInitialCloud = true;
    this.lastAppliedFingerprint = this.computeFingerprint(payload);
    this.notifyState(false);
    this.persistLocally(payload);

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'STATE_UPDATE', payload });
      } catch {
        // ignore
      }
    }

    // 1. If connected to Firebase Firestore
    if (
      this.activeFirebaseConfig &&
      this.activeFirebaseConfig.mode === 'firestore' &&
      this.firestore
    ) {
      const workspaceDocRef = doc(this.firestore, 'std_workspaces', 'main_workspace');
      await setDoc(workspaceDocRef, payload);
      localStorage.removeItem('std_qa_pending_push');
      return;
    }

    // 2. If connected to Firebase Realtime Database
    if (this.activeFirebaseConfig && this.rtdb) {
      const stateRef = ref(this.rtdb, 'std_workspace');
      await set(stateRef, payload);
      localStorage.removeItem('std_qa_pending_push');
      return;
    }

    // 3. Publish immediately to MQTT
    await this.publishStateToMqtt(payload);

    // 4. If Google Drive (5TB) is connected, offload any new Base64 screenshots safely and update Drive backup
    if (getSavedGoogleDriveUrl()) {
      this.offloadNewImagesToGoogleDriveInBackground();
    }

    // 5. Also push to local server if running locally
    try {
      await fetch('/api/std-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // ignore on static hosting
    }
  }
}

export const syncService = new RealtimeSyncService();
