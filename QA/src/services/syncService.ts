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

const TOPIC_NAMESPACE = 'std_qa_cloud_tzavman_v3';
const CLOUD_TOPIC_STATE = `${TOPIC_NAMESPACE}/workspace_state`;
const CLOUD_TOPIC_MANIFEST = `${TOPIC_NAMESPACE}/manifest`;
const CLOUD_TOPIC_CHUNK_PREFIX = `${TOPIC_NAMESPACE}/chunk/`;
const CLOUD_TOPIC_CONTROL = `${TOPIC_NAMESPACE}/control`;
const CLOUD_TOPIC_PRESENCE = `${TOPIC_NAMESPACE}/presence/`;

// Legacy topic subscription so existing data from v2 is also picked up seamlessly
const LEGACY_TOPIC_STATE_V2 = 'std_qa_cloud_abkss001_v2/workspace_state';

const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];

const CHUNK_SIZE = 28_000; // 28KB per MQTT packet - guaranteed to pass all public brokers & retain!
const DEMO_BASE_TS = 1700000000000;

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
        createdAt: DEMO_BASE_TS - 3600000 * 3
      },
      {
        id: 'c-2',
        author: 'רועי צוות פיתוח',
        role: 'dev',
        text: 'בודק את ה-Safe Area padding בתחתית המסך, מעלה תיקון לסביבת הבדיקות בקרוב.',
        createdAt: DEMO_BASE_TS - 3600000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: DEMO_BASE_TS - 3600000 * 4,
    updatedAt: DEMO_BASE_TS - 3600000
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
        createdAt: DEMO_BASE_TS - 7200000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: DEMO_BASE_TS - 8600000,
    updatedAt: DEMO_BASE_TS - 7200000
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
        createdAt: DEMO_BASE_TS - 1800000
      }
    ],
    createdBy: 'דניאל צוות בדיקות',
    createdAt: DEMO_BASE_TS - 14400000,
    updatedAt: DEMO_BASE_TS - 1800000
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
        createdAt: DEMO_BASE_TS - 5400000
      },
      {
        id: 'c-6',
        author: 'מיכל צוות בדיקות',
        role: 'qa',
        text: 'נבדק שוב – התוצאות עולות תוך פחות מ-200ms. תקין!',
        createdAt: DEMO_BASE_TS - 2400000
      }
    ],
    createdBy: 'מיכל צוות בדיקות',
    createdAt: DEMO_BASE_TS - 18000000,
    updatedAt: DEMO_BASE_TS - 2400000
  }
];

interface ChunkManifest {
  transferId: string;
  totalChunks: number;
  updatedAt: number;
  clientId: string;
}

interface ChunkPacket {
  transferId: string;
  chunkIndex: number;
  totalChunks: number;
  updatedAt: number;
  clientId: string;
  data: string;
}

class RealtimeSyncService {
  private clientId = `client-${Math.random().toString(36).substring(2, 9)}`;
  private stateListeners = new Set<StateListener>();
  private statusListeners = new Set<StatusListener>();

  private currentState: SyncStatePayload = {
    systems: DEFAULT_SYSTEMS,
    issues: INITIAL_DEMO_ISSUES,
    updatedAt: DEMO_BASE_TS
  };

  private hasLoadedRealState = false;

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
  private mqttClients: MqttClient[] = [];
  private activePeers = new Map<string, number>();
  private broadcastChannel: BroadcastChannel | null = null;
  private activeFirebaseConfig: FirebaseConfigData | null = null;

  // Chunk reassembly buffers
  private activeManifest: ChunkManifest | null = null;
  private chunkBuffers = new Map<string, Map<number, string>>();
  private chunkTotals = new Map<string, number>();
  private processedTransferIds = new Set<string>();
  private lastPeerRespondAt = 0;

  public init() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('std_qa_live_channel');
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'STATE_UPDATE' && data.payload) {
          const isRemote = data.payload.clientId !== this.clientId;
          this.applyIncomingState(data.payload, isRemote);
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
    for (const c of this.mqttClients) {
      try {
        c.end(true);
      } catch {
        // ignore
      }
    }
    this.mqttClients = [];
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
              this.applyIncomingState(normalized, isRemote);
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
              this.applyIncomingState(normalized, isRemote);
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
   * סנכרון ידני מיידי בלחיצת כפתור: מושך ומשדר את המצב העדכני ביותר בין כל המכשירים
   */
  public requestManualSync() {
    for (const client of this.mqttClients) {
      if (!client.connected) continue;
      try {
        client.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
        client.subscribe(CLOUD_TOPIC_MANIFEST, { qos: 1 });
        client.subscribe(`${CLOUD_TOPIC_CHUNK_PREFIX}+`, { qos: 1 });
        client.publish(
          CLOUD_TOPIC_CONTROL,
          JSON.stringify({
            type: 'REQUEST_STATE',
            clientId: this.clientId,
            ts: Date.now()
          }),
          { qos: 0, retain: false }
        );
      } catch {
        // ignore
      }
    }

    if (this.hasLoadedRealState && (this.currentState.updatedAt || 0) > DEMO_BASE_TS) {
      this.publishToMqttBrokers(this.currentState);
    }
  }

  private applyIncomingState(normalized: SyncStatePayload, isRemote: boolean) {
    const incomingTs = normalized.updatedAt || 0;
    const localTs = this.currentState.updatedAt || 0;

    if (!this.hasLoadedRealState || incomingTs >= localTs) {
      // If edits happened within 4 seconds of each other on different clients, smart-merge;
      // otherwise take the newer state authoritatively so deletions and edits apply cleanly!
      if (
        this.hasLoadedRealState &&
        isRemote &&
        Math.abs(incomingTs - localTs) < 4000
      ) {
        this.currentState = this.mergeStates(this.currentState, normalized);
      } else {
        this.currentState = normalized;
      }
      this.hasLoadedRealState = true;
      this.persistCacheLocally(this.currentState);
      this.notifyState(isRemote);
    }
  }

  /**
   * סנכרון ענן מרובה-שרתים מובנה + פיצול חבילות (Chunking) לתמיכה מלאה בצילומי מסך!
   */
  public connectBuiltInCloudAndServer() {
    this.cleanupConnections();
    this.updateStatus({
      mode: 'live-server',
      connected: false,
      errorMessage: undefined
    });

    // Load cached state from localStorage / IndexedDB
    const cached = localStorage.getItem('std_qa_fallback_cache');
    if (cached) {
      try {
        const parsed = this.normalizePayload(JSON.parse(cached));
        if ((parsed.updatedAt || 0) > DEMO_BASE_TS) {
          this.currentState = parsed;
          this.hasLoadedRealState = true;
          this.notifyState(false);
        }
      } catch {
        // ignore
      }
    }

    loadWorkspaceFromIndexedDB<SyncStatePayload>().then((idbState) => {
      if (
        idbState &&
        idbState.updatedAt &&
        idbState.updatedAt > DEMO_BASE_TS &&
        idbState.updatedAt >= (this.currentState.updatedAt || 0)
      ) {
        this.currentState = this.normalizePayload(idbState);
        this.hasLoadedRealState = true;
        this.notifyState(false);
      }
    });

    // 1. Connect to Multiple Redundant Global WebSocket Brokers
    for (const brokerUrl of MQTT_BROKERS) {
      try {
        const client = mqtt.connect(brokerUrl, {
          clientId: `tzavman_${this.clientId}_${Math.random().toString(36).substring(2, 5)}`,
          clean: true,
          connectTimeout: 7000,
          reconnectPeriod: 3500,
          will: {
            topic: `${CLOUD_TOPIC_PRESENCE}${this.clientId}`,
            payload: JSON.stringify({ online: false }),
            qos: 0,
            retain: true
          }
        });

        this.mqttClients.push(client);

        client.on('connect', () => {
          this.updateStatus({
            mode: 'live-server',
            connected: true,
            errorMessage: undefined
          });

          client.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
          client.subscribe(LEGACY_TOPIC_STATE_V2, { qos: 0 });
          client.subscribe(CLOUD_TOPIC_MANIFEST, { qos: 1 });
          client.subscribe(`${CLOUD_TOPIC_CHUNK_PREFIX}+`, { qos: 1 });
          client.subscribe(CLOUD_TOPIC_CONTROL, { qos: 0 });
          client.subscribe(`${CLOUD_TOPIC_PRESENCE}+`, { qos: 0 });

          // Announce presence
          client.publish(
            `${CLOUD_TOPIC_PRESENCE}${this.clientId}`,
            JSON.stringify({ online: true, ts: Date.now() }),
            { qos: 0, retain: true }
          );

          // Request latest state from any active peers
          client.publish(
            CLOUD_TOPIC_CONTROL,
            JSON.stringify({
              type: 'REQUEST_STATE',
              clientId: this.clientId,
              currentUpdatedAt: this.currentState.updatedAt || 0
            }),
            { qos: 0, retain: false }
          );
        });

        client.on('message', (topic, message) => {
          try {
            const rawStr = message.toString();
            if (!rawStr) return;

            if (topic === CLOUD_TOPIC_STATE || topic === LEGACY_TOPIC_STATE_V2) {
              const parsed = JSON.parse(rawStr);
              const normalized = this.normalizePayload(parsed);
              const isRemote = Boolean(
                normalized.clientId && normalized.clientId !== this.clientId
              );
              this.applyIncomingState(normalized, isRemote);
              this.updateStatus({
                mode: 'live-server',
                connected: true,
                lastSyncAt: Date.now(),
                lastEventText: normalized.lastAction
                  ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
                  : undefined
              });
            } else if (topic === CLOUD_TOPIC_MANIFEST) {
              const manifest = JSON.parse(rawStr) as ChunkManifest;
              if (
                manifest &&
                manifest.transferId &&
                manifest.updatedAt >= (this.currentState.updatedAt || 0)
              ) {
                this.activeManifest = manifest;
                this.chunkTotals.set(manifest.transferId, manifest.totalChunks);
                this.tryAssembleChunks(manifest.transferId, manifest.clientId);
              }
            } else if (topic.startsWith(CLOUD_TOPIC_CHUNK_PREFIX)) {
              const pkt = JSON.parse(rawStr) as ChunkPacket;
              if (!pkt || !pkt.transferId || typeof pkt.chunkIndex !== 'number') return;
              if (this.processedTransferIds.has(pkt.transferId)) return;

              if (!this.chunkBuffers.has(pkt.transferId)) {
                this.chunkBuffers.set(pkt.transferId, new Map());
              }
              this.chunkBuffers.get(pkt.transferId)!.set(pkt.chunkIndex, pkt.data);
              this.chunkTotals.set(pkt.transferId, pkt.totalChunks);
              this.tryAssembleChunks(pkt.transferId, pkt.clientId);
            } else if (topic === CLOUD_TOPIC_CONTROL) {
              const ctrl = JSON.parse(rawStr);
              if (
                ctrl &&
                ctrl.type === 'REQUEST_STATE' &&
                ctrl.clientId !== this.clientId &&
                this.hasLoadedRealState &&
                (this.currentState.updatedAt || 0) > (ctrl.currentUpdatedAt || 0)
              ) {
                const now = Date.now();
                if (now - this.lastPeerRespondAt > 2500) {
                  this.lastPeerRespondAt = now;
                  setTimeout(() => {
                    this.publishToMqttBrokers(this.currentState);
                  }, 150 + Math.floor(Math.random() * 350));
                }
              }
            } else if (topic.startsWith(CLOUD_TOPIC_PRESENCE)) {
              const peerId = topic.replace(CLOUD_TOPIC_PRESENCE, '');
              const data = JSON.parse(rawStr);
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
            // ignore malformed packet
          }
        });
      } catch {
        // ignore broker init error
      }
    }

    // 2. Also connect to local Vite SSE server if running locally
    fetch('/api/std-state')
      .then((r) => {
        if (!r.ok) throw new Error('Not local server');
        return r.json();
      })
      .then((data) => {
        if (
          data.firebaseConfig &&
          isValidFirebaseConfig(data.firebaseConfig) &&
          !this.activeFirebaseConfig
        ) {
          this.connectFirebase(data.firebaseConfig);
          return;
        }
        const normalized = this.normalizePayload(data);
        this.applyIncomingState(normalized, false);
        this.updateStatus({
          mode: 'live-server',
          connected: true,
          onlineCount: Math.max(this.statusInfo.onlineCount, data.onlineCount || 1),
          lastSyncAt: Date.now()
        });

        const es = new EventSource('/api/std-stream');
        this.eventSource = es;
        es.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'SYNC_STATE' && msg.payload) {
              const norm = this.normalizePayload(msg.payload);
              const isRemote = Boolean(norm.clientId && norm.clientId !== this.clientId);
              this.applyIncomingState(norm, isRemote);
            }
          } catch {
            // ignore
          }
        };
      })
      .catch(() => {
        // Static hosting (GitHub Pages) - handled by multi-broker MQTT
      });
  }

  private tryAssembleChunks(transferId: string, senderClientId?: string) {
    if (this.processedTransferIds.has(transferId)) return;
    const total = this.chunkTotals.get(transferId);
    const buf = this.chunkBuffers.get(transferId);
    if (!total || !buf || buf.size < total) return;

    // All chunks received! Reconstruct full JSON string
    let fullJson = '';
    for (let i = 0; i < total; i++) {
      const part = buf.get(i);
      if (part === undefined) return;
      fullJson += part;
    }

    this.processedTransferIds.add(transferId);
    this.chunkBuffers.delete(transferId);

    try {
      const parsed = JSON.parse(fullJson);
      const normalized = this.normalizePayload(parsed);
      const isRemote = Boolean(senderClientId && senderClientId !== this.clientId);
      this.applyIncomingState(normalized, isRemote);
      this.updateStatus({
        mode: 'live-server',
        connected: true,
        lastSyncAt: Date.now(),
        lastEventText: normalized.lastAction
          ? `${normalized.lastUpdatedBy || 'צוות'}: ${normalized.lastAction}`
          : undefined
      });
    } catch {
      // ignore corrupted reassembly
    }
  }

  private publishToMqttBrokers(payload: SyncStatePayload) {
    const jsonStr = JSON.stringify(payload);
    const totalChunks = Math.ceil(jsonStr.length / CHUNK_SIZE) || 1;
    const transferId = `tr_${payload.updatedAt || Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    this.processedTransferIds.add(transferId);

    for (const client of this.mqttClients) {
      if (!client.connected) continue;
      try {
        // If small enough, also publish directly to CLOUD_TOPIC_STATE
        if (jsonStr.length <= CHUNK_SIZE) {
          client.publish(CLOUD_TOPIC_STATE, jsonStr, { qos: 1, retain: true });
        }

        // Always publish retained chunks + manifest so even 2MB states with screenshots sync & retain 100%!
        for (let i = 0; i < totalChunks; i++) {
          const slice = jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const packet: ChunkPacket = {
            transferId,
            chunkIndex: i,
            totalChunks,
            updatedAt: payload.updatedAt || Date.now(),
            clientId: this.clientId,
            data: slice
          };
          client.publish(`${CLOUD_TOPIC_CHUNK_PREFIX}${i}`, JSON.stringify(packet), {
            qos: 1,
            retain: true
          });
        }

        const manifest: ChunkManifest = {
          transferId,
          totalChunks,
          updatedAt: payload.updatedAt || Date.now(),
          clientId: this.clientId
        };
        client.publish(CLOUD_TOPIC_MANIFEST, JSON.stringify(manifest), {
          qos: 1,
          retain: true
        });
      } catch {
        // ignore individual broker publish error
      }
    }
  }

  private persistCacheLocally(payload: SyncStatePayload) {
    saveWorkspaceToIndexedDB(payload);
    try {
      localStorage.setItem('std_qa_fallback_cache', JSON.stringify(payload));
    } catch {
      // IndexedDB handles large payloads when localStorage reaches 5MB
    }
  }

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
        const commentMap = new Map<string, StdComment>();
        for (const c of existing.comments || []) commentMap.set(c.id, c);
        for (const c of inc.comments || []) commentMap.set(c.id, c);
        const mergedComments = Array.from(commentMap.values()).sort(
          (a, b) => a.createdAt - b.createdAt
        );

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
      .filter((item: any) => !deletedIssueIds.includes(String(item.id)))
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
        createdAt: Number(item.createdAt || DEMO_BASE_TS),
        updatedAt: Number(item.updatedAt || DEMO_BASE_TS)
      }));

    return {
      systems,
      archivedSystems,
      deletedIssueIds,
      issues,
      lastUpdatedBy: raw?.lastUpdatedBy,
      lastAction: raw?.lastAction,
      updatedAt: Number(raw?.updatedAt || DEMO_BASE_TS),
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
    this.hasLoadedRealState = true;
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

    // 3. Publish to all built-in Cloud WebSocket Brokers (with automatic 28KB chunking!)
    this.publishToMqttBrokers(payload);

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
