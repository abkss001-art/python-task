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

export interface SyncStatePayload {
  systems: string[];
  archivedSystems?: string[];
  deletedIssueIds?: string[];
  issues: StdIssue[];
  lastUpdatedBy?: string;
  lastAction?: string;
  updatedAt?: number;
  revision?: number;
  clientId?: string;
  bytebinKey?: string;
}

type StateListener = (state: SyncStatePayload, isRemoteUpdate: boolean) => void;
type StatusListener = (status: SyncStatusInfo) => void;

const CLOUD_TOPIC_STATE = 'std_qa_cloud_abkss001_v2/workspace_state';
const CLOUD_TOPIC_STATE_V3 = 'std_qa_cloud_tzavman_v3/workspace_state';
const CLOUD_TOPIC_PRESENCE = 'std_qa_cloud_abkss001_v2/presence_active/';
const CLOUD_TOPIC_PRESENCE_LEGACY = 'std_qa_cloud_abkss001_v2/presence/';
const CLOUD_TOPIC_PRESENCE_V3 = 'std_qa_cloud_tzavman_v3/presence/';
const CLOUD_TOPIC_PING = 'std_qa_cloud_abkss001_v2/presence_ping';

const MAX_SAFE_MQTT_BYTES = 210_000; // Well below broker.emqx.io 256KB packet limit
const BYTEBIN_POST_URL = 'https://bytebin.lucko.me/post';
const BYTEBIN_GET_BASE = 'https://bytebin.lucko.me/';

const DEMO_IDS = new Set(['std-101', 'std-102', 'std-103', 'std-201']);

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

function isDefaultDemoState(state: SyncStatePayload | null | undefined): boolean {
  if (!state) return true;
  if ((state.archivedSystems || []).length > 0) return false;
  if (state.systems.length !== 2 || state.systems[0] !== 'CARGO' || state.systems[1] !== 'נשקי ערד') {
    return false;
  }
  if (state.issues.length !== 4) return false;
  for (const iss of state.issues) {
    if (!DEMO_IDS.has(iss.id)) return false;
    if ((iss.screenshots || []).length > 0) return false;
  }
  return true;
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
    testCaseId: '10',
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
    testCaseId: '11',
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
    testCaseId: '12',
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
    testCaseId: '10',
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
    issues: INITIAL_DEMO_ISSUES
  };

  private hasReceivedInitialCloud = false;
  private lastBytebinFetched = '';

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
  // Maps peerId -> local timestamp (Date.now() on THIS device when peer was seen)
  private activePeers = new Map<string, number>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
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
    saveWorkspaceToIndexedDB(payload);
    try {
      localStorage.setItem('std_qa_fallback_cache', JSON.stringify(payload));
    } catch {
      // If > 5MB, IndexedDB stores the full state seamlessly
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
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
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
   * לחיצה על כפתור "סנכרון חי": משדר מיד את כל הנתונים המקומיים (כולל אקסל שיובא) לכל המכשירים!
   */
  public requestManualSync() {
    if (!isDefaultDemoState(this.currentState)) {
      this.publishStateToMqtt(this.currentState);
    }
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish(
          CLOUD_TOPIC_PING,
          JSON.stringify({ type: 'PING', clientId: this.clientId }),
          { qos: 0, retain: false }
        );
      } catch {
        // ignore
      }
    }
  }

  /**
   * סנכרון ענן מובנה אוטומטי (פועל מיד גם ב-GitHub Pages וגם במחשב ללא תלות בשעון המכשיר!)
   */
  public connectBuiltInCloudAndServer() {
    this.cleanupConnections();
    this.hasReceivedInitialCloud = false;
    this.updateStatus({
      mode: 'live-server',
      connected: false,
      errorMessage: undefined
    });

    // 1. Load cached state from localStorage and IndexedDB (supports large Excel imports)
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
      if (idbState && Array.isArray(idbState.issues)) {
        const normIdb = this.normalizePayload(idbState);
        if (
          !this.hasReceivedInitialCloud ||
          normIdb.issues.length > this.currentState.issues.length
        ) {
          this.currentState = normIdb;
          this.notifyState(false);
          // If IndexedDB had a larger state (e.g. Excel import), push it to cloud once connected
          if (this.mqttClient && this.mqttClient.connected && !isDefaultDemoState(normIdb)) {
            this.publishStateToMqtt(normIdb);
          }
        }
      }
    });

    // 2. Connect to built-in Cloud WebSocket Broker (wss://broker.emqx.io:8084/mqtt)
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
        // Publish to all presence topics so both v2 and v3 cached clients see us online!
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
        client.subscribe(CLOUD_TOPIC_STATE_V3, { qos: 1 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE}+`, { qos: 0 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE_LEGACY}+`, { qos: 0 });
        client.subscribe(`${CLOUD_TOPIC_PRESENCE_V3}+`, { qos: 0 });
        client.subscribe(CLOUD_TOPIC_PING, { qos: 0 });

        publishPresenceOnline();

        // Ping all currently connected browsers so everyone's online counter syncs immediately
        client.publish(
          CLOUD_TOPIC_PING,
          JSON.stringify({ type: 'PING', clientId: this.clientId }),
          { qos: 0, retain: false }
        );
      });

      this.heartbeatTimer = setInterval(() => {
        publishPresenceOnline();
        // Prune using ONLY local receiver clock (100% immune to clock skew between PC & phone!)
        const nowLocal = Date.now();
        for (const [id, seenAtLocal] of this.activePeers.entries()) {
          if (id !== this.clientId && nowLocal - seenAtLocal > 70000) {
            this.activePeers.delete(id);
          }
        }
        this.updateStatus({
          onlineCount: Math.max(1, this.activePeers.size)
        });
      }, 22000);

      client.on('message', (topic, message) => {
        try {
          const rawStr = message.toString();
          if (!rawStr) return;

          if (topic === CLOUD_TOPIC_STATE || topic === CLOUD_TOPIC_STATE_V3) {
            const parsed = JSON.parse(rawStr);
            const normalized = this.normalizePayload(parsed);
            const isRemote = Boolean(normalized.clientId && normalized.clientId !== this.clientId);

            // On initial connect retained message: if this computer has an unsynced Excel import
            // (more issues locally than in the cloud), push the computer's fuller state to the cloud!
            if (
              !this.hasReceivedInitialCloud &&
              !isDefaultDemoState(this.currentState) &&
              this.currentState.issues.length > normalized.issues.length
            ) {
              this.hasReceivedInitialCloud = true;
              this.publishStateToMqtt(this.currentState);
              return;
            }

            this.hasReceivedInitialCloud = true;
            this.currentState = normalized;
            this.persistLocally(normalized);

            this.updateStatus({
              mode: 'live-server',
              connected: true,
              lastSyncAt: Date.now(),
              lastEventText: normalized.lastAction
                ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
                : undefined
            });
            this.notifyState(isRemote);

            // If payload had heavy screenshots offloaded to bytebinKey, fetch and restore them
            if (
              normalized.bytebinKey &&
              normalized.bytebinKey !== this.lastBytebinFetched
            ) {
              this.lastBytebinFetched = normalized.bytebinKey;
              fetch(`${BYTEBIN_GET_BASE}${normalized.bytebinKey}`)
                .then((r) => (r.ok ? r.json() : null))
                .then((fullData) => {
                  if (fullData && Array.isArray(fullData.issues)) {
                    const fullNorm = this.normalizePayload(fullData);
                    this.currentState = fullNorm;
                    this.persistLocally(fullNorm);
                    this.notifyState(false);
                  }
                })
                .catch(() => {});
            }
          } else if (topic === CLOUD_TOPIC_PING) {
            const data = JSON.parse(rawStr);
            if (data && data.clientId) {
              this.activePeers.set(data.clientId, Date.now());
              this.activePeers.set(this.clientId, Date.now());
              this.updateStatus({
                onlineCount: Math.max(1, this.activePeers.size)
              });
              if (data.type === 'PING' && data.clientId !== this.clientId) {
                publishPresenceOnline();
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
            // Record using THIS device's Date.now() so clock differences between PC & Phone never break presence!
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
    if (!this.mqttClient || !this.mqttClient.connected) return;

    try {
      let jsonStr = JSON.stringify(payload);

      // If state + screenshots + Excel rows exceeds 210KB, offload heavy base64 images to Bytebin
      // so the MQTT packet stays < 210KB (with ALL Excel issues included!) and broker.emqx.io never drops it!
      if (jsonStr.length > MAX_SAFE_MQTT_BYTES) {
        let bytebinKey = payload.bytebinKey || '';
        try {
          const bRes = await fetch(BYTEBIN_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStr
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

        const lightPayload: SyncStatePayload = {
          ...payload,
          bytebinKey: bytebinKey || undefined,
          issues: payload.issues.map((iss) => ({
            ...iss,
            screenshots: [],
            comments: (iss.comments || []).map((c) => ({ ...c, screenshot: undefined }))
          }))
        };
        jsonStr = JSON.stringify(lightPayload);
      }

      this.mqttClient.publish(CLOUD_TOPIC_STATE, jsonStr, {
        qos: 1,
        retain: true
      });
      this.mqttClient.publish(CLOUD_TOPIC_STATE_V3, jsonStr, {
        qos: 1,
        retain: true
      });
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
      issues,
      lastUpdatedBy: raw?.lastUpdatedBy,
      lastAction: raw?.lastAction,
      updatedAt: raw?.updatedAt,
      revision: Number(raw?.revision || 0),
      clientId: raw?.clientId,
      bytebinKey: raw?.bytebinKey
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
      issues: nextState.issues,
      lastUpdatedBy: actorName,
      lastAction: actionSummary,
      updatedAt: Date.now(),
      revision: (this.currentState.revision || 0) + 1,
      clientId: this.clientId
    };

    this.currentState = payload;
    this.hasReceivedInitialCloud = true;
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
      return;
    }

    // 2. If connected to Firebase Realtime Database
    if (this.activeFirebaseConfig && this.rtdb) {
      const stateRef = ref(this.rtdb, 'std_workspace');
      await set(stateRef, payload);
      return;
    }

    // 3. Publish to built-in Cloud WebSocket Broker (with automatic >210KB large Excel/screenshot handling)
    await this.publishStateToMqtt(payload);

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
