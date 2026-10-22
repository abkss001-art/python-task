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
  StdAuditEntry,
  StdComment,
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

export interface SyncStatePayload {
  systems: string[];
  archivedSystems?: string[];
  deletedIssueIds?: string[];
  issues: StdIssue[];
  lastUpdatedBy?: string;
  lastAction?: string;
  updatedAt?: number;
  clientId?: string;
}

type StateListener = (state: SyncStatePayload, isRemoteUpdate: boolean) => void;
type StatusListener = (status: SyncStatusInfo) => void;

const CLOUD_TOPIC_STATE = 'std_qa_cloud_abkss001_v2/workspace_state';
const CLOUD_TOPIC_PRESENCE = 'std_qa_cloud_abkss001_v2/presence/';

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
  if (trimmed === 'IOS' || trimmed.toLowerCase() === 'ios' || trimmed === 'אייפון' || trimmed === 'Safari') {
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
    testCaseId: '10',
    platform: 'IOS',
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
        createdAt: Date.now() - 3600000 * 3
      },
      {
        id: 'c-2',
        author: 'רועי צוות פיתוח',
        role: 'dev',
        text: 'בודק את ה-Safe Area padding בתחתית המסך, מעלה תיקון לסביבת הבדיקות בקרוב.',
        createdAt: Date.now() - 3600000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'std-102',
    system: 'CARGO',
    testCaseId: '11',
    platform: 'מחשב',
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
        createdAt: Date.now() - 7200000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: Date.now() - 8600000,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'std-103',
    system: 'CARGO',
    testCaseId: '12',
    platform: 'אנדרואיד',
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
        createdAt: Date.now() - 1800000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: Date.now() - 14400000,
    updatedAt: Date.now() - 1800000
  },
  {
    id: 'std-201',
    system: 'נשקי ערד',
    testCaseId: '10',
    platform: 'מחשב',
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
        createdAt: Date.now() - 5400000
      },
      {
        id: 'c-6',
        author: 'מיכל צוות בדיקות',
        role: 'qa',
        text: 'נבדק שוב – התוצאות עולות תוך פחות מ-200ms. תקין!',
        createdAt: Date.now() - 2400000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: Date.now() - 18000000,
    updatedAt: Date.now() - 2400000
  }
];

class RealtimeSyncService {
  private clientId = `client-${Math.random().toString(36).substring(2, 9)}`;
  private stateListeners = new Set<StateListener>();
  private statusListeners = new Set<StatusListener>();

  private currentState: SyncStatePayload = {
    systems: DEFAULT_SYSTEMS,
    issues: INITIAL_DEMO_ISSUES
  };

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
  private broadcastChannel: BroadcastChannel | null = null;
  private activeFirebaseConfig: FirebaseConfigData | null = null;

  public init() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('std_qa_live_channel');
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'STATE_UPDATE' && data.payload) {
          const isRemote = data.payload.clientId !== this.clientId;
          this.currentState = data.payload;
          this.notifyState(isRemote);
        }
      };
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
    if (this.mqttClient) {
      try {
        this.mqttClient.end(true);
      } catch {
        // ignore
      }
      this.mqttClient = null;
    }
  }

  public async connectFirebase(config: FirebaseConfigData): Promise<{ ok: boolean; error?: string }> {
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
   * סנכרון ענן מובנה אוטומטי (פועל מיד גם ב-GitHub Pages ללא צורך בהגדרת מפתחות!)
   */
  public connectBuiltInCloudAndServer() {
    this.cleanupConnections();
    this.updateStatus({
      mode: 'live-server',
      connected: false,
      errorMessage: undefined
    });

    // Load cached state first from IndexedDB (unlimited capacity) or localStorage fallback
    const cached = localStorage.getItem('std_qa_fallback_cache');
    if (cached) {
      try {
        this.currentState = this.normalizePayload(JSON.parse(cached));
        this.notifyState(false);
      } catch {
        // ignore
      }
    }

    loadWorkspaceFromIndexedDB<SyncStatePayload>().then((idbState) => {
      if (idbState && idbState.updatedAt && idbState.updatedAt >= (this.currentState.updatedAt || 0)) {
        this.currentState = this.normalizePayload(idbState);
        this.notifyState(false);
      }
    });

    // 1. Connect to built-in Cloud WebSocket Broker (works globally 24/7 on GitHub Pages!)
    try {
      const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
        clientId: `std_qa_${this.clientId}`,
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

      client.on('connect', () => {
        this.updateStatus({
          mode: 'live-server',
          connected: true,
          errorMessage: undefined
        });

        client.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE}+`, { qos: 0 });

        // Announce presence
        client.publish(
          `${CLOUD_TOPIC_PRESENCE}${this.clientId}`,
          JSON.stringify({ online: true, ts: Date.now() }),
          { qos: 0, retain: true }
        );
      });

      client.on('message', (topic, message) => {
        try {
          if (topic === CLOUD_TOPIC_STATE) {
            const parsed = JSON.parse(message.toString());
            const normalized = this.normalizePayload(parsed);
            const isRemote = Boolean(normalized.clientId && normalized.clientId !== this.clientId);

            // Smart Merge so concurrent edits never overwrite each other
            const merged = isRemote
              ? this.mergeStates(this.currentState, normalized)
              : normalized;

            this.currentState = merged;
            this.persistCacheLocally(merged);

            this.updateStatus({
              mode: 'live-server',
              connected: true,
              lastSyncAt: Date.now(),
              lastEventText: normalized.lastAction
                ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
                : undefined
            });
            this.notifyState(isRemote);
          } else if (topic.startsWith(CLOUD_TOPIC_PRESENCE)) {
            const peerId = topic.replace(CLOUD_TOPIC_PRESENCE, '');
            const data = JSON.parse(message.toString());
            if (data && data.online) {
              this.activePeers.set(peerId, Date.now());
            } else {
              this.activePeers.delete(peerId);
            }
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

    // 2. Also connect to local Vite SSE server if running locally
    fetch('/api/std-state')
      .then((r) => {
        if (!r.ok) throw new Error('Not local server');
        return r.json();
      })
      .then((data) => {
        if (data.firebaseConfig && isValidFirebaseConfig(data.firebaseConfig) && !this.activeFirebaseConfig) {
          this.connectFirebase(data.firebaseConfig);
          return;
        }
        const normalized = this.normalizePayload(data);
        this.currentState = normalized;
        this.persistCacheLocally(normalized);
        this.updateStatus({
          mode: 'live-server',
          connected: true,
          onlineCount: Math.max(this.statusInfo.onlineCount, data.onlineCount || 1),
          lastSyncAt: Date.now()
        });
        this.notifyState(false);

        const es = new EventSource('/api/std-stream');
        this.eventSource = es;
        es.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'SYNC_STATE' && msg.payload) {
              const norm = this.normalizePayload(msg.payload);
              const isRemote = Boolean(norm.clientId && norm.clientId !== this.clientId);
              const merged = isRemote ? this.mergeStates(this.currentState, norm) : norm;
              this.currentState = merged;
              this.persistCacheLocally(merged);
              this.notifyState(isRemote);
            }
          } catch {
            // ignore
          }
        };
      })
      .catch(() => {
        // Running on GitHub Pages (static) - MQTT WebSocket cloud handles real-time sync!
      });
  }

  private persistCacheLocally(payload: SyncStatePayload) {
    saveWorkspaceToIndexedDB(payload);
    try {
      localStorage.setItem('std_qa_fallback_cache', JSON.stringify(payload));
    } catch {
      // IndexedDB handles large payloads when localStorage reaches 5MB
    }
  }

  /**
   * מיזוג חכם (Smart Merge) ברמת תקלה בודדת וברמת הערה/היסטוריה
   * מונע דריסת נתונים כאשר בודק ומפתח שומרים שינוי באותה שנייה במקביל
   */
  public mergeStates(local: SyncStatePayload, incoming: SyncStatePayload): SyncStatePayload {
    const incomingNewer = (incoming.updatedAt || 0) >= (local.updatedAt || 0);
    const primary = incomingNewer ? incoming : local;

    const deletedSet = new Set<string>([
      ...(local.deletedIssueIds || []),
      ...(incoming.deletedIssueIds || [])
    ]);

    const issueMap = new Map<string, StdIssue>();
    for (const iss of local.issues || []) {
      if (!deletedSet.has(iss.id)) {
        issueMap.set(iss.id, iss);
      }
    }

    for (const inc of incoming.issues || []) {
      if (deletedSet.has(inc.id)) continue;
      const existing = issueMap.get(inc.id);
      if (!existing) {
        issueMap.set(inc.id, inc);
      } else {
        // Merge comments by ID
        const commentMap = new Map<string, StdComment>();
        for (const c of existing.comments || []) commentMap.set(c.id, c);
        for (const c of inc.comments || []) commentMap.set(c.id, c);
        const mergedComments = Array.from(commentMap.values()).sort(
          (a, b) => a.createdAt - b.createdAt
        );

        // Merge auditLog by ID
        const auditMap = new Map<string, StdAuditEntry>();
        for (const a of existing.auditLog || []) auditMap.set(a.id, a);
        for (const a of inc.auditLog || []) auditMap.set(a.id, a);
        const mergedAudit = Array.from(auditMap.values()).sort(
          (a, b) => a.timestamp - b.timestamp
        );

        const winner = (inc.updatedAt || 0) >= (existing.updatedAt || 0) ? inc : existing;
        issueMap.set(inc.id, {
          ...winner,
          comments: mergedComments,
          auditLog: mergedAudit
        });
      }
    }

    const mergedIssues = Array.from(issueMap.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    return {
      systems: primary.systems,
      archivedSystems: primary.archivedSystems || [],
      deletedIssueIds: Array.from(deletedSet).slice(-200),
      issues: mergedIssues,
      lastUpdatedBy: incoming.lastUpdatedBy || local.lastUpdatedBy,
      lastAction: incoming.lastAction || local.lastAction,
      updatedAt: Math.max(local.updatedAt || 0, incoming.updatedAt || 0),
      clientId: incoming.clientId
    };
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
      ? raw.deletedIssueIds
      : raw?.deletedIssueIds && typeof raw.deletedIssueIds === 'object'
      ? Object.values(raw.deletedIssueIds)
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
        screenshots: Array.isArray(item.screenshots)
          ? item.screenshots
          : item.screenshots && typeof item.screenshots === 'object'
          ? Object.values(item.screenshots)
          : [],
        comments: (Array.isArray(item.comments)
          ? item.comments
          : item.comments && typeof item.comments === 'object'
          ? Object.values(item.comments)
          : []
        ).map((c: any) => ({
          ...c,
          author: formatLegacyAuthor(c?.author)
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

    return {
      systems,
      archivedSystems,
      deletedIssueIds,
      issues,
      lastUpdatedBy: raw?.lastUpdatedBy,
      lastAction: raw?.lastAction,
      updatedAt: raw?.updatedAt,
      clientId: raw?.clientId
    };
  }

  public async pushStateToCloud(
    nextState: {
      systems: string[];
      archivedSystems?: string[];
      deletedIssueIds?: string[];
      issues: StdIssue[];
    },
    actionSummary: string,
    actorName = 'חבר צוות'
  ) {
    const payload: SyncStatePayload = {
      systems: nextState.systems,
      archivedSystems: nextState.archivedSystems ?? this.currentState.archivedSystems ?? [],
      deletedIssueIds: nextState.deletedIssueIds ?? this.currentState.deletedIssueIds ?? [],
      issues: nextState.issues,
      lastUpdatedBy: actorName,
      lastAction: actionSummary,
      updatedAt: Date.now(),
      clientId: this.clientId
    };

    this.currentState = payload;
    this.notifyState(false);
    this.persistCacheLocally(payload);

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'STATE_UPDATE', payload });
      } catch {
        // ignore
      }
    }

    // 1. If connected to Firebase Firestore
    if (this.activeFirebaseConfig && this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
      const workspaceDocRef = doc(this.firestore, 'std_workspaces', 'main_workspace');
      await setDoc(workspaceDocRef, payload);
      return;
    }

    // 2. If connected to Firebase Realtime Database
    if (this.activeFirebaseConfig && this.rtdb) {
      const stateRef = ref(this.rtdb, 'std_workspace');
      await set(stateRef, payload);
      return;
    }

    // 3. Publish to built-in Cloud WebSocket Broker (retained so new visitors get latest state!)
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish(CLOUD_TOPIC_STATE, JSON.stringify(payload), {
          qos: 1,
          retain: true
        });
      } catch {
        // ignore
      }
    }

    // 4. Also push to local server if running locally
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
