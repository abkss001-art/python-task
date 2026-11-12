import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
  User
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  get,
  onDisconnect,
  Database
} from 'firebase/database';
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  Firestore
} from 'firebase/firestore';
import mqtt, { MqttClient } from 'mqtt';
import {
  buildProfileAccessFields,
  hashString,
  stripUndefinedDeep
} from '../utils/accessUtils';
import {
  ChatTypingUser,
  DEFAULT_SYSTEMS,
  FirebaseConfigData,
  FirebaseUserProfile,
  StdIssue,
  StdSeverity,
  SyncStatusInfo,
  SystemChatMessage,
  TeamRole
} from '../types/std';
import {
  isValidAppCheckSiteKey,
  isValidFirebaseConfig,
  loadActiveFirebaseConfig,
  saveFirebaseConfigLocally
} from '../firebaseConfig';
import {
  loadChatsFromIndexedDB,
  loadWorkspaceFromIndexedDB,
  saveChatsToIndexedDB,
  saveWorkspaceToIndexedDB
} from '../utils/idbStorage';
import {
  encodeFirebaseSystemKey,
  mergeAllChats,
  mergeSystemChatArrays,
  pruneChatMessages
} from '../utils/chatUtils';
import {
  getSavedGoogleDriveSecret,
  getSavedGoogleDriveUrl,
  isDataUrlImage,
  saveAutoBackupToGoogleDrive,
  setSavedGoogleDriveSecret,
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
type ChatListener = (
  chatsBySystem: Record<string, SystemChatMessage[]>,
  incomingNewMessage?: SystemChatMessage
) => void;
type TypingListener = (typingBySystem: Record<string, ChatTypingUser[]>) => void;

const CLOUD_TOPIC_STATE = 'std_qa_cloud_abkss001_v2/workspace_state';
const CLOUD_TOPIC_STATE_V3 = 'std_qa_cloud_tzavman_v3/workspace_state';
const CLOUD_TOPIC_PRESENCE_V4 = 'std_qa_cloud_tzavman_v4/presence/';
const CLOUD_TOPIC_PING_V4 = 'std_qa_cloud_tzavman_v4/presence_ping';
const CLOUD_TOPIC_CHAT_EVENT = 'std_qa_cloud_tzavman_v4/chat_event';
const CLOUD_TOPIC_CHAT_SNAPSHOT = 'std_qa_cloud_tzavman_v4/chat_snapshot';
const CLOUD_TOPIC_CHAT_TYPING = 'std_qa_cloud_tzavman_v4/chat_typing';
const CLOUD_TOPIC_CHAT_PING = 'std_qa_cloud_tzavman_v4/chat_ping';
const CHATS_LOCAL_STORAGE_KEY = 'std_qa_chats_fallback_v1';

function stripUndefinedChatFields(msg: SystemChatMessage): Record<string, any> {
  const clean: Record<string, any> = {
    id: msg.id,
    system: msg.system,
    author: msg.author,
    authorRole: msg.authorRole,
    text: msg.text,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt
  };
  if (Array.isArray(msg.screenshots) && msg.screenshots.length > 0) {
    clean.screenshots = msg.screenshots;
  }
  if (msg.reactions && Object.keys(msg.reactions).length > 0) {
    clean.reactions = msg.reactions;
  }
  if (Array.isArray(msg.mentions) && msg.mentions.length > 0) {
    clean.mentions = msg.mentions;
  }
  if (msg.editedAt !== undefined) clean.editedAt = msg.editedAt;
  if (msg.deletedByAdmin !== undefined) clean.deletedByAdmin = msg.deletedByAdmin;
  if (msg.deletedAt !== undefined) clean.deletedAt = msg.deletedAt;
  return clean;
}

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

export function isSystemAdminAction(actionText: string | undefined): boolean {
  if (!actionText) return true;
  return /מערכת|צוות|אבטחה|ארכיון|שחזור|אתחול|גיבוי|הגדרות/i.test(actionText);
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
  private firebaseAuth: Auth | null = null;
  private firebaseUser: User | null = null;
  private firebaseUserProfile: FirebaseUserProfile | null = null;
  private firebaseAuthInitialized = false;
  private authListeners = new Set<
    (profile: FirebaseUserProfile | null, rawUser: User | null, initialized: boolean) => void
  >();
  private rtdb: Database | null = null;
  private firestore: Firestore | null = null;
  private unsubscribeFirebase: (() => void) | null = null;
  private unsubscribePresence: (() => void) | null = null;
  private unsubscribeAuthState: (() => void) | null = null;
  private unsubscribePrivateConfig: (() => void) | null = null;
  private eventSource: EventSource | null = null;
  private mqttClient: MqttClient | null = null;

  private activePeers = new Map<string, number>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private autoRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private activeFirebaseConfig: FirebaseConfigData | null = null;

  // Dedicated Per-System Group Chat State & Sync
  private chatsBySystem: Record<string, SystemChatMessage[]> = {};
  private chatListeners = new Set<ChatListener>();
  private typingListeners = new Set<TypingListener>();
  private typingUsers = new Map<string, ChatTypingUser>();
  private typingCleanupTimer: ReturnType<typeof setInterval> | null = null;
  private unsubscribeChatFirebase: (() => void) | null = null;
  private unsubscribeTypingFirebase: (() => void) | null = null;
  private hasLoadedInitialChatsFirebase = false;
  private isOffloadingChatImages = false;
  private uploadedChatDriveUrlCache = new Map<string, string>();
  private lastChatBytebinFetched = '';

  // Per-System Partitioned State (Phase 3 #2: server-enforced per-system access)
  private partitionIssues = new Map<string, StdIssue[]>();
  private partitionUnsubscribes = new Map<string, () => void>();
  private chatPartitionUnsubscribes = new Map<string, () => void>();
  private loadedPartitionKeys = new Set<string>();
  private expectedPartitionKeys = new Set<string>();
  private lastPushedPartitionHashes = new Map<string, string>();
  private isMigratingPartitions = false;
  private currentMetaState: {
    systems: string[];
    archivedSystems: string[];
    deletedIssueIds: string[];
    deletedSystemIds: string[];
    teamMembers?: TeamMember[];
    securityConfig?: CustomSecurityConfig;
    partitionVersion?: number;
    revision?: number;
    lastUpdatedBy?: string;
    lastAction?: string;
    updatedAt?: number;
    clientId?: string;
  } | null = null;

  public init() {
    this.loadChatsLocally();

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
        } else if (data && data.type === 'CHAT_UPDATE' && data.chats) {
          const isRemote = data.clientId !== this.clientId;
          this.chatsBySystem = mergeAllChats(this.chatsBySystem, data.chats);
          this.persistChatsLocally(this.chatsBySystem);
          this.notifyChats(isRemote ? data.incomingNewMessage : undefined);
        }
      };
    }

    this.typingCleanupTimer = setInterval(() => {
      const now = Date.now();
      let removed = false;
      for (const [key, item] of this.typingUsers.entries()) {
        if (now - item.updatedAt > 4200) {
          this.typingUsers.delete(key);
          removed = true;
        }
      }
      if (removed) {
        this.notifyTyping();
      }
    }, 1500);

    if (typeof window !== 'undefined') {
      const announceOffline = () => {
        if (this.mqttClient && this.mqttClient.connected) {
          try {
            const offMsg = JSON.stringify({
              online: false,
              clientId: this.clientId,
              timestamp: Date.now()
            });
            this.mqttClient.publish(`${CLOUD_TOPIC_PRESENCE_V4}${this.clientId}`, offMsg, {
              qos: 0,
              retain: false
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

  public subscribeChat(listener: ChatListener): () => void {
    this.chatListeners.add(listener);
    listener(this.chatsBySystem);
    return () => {
      this.chatListeners.delete(listener);
    };
  }

  public subscribeTyping(listener: TypingListener): () => void {
    this.typingListeners.add(listener);
    listener(this.getTypingBySystem());
    return () => {
      this.typingListeners.delete(listener);
    };
  }

  public getAllChats(): Record<string, SystemChatMessage[]> {
    return this.chatsBySystem;
  }

  public getChatMessages(system: string): SystemChatMessage[] {
    return this.chatsBySystem[system] || [];
  }

  private getTypingBySystem(): Record<string, ChatTypingUser[]> {
    const grouped: Record<string, ChatTypingUser[]> = {};
    const now = Date.now();
    for (const user of this.typingUsers.values()) {
      if (now - user.updatedAt <= 4200 && user.clientId !== this.clientId) {
        if (!grouped[user.system]) grouped[user.system] = [];
        grouped[user.system].push(user);
      }
    }
    return grouped;
  }

  private notifyChats(incomingNewMessage?: SystemChatMessage) {
    const snapshot = { ...this.chatsBySystem };
    for (const listener of this.chatListeners) {
      listener(snapshot, incomingNewMessage);
    }
  }

  private notifyTyping() {
    const grouped = this.getTypingBySystem();
    for (const listener of this.typingListeners) {
      listener(grouped);
    }
  }

  private loadChatsLocally() {
    try {
      const raw = localStorage.getItem(CHATS_LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.chatsBySystem = mergeAllChats(this.chatsBySystem, parsed);
          this.notifyChats();
        }
      }
    } catch {
      // ignore
    }

    loadChatsFromIndexedDB<Record<string, SystemChatMessage[]>>().then((idbChats) => {
      if (idbChats && typeof idbChats === 'object') {
        this.chatsBySystem = mergeAllChats(this.chatsBySystem, idbChats);
        this.notifyChats();
      }
    });
  }

  private persistChatsLocally(chats: Record<string, SystemChatMessage[]>) {
    saveChatsToIndexedDB(chats);
    try {
      localStorage.setItem(CHATS_LOCAL_STORAGE_KEY, JSON.stringify(chats));
    } catch {
      // Strip inline base64 images if localStorage quota exceeded (IndexedDB still holds full images)
      try {
        const lightChats: Record<string, SystemChatMessage[]> = {};
        for (const [sys, list] of Object.entries(chats)) {
          lightChats[sys] = list.map((m) => ({
            ...m,
            screenshots: (m.screenshots || []).filter((s) => !isDataUrlImage(s))
          }));
        }
        localStorage.setItem(CHATS_LOCAL_STORAGE_KEY, JSON.stringify(lightChats));
      } catch {
        // IndexedDB handles full dataset
      }
    }
  }

  private getChatTotals(chats: Record<string, SystemChatMessage[]>): {
    totalMessages: number;
    latestUpdatedAt: number;
  } {
    let totalMessages = 0;
    let latestUpdatedAt = 0;
    for (const arr of Object.values(chats)) {
      totalMessages += arr.length;
      for (const m of arr) {
        const ts = m.updatedAt || m.createdAt || 0;
        if (ts > latestUpdatedAt) latestUpdatedAt = ts;
      }
    }
    return { totalMessages, latestUpdatedAt };
  }

  private broadcastChatToTabs(incomingNewMessage?: SystemChatMessage) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'CHAT_UPDATE',
          chats: this.chatsBySystem,
          incomingNewMessage,
          clientId: this.clientId
        });
      } catch {
        // ignore
      }
    }
  }

  private async publishSingleChatMessageToCloud(
    msg: SystemChatMessage,
    isNew: boolean
  ): Promise<void> {
    if (
      this.activeFirebaseConfig &&
      this.activeFirebaseConfig.mode === 'firestore' &&
      this.firestore
    ) {
      try {
        if (this.isFirebaseAuthRequired()) {
          const sysKey = encodeFirebaseSystemKey(msg.system);
          const chatDocRef = doc(this.firestore, 'std_chats', sysKey);
          const msgs = pruneChatMessages(this.chatsBySystem[msg.system] || []).map(
            stripUndefinedChatFields
          );
          await setDoc(chatDocRef, {
            system: msg.system,
            messages: msgs,
            updatedAt: Date.now(),
            clientId: this.clientId
          });
        } else {
          const chatsDocRef = doc(this.firestore, 'std_workspaces', 'system_chats');
          const sanitized: Record<string, Record<string, any>[]> = {};
          for (const [sys, arr] of Object.entries(this.chatsBySystem)) {
            sanitized[sys] = pruneChatMessages(arr).map(stripUndefinedChatFields);
          }
          await setDoc(chatsDocRef, {
            chats: sanitized,
            updatedAt: Date.now(),
            clientId: this.clientId
          });
        }
      } catch {
        // ignore firestore error
      }
      return;
    }

    if (this.activeFirebaseConfig && this.rtdb) {
      try {
        const msgRef = ref(
          this.rtdb,
          `std_chats/${encodeFirebaseSystemKey(msg.system)}/${msg.id}`
        );
        await set(msgRef, stripUndefinedChatFields(msg));
      } catch {
        // ignore rtdb error
      }
      return;
    }

    await this.publishChatEventToMqtt(msg, isNew);
    await this.publishChatSnapshotToMqtt(this.chatsBySystem);
  }

  private async publishChatEventToMqtt(msg: SystemChatMessage, isNew: boolean) {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    try {
      const eventObj: Record<string, any> = {
        message: stripUndefinedChatFields(msg),
        clientId: this.clientId,
        isNew,
        timestamp: Date.now()
      };
      let jsonStr = JSON.stringify(eventObj);

      if (jsonStr.length > MAX_SAFE_MQTT_BYTES) {
        try {
          const encryptedFull = await encryptSyncPayload(jsonStr);
          const bRes = await fetch(BYTEBIN_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: encryptedFull
          });
          if (bRes.ok) {
            const bJson = await bRes.json();
            if (bJson && bJson.key) {
              eventObj.bytebinKey = String(bJson.key);
              eventObj.message = {
                ...eventObj.message,
                screenshots: (msg.screenshots || []).filter((s) => !isDataUrlImage(s))
              };
              jsonStr = JSON.stringify(eventObj);
            }
          }
        } catch {
          // ignore bytebin error
        }
      }

      const encrypted = await encryptSyncPayload(jsonStr);
      this.mqttClient.publish(CLOUD_TOPIC_CHAT_EVENT, encrypted, {
        qos: 1,
        retain: false
      });
    } catch {
      // ignore
    }
  }

  private async publishChatSnapshotToMqtt(chats: Record<string, SystemChatMessage[]>) {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    try {
      const payloadObj: Record<string, any> = {
        chats,
        updatedAt: Date.now(),
        clientId: this.clientId
      };
      let jsonStr = JSON.stringify(payloadObj);
      let bytebinKey = '';

      if (jsonStr.length > MAX_SAFE_MQTT_BYTES) {
        try {
          const encryptedFull = await encryptSyncPayload(jsonStr);
          const bRes = await fetch(BYTEBIN_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: encryptedFull
          });
          if (bRes.ok) {
            const bJson = await bRes.json();
            if (bJson && bJson.key) {
              bytebinKey = String(bJson.key);
              this.lastChatBytebinFetched = bytebinKey;
            }
          }
        } catch {
          // ignore
        }

        const lightChats: Record<string, SystemChatMessage[]> = {};
        for (const [sys, list] of Object.entries(chats)) {
          lightChats[sys] = list.map((m) => ({
            ...m,
            screenshots: (m.screenshots || []).filter((s) => !isDataUrlImage(s))
          }));
        }
        jsonStr = JSON.stringify({
          chats: lightChats,
          bytebinKey: bytebinKey || undefined,
          updatedAt: payloadObj.updatedAt,
          clientId: this.clientId
        });
      }

      const encrypted = await encryptSyncPayload(jsonStr);
      this.mqttClient.publish(CLOUD_TOPIC_CHAT_SNAPSHOT, encrypted, {
        qos: 1,
        retain: true
      });
    } catch {
      // ignore
    }
  }

  private async offloadChatImagesToGoogleDriveInBackground() {
    const driveUrl = getSavedGoogleDriveUrl();
    if (!driveUrl || this.isOffloadingChatImages) return;

    this.isOffloadingChatImages = true;
    try {
      const updatedMessages: SystemChatMessage[] = [];
      for (const list of Object.values(this.chatsBySystem)) {
        for (const msg of list) {
          if (!Array.isArray(msg.screenshots) || msg.screenshots.length === 0) continue;
          let msgChanged = false;
          const nextScreenshots: string[] = [];
          for (let i = 0; i < msg.screenshots.length; i++) {
            const sc = msg.screenshots[i];
            if (isDataUrlImage(sc)) {
              const cached = this.uploadedChatDriveUrlCache.get(sc);
              if (cached) {
                nextScreenshots.push(cached);
                msgChanged = true;
              } else {
                const uploadedUrl = await uploadImageToGoogleDrive(sc, {
                  system: msg.system,
                  testCaseId: 'צאט'
                });
                if (uploadedUrl && uploadedUrl !== sc) {
                  this.uploadedChatDriveUrlCache.set(sc, uploadedUrl);
                  nextScreenshots.push(uploadedUrl);
                  msgChanged = true;
                } else {
                  nextScreenshots.push(sc);
                }
              }
            } else {
              nextScreenshots.push(sc);
            }
          }
          if (msgChanged) {
            updatedMessages.push({
              ...msg,
              screenshots: nextScreenshots,
              updatedAt: Date.now()
            });
          }
        }
      }

      if (updatedMessages.length > 0) {
        const patch: Record<string, SystemChatMessage[]> = {};
        for (const m of updatedMessages) {
          if (!patch[m.system]) patch[m.system] = [];
          patch[m.system].push(m);
        }
        this.chatsBySystem = mergeAllChats(this.chatsBySystem, patch);
        this.persistChatsLocally(this.chatsBySystem);
        this.notifyChats();
        this.broadcastChatToTabs();
        for (const m of updatedMessages) {
          await this.publishSingleChatMessageToCloud(m, false);
        }
      }
    } catch {
      // ignore Drive chat offload error
    } finally {
      this.isOffloadingChatImages = false;
    }
  }

  public async sendChatMessage(input: {
    system: string;
    author: string;
    authorRole: SystemChatMessage['authorRole'];
    text: string;
    screenshots?: string[];
    mentions?: string[];
  }): Promise<SystemChatMessage> {
    const now = Date.now();
    const msg: SystemChatMessage = {
      id: `chat-${now}-${Math.random().toString(36).substring(2, 7)}`,
      system: input.system,
      author: input.author,
      ...(this.firebaseUser?.uid ? { authorUid: this.firebaseUser.uid } : {}),
      authorRole: input.authorRole,
      text: input.text,
      screenshots: Array.isArray(input.screenshots) ? input.screenshots : [],
      reactions: {},
      mentions: input.mentions && input.mentions.length > 0 ? input.mentions : undefined,
      createdAt: now,
      updatedAt: now
    };

    const existing = this.chatsBySystem[msg.system] || [];
    this.chatsBySystem = {
      ...this.chatsBySystem,
      [msg.system]: pruneChatMessages([...existing, msg])
    };
    this.persistChatsLocally(this.chatsBySystem);
    this.notifyChats();
    this.broadcastChatToTabs();
    this.sendTypingStatus(msg.system, msg.author, false);

    await this.publishSingleChatMessageToCloud(msg, true);
    if (msg.screenshots && msg.screenshots.some((s) => isDataUrlImage(s)) && getSavedGoogleDriveUrl()) {
      this.offloadChatImagesToGoogleDriveInBackground();
    }
    return msg;
  }

  public async editChatMessage(
    system: string,
    messageId: string,
    newText: string,
    actorName: string,
    mentions?: string[]
  ): Promise<void> {
    const list = this.chatsBySystem[system] || [];
    const target = list.find((m) => m.id === messageId);
    if (!target || target.deletedAt) return;
    if (target.author.trim().toLowerCase() !== actorName.trim().toLowerCase()) return;

    const now = Date.now();
    const updatedMsg: SystemChatMessage = {
      ...target,
      text: newText,
      mentions: mentions && mentions.length > 0 ? mentions : undefined,
      editedAt: now,
      updatedAt: now
    };
    this.chatsBySystem = {
      ...this.chatsBySystem,
      [system]: list.map((m) => (m.id === messageId ? updatedMsg : m))
    };
    this.persistChatsLocally(this.chatsBySystem);
    this.notifyChats();
    this.broadcastChatToTabs();
    await this.publishSingleChatMessageToCloud(updatedMsg, false);
  }

  public async deleteChatMessageByAdmin(
    system: string,
    messageId: string,
    adminName: string
  ): Promise<void> {
    const list = this.chatsBySystem[system] || [];
    const target = list.find((m) => m.id === messageId);
    if (!target) return;

    const now = Date.now();
    const deletedMsg: SystemChatMessage = {
      ...target,
      text: 'הודעה נמחקה על ידי מנהל',
      screenshots: [],
      reactions: {},
      mentions: undefined,
      deletedByAdmin: adminName,
      deletedAt: now,
      updatedAt: now
    };
    this.chatsBySystem = {
      ...this.chatsBySystem,
      [system]: list.map((m) => (m.id === messageId ? deletedMsg : m))
    };
    this.persistChatsLocally(this.chatsBySystem);
    this.notifyChats();
    this.broadcastChatToTabs();
    await this.publishSingleChatMessageToCloud(deletedMsg, false);
  }

  public async toggleChatReaction(
    system: string,
    messageId: string,
    emoji: string,
    userName: string
  ): Promise<void> {
    const list = this.chatsBySystem[system] || [];
    const target = list.find((m) => m.id === messageId);
    if (!target || target.deletedAt) return;

    const currentReactions = { ...(target.reactions || {}) };
    const existingUsers = Array.isArray(currentReactions[emoji]) ? [...currentReactions[emoji]] : [];
    const normalizedUser = userName.trim();
    const idx = existingUsers.findIndex((u) => u.trim().toLowerCase() === normalizedUser.toLowerCase());
    if (idx !== -1) {
      existingUsers.splice(idx, 1);
    } else {
      existingUsers.push(normalizedUser);
    }
    if (existingUsers.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = existingUsers;
    }

    const updatedMsg: SystemChatMessage = {
      ...target,
      reactions: currentReactions,
      updatedAt: Date.now()
    };
    this.chatsBySystem = {
      ...this.chatsBySystem,
      [system]: list.map((m) => (m.id === messageId ? updatedMsg : m))
    };
    this.persistChatsLocally(this.chatsBySystem);
    this.notifyChats();
    this.broadcastChatToTabs();
    await this.publishSingleChatMessageToCloud(updatedMsg, false);
  }

  public sendTypingStatus(system: string, author: string, isTyping: boolean) {
    const now = Date.now();
    const payload = {
      system,
      author,
      clientId: this.clientId,
      isTyping,
      timestamp: now
    };

    if (this.activeFirebaseConfig && this.rtdb) {
      try {
        const typingRef = ref(this.rtdb, `std_chat_typing/${this.clientId}`);
        if (isTyping) {
          set(typingRef, payload).catch(() => {});
          onDisconnect(typingRef).remove().catch(() => {});
        } else {
          set(typingRef, null).catch(() => {});
        }
      } catch {
        // ignore
      }
      return;
    }

    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish(CLOUD_TOPIC_CHAT_TYPING, JSON.stringify(payload), {
          qos: 0,
          retain: false
        });
      } catch {
        // ignore
      }
    }
  }

  public renameSystemChats(oldSystem: string, newSystem: string) {
    const existing = this.chatsBySystem[oldSystem];
    if (!existing || existing.length === 0) return;
    const moved = existing.map((m) => ({ ...m, system: newSystem, updatedAt: Date.now() }));
    const next = { ...this.chatsBySystem };
    delete next[oldSystem];
    next[newSystem] = mergeSystemChatArrays(next[newSystem], moved);
    this.chatsBySystem = next;
    this.persistChatsLocally(next);
    this.notifyChats();
    this.publishChatSnapshotToMqtt(next);
  }

  private applyIncomingRemoteChats(
    incomingChats: Record<string, SystemChatMessage[]>,
    isRemote: boolean,
    notifyRecentOnly = true
  ) {
    const prevIds = new Set<string>();
    for (const list of Object.values(this.chatsBySystem)) {
      for (const m of list) prevIds.add(m.id);
    }

    const merged = mergeAllChats(this.chatsBySystem, incomingChats);
    this.chatsBySystem = merged;
    this.persistChatsLocally(merged);

    let newestRemoteMsg: SystemChatMessage | undefined;
    if (isRemote && this.hasLoadedInitialChatsFirebase) {
      const now = Date.now();
      for (const list of Object.values(incomingChats)) {
        for (const m of list) {
          if (
            !prevIds.has(m.id) &&
            !m.deletedAt &&
            (!notifyRecentOnly || now - m.createdAt < 60000)
          ) {
            if (!newestRemoteMsg || m.createdAt > newestRemoteMsg.createdAt) {
              newestRemoteMsg = m;
            }
          }
        }
      }
    }
    this.hasLoadedInitialChatsFirebase = true;
    this.notifyChats(newestRemoteMsg);

    if (getSavedGoogleDriveUrl()) {
      this.offloadChatImagesToGoogleDriveInBackground();
    }
  }

  private async handleIncomingChatEvent(rawStr: string) {
    try {
      const decrypted = await decryptSyncPayload(rawStr);
      const parsed = JSON.parse(decrypted);
      if (!parsed || !parsed.message) return;

      let incomingMsg: SystemChatMessage = parsed.message;
      const isRemote = Boolean(parsed.clientId && parsed.clientId !== this.clientId);

      if (parsed.bytebinKey && isRemote) {
        try {
          const res = await fetch(`${BYTEBIN_GET_BASE}${parsed.bytebinKey}`);
          if (res.ok) {
            const body = await res.text();
            const fullDecrypted = await decryptSyncPayload(body);
            const fullParsed = JSON.parse(fullDecrypted);
            if (fullParsed?.message) incomingMsg = fullParsed.message;
          }
        } catch {
          // fallback to light payload
        }
      }

      if (!incomingMsg.id || !incomingMsg.system) return;
      const existingList = this.chatsBySystem[incomingMsg.system] || [];
      const existedBefore = existingList.some((m) => m.id === incomingMsg.id);
      const mergedList = mergeSystemChatArrays(existingList, [incomingMsg]);

      this.chatsBySystem = {
        ...this.chatsBySystem,
        [incomingMsg.system]: mergedList
      };
      this.persistChatsLocally(this.chatsBySystem);

      // Clear sender's typing indicator cleanly upon message delivery
      if (parsed.clientId) {
        const typingKey = `${incomingMsg.system}::${parsed.clientId}`;
        if (this.typingUsers.delete(typingKey)) {
          this.notifyTyping();
        }
      }

      const shouldNotifyNew = isRemote && Boolean(parsed.isNew) && !existedBefore && !incomingMsg.deletedAt;
      this.notifyChats(shouldNotifyNew ? incomingMsg : undefined);
    } catch {
      // ignore malformed chat event
    }
  }

  private async handleIncomingChatSnapshot(rawStr: string) {
    try {
      const decrypted = await decryptSyncPayload(rawStr);
      const parsed = JSON.parse(decrypted);
      if (!parsed || !parsed.chats || typeof parsed.chats !== 'object') return;

      const isRemote = Boolean(parsed.clientId && parsed.clientId !== this.clientId);
      const prevIds = new Set<string>();
      for (const list of Object.values(this.chatsBySystem)) {
        for (const m of list) prevIds.add(m.id);
      }

      let incomingChats: Record<string, SystemChatMessage[]> = parsed.chats;
      if (parsed.bytebinKey && parsed.bytebinKey !== this.lastChatBytebinFetched) {
        this.lastChatBytebinFetched = parsed.bytebinKey;
        try {
          const res = await fetch(`${BYTEBIN_GET_BASE}${parsed.bytebinKey}`);
          if (res.ok) {
            const body = await res.text();
            const fullDecrypted = await decryptSyncPayload(body);
            const fullParsed = JSON.parse(fullDecrypted);
            if (fullParsed?.chats && typeof fullParsed.chats === 'object') {
              incomingChats = fullParsed.chats;
            }
          }
        } catch {
          // ignore
        }
      }

      const merged = mergeAllChats(this.chatsBySystem, incomingChats);
      this.chatsBySystem = merged;
      this.persistChatsLocally(merged);

      // If peer was missing our local chat messages, re-share snapshot cleanly
      const ourTotals = this.getChatTotals(this.chatsBySystem);
      const peerTotals = this.getChatTotals(incomingChats);
      if (isRemote && ourTotals.totalMessages > peerTotals.totalMessages) {
        this.publishChatSnapshotToMqtt(merged);
      }

      // Notify only if a brand-new message arrived within the last 30s (prevents history catchup notification spam)
      let recentNewMsg: SystemChatMessage | undefined;
      if (isRemote) {
        const now = Date.now();
        for (const list of Object.values(incomingChats)) {
          for (const m of list) {
            if (!prevIds.has(m.id) && !m.deletedAt && now - m.createdAt < 30000) {
              if (!recentNewMsg || m.createdAt > recentNewMsg.createdAt) {
                recentNewMsg = m;
              }
            }
          }
        }
      }
      this.notifyChats(recentNewMsg);
    } catch {
      // ignore malformed chat snapshot
    }
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
    if (this.unsubscribeChatFirebase) {
      this.unsubscribeChatFirebase();
      this.unsubscribeChatFirebase = null;
    }
    if (this.unsubscribeTypingFirebase) {
      this.unsubscribeTypingFirebase();
      this.unsubscribeTypingFirebase = null;
    }
    this.clearPartitionListeners();
    this.partitionIssues.clear();
    this.lastPushedPartitionHashes.clear();
    this.currentMetaState = null;
    if (this.unsubscribePrivateConfig) {
      this.unsubscribePrivateConfig();
      this.unsubscribePrivateConfig = null;
    }
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
      this.unsubscribeAuthState = null;
    }
    this.hasLoadedInitialChatsFirebase = false;
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

  private buildFirebaseOptions(config: FirebaseConfigData) {
    return {
      apiKey: config.apiKey,
      authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
      databaseURL:
        config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    };
  }

  private notifyAuthListeners() {
    for (const listener of this.authListeners) {
      listener(this.firebaseUserProfile, this.firebaseUser, this.firebaseAuthInitialized);
    }
  }

  public isFirebaseAuthRequired(): boolean {
    return Boolean(this.activeFirebaseConfig && this.activeFirebaseConfig.requireFirebaseAuth);
  }

  public getCurrentFirebaseProfile(): FirebaseUserProfile | null {
    return this.firebaseUserProfile;
  }

  public getCurrentFirebaseUser(): User | null {
    return this.firebaseUser;
  }

  public subscribeFirebaseAuth(
    listener: (profile: FirebaseUserProfile | null, rawUser: User | null, initialized: boolean) => void
  ): () => void {
    this.authListeners.add(listener);
    listener(this.firebaseUserProfile, this.firebaseUser, this.firebaseAuthInitialized);
    return () => {
      this.authListeners.delete(listener);
    };
  }

  public async fetchFirebaseUserProfile(uid: string): Promise<FirebaseUserProfile | null> {
    if (!uid || !this.activeFirebaseConfig) return null;
    const normalizeAndUpgradeProfile = (
      data: Partial<FirebaseUserProfile> | null | undefined
    ): { profile: FirebaseUserProfile; needsUpgrade: boolean } | null => {
      if (!data?.fullName || !data?.role) return null;
      const access = buildProfileAccessFields(data.role, data.allowedSystems);
      const needsUpgrade =
        typeof data.allSystems !== 'boolean' ||
        (!access.allSystems &&
          JSON.stringify(data.allowedSystemKeys || {}) !==
            JSON.stringify(access.allowedSystemKeys || {}));
      const profile: FirebaseUserProfile = {
        uid,
        email: data.email,
        fullName: String(data.fullName).trim(),
        role: data.role,
        ...access,
        isSuperAdmin: Boolean(data.isSuperAdmin || data.role === 'admin'),
        updatedAt: data.updatedAt
      };
      return { profile, needsUpgrade };
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await getDoc(doc(this.firestore, 'std_users', uid));
        if (!snap.exists()) return null;
        const res = normalizeAndUpgradeProfile(snap.data() as Partial<FirebaseUserProfile>);
        if (!res) return null;
        if (res.needsUpgrade && res.profile.role === 'admin') {
          await setDoc(doc(this.firestore, 'std_users', uid), stripUndefinedDeep(res.profile)).catch(
            () => {}
          );
        }
        return res.profile;
      }
      if (this.rtdb) {
        const snap = await get(ref(this.rtdb, `std_users/${uid}`));
        const res = normalizeAndUpgradeProfile(snap.val() as Partial<FirebaseUserProfile> | null);
        if (!res) return null;
        if (res.needsUpgrade && res.profile.role === 'admin') {
          await set(ref(this.rtdb, `std_users/${uid}`), stripUndefinedDeep(res.profile)).catch(
            () => {}
          );
        }
        return res.profile;
      }
    } catch {
      // ignore
    }
    return null;
  }

  public async signInWithFirebaseEmail(
    email: string,
    password: string
  ): Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    needsProfileBootstrap?: boolean;
    error?: string;
  }> {
    if (!this.firebaseAuth) {
      return { ok: false, error: 'Firebase Auth לא מאותחל בהגדרות הענן.' };
    }
    try {
      const cred = await signInWithEmailAndPassword(this.firebaseAuth, email.trim(), password);
      this.firebaseUser = cred.user;
      const profile = await this.fetchFirebaseUserProfile(cred.user.uid);
      if (profile) {
        this.firebaseUserProfile = profile;
        if (this.activeFirebaseConfig) {
          this.attachFirebaseDataListeners(this.activeFirebaseConfig);
        }
        this.updateStatus({
          firebaseUid: cred.user.uid,
          firebaseUserEmail: cred.user.email || undefined
        });
        this.notifyAuthListeners();
        return { ok: true, profile };
      }
      this.notifyAuthListeners();
      return { ok: true, needsProfileBootstrap: true };
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return { ok: false, error: 'אימייל או סיסמה שגויים ב-Firebase Auth.' };
      }
      if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'יותר מדי ניסיונות כושלים. נסה שוב בעוד מספר דקות.' };
      }
      if (code === 'auth/user-disabled') {
        return { ok: false, error: 'חשבון זה הושבת על ידי המנהל ב-Firebase Console.' };
      }
      return { ok: false, error: err?.message || 'שגיאת התחברות ל-Firebase Auth' };
    }
  }

  public async bootstrapInitialAdminProfile(fullName: string): Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    error?: string;
  }> {
    const cleanName = fullName.trim();
    if (!cleanName || !this.firebaseUser || !this.activeFirebaseConfig) {
      return { ok: false, error: 'אין משתמש Firebase מחובר או שם חסר.' };
    }

    const profile: FirebaseUserProfile = {
      uid: this.firebaseUser.uid,
      email: this.firebaseUser.email || undefined,
      fullName: cleanName,
      role: 'admin',
      allSystems: true,
      isSuperAdmin: true,
      updatedAt: Date.now()
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_users', profile.uid), profile);
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_users/${profile.uid}`), profile);
      } else {
        return { ok: false, error: 'מסד הנתונים אינו מחובר.' };
      }
      this.firebaseUserProfile = profile;
      this.attachFirebaseDataListeners(this.activeFirebaseConfig);
      this.notifyAuthListeners();
      return { ok: true, profile };
    } catch (err: any) {
      return {
        ok: false,
        error:
          err?.message ||
          'השרת חסם יצירת פרופיל מנהל. אם כבר קיימים משתמשים ב-std_users, רק מנהל קיים יכול להגדיר משתמשים חדשים.'
      };
    }
  }

  public async registerTeamMemberInFirebaseAuth(
    email: string,
    password: string,
    fullName: string,
    role: TeamRole,
    allowedSystems?: string[]
  ): Promise<{ ok: boolean; uid?: string; error?: string }> {
    if (!this.activeFirebaseConfig) {
      return { ok: false, error: 'Firebase אינו מחובר.' };
    }
    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    if (!cleanEmail || !password || password.length < 6 || !cleanName) {
      return { ok: false, error: 'נא להזין אימייל תקין, שם מלא וסיסמה של לפחות 6 תווים.' };
    }

    // Use a secondary temporary app so creating the team member account does NOT log out the Admin!
    const secondaryName = `provisioning-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let secondaryApp: FirebaseApp | null = null;
    try {
      secondaryApp = initializeApp(this.buildFirebaseOptions(this.activeFirebaseConfig), secondaryName);
      const secondaryAuth = getAuth(secondaryApp);
      const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
      const newUid = cred.user.uid;
      await signOut(secondaryAuth).catch(() => {});

      const accessFields = buildProfileAccessFields(role, allowedSystems);
      const profile: FirebaseUserProfile = {
        uid: newUid,
        email: cleanEmail,
        fullName: cleanName,
        role,
        ...accessFields,
        ...(role === 'admin' ? { isSuperAdmin: false } : {}),
        updatedAt: Date.now()
      };

      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_users', newUid), stripUndefinedDeep(profile));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_users/${newUid}`), stripUndefinedDeep(profile));
      }

      return { ok: true, uid: newUid };
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/email-already-in-use') {
        return { ok: false, error: 'כתובת אימייל זו כבר רשומה ב-Firebase Auth.' };
      }
      if (code === 'auth/weak-password') {
        return { ok: false, error: 'הסיסמה חלשה מדי — יש לבחור לפחות 6 תווים.' };
      }
      return { ok: false, error: err?.message || 'שגיאה ביצירת משתמש Firebase Auth' };
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp).catch(() => {});
      }
    }
  }

  public async signOutFirebase(): Promise<void> {
    this.firebaseUserProfile = null;
    this.firebaseUser = null;
    this.detachDataListenersOnly();
    this.partitionIssues.clear();
    this.lastPushedPartitionHashes.clear();
    this.currentMetaState = null;
    if (this.firebaseAuth) {
      await signOut(this.firebaseAuth).catch(() => {});
    }
    this.updateStatus({
      connected: false,
      firebaseUid: undefined,
      firebaseUserEmail: undefined
    });
    this.notifyAuthListeners();
  }

  public async syncPrivateDriveConfig(googleDriveUrl: string, apiSecret?: string): Promise<void> {
    if (!this.activeFirebaseConfig) return;
    const payload = {
      googleDriveUrl: googleDriveUrl ? encodeProtectedUrl(googleDriveUrl) : '',
      ...(apiSecret ? { apiSecret } : {}),
      updatedAt: Date.now()
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_workspaces', 'private_config'), payload, {
          merge: true
        });
      } else if (this.rtdb) {
        await set(ref(this.rtdb, 'std_private_config'), payload);
      }
    } catch {
      // ignore if user does not have admin permission on private_config
    }
  }

  private clearPartitionListeners() {
    for (const unsub of this.partitionUnsubscribes.values()) {
      try {
        unsub();
      } catch {
        // ignore
      }
    }
    this.partitionUnsubscribes.clear();

    for (const unsub of this.chatPartitionUnsubscribes.values()) {
      try {
        unsub();
      } catch {
        // ignore
      }
    }
    this.chatPartitionUnsubscribes.clear();
    this.loadedPartitionKeys.clear();
    this.expectedPartitionKeys.clear();
  }

  private getPermittedSystemsForCurrentProfile(allCandidateSystems: string[]): string[] {
    const profile = this.firebaseUserProfile;
    if (!profile) return [];
    if (profile.role === 'admin' || profile.allSystems) {
      return Array.from(new Set(allCandidateSystems.filter(Boolean)));
    }
    const allowedSet = new Set(Object.keys(profile.allowedSystemKeys || {}).filter((k) => profile.allowedSystemKeys?.[k]));
    if (allowedSet.size === 0 && Array.isArray(profile.allowedSystems)) {
      for (const s of profile.allowedSystems) allowedSet.add(encodeFirebaseSystemKey(s));
    }
    return Array.from(new Set(allCandidateSystems.filter((sys) => allowedSet.has(encodeFirebaseSystemKey(sys)))));
  }

  private rebuildStateFromPartitions(isRemote: boolean) {
    const meta = this.currentMetaState;
    if (!meta) return;

    const deletedSet = new Set(meta.deletedIssueIds || []);
    const mergedIssues: StdIssue[] = [];
    for (const list of this.partitionIssues.values()) {
      for (const iss of list) {
        if (iss && iss.id && !deletedSet.has(iss.id)) {
          mergedIssues.push(iss);
        }
      }
    }

    const profile = this.firebaseUserProfile;
    const isRestricted = Boolean(profile && profile.role !== 'admin' && !profile.allSystems);
    const permittedSystems = isRestricted
      ? new Set(this.getPermittedSystemsForCurrentProfile(meta.systems))
      : null;

    const scopedIssues = permittedSystems
      ? mergedIssues.filter((iss) => permittedSystems.has(iss.system))
      : mergedIssues;

    if (permittedSystems) {
      // Remove any stale unauthorized cached chats from previous sessions
      const cleanedChats: Record<string, SystemChatMessage[]> = {};
      for (const [sys, list] of Object.entries(this.chatsBySystem)) {
        if (permittedSystems.has(sys)) cleanedChats[sys] = list;
      }
      this.chatsBySystem = cleanedChats;
      this.persistChatsLocally(cleanedChats);
      this.notifyChats();
    }

    const combined = this.normalizePayload({
      systems: meta.systems,
      archivedSystems: meta.archivedSystems,
      deletedIssueIds: meta.deletedIssueIds,
      deletedSystemIds: meta.deletedSystemIds,
      teamMembers: meta.teamMembers,
      securityConfig: meta.securityConfig,
      issues: scopedIssues,
      revision: meta.revision || this.highestSeenRevision,
      lastUpdatedBy: meta.lastUpdatedBy,
      lastAction: meta.lastAction,
      updatedAt: meta.updatedAt || Date.now(),
      clientId: meta.clientId
    });

    this.currentState = combined;
    this.hasReceivedInitialCloud = true;
    this.persistLocally(combined);
    this.notifyState(isRemote);
  }

  public async syncTeamMemberAccessProfiles(members: TeamMember[]): Promise<void> {
    if (!this.activeFirebaseConfig || !this.isFirebaseAuthRequired()) return;
    if (this.firebaseUserProfile?.role !== 'admin') return;

    try {
      const byUid = new Map<string, FirebaseUserProfile>();
      const byName = new Map<string, FirebaseUserProfile>();

      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await getDocs(collection(this.firestore, 'std_users'));
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Partial<FirebaseUserProfile>;
          if (data && data.fullName && data.role) {
            const p: FirebaseUserProfile = {
              uid: docSnap.id,
              email: data.email,
              fullName: data.fullName.trim(),
              role: data.role,
              allowedSystems: data.allowedSystems,
              allowedSystemKeys: data.allowedSystemKeys,
              allSystems: data.allSystems,
              isSuperAdmin: data.isSuperAdmin
            };
            byUid.set(p.uid, p);
            byName.set(p.fullName.toLowerCase(), p);
          }
        });
      } else if (this.rtdb) {
        const snap = await get(ref(this.rtdb, 'std_users'));
        const val = snap.val() as Record<string, Partial<FirebaseUserProfile>> | null;
        if (val) {
          for (const [uid, data] of Object.entries(val)) {
            if (data && data.fullName && data.role) {
              const p: FirebaseUserProfile = {
                uid,
                email: data.email,
                fullName: data.fullName.trim(),
                role: data.role,
                allowedSystems: data.allowedSystems,
                allowedSystemKeys: data.allowedSystemKeys,
                allSystems: data.allSystems,
                isSuperAdmin: data.isSuperAdmin
              };
              byUid.set(uid, p);
              byName.set(p.fullName.toLowerCase(), p);
            }
          }
        }
      }

      for (const m of members) {
        const targetProfile =
          (m.uid ? byUid.get(m.uid) : undefined) || byName.get(m.fullName.trim().toLowerCase());
        if (!targetProfile) continue;

        const access = buildProfileAccessFields(m.role, m.allowedSystems);
        const updatedProfile: FirebaseUserProfile = {
          uid: targetProfile.uid,
          email: targetProfile.email,
          fullName: m.fullName.trim(),
          role: m.role,
          ...access,
          isSuperAdmin: Boolean(m.isSuperAdmin || (m.role === 'admin' && targetProfile.isSuperAdmin)),
          updatedAt: Date.now()
        };

        if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
          await setDoc(
            doc(this.firestore, 'std_users', targetProfile.uid),
            stripUndefinedDeep(updatedProfile)
          );
        } else if (this.rtdb) {
          await set(
            ref(this.rtdb, `std_users/${targetProfile.uid}`),
            stripUndefinedDeep(updatedProfile)
          );
        }
      }
    } catch {
      // ignore background profile sync error
    }
  }

  private async migrateLegacyToPartitioned(config: FirebaseConfigData): Promise<void> {
    if (this.isMigratingPartitions) return;
    if (this.firebaseUserProfile?.role !== 'admin') return;
    this.isMigratingPartitions = true;

    try {
      let baseState: SyncStatePayload = this.currentState;
      let baseChats: Record<string, SystemChatMessage[]> = { ...this.chatsBySystem };

      if (config.mode === 'firestore' && this.firestore) {
        const legacyWsSnap = await getDoc(doc(this.firestore, 'std_workspaces', 'main_workspace')).catch(
          () => null
        );
        if (legacyWsSnap && legacyWsSnap.exists()) {
          baseState = this.normalizePayload(legacyWsSnap.data());
        }
        const legacyChatSnap = await getDoc(
          doc(this.firestore, 'std_workspaces', 'system_chats')
        ).catch(() => null);
        if (legacyChatSnap && legacyChatSnap.exists()) {
          const cData = legacyChatSnap.data() as { chats?: Record<string, SystemChatMessage[]> };
          if (cData?.chats) baseChats = mergeAllChats(baseChats, cData.chats);
        }

        const systemsList = Array.from(
          new Set([
            ...(baseState.systems || DEFAULT_SYSTEMS),
            ...(baseState.archivedSystems || []),
            ...baseState.issues.map((i) => i.system)
          ])
        );
        for (const sys of systemsList) {
          const sysKey = encodeFirebaseSystemKey(sys);
          const sysIssues = baseState.issues.filter((i) => i.system === sys);
          await setDoc(
            doc(this.firestore, 'std_systems', sysKey),
            stripUndefinedDeep({
              system: sys,
              issues: sysIssues,
              updatedAt: Date.now(),
              revision: baseState.revision || 1,
              lastUpdatedBy: baseState.lastUpdatedBy || 'Admin'
            })
          );
          if (baseChats[sys] && baseChats[sys].length > 0) {
            await setDoc(
              doc(this.firestore, 'std_chats', sysKey),
              stripUndefinedDeep({
                system: sys,
                messages: pruneChatMessages(baseChats[sys]).map(stripUndefinedChatFields),
                updatedAt: Date.now(),
                clientId: this.clientId
              })
            );
          }
        }

        const metaDoc = stripUndefinedDeep({
          systems: baseState.systems || DEFAULT_SYSTEMS,
          archivedSystems: baseState.archivedSystems || [],
          deletedIssueIds: baseState.deletedIssueIds || [],
          deletedSystemIds: baseState.deletedSystemIds || [],
          teamMembers: baseState.teamMembers || getStoredTeamMembers(),
          securityConfig: baseState.securityConfig || getStoredSecurityConfig(),
          partitionVersion: 2,
          revision: Math.max(baseState.revision || 0, 1),
          lastUpdatedBy: baseState.lastUpdatedBy || 'Admin',
          lastAction: 'מיגרציה אוטומטית למחיצות מאובטחות לפי מערכת',
          updatedAt: Date.now(),
          clientId: this.clientId
        });
        await setDoc(doc(this.firestore, 'std_workspaces', 'meta'), metaDoc);
      } else if (this.rtdb) {
        const legacyWsSnap = await get(ref(this.rtdb, 'std_workspace')).catch(() => null);
        if (legacyWsSnap && legacyWsSnap.exists()) {
          baseState = this.normalizePayload(legacyWsSnap.val());
        }
        const systemsList = Array.from(
          new Set([
            ...(baseState.systems || DEFAULT_SYSTEMS),
            ...(baseState.archivedSystems || []),
            ...baseState.issues.map((i) => i.system)
          ])
        );
        for (const sys of systemsList) {
          const sysKey = encodeFirebaseSystemKey(sys);
          const sysIssues = baseState.issues.filter((i) => i.system === sys);
          await set(
            ref(this.rtdb, `std_systems/${sysKey}`),
            stripUndefinedDeep({
              system: sys,
              issues: sysIssues,
              updatedAt: Date.now(),
              revision: baseState.revision || 1,
              lastUpdatedBy: baseState.lastUpdatedBy || 'Admin'
            })
          );
        }

        const metaNode = stripUndefinedDeep({
          systems: baseState.systems || DEFAULT_SYSTEMS,
          archivedSystems: baseState.archivedSystems || [],
          deletedIssueIds: baseState.deletedIssueIds || [],
          deletedSystemIds: baseState.deletedSystemIds || [],
          teamMembers: baseState.teamMembers || getStoredTeamMembers(),
          securityConfig: baseState.securityConfig || getStoredSecurityConfig(),
          partitionVersion: 2,
          revision: Math.max(baseState.revision || 0, 1),
          lastUpdatedBy: baseState.lastUpdatedBy || 'Admin',
          lastAction: 'מיגרציה אוטומטית למחיצות מאובטחות לפי מערכת',
          updatedAt: Date.now(),
          clientId: this.clientId
        });
        await set(ref(this.rtdb, 'std_meta'), metaNode);
      }
    } catch {
      // ignore migration errors and retry next admin session if needed
    } finally {
      this.isMigratingPartitions = false;
    }
  }

  private syncPerSystemListeners(config: FirebaseConfigData, allCandidateSystems: string[]) {
    const permittedSystems = this.getPermittedSystemsForCurrentProfile(allCandidateSystems);
    const permittedKeyMap = new Map<string, string>();
    for (const sys of permittedSystems) {
      permittedKeyMap.set(encodeFirebaseSystemKey(sys), sys);
    }

    // Close listeners for systems no longer permitted/active
    for (const [sysKey, unsub] of this.partitionUnsubscribes.entries()) {
      if (!permittedKeyMap.has(sysKey)) {
        try {
          unsub();
        } catch {}
        this.partitionUnsubscribes.delete(sysKey);
        this.partitionIssues.delete(sysKey);
        this.loadedPartitionKeys.delete(sysKey);
      }
    }
    for (const [sysKey, unsub] of this.chatPartitionUnsubscribes.entries()) {
      if (!permittedKeyMap.has(sysKey)) {
        try {
          unsub();
        } catch {}
        this.chatPartitionUnsubscribes.delete(sysKey);
      }
    }

    this.expectedPartitionKeys = new Set(permittedKeyMap.keys());
    const allPartitionsLoaded = () => {
      for (const k of this.expectedPartitionKeys) {
        if (!this.loadedPartitionKeys.has(k)) return false;
      }
      return true;
    };

    const useFirestore = config.mode === 'firestore';
    for (const [sysKey, sysName] of permittedKeyMap.entries()) {
      if (!this.partitionUnsubscribes.has(sysKey)) {
        if (useFirestore && this.firestore) {
          const sysDocRef = doc(this.firestore, 'std_systems', sysKey);
          const unsub = onSnapshot(
            sysDocRef,
            (snap) => {
              const raw = snap.exists()
                ? (snap.data() as { issues?: StdIssue[]; clientId?: string })
                : null;
              const wasLoaded = this.loadedPartitionKeys.has(sysKey);
              this.loadedPartitionKeys.add(sysKey);
              this.partitionIssues.set(sysKey, Array.isArray(raw?.issues) ? raw.issues : []);
              if (allPartitionsLoaded()) {
                const isRemote =
                  wasLoaded && Boolean(raw?.clientId && raw.clientId !== this.clientId);
                this.rebuildStateFromPartitions(isRemote);
              }
            },
            () => {}
          );
          this.partitionUnsubscribes.set(sysKey, unsub);
        } else if (this.rtdb) {
          const sysRef = ref(this.rtdb, `std_systems/${sysKey}`);
          const unsub = onValue(
            sysRef,
            (snap) => {
              const raw = snap.val() as {
                issues?: StdIssue[] | Record<string, StdIssue>;
                clientId?: string;
              } | null;
              const wasLoaded = this.loadedPartitionKeys.has(sysKey);
              this.loadedPartitionKeys.add(sysKey);
              const list = Array.isArray(raw?.issues)
                ? raw.issues
                : raw?.issues && typeof raw.issues === 'object'
                ? Object.values(raw.issues)
                : [];
              this.partitionIssues.set(sysKey, list);
              if (allPartitionsLoaded()) {
                const isRemote =
                  wasLoaded && Boolean(raw?.clientId && raw.clientId !== this.clientId);
                this.rebuildStateFromPartitions(isRemote);
              }
            },
            () => {}
          );
          this.partitionUnsubscribes.set(sysKey, unsub);
        }
      }

      if (!this.chatPartitionUnsubscribes.has(sysKey)) {
        if (useFirestore && this.firestore) {
          const chatDocRef = doc(this.firestore, 'std_chats', sysKey);
          const unsubChat = onSnapshot(
            chatDocRef,
            (snap) => {
              if (!snap.exists()) {
                this.hasLoadedInitialChatsFirebase = true;
                return;
              }
              const data = snap.data() as { messages?: SystemChatMessage[]; clientId?: string };
              const msgs = Array.isArray(data?.messages) ? data.messages : [];
              const isRemote = Boolean(data?.clientId && data.clientId !== this.clientId);
              this.applyIncomingRemoteChats({ [sysName]: msgs }, isRemote);
            },
            () => {}
          );
          this.chatPartitionUnsubscribes.set(sysKey, unsubChat);
        } else if (this.rtdb) {
          const chatRef = ref(this.rtdb, `std_chats/${sysKey}`);
          const unsubChat = onValue(
            chatRef,
            (snap) => {
              const bucket = snap.val() as Record<string, SystemChatMessage> | SystemChatMessage[] | null;
              if (!bucket) {
                this.hasLoadedInitialChatsFirebase = true;
                return;
              }
              const list = (Array.isArray(bucket) ? bucket : Object.values(bucket)).filter(
                (m) => m && m.id && m.system
              );
              this.applyIncomingRemoteChats({ [sysName]: list }, true);
            },
            () => {}
          );
          this.chatPartitionUnsubscribes.set(sysKey, unsubChat);
        }
      }
    }
  }

  private detachDataListenersOnly() {
    this.clearPartitionListeners();
    if (this.unsubscribeFirebase) {
      this.unsubscribeFirebase();
      this.unsubscribeFirebase = null;
    }
    if (this.unsubscribePresence) {
      this.unsubscribePresence();
      this.unsubscribePresence = null;
    }
    if (this.unsubscribeChatFirebase) {
      this.unsubscribeChatFirebase();
      this.unsubscribeChatFirebase = null;
    }
    if (this.unsubscribeTypingFirebase) {
      this.unsubscribeTypingFirebase();
      this.unsubscribeTypingFirebase = null;
    }
    if (this.unsubscribePrivateConfig) {
      this.unsubscribePrivateConfig();
      this.unsubscribePrivateConfig = null;
    }
    this.hasLoadedInitialChatsFirebase = false;
  }

  private attachFirebaseDataListeners(config: FirebaseConfigData) {
    this.detachDataListenersOnly();
    const useFirestore = config.mode === 'firestore';
    const isEnforced = Boolean(config.requireFirebaseAuth);

    if (useFirestore && this.firestore) {
      if (isEnforced) {
        // Phase 3 #2: Per-System Partitioned Firestore Sync (Server Rules enforce allowedSystemKeys)
        const metaDocRef = doc(this.firestore, 'std_workspaces', 'meta');
        this.unsubscribeFirebase = onSnapshot(
          metaDocRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              if (this.firebaseUserProfile?.role === 'admin') {
                this.migrateLegacyToPartitioned(config);
              }
              return;
            }
            const m = snapshot.data() as NonNullable<typeof this.currentMetaState>;
            this.currentMetaState = {
              systems: Array.isArray(m.systems) && m.systems.length > 0 ? m.systems : DEFAULT_SYSTEMS,
              archivedSystems: Array.isArray(m.archivedSystems) ? m.archivedSystems : [],
              deletedIssueIds: Array.isArray(m.deletedIssueIds) ? m.deletedIssueIds : [],
              deletedSystemIds: Array.isArray(m.deletedSystemIds) ? m.deletedSystemIds : [],
              teamMembers: Array.isArray(m.teamMembers) ? m.teamMembers : undefined,
              securityConfig: m.securityConfig,
              partitionVersion: m.partitionVersion,
              revision: m.revision,
              lastUpdatedBy: m.lastUpdatedBy,
              lastAction: m.lastAction,
              updatedAt: m.updatedAt,
              clientId: m.clientId
            };
            const allSystems = [
              ...this.currentMetaState.systems,
              ...this.currentMetaState.archivedSystems
            ];
            const isRemote = Boolean(m.clientId && m.clientId !== this.clientId);
            this.syncPerSystemListeners(config, allSystems);
            if (
              this.expectedPartitionKeys.size === 0 ||
              Array.from(this.expectedPartitionKeys).every((k) => this.loadedPartitionKeys.has(k))
            ) {
              this.rebuildStateFromPartitions(isRemote);
            }
            this.updateStatus({
              mode: 'firebase-firestore',
              connected: true,
              projectId: config.projectId,
              requireFirebaseAuth: true,
              firebaseUid: this.firebaseUser?.uid,
              firebaseUserEmail: this.firebaseUser?.email || undefined,
              lastSyncAt: Date.now(),
              lastEventText:
                m.lastAction && !isSystemAdminAction(m.lastAction)
                  ? `${m.lastUpdatedBy || 'צוות'}: ${m.lastAction}`
                  : undefined,
              errorMessage: undefined
            });
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

        const privateDocRef = doc(this.firestore, 'std_workspaces', 'private_config');
        this.unsubscribePrivateConfig = onSnapshot(
          privateDocRef,
          (snap) => {
            if (!snap.exists()) return;
            const pData = snap.data() as { googleDriveUrl?: string; apiSecret?: string };
            const decodedUrl = decodeProtectedUrl(pData?.googleDriveUrl);
            if (decodedUrl) setSavedGoogleDriveUrl(decodedUrl);
            if (pData?.apiSecret) setSavedGoogleDriveSecret(String(pData.apiSecret));
          },
          () => {}
        );
        return;
      }

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
              requireFirebaseAuth: Boolean(config.requireFirebaseAuth),
              firebaseUid: this.firebaseUser?.uid,
              firebaseUserEmail: this.firebaseUser?.email || undefined,
              lastSyncAt: Date.now(),
              lastEventText:
                normalized.lastAction && !isSystemAdminAction(normalized.lastAction)
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
              requireFirebaseAuth: Boolean(config.requireFirebaseAuth),
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

      // Private Drive config listener (protected by Firestore Rules)
      const privateDocRef = doc(this.firestore, 'std_workspaces', 'private_config');
      this.unsubscribePrivateConfig = onSnapshot(
        privateDocRef,
        (snap) => {
          if (!snap.exists()) return;
          const pData = snap.data() as { googleDriveUrl?: string; apiSecret?: string };
          const decodedUrl = decodeProtectedUrl(pData?.googleDriveUrl);
          if (decodedUrl) setSavedGoogleDriveUrl(decodedUrl);
          if (pData?.apiSecret) setSavedGoogleDriveSecret(String(pData.apiSecret));
        },
        () => {}
      );

      // Listen to dedicated Firestore per-system chat document
      const chatsDocRef = doc(this.firestore, 'std_workspaces', 'system_chats');
      this.unsubscribeChatFirebase = onSnapshot(
        chatsDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as {
              chats?: Record<string, SystemChatMessage[]>;
              clientId?: string;
            };
            if (data?.chats && typeof data.chats === 'object') {
              const isRemote = Boolean(data.clientId && data.clientId !== this.clientId);
              this.applyIncomingRemoteChats(data.chats, isRemote);
            }
          }
        },
        () => {
          // ignore optional chat listener error
        }
      );
      return;
    }

    if (this.rtdb) {
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

      if (isEnforced) {
        // Phase 3 #2: Per-System Partitioned RTDB Sync (Server Rules enforce allowedSystemKeys)
        const metaRef = ref(this.rtdb, 'std_meta');
        this.unsubscribeFirebase = onValue(
          metaRef,
          (snapshot) => {
            const m = snapshot.val() as NonNullable<typeof this.currentMetaState> | null;
            if (!m) {
              if (this.firebaseUserProfile?.role === 'admin') {
                this.migrateLegacyToPartitioned(config);
              }
              return;
            }
            this.currentMetaState = {
              systems: Array.isArray(m.systems) && m.systems.length > 0 ? m.systems : DEFAULT_SYSTEMS,
              archivedSystems: Array.isArray(m.archivedSystems) ? m.archivedSystems : [],
              deletedIssueIds: Array.isArray(m.deletedIssueIds) ? m.deletedIssueIds : [],
              deletedSystemIds: Array.isArray(m.deletedSystemIds) ? m.deletedSystemIds : [],
              teamMembers: Array.isArray(m.teamMembers)
                ? m.teamMembers
                : m.teamMembers && typeof m.teamMembers === 'object'
                ? Object.values(m.teamMembers)
                : undefined,
              securityConfig: m.securityConfig,
              partitionVersion: m.partitionVersion,
              revision: m.revision,
              lastUpdatedBy: m.lastUpdatedBy,
              lastAction: m.lastAction,
              updatedAt: m.updatedAt,
              clientId: m.clientId
            };
            const allSystems = [
              ...this.currentMetaState.systems,
              ...this.currentMetaState.archivedSystems
            ];
            const isRemote = Boolean(m.clientId && m.clientId !== this.clientId);
            this.syncPerSystemListeners(config, allSystems);
            if (
              this.expectedPartitionKeys.size === 0 ||
              Array.from(this.expectedPartitionKeys).every((k) => this.loadedPartitionKeys.has(k))
            ) {
              this.rebuildStateFromPartitions(isRemote);
            }
            this.updateStatus({
              mode: 'firebase-rtdb',
              connected: true,
              projectId: config.projectId,
              requireFirebaseAuth: true,
              firebaseUid: this.firebaseUser?.uid,
              firebaseUserEmail: this.firebaseUser?.email || undefined,
              lastSyncAt: Date.now(),
              lastEventText:
                m.lastAction && !isSystemAdminAction(m.lastAction)
                  ? `${m.lastUpdatedBy || 'צוות'}: ${m.lastAction}`
                  : undefined,
              errorMessage: undefined
            });
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

        try {
          const privateRef = ref(this.rtdb, 'std_private_config');
          this.unsubscribePrivateConfig = onValue(
            privateRef,
            (snap) => {
              const pData = snap.val() as { googleDriveUrl?: string; apiSecret?: string } | null;
              if (!pData) return;
              const decodedUrl = decodeProtectedUrl(pData.googleDriveUrl);
              if (decodedUrl) setSavedGoogleDriveUrl(decodedUrl);
              if (pData.apiSecret) setSavedGoogleDriveSecret(String(pData.apiSecret));
            },
            () => {}
          );
          const typingRef = ref(this.rtdb, 'std_chat_typing');
          this.unsubscribeTypingFirebase = onValue(
            typingRef,
            (snap) => {
              const rawVal = snap.val() as Record<string, any> | null;
              const now = Date.now();
              this.typingUsers.clear();
              if (rawVal) {
                for (const item of Object.values(rawVal)) {
                  if (
                    item &&
                    item.isTyping &&
                    item.system &&
                    item.author &&
                    item.clientId &&
                    item.clientId !== this.clientId &&
                    now - (item.timestamp || 0) < 6000
                  ) {
                    this.typingUsers.set(`${item.system}::${item.clientId}`, {
                      system: item.system,
                      author: item.author,
                      clientId: item.clientId,
                      updatedAt: item.timestamp || now
                    });
                  }
                }
              }
              this.notifyTyping();
            },
            () => {}
          );
        } catch {
          // ignore
        }
        return;
      }

      const stateRef = ref(this.rtdb, 'std_workspace');

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
              requireFirebaseAuth: Boolean(config.requireFirebaseAuth),
              firebaseUid: this.firebaseUser?.uid,
              firebaseUserEmail: this.firebaseUser?.email || undefined,
              lastSyncAt: Date.now(),
              lastEventText:
                normalized.lastAction && !isSystemAdminAction(normalized.lastAction)
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
              requireFirebaseAuth: Boolean(config.requireFirebaseAuth),
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

      // Private Drive config listener (protected by RTDB Rules)
      try {
        const privateRef = ref(this.rtdb, 'std_private_config');
        this.unsubscribePrivateConfig = onValue(
          privateRef,
          (snap) => {
            const pData = snap.val() as { googleDriveUrl?: string; apiSecret?: string } | null;
            if (!pData) return;
            const decodedUrl = decodeProtectedUrl(pData.googleDriveUrl);
            if (decodedUrl) setSavedGoogleDriveUrl(decodedUrl);
            if (pData.apiSecret) setSavedGoogleDriveSecret(String(pData.apiSecret));
          },
          () => {}
        );
      } catch {
        // ignore
      }

      // Listen to dedicated RTDB per-system chats node
      try {
        const chatsRef = ref(this.rtdb, 'std_chats');
        this.unsubscribeChatFirebase = onValue(
          chatsRef,
          (snap) => {
            const rawVal = snap.val() as Record<
              string,
              Record<string, SystemChatMessage> | SystemChatMessage[]
            > | null;
            if (!rawVal) {
              this.hasLoadedInitialChatsFirebase = true;
              return;
            }
            const parsedChats: Record<string, SystemChatMessage[]> = {};
            for (const bucket of Object.values(rawVal)) {
              if (!bucket) continue;
              const list = Array.isArray(bucket) ? bucket : Object.values(bucket);
              for (const msg of list) {
                if (msg && msg.id && msg.system) {
                  if (!parsedChats[msg.system]) parsedChats[msg.system] = [];
                  parsedChats[msg.system].push(msg);
                }
              }
            }
            this.applyIncomingRemoteChats(parsedChats, true);
          },
          () => {
            // ignore chat listener error
          }
        );

        const typingRef = ref(this.rtdb, 'std_chat_typing');
        this.unsubscribeTypingFirebase = onValue(
          typingRef,
          (snap) => {
            const rawVal = snap.val() as Record<string, any> | null;
            const now = Date.now();
            this.typingUsers.clear();
            if (rawVal) {
              for (const item of Object.values(rawVal)) {
                if (
                  item &&
                  item.isTyping &&
                  item.system &&
                  item.author &&
                  item.clientId &&
                  item.clientId !== this.clientId &&
                  now - (item.timestamp || 0) < 6000
                ) {
                  this.typingUsers.set(`${item.system}::${item.clientId}`, {
                    system: item.system,
                    author: item.author,
                    clientId: item.clientId,
                    updatedAt: item.timestamp || now
                  });
                }
              }
            }
            this.notifyTyping();
          },
          () => {
            // ignore typing listener error
          }
        );
      } catch {
        // ignore
      }
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
      requireFirebaseAuth: Boolean(config.requireFirebaseAuth),
      errorMessage: undefined
    });

    try {
      const existingApps = getApps();
      for (const app of existingApps) {
        await deleteApp(app);
      }

      this.firebaseApp = initializeApp(this.buildFirebaseOptions(config));

      // Firebase App Check (reCAPTCHA v3): blocks use of the Firebase API key outside this app
      if (isValidAppCheckSiteKey(config.appCheckSiteKey)) {
        try {
          if (import.meta.env.DEV) {
            (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
          }
          initializeAppCheck(this.firebaseApp, {
            provider: new ReCaptchaV3Provider((config.appCheckSiteKey as string).trim()),
            isTokenAutoRefreshEnabled: true
          });
        } catch (appCheckErr: any) {
          this.updateStatus({
            errorMessage: `App Check לא הופעל: ${appCheckErr?.message || appCheckErr}`
          });
        }
      }

      this.firebaseAuth = getAuth(this.firebaseApp);
      if (useFirestore) {
        this.firestore = getFirestore(this.firebaseApp);
        this.rtdb = null;
      } else {
        this.rtdb = getDatabase(this.firebaseApp);
        this.firestore = null;
      }

      this.unsubscribeAuthState = onAuthStateChanged(this.firebaseAuth, async (user) => {
        this.firebaseUser = user;
        this.firebaseAuthInitialized = true;

        if (user) {
          const profile = await this.fetchFirebaseUserProfile(user.uid);
          this.firebaseUserProfile = profile;
          this.updateStatus({
            firebaseUid: user.uid,
            firebaseUserEmail: user.email || undefined
          });
          if (config.requireFirebaseAuth) {
            if (profile) {
              this.attachFirebaseDataListeners(config);
            }
          }
        } else {
          this.firebaseUserProfile = null;
          this.updateStatus({
            firebaseUid: undefined,
            firebaseUserEmail: undefined,
            ...(config.requireFirebaseAuth ? { connected: false } : {})
          });
          if (config.requireFirebaseAuth) {
            this.detachDataListenersOnly();
          }
        }
        this.notifyAuthListeners();
      });

      if (!config.requireFirebaseAuth) {
        this.attachFirebaseDataListeners(config);
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
    this.firebaseUser = null;
    this.firebaseUserProfile = null;
    this.updateStatus({
      requireFirebaseAuth: false,
      firebaseUid: undefined,
      firebaseUserEmail: undefined
    });
    this.notifyAuthListeners();
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
    // When Firebase is active (especially in Auth-enforced mode), Firebase real-time listeners handle sync exclusively.
    // Never fall back to public MQTT / Registry / Bytebin endpoints.
    if (this.activeFirebaseConfig) {
      return;
    }

    if (this.mqttClient && this.mqttClient.connected) {
      try {
        if (forceMqttResubscribe || !this.hasReceivedInitialCloud) {
          this.mqttClient.subscribe(CLOUD_TOPIC_STATE, { qos: 1 });
        }
        // Ask all connected peers if anyone has a newer revision or more issues
        this.mqttClient.publish(
          CLOUD_TOPIC_PING_V4,
          JSON.stringify({
            type: 'STATE_SYNC_CHECK',
            clientId: this.clientId,
            revision: this.currentState.revision || 0,
            issueCount: this.currentState.issues.length,
            timestamp: Date.now()
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
      lastEventText:
        merged.lastAction && !isSystemAdminAction(merged.lastAction)
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
          topic: `${CLOUD_TOPIC_PRESENCE_V4}${this.clientId}`,
          payload: JSON.stringify({ online: false, clientId: this.clientId, timestamp: Date.now() }),
          qos: 0,
          retain: false
        }
      });

      this.mqttClient = client;

      const publishPresenceOnline = () => {
        if (!client.connected) return;
        const now = Date.now();
        this.activePeers.set(this.clientId, now);
        const onMsg = JSON.stringify({ online: true, clientId: this.clientId, timestamp: now });
        client.publish(`${CLOUD_TOPIC_PRESENCE_V4}${this.clientId}`, onMsg, {
          qos: 0,
          retain: false
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
        client.subscribe(`${CLOUD_TOPIC_PRESENCE_V4}+`, { qos: 0 });
        client.subscribe(CLOUD_TOPIC_PING_V4, { qos: 0 });
        client.subscribe(CLOUD_TOPIC_CHAT_EVENT, { qos: 1 });
        client.subscribe(CLOUD_TOPIC_CHAT_SNAPSHOT, { qos: 1 });
        client.subscribe(CLOUD_TOPIC_CHAT_TYPING, { qos: 0 });
        client.subscribe(CLOUD_TOPIC_CHAT_PING, { qos: 0 });

        publishPresenceOnline();

        client.publish(
          CLOUD_TOPIC_PING_V4,
          JSON.stringify({
            type: 'STATE_SYNC_CHECK',
            clientId: this.clientId,
            revision: this.currentState.revision || 0,
            issueCount: this.currentState.issues.length,
            timestamp: Date.now()
          }),
          { qos: 0, retain: false }
        );

        const chatTotals = this.getChatTotals(this.chatsBySystem);
        client.publish(
          CLOUD_TOPIC_CHAT_PING,
          JSON.stringify({
            type: 'CHAT_SYNC_CHECK',
            clientId: this.clientId,
            totalMessages: chatTotals.totalMessages,
            latestUpdatedAt: chatTotals.latestUpdatedAt,
            timestamp: Date.now()
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
          // If a peer has not sent a heartbeat in 30 seconds, consider them disconnected
          if (id !== this.clientId && nowLocal - seenAtLocal > 30000) {
            this.activePeers.delete(id);
          }
        }
        this.updateStatus({
          onlineCount: Math.max(1, this.activePeers.size)
        });
      }, 10000);

      client.on('message', async (topic, message) => {
        try {
          const rawStr = message.toString();
          if (!rawStr) return;

          if (topic === CLOUD_TOPIC_STATE) {
            const decryptedStr = await decryptSyncPayload(rawStr);
            const parsed = JSON.parse(decryptedStr);
            const normalized = this.normalizePayload(parsed);
            this.handleIncomingCloudState(normalized);
          } else if (topic === CLOUD_TOPIC_PING_V4) {
            const data = JSON.parse(rawStr);
            if (data && data.clientId) {
              const now = Date.now();
              // Ignore stale or delayed packets older than 25s
              if (data.timestamp && Math.abs(now - data.timestamp) > 25000) {
                return;
              }
              if (data.clientId !== this.clientId) {
                this.activePeers.set(data.clientId, now);
              }
              this.activePeers.set(this.clientId, now);
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
          } else if (topic.startsWith(CLOUD_TOPIC_PRESENCE_V4)) {
            const peerId = topic.replace(CLOUD_TOPIC_PRESENCE_V4, '');
            if (!peerId) return;

            const data = JSON.parse(rawStr);
            const now = Date.now();
            // Ignore stale packets
            if (data && data.timestamp && Math.abs(now - data.timestamp) > 25000) {
              return;
            }
            if (data && data.online) {
              if (peerId !== this.clientId) {
                this.activePeers.set(peerId, now);
              }
            } else {
              this.activePeers.delete(peerId);
            }
            this.activePeers.set(this.clientId, now);
            this.updateStatus({
              onlineCount: Math.max(1, this.activePeers.size)
            });
          } else if (topic === CLOUD_TOPIC_CHAT_EVENT) {
            await this.handleIncomingChatEvent(rawStr);
          } else if (topic === CLOUD_TOPIC_CHAT_SNAPSHOT) {
            await this.handleIncomingChatSnapshot(rawStr);
          } else if (topic === CLOUD_TOPIC_CHAT_PING) {
            const data = JSON.parse(rawStr);
            if (data && data.clientId && data.clientId !== this.clientId) {
              const now = Date.now();
              if (data.timestamp && Math.abs(now - data.timestamp) > 25000) {
                return;
              }
              const peerTotal = Number(data.totalMessages || 0);
              const peerLatest = Number(data.latestUpdatedAt || 0);
              const myTotals = this.getChatTotals(this.chatsBySystem);
              if (
                myTotals.totalMessages > peerTotal ||
                (myTotals.totalMessages > 0 && myTotals.latestUpdatedAt > peerLatest)
              ) {
                this.publishChatSnapshotToMqtt(this.chatsBySystem);
              }
            }
          } else if (topic === CLOUD_TOPIC_CHAT_TYPING) {
            const data = JSON.parse(rawStr);
            if (
              data &&
              data.clientId &&
              data.clientId !== this.clientId &&
              data.system &&
              data.author
            ) {
              const now = Date.now();
              if (data.timestamp && Math.abs(now - data.timestamp) > 15000) {
                return;
              }
              const key = `${data.system}::${data.clientId}`;
              if (data.isTyping) {
                this.typingUsers.set(key, {
                  system: data.system,
                  author: data.author,
                  clientId: data.clientId,
                  updatedAt: now
                });
              } else {
                this.typingUsers.delete(key);
              }
              this.notifyTyping();
            }
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

        const isAuthEnforced = this.isFirebaseAuthRequired();
        const drivePayload: SyncStatePayload = {
          ...this.currentState,
          issues: liveIssues,
          revision: driveRev,
          updatedAt: Date.now(),
          ...(!isAuthEnforced ? { googleDriveUrl: getSavedGoogleDriveUrl() || undefined } : {})
        };

        this.currentState = drivePayload;
        this.lastAppliedFingerprint = this.computeFingerprint(drivePayload);
        this.notifyState(false);
        this.persistLocally(drivePayload);

        if (
          this.activeFirebaseConfig &&
          this.activeFirebaseConfig.mode === 'firestore' &&
          this.firestore
        ) {
          if (isAuthEnforced) {
            const systems = this.getPermittedSystemsForCurrentProfile(
              Array.from(new Set(drivePayload.issues.map((i) => i.system)))
            );
            for (const sys of systems) {
              const sysKey = encodeFirebaseSystemKey(sys);
              const sysIssues = drivePayload.issues.filter((i) => i.system === sys);
              this.partitionIssues.set(sysKey, sysIssues);
              await setDoc(
                doc(this.firestore, 'std_systems', sysKey),
                stripUndefinedDeep({
                  system: sys,
                  issues: sysIssues,
                  updatedAt: drivePayload.updatedAt,
                  revision: driveRev,
                  lastUpdatedBy: this.currentState.lastUpdatedBy
                })
              );
            }
          } else {
            const workspaceDocRef = doc(this.firestore, 'std_workspaces', 'main_workspace');
            await setDoc(
              workspaceDocRef,
              {
                issues: drivePayload.issues,
                revision: driveRev,
                updatedAt: drivePayload.updatedAt,
                clientId: this.clientId
              },
              { merge: true }
            );
          }
        } else if (this.activeFirebaseConfig && this.rtdb) {
          if (isAuthEnforced) {
            const systems = this.getPermittedSystemsForCurrentProfile(
              Array.from(new Set(drivePayload.issues.map((i) => i.system)))
            );
            for (const sys of systems) {
              const sysKey = encodeFirebaseSystemKey(sys);
              const sysIssues = drivePayload.issues.filter((i) => i.system === sys);
              this.partitionIssues.set(sysKey, sysIssues);
              await set(
                ref(this.rtdb, `std_systems/${sysKey}`),
                stripUndefinedDeep({
                  system: sys,
                  issues: sysIssues,
                  updatedAt: drivePayload.updatedAt,
                  revision: driveRev,
                  lastUpdatedBy: this.currentState.lastUpdatedBy
                })
              );
            }
          } else {
            const stateRef = ref(this.rtdb, 'std_workspace');
            await update(stateRef, {
              issues: drivePayload.issues,
              revision: driveRev,
              updatedAt: drivePayload.updatedAt,
              clientId: this.clientId
            });
          }
        } else if (!isAuthEnforced) {
          await this.publishStateToMqtt(drivePayload);
        }
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
    actionSummary?: string,
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

    const effectiveAction =
      actionSummary !== undefined ? actionSummary : this.currentState.lastAction;
    const effectiveActor =
      actionSummary ? actorName : (this.currentState.lastUpdatedBy || actorName);

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
      lastUpdatedBy: effectiveActor,
      lastAction: effectiveAction,
      updatedAt: Date.now(),
      revision: nextRevision,
      clientId: this.clientId,
      googleDriveUrl: this.isFirebaseAuthRequired()
        ? undefined
        : getSavedGoogleDriveUrl() || undefined
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
    payload.lastUpdatedBy = effectiveActor;
    payload.lastAction = effectiveAction;
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

    const isAuthEnforced = this.isFirebaseAuthRequired();
    const isFirebaseAdmin = this.firebaseUserProfile?.role === 'admin';

    // 1. If connected to Firebase Firestore
    if (
      this.activeFirebaseConfig &&
      this.activeFirebaseConfig.mode === 'firestore' &&
      this.firestore
    ) {
      if (isAuthEnforced) {
        const allKnownSystems = Array.from(
          new Set([
            ...payload.systems,
            ...(payload.archivedSystems || []),
            ...payload.issues.map((i) => i.system)
          ])
        );
        const permittedSystems = this.getPermittedSystemsForCurrentProfile(allKnownSystems);
        for (const sys of permittedSystems) {
          const sysKey = encodeFirebaseSystemKey(sys);
          const sysIssues = payload.issues.filter((i) => i.system === sys);
          this.partitionIssues.set(sysKey, sysIssues);
          const partPayload = stripUndefinedDeep({
            system: sys,
            issues: sysIssues,
            updatedAt: payload.updatedAt,
            revision: payload.revision,
            lastUpdatedBy: payload.lastUpdatedBy,
            clientId: this.clientId
          });
          const partHash = hashString(JSON.stringify(sysIssues));
          if (nextState.replaceAll || this.lastPushedPartitionHashes.get(sysKey) !== partHash) {
            await setDoc(doc(this.firestore, 'std_systems', sysKey), partPayload);
            this.lastPushedPartitionHashes.set(sysKey, partHash);
          }
        }
        const metaDocRef = doc(this.firestore, 'std_workspaces', 'meta');
        if (isFirebaseAdmin) {
          await setDoc(
            metaDocRef,
            stripUndefinedDeep({
              systems: payload.systems,
              archivedSystems: payload.archivedSystems || [],
              deletedIssueIds: payload.deletedIssueIds || [],
              deletedSystemIds: payload.deletedSystemIds || [],
              teamMembers: payload.teamMembers,
              securityConfig: payload.securityConfig,
              partitionVersion: 2,
              revision: payload.revision,
              updatedAt: payload.updatedAt,
              lastUpdatedBy: payload.lastUpdatedBy,
              lastAction: payload.lastAction,
              clientId: payload.clientId
            })
          );
        } else {
          await setDoc(
            metaDocRef,
            stripUndefinedDeep({
              revision: payload.revision,
              updatedAt: payload.updatedAt,
              lastUpdatedBy: payload.lastUpdatedBy,
              lastAction: payload.lastAction,
              clientId: payload.clientId
            }),
            { merge: true }
          );
        }
      } else {
        const workspaceDocRef = doc(this.firestore, 'std_workspaces', 'main_workspace');
        await setDoc(workspaceDocRef, payload);
      }
      if (getSavedGoogleDriveUrl()) {
        this.offloadNewImagesToGoogleDriveInBackground();
      }
      localStorage.removeItem('std_qa_pending_push');
      return;
    }

    // 2. If connected to Firebase Realtime Database
    if (this.activeFirebaseConfig && this.rtdb) {
      if (isAuthEnforced) {
        const allKnownSystems = Array.from(
          new Set([
            ...payload.systems,
            ...(payload.archivedSystems || []),
            ...payload.issues.map((i) => i.system)
          ])
        );
        const permittedSystems = this.getPermittedSystemsForCurrentProfile(allKnownSystems);
        for (const sys of permittedSystems) {
          const sysKey = encodeFirebaseSystemKey(sys);
          const sysIssues = payload.issues.filter((i) => i.system === sys);
          this.partitionIssues.set(sysKey, sysIssues);
          const partPayload = stripUndefinedDeep({
            system: sys,
            issues: sysIssues,
            updatedAt: payload.updatedAt,
            revision: payload.revision,
            lastUpdatedBy: payload.lastUpdatedBy,
            clientId: this.clientId
          });
          const partHash = hashString(JSON.stringify(sysIssues));
          if (nextState.replaceAll || this.lastPushedPartitionHashes.get(sysKey) !== partHash) {
            await set(ref(this.rtdb, `std_systems/${sysKey}`), partPayload);
            this.lastPushedPartitionHashes.set(sysKey, partHash);
          }
        }
        const metaRef = ref(this.rtdb, 'std_meta');
        if (isFirebaseAdmin) {
          await set(
            metaRef,
            stripUndefinedDeep({
              systems: payload.systems,
              archivedSystems: payload.archivedSystems || [],
              deletedIssueIds: payload.deletedIssueIds || [],
              deletedSystemIds: payload.deletedSystemIds || [],
              teamMembers: payload.teamMembers,
              securityConfig: payload.securityConfig,
              partitionVersion: 2,
              revision: payload.revision,
              updatedAt: payload.updatedAt,
              lastUpdatedBy: payload.lastUpdatedBy,
              lastAction: payload.lastAction,
              clientId: payload.clientId
            })
          );
        } else {
          await update(
            metaRef,
            stripUndefinedDeep({
              revision: payload.revision,
              updatedAt: payload.updatedAt,
              lastUpdatedBy: payload.lastUpdatedBy,
              lastAction: payload.lastAction,
              clientId: payload.clientId
            })
          );
        }
      } else {
        const stateRef = ref(this.rtdb, 'std_workspace');
        await set(stateRef, payload);
      }
      if (getSavedGoogleDriveUrl()) {
        this.offloadNewImagesToGoogleDriveInBackground();
      }
      localStorage.removeItem('std_qa_pending_push');
      return;
    }

    // Never downgrade to unauthenticated public MQTT/Bytebin if strict Firebase Auth mode is enabled
    if (isAuthEnforced) {
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
