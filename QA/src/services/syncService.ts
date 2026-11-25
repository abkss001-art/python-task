import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken as getAppCheckToken,
  onTokenChanged,
  AppCheck
} from 'firebase/app-check';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  remove,
  onDisconnect,
  query,
  orderByChild,
  limitToLast,
  forceWebSockets,
  goOffline,
  goOnline,
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
  deleteDoc,
  query as fsQuery,
  orderBy,
  limit,
  Firestore
} from 'firebase/firestore';
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
  JoinRequest,
  PlatformQuotaSnapshot,
  ServerAuditLogEntry,
  StdIssue,
  StdSeverity,
  SyncStatusInfo,
  SystemChatMessage,
  TeamRole
} from '../types/std';
import {
  computeFullNameHash,
  MAX_JOIN_REJECTIONS,
  normalizeLoginEmail
} from '../utils/authHelpers';
import {
  encodeMcpPersonalToken,
  isValidAppCheckDebugToken
} from '../utils/mcpTokenUtils';
import {
  isValidAppCheckSiteKey,
  isValidFirebaseConfig,
  loadActiveFirebaseConfig,
  saveFirebaseConfigLocally
} from '../firebaseConfig';
import {
  clearWorkspaceAndChatsFromIndexedDB,
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
  fetchGoogleDriveQuota,
  getSavedGoogleDriveUrl,
  isDataUrlImage,
  registerFirebaseAppCheckTokenProvider,
  registerFirebaseIdTokenProvider,
  saveAutoBackupToGoogleDrive,
  setSavedGoogleDriveSecret,
  setSavedGoogleDriveUrl,
  uploadImageToGoogleDrive
} from './googleDriveService';
import {
  decodeProtectedUrl,
  DeveloperVaultCredential,
  encodeProtectedUrl,
  hashDeveloperVaultPassword,
  sanitizeImageUrl,
  verifyDeveloperVaultPassword
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
  lastUpdatedBy?: string;
  lastAction?: string;
  updatedAt?: number;
  revision?: number;
  clientId?: string;
  googleDriveUrl?: string;
}

type StateListener = (state: SyncStatePayload, isRemoteUpdate: boolean) => void;
type StatusListener = (status: SyncStatusInfo) => void;
type ChatListener = (
  chatsBySystem: Record<string, SystemChatMessage[]>,
  incomingNewMessage?: SystemChatMessage
) => void;
type TypingListener = (typingBySystem: Record<string, ChatTypingUser[]>) => void;

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
  if (msg.authorUid) {
    clean.authorUid = msg.authorUid;
  }
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

class RealtimeSyncService {
  private clientId = getPersistentClientId();
  private stateListeners = new Set<StateListener>();
  private statusListeners = new Set<StatusListener>();

  private currentState: SyncStatePayload = {
    systems: [],
    archivedSystems: [],
    deletedIssueIds: [],
    deletedSystemIds: [],
    issues: [],
    teamMembers: [],
    revision: 0
  };

  private highestSeenRevision = 0;
  private lastAppliedFingerprint = '';
  private isOffloadingImages = false;
  private uploadedDriveUrlCache = new Map<string, string>();

  private statusInfo: SyncStatusInfo = {
    mode: 'connecting',
    connected: false,
    onlineCount: 1,
    requireFirebaseAuth: true
  };

  private firebaseApp: FirebaseApp | null = null;
  private firebaseAppCheck: AppCheck | null = null;
  private unsubscribeAppCheckToken: (() => void) | null = null;
  private lastRecordedAppCheckTokenHash = '';
  private isInitialized = false;
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
  private unsubscribeOwnJoinRequest: (() => void) | null = null;
  private unsubscribeOwnProfileWatcher: (() => void) | null = null;
  private unsubscribeAdminJoinRequests: (() => void) | null = null;
  private pendingJoinRequest: JoinRequest | null = null;
  private pendingJoinRequestListeners = new Set<(req: JoinRequest | null) => void>();
  private adminJoinRequests: JoinRequest[] = [];
  private adminJoinRequestsListeners = new Set<
    (requests: JoinRequest[], newlyArrived?: JoinRequest) => void
  >();
  private seenPendingJoinRequestKeys = new Set<string>();
  private hasLoadedInitialJoinRequests = false;
  private realtimeApprovalListeners = new Set<(profile: FirebaseUserProfile) => void>();
  private broadcastChannel: BroadcastChannel | null = null;
  private activeFirebaseConfig: FirebaseConfigData | null = null;
  private authEpoch = 0;
  private activeDataListenersUid: string | null = null;
  private rtdbMetaSnapshotReceived = false;
  private rtdbBootstrapWatchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private rtdbReconnectRetryTimer: ReturnType<typeof setTimeout> | null = null;
  private isRecoveringRtdb = false;
  private hasForcedWebSockets = false;
  private isRebuildingFirebaseApp = false;
  private hasAutoRebuiltFirebaseApp = false;
  private mcpAppCheckDebugToken = '';
  private mcpBridgeEnabled = true;
  private devVaultCredential: DeveloperVaultCredential | null = null;
  private mcpBridgeListeners = new Set<
    (info: { configured: boolean; enabled: boolean }) => void
  >();

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
    partitionVersion?: number;
    revision?: number;
    lastUpdatedBy?: string;
    lastAction?: string;
    updatedAt?: number;
    clientId?: string;
  } | null = null;

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    registerFirebaseIdTokenProvider(async () => {
      try {
        return this.firebaseUser ? await this.firebaseUser.getIdToken() : null;
      } catch {
        return null;
      }
    });
    registerFirebaseAppCheckTokenProvider(async () => {
      try {
        if (!this.firebaseAppCheck) return null;
        const res = await getAppCheckToken(this.firebaseAppCheck, false);
        return res?.token || null;
      } catch {
        return null;
      }
    });

    const initialFbConfig = loadActiveFirebaseConfig();
    this.currentState = {
      systems: [],
      archivedSystems: [],
      deletedIssueIds: [],
      deletedSystemIds: [],
      issues: [],
      teamMembers: [],
      revision: 0
    };
    this.chatsBySystem = {};
    this.mcpAppCheckDebugToken = '';
    this.mcpBridgeEnabled = true;
    this.devVaultCredential = null;
    this.notifyMcpBridgeListeners();

    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('std_qa_live_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (!this.firebaseUser || !this.firebaseUserProfile) return;
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

    if (initialFbConfig && isValidFirebaseConfig(initialFbConfig)) {
      this.connectFirebase({ ...initialFbConfig, requireFirebaseAuth: true });
    } else {
      this.updateStatus({
        mode: 'error',
        connected: false,
        requireFirebaseAuth: true,
        errorMessage: 'הגדרות Firebase חסרות — לא ניתן להתחבר לענן המאובטח.'
      });
    }
  }

  public getActiveFirebaseConfig(): FirebaseConfigData | null {
    return this.activeFirebaseConfig;
  }

  public async checkAppCheckHealth(): Promise<{ ok: boolean; configured: boolean; error?: string }> {
    const configured = Boolean(
      this.activeFirebaseConfig && isValidAppCheckSiteKey(this.activeFirebaseConfig.appCheckSiteKey)
    );
    if (!configured || !this.firebaseAppCheck) {
      return { ok: false, configured };
    }
    try {
      const res = await getAppCheckToken(this.firebaseAppCheck, false);
      if (res?.token) {
        return { ok: true, configured: true };
      }
      return { ok: false, configured: true, error: 'לא התקבל טוקן App Check' };
    } catch (err: any) {
      return {
        ok: false,
        configured: true,
        error: String(err?.code || err?.message || err || 'App Check error')
      };
    }
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
    this.broadcastChatToTabs();

    if (
      this.activeFirebaseConfig &&
      this.activeFirebaseConfig.mode === 'firestore' &&
      this.firestore
    ) {
      const oldKey = encodeFirebaseSystemKey(oldSystem);
      const newKey = encodeFirebaseSystemKey(newSystem);
      const msgs = pruneChatMessages(next[newSystem] || []).map(stripUndefinedChatFields);
      setDoc(doc(this.firestore, 'std_chats', newKey), {
        system: newSystem,
        messages: msgs,
        updatedAt: Date.now(),
        clientId: this.clientId
      })
        .then(() => {
          if (oldKey !== newKey && this.firestore) {
            return deleteDoc(doc(this.firestore, 'std_chats', oldKey));
          }
        })
        .catch(() => {});
      return;
    }

    if (this.activeFirebaseConfig && this.rtdb) {
      const oldKey = encodeFirebaseSystemKey(oldSystem);
      const newKey = encodeFirebaseSystemKey(newSystem);
      const bucket: Record<string, Record<string, any>> = {};
      for (const m of pruneChatMessages(next[newSystem] || [])) {
        bucket[m.id] = stripUndefinedChatFields(m);
      }
      set(ref(this.rtdb, `std_chats/${newKey}`), bucket)
        .then(() => {
          if (oldKey !== newKey && this.rtdb) {
            return remove(ref(this.rtdb, `std_chats/${oldKey}`));
          }
        })
        .catch(() => {});
      return;
    }
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
    this.clearRtdbWatchdogTimers();
    this.activeDataListenersUid = null;
    this.rtdbMetaSnapshotReceived = false;
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
    if (this.unsubscribeAppCheckToken) {
      this.unsubscribeAppCheckToken();
      this.unsubscribeAppCheckToken = null;
    }
    this.detachWaitingRoomListeners();
    if (this.unsubscribeAdminJoinRequests) {
      this.unsubscribeAdminJoinRequests();
      this.unsubscribeAdminJoinRequests = null;
    }
    this.adminJoinRequests = [];
    this.seenPendingJoinRequestKeys.clear();
    this.hasLoadedInitialJoinRequests = false;
    this.hasLoadedInitialChatsFirebase = false;
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

  private withTimeout<T>(promise: Promise<T>, ms: number, label = 'timeout'): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(label)), ms);
      promise.then(
        (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  /**
   * ניקוי דגלי תחבורה ישנים של RTDB ב-localStorage (previous_websocket_failure ו-host cache),
   * שגורמים לדפדפן הרגיל / PWA להינעל ב-Long-Polling שבור במקום להתחבר ב-WebSocket נקי.
   * לעולם לא נוגע במפתחות ההתחברות (firebase:authUser:*).
   */
  private clearStaleRtdbTransportFlags() {
    try {
      const staleKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k === 'firebase:previous_websocket_failure' || k.startsWith('firebase:host:'))) {
          staleKeys.push(k);
        }
      }
      for (const k of staleKeys) {
        localStorage.removeItem(k);
      }
    } catch {
      // ignore storage errors
    }
  }

  private clearRtdbWatchdogTimers() {
    if (this.rtdbBootstrapWatchdogTimer) {
      clearTimeout(this.rtdbBootstrapWatchdogTimer);
      this.rtdbBootstrapWatchdogTimer = null;
    }
    if (this.rtdbReconnectRetryTimer) {
      clearTimeout(this.rtdbReconnectRetryTimer);
      this.rtdbReconnectRetryTimer = null;
    }
  }

  /**
   * מאתחל מחדש את חיבור ה-WebSocket של RTDB (כולל ניקוי דגלים ישנים ורענון טוקן אבטחה במידת הצורך).
   */
  private async recoverRtdbRealtimeConnection(forceRefreshAppCheck = false): Promise<void> {
    if (!this.rtdb || this.isRecoveringRtdb) return;
    this.isRecoveringRtdb = true;
    try {
      this.clearStaleRtdbTransportFlags();
      if (forceRefreshAppCheck && this.firebaseAppCheck) {
        await this.withTimeout(
          getAppCheckToken(this.firebaseAppCheck, true),
          3000,
          'ac-recover-timeout'
        ).catch(() => {});
      }
      if (this.firebaseUser) {
        await this.withTimeout(
          this.firebaseUser.getIdToken(false),
          2500,
          'id-recover-timeout'
        ).catch(() => {});
      }
      if (!this.rtdb) return;
      try {
        goOffline(this.rtdb);
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
      this.clearStaleRtdbTransportFlags();
      if (this.rtdb) {
        try {
          goOnline(this.rtdb);
        } catch {}
      }
    } finally {
      this.isRecoveringRtdb = false;
    }
  }

  /**
   * טעינת גיבוי מהירה דרך HTTPS REST מאומת עבור כל המערכות, התקלות והצ׳אטים המורשים למשתמש,
   * כך שגם אם חיבור ה-WebSocket מתעכב בדפדפן הרגיל או ב-PWA — המערכות והנתונים מופיעים מיד.
   */
  private async hydrateWorkspaceViaRestFallback(config: FirebaseConfigData): Promise<boolean> {
    if (
      !this.activeFirebaseConfig ||
      config.mode === 'firestore' ||
      !this.firebaseUser ||
      !this.firebaseUserProfile
    ) {
      return false;
    }
    const myEpoch = this.authEpoch;
    const myUid = this.firebaseUser.uid;
    try {
      const metaRes = await this.fetchRtdbNodeWithFallback<NonNullable<typeof this.currentMetaState>>(
        'std_meta',
        0
      );
      if (
        this.rtdbMetaSnapshotReceived ||
        this.authEpoch !== myEpoch ||
        this.firebaseUser?.uid !== myUid
      ) {
        return this.rtdbMetaSnapshotReceived;
      }
      if (!metaRes.ok || !metaRes.exists || !metaRes.value) {
        return false;
      }

      const m = metaRes.value;
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
      const permittedSystems = this.getPermittedSystemsForCurrentProfile(allSystems);

      // Keep real-time per-system listeners armed so live updates take over seamlessly once WebSocket connects
      this.syncPerSystemListeners(config, allSystems);

      const sysPromises = permittedSystems.map(async (sysName) => {
        const sysKey = encodeFirebaseSystemKey(sysName);
        const [sysRes, chatRes] = await Promise.all([
          this.fetchRtdbNodeWithFallback<{ issues?: StdIssue[] | Record<string, StdIssue> }>(
            `std_systems/${sysKey}`,
            0
          ),
          this.fetchRtdbNodeWithFallback<Record<string, SystemChatMessage> | SystemChatMessage[]>(
            `std_chats/${sysKey}`,
            0
          )
        ]);
        if (this.authEpoch !== myEpoch || this.firebaseUser?.uid !== myUid) return;
        if (sysRes.ok) {
          const raw = sysRes.value;
          const list = Array.isArray(raw?.issues)
            ? raw.issues
            : raw?.issues && typeof raw.issues === 'object'
            ? Object.values(raw.issues)
            : [];
          this.loadedPartitionKeys.add(sysKey);
          this.partitionIssues.set(sysKey, list);
        }
        if (chatRes.ok && chatRes.value) {
          const bucket = chatRes.value;
          const list = (Array.isArray(bucket) ? bucket : Object.values(bucket)).filter(
            (msg) => msg && msg.id && msg.system
          );
          if (list.length > 0) {
            this.applyIncomingRemoteChats({ [sysName]: list }, false);
          }
        }
      });

      const privatePromise = this.fetchRtdbNodeWithFallback<{
        googleDriveUrl?: string;
        apiSecret?: string;
        mcpAppCheckToken?: string;
        mcpEnabled?: boolean;
        devVaultSalt?: string;
        devVaultHash?: string;
      }>('std_private_config', 0).then((pRes) => {
        if (pRes.ok && pRes.value) {
          this.applyPrivateConfigSnapshot(pRes.value);
        }
      });

      const joinReqPromise =
        this.firebaseUserProfile.role === 'admin'
          ? this.fetchRtdbNodeWithFallback<Record<string, any>>('std_join_requests', 0).then(
              (jRes) => {
                if (this.authEpoch !== myEpoch || this.firebaseUser?.uid !== myUid) return;
                if (jRes.ok && jRes.value && typeof jRes.value === 'object') {
                  const list: JoinRequest[] = [];
                  for (const [uid, val] of Object.entries(jRes.value)) {
                    const parsed = this.normalizeJoinRequestRecord(uid, val);
                    if (parsed) list.push(parsed);
                  }
                  list.sort(
                    (a, b) => (b.updatedAt || b.requestedAt) - (a.updatedAt || a.requestedAt)
                  );
                  this.hasLoadedInitialJoinRequests = true;
                  this.adminJoinRequests = list;
                  this.notifyAdminJoinRequests(undefined);
                }
              }
            )
          : Promise.resolve();

      await Promise.all([...sysPromises, privatePromise, joinReqPromise]);
      if (
        this.rtdbMetaSnapshotReceived ||
        this.authEpoch !== myEpoch ||
        this.firebaseUser?.uid !== myUid
      ) {
        return true;
      }

      this.rebuildStateFromPartitions(false);
      this.updateStatus({
        lastSyncAt: Date.now(),
        lastEventText:
          m.lastAction && !isSystemAdminAction(m.lastAction)
            ? `${m.lastUpdatedBy || 'צוות'}: ${m.lastAction}`
            : undefined
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * קריאת צומת RTDB עם Timeout קצר + גיבוי HTTPS REST מאומת (כולל רענון טוקן App Check אוטומטי ב-401),
   * כך ש-get() לעולם לא יתקע לנצח בטלפון או ב-PWA (ולעולם לא נועל IndexedDB בין טאבים).
   */
  private async fetchRtdbNodeWithFallback<T = any>(
    nodePath: string,
    sdkTimeoutMs = 3000
  ): Promise<{
    ok: boolean;
    exists: boolean;
    value: T | null;
    error?: string;
    usedRestFallback?: boolean;
    refreshedTokens?: boolean;
  }> {
    // 1. Fast path: Firebase RTDB SDK with strict timeout (skipped when sdkTimeoutMs <= 0)
    if (this.rtdb && sdkTimeoutMs > 0) {
      try {
        const snap = await this.withTimeout(
          get(ref(this.rtdb, nodePath)),
          sdkTimeoutMs,
          'RTDB_SDK_TIMEOUT'
        );
        return {
          ok: true,
          exists: snap.exists(),
          value: (snap.exists() ? snap.val() : null) as T | null,
          usedRestFallback: false
        };
      } catch {
        // Fall through to authenticated HTTPS REST fallback
      }
    }

    // 2. Fallback: Direct HTTPS REST request with Firebase ID token + App Check token + AbortController
    const dbUrl = (this.activeFirebaseConfig?.databaseURL || '').replace(/\/+$/, '');
    if (!dbUrl || !this.firebaseUser) {
      return { ok: false, exists: false, value: null, error: 'DB_UNAVAILABLE' };
    }

    const doRestRead = async (
      idToken: string,
      forceRefreshAppCheck: boolean
    ): Promise<{ status: number; value?: T | null; error?: string }> => {
      let acToken = '';
      let acErrCode = '';
      if (this.firebaseAppCheck) {
        try {
          const acRes = await this.withTimeout(
            getAppCheckToken(this.firebaseAppCheck, forceRefreshAppCheck),
            3000,
            'AC_TIMEOUT'
          );
          acToken = acRes?.token || '';
        } catch (acErr: any) {
          acErrCode = String(acErr?.code || acErr?.message || 'AC_ERR');
          acToken = '';
        }
      }
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const abortTimer = controller ? setTimeout(() => controller.abort(), 4000) : null;
      try {
        const encodedNodePath = nodePath
          .split('/')
          .map((seg) => encodeURIComponent(seg))
          .join('/');
        const res = await fetch(
          `${dbUrl}/${encodedNodePath}.json?auth=${encodeURIComponent(idToken)}`,
          {
            method: 'GET',
            headers: acToken ? { 'X-Firebase-AppCheck': acToken } : undefined,
            signal: controller?.signal
          }
        );
        if (abortTimer) clearTimeout(abortTimer);
        if (res.status === 200) {
          const val = (await res.json()) as T | null;
          return { status: 200, value: val };
        }
        return {
          status: res.status,
          error: acErrCode ? `HTTP_${res.status}_${acErrCode}` : `HTTP_${res.status}`
        };
      } catch (fetchErr: any) {
        if (abortTimer) clearTimeout(abortTimer);
        return { status: 0, error: fetchErr?.name === 'AbortError' ? 'REST_TIMEOUT' : 'NET_ERR' };
      }
    };

    try {
      const idToken = await this.withTimeout(
        this.firebaseUser.getIdToken(),
        3000,
        'ID_TOKEN_TIMEOUT'
      );
      const firstTry = await doRestRead(idToken, false);
      if (firstTry.status === 200) {
        const val = firstTry.value ?? null;
        return {
          ok: true,
          exists: val !== null && val !== undefined,
          value: val,
          usedRestFallback: true,
          refreshedTokens: false
        };
      }
      // If 401 (stale App Check or Auth token), force-refresh BOTH once and retry cleanly!
      if (firstTry.status === 401) {
        const freshIdToken = await this.withTimeout(
          this.firebaseUser.getIdToken(true),
          3000,
          'ID_TOKEN_REFRESH_TIMEOUT'
        ).catch(() => idToken);
        const secondTry = await doRestRead(freshIdToken, true);
        if (secondTry.status === 200) {
          const val = secondTry.value ?? null;
          return {
            ok: true,
            exists: val !== null && val !== undefined,
            value: val,
            usedRestFallback: true,
            refreshedTokens: true
          };
        }
        return { ok: false, exists: false, value: null, error: secondTry.error || 'HTTP_401' };
      }
      return { ok: false, exists: false, value: null, error: firstTry.error || 'NET_ERR' };
    } catch (err: any) {
      return { ok: false, exists: false, value: null, error: err?.message || 'AUTH_TOKEN_ERR' };
    }
  }

  public async resetAppCheckCacheAndReload(): Promise<void> {
    this.clearStaleRtdbTransportFlags();
    if (this.firebaseAppCheck) {
      await this.withTimeout(
        getAppCheckToken(this.firebaseAppCheck, true),
        2500,
        'ac-refresh-timeout'
      ).catch(() => {});
    }
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  public async forceSignOutAndResetStartup(): Promise<void> {
    this.authEpoch++;
    this.clearStaleRtdbTransportFlags();
    await this.withTimeout(this.signOutFirebase(), 2500, 'signout-timeout').catch(() => {});
    this.firebaseUserProfile = null;
    this.firebaseUser = null;
    this.firebaseAuthInitialized = true;
    this.updateStatus({ connected: false, errorMessage: undefined });
    this.notifyAuthListeners();
  }

  private async fetchFirebaseUserProfileDetailed(uid: string): Promise<{
    status: 'found' | 'not_found' | 'error';
    profile: FirebaseUserProfile | null;
    error?: string;
  }> {
    if (!uid || !this.activeFirebaseConfig) {
      return { status: 'error', profile: null, error: 'הגדרות החיבור חסרות' };
    }
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
        isSuperAdmin: Boolean(data.isSuperAdmin),
        updatedAt: data.updatedAt
      };
      return { profile, needsUpgrade };
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await this.withTimeout(
          getDoc(doc(this.firestore, 'std_users', uid)),
          6000,
          'firestore-profile-timeout'
        );
        if (!snap.exists()) return { status: 'not_found', profile: null };
        const res = normalizeAndUpgradeProfile(snap.data() as Partial<FirebaseUserProfile>);
        if (!res) return { status: 'not_found', profile: null };
        if (res.needsUpgrade && res.profile.role === 'admin') {
          await setDoc(doc(this.firestore, 'std_users', uid), stripUndefinedDeep(res.profile)).catch(
            () => {}
          );
        }
        return { status: 'found', profile: res.profile };
      }
      if (this.rtdb) {
        const nodeRes = await this.fetchRtdbNodeWithFallback<Partial<FirebaseUserProfile>>(
          `std_users/${uid}`,
          3000
        );
        if (!nodeRes.ok) {
          return { status: 'error', profile: null, error: nodeRes.error || 'שגיאת חיבור' };
        }
        if (nodeRes.usedRestFallback) {
          // SDK timed out while REST succeeded — proactively recover RTDB WebSocket in background
          void this.recoverRtdbRealtimeConnection(Boolean(nodeRes.refreshedTokens));
        }
        if (!nodeRes.exists || !nodeRes.value) {
          return { status: 'not_found', profile: null };
        }
        const res = normalizeAndUpgradeProfile(nodeRes.value);
        if (!res) return { status: 'not_found', profile: null };
        if (res.needsUpgrade && res.profile.role === 'admin') {
          await set(ref(this.rtdb, `std_users/${uid}`), stripUndefinedDeep(res.profile)).catch(
            () => {}
          );
        }
        return { status: 'found', profile: res.profile };
      }
    } catch (err: any) {
      return { status: 'error', profile: null, error: err?.message || 'שגיאת תקשורת' };
    }
    return { status: 'error', profile: null, error: 'המסד אינו מחובר' };
  }

  public async fetchFirebaseUserProfile(uid: string): Promise<FirebaseUserProfile | null> {
    const detailed = await this.fetchFirebaseUserProfileDetailed(uid);
    return detailed.profile;
  }

  public async signInWithFirebaseEmail(
    email: string,
    password: string
  ): Promise<{
    ok: boolean;
    profile?: FirebaseUserProfile;
    pendingApproval?: boolean;
    pendingJoinRequest?: JoinRequest | null;
    needsJoinOrBootstrap?: boolean;
    needsProfileBootstrap?: boolean;
    error?: string;
  }> {
    if (!this.firebaseAuth) {
      return { ok: false, error: 'שירות ההתחברות אינו זמין כרגע.' };
    }
    const { email: normalizedEmail } = normalizeLoginEmail(email);
    if (!normalizedEmail) {
      return { ok: false, error: 'נא להזין אימייל או שם משתמש.' };
    }
    try {
      const cred = await signInWithEmailAndPassword(this.firebaseAuth, normalizedEmail, password);
      this.authEpoch++;
      this.firebaseUser = cred.user;
      const profileRes = await this.fetchFirebaseUserProfileDetailed(cred.user.uid);
      if (profileRes.status === 'error') {
        return {
          ok: false,
          error: 'החיבור למערכת נכשל זמנית. נסה שוב בעוד רגע.'
        };
      }
      const profile = profileRes.profile;
      if (profile) {
        this.firebaseUserProfile = profile;
        this.detachWaitingRoomListeners();
        if (this.activeFirebaseConfig) {
          this.attachFirebaseDataListeners(this.activeFirebaseConfig);
        }
        this.updateStatus({
          firebaseUid: cred.user.uid,
          firebaseUserEmail: cred.user.email || undefined
        });
        this.notifyAuthListeners();
        this.recordAuditEvent('התחברות מאובטחת למערכת', 'auth');
        return { ok: true, profile };
      }

      // User has a Firebase Auth account but is not yet approved in std_users
      const existingReq = await this.fetchOwnJoinRequest(cred.user.uid);
      this.pendingJoinRequest = existingReq;
      this.attachWaitingRoomListeners(cred.user.uid);
      this.updateStatus({
        firebaseUid: cred.user.uid,
        firebaseUserEmail: cred.user.email || undefined
      });
      this.notifyPendingJoinRequestListeners();
      this.notifyAuthListeners();
      return {
        ok: true,
        pendingApproval: true,
        pendingJoinRequest: existingReq,
        needsJoinOrBootstrap: !existingReq
      };
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return { ok: false, error: 'אימייל / שם משתמש או סיסמה שגויים.' };
      }
      if (code === 'auth/invalid-email') {
        return { ok: false, error: 'כתובת האימייל אינה תקינה.' };
      }
      if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'יותר מדי ניסיונות כושלים. נסה שוב בעוד מספר דקות.' };
      }
      if (code === 'auth/user-disabled') {
        return { ok: false, error: 'חשבון זה הושבת ע״י המנהל.' };
      }
      return { ok: false, error: err?.message || 'ההתחברות נכשלה. נסה שוב.' };
    }
  }

  public async sendFirebasePasswordReset(
    rawEmailOrUsername: string
  ): Promise<{ ok: boolean; normalizedEmail?: string; error?: string }> {
    if (!this.firebaseAuth) {
      return { ok: false, error: 'שירות איפוס הסיסמה אינו זמין כרגע.' };
    }
    const { email } = normalizeLoginEmail(rawEmailOrUsername);
    if (!email || !email.includes('@')) {
      return { ok: false, error: 'נא להזין תחילה כתובת אימייל או שם משתמש לאיפוס סיסמה.' };
    }
    try {
      await sendPasswordResetEmail(this.firebaseAuth, email);
      return { ok: true, normalizedEmail: email };
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/user-not-found') {
        return { ok: false, error: 'לא נמצא חשבון רשום עבור כתובת אימייל זו.' };
      }
      if (code === 'auth/invalid-email') {
        return { ok: false, error: 'כתובת האימייל אינה תקינה.' };
      }
      if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'נשלחו יותר מדי בקשות איפוס. נסה שוב בעוד מספר דקות.' };
      }
      return { ok: false, error: err?.message || 'שגיאה בשליחת מייל איפוס סיסמה.' };
    }
  }

  private detachWaitingRoomListeners(preservePendingRequest = false) {
    if (this.unsubscribeOwnJoinRequest) {
      this.unsubscribeOwnJoinRequest();
      this.unsubscribeOwnJoinRequest = null;
    }
    if (this.unsubscribeOwnProfileWatcher) {
      this.unsubscribeOwnProfileWatcher();
      this.unsubscribeOwnProfileWatcher = null;
    }
    if (!preservePendingRequest) {
      this.pendingJoinRequest = null;
    }
  }

  private notifyPendingJoinRequestListeners() {
    for (const l of this.pendingJoinRequestListeners) {
      l(this.pendingJoinRequest);
    }
  }

  private notifyAdminJoinRequests(newlyArrived?: JoinRequest) {
    const snapshot = [...this.adminJoinRequests];
    for (const l of this.adminJoinRequestsListeners) {
      l(snapshot, newlyArrived);
    }
  }

  public subscribeOwnJoinRequest(listener: (req: JoinRequest | null) => void): () => void {
    this.pendingJoinRequestListeners.add(listener);
    listener(this.pendingJoinRequest);
    return () => {
      this.pendingJoinRequestListeners.delete(listener);
    };
  }

  public subscribeRealtimeApproval(listener: (profile: FirebaseUserProfile) => void): () => void {
    this.realtimeApprovalListeners.add(listener);
    return () => {
      this.realtimeApprovalListeners.delete(listener);
    };
  }

  public subscribeAdminJoinRequests(
    listener: (requests: JoinRequest[], newlyArrived?: JoinRequest) => void
  ): () => void {
    this.adminJoinRequestsListeners.add(listener);
    listener([...this.adminJoinRequests]);
    return () => {
      this.adminJoinRequestsListeners.delete(listener);
    };
  }

  public getAdminJoinRequests(): JoinRequest[] {
    return [...this.adminJoinRequests];
  }

  public getOwnJoinRequest(): JoinRequest | null {
    return this.pendingJoinRequest;
  }

  private normalizeJoinRequestRecord(uid: string, raw: any): JoinRequest | null {
    if (!raw || typeof raw !== 'object' || !raw.fullName || !raw.status) return null;
    const rejectCount = Math.max(0, Math.min(MAX_JOIN_REJECTIONS, Number(raw.rejectCount || 0)));
    const attemptNumber = Math.max(1, Math.min(MAX_JOIN_REJECTIONS, Number(raw.attemptNumber || 1)));
    const rawStatus = String(raw.status);
    const status: JoinRequest['status'] =
      rawStatus === 'approved' || rawStatus === 'rejected' || rawStatus === 'blocked'
        ? rawStatus
        : 'pending';
    return {
      uid: String(raw.uid || uid),
      fullName: String(raw.fullName).trim(),
      email: String(raw.email || '').trim(),
      status: rejectCount >= MAX_JOIN_REJECTIONS && status !== 'approved' ? 'blocked' : status,
      rejectCount,
      attemptNumber,
      requestedAt: Number(raw.requestedAt || Date.now()),
      updatedAt: Number(raw.updatedAt || Date.now()),
      ...(raw.rejectionReason ? { rejectionReason: String(raw.rejectionReason) } : {}),
      ...(raw.rejectedAt ? { rejectedAt: Number(raw.rejectedAt) } : {}),
      ...(raw.rejectedBy ? { rejectedBy: String(raw.rejectedBy) } : {}),
      ...(raw.approvedRole === 'qa' || raw.approvedRole === 'dev'
        ? { approvedRole: raw.approvedRole }
        : {}),
      ...(Array.isArray(raw.approvedSystems) ? { approvedSystems: raw.approvedSystems } : {}),
      ...(raw.approvedAt ? { approvedAt: Number(raw.approvedAt) } : {}),
      ...(raw.approvedBy ? { approvedBy: String(raw.approvedBy) } : {})
    };
  }

  private async fetchOwnJoinRequest(uid: string): Promise<JoinRequest | null> {
    if (!uid || !this.activeFirebaseConfig) return null;
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await this.withTimeout(
          getDoc(doc(this.firestore, 'std_join_requests', uid)),
          5000,
          'firestore-join-req-timeout'
        );
        if (!snap.exists()) return null;
        return this.normalizeJoinRequestRecord(uid, snap.data());
      }
      if (this.rtdb) {
        const nodeRes = await this.fetchRtdbNodeWithFallback<any>(
          `std_join_requests/${uid}`,
          4500
        );
        if (!nodeRes.ok || !nodeRes.exists || !nodeRes.value) return null;
        return this.normalizeJoinRequestRecord(uid, nodeRes.value);
      }
    } catch {
      // ignore
    }
    return null;
  }

  /**
   * מאזין בזמן אמת לסטטוס בקשת ההצטרפות של המשתמש הממתין ולרגע שהמנהל מאשר אותו ב-std_users/{uid}
   */
  private attachWaitingRoomListeners(uid: string) {
    this.detachWaitingRoomListeners(true);
    const config = this.activeFirebaseConfig;
    if (!config || !uid) return;

    const handleRealtimeApprovedProfile = (data: Partial<FirebaseUserProfile> | null | undefined) => {
      if (!data?.fullName || !data?.role) return;
      const access = buildProfileAccessFields(data.role, data.allowedSystems);
      const approvedProfile: FirebaseUserProfile = {
        uid,
        email: data.email || this.firebaseUser?.email || undefined,
        fullName: String(data.fullName).trim(),
        role: data.role,
        ...access,
        isSuperAdmin: Boolean(data.isSuperAdmin),
        updatedAt: data.updatedAt
      };
      this.firebaseUserProfile = approvedProfile;
      this.detachWaitingRoomListeners();
      this.attachFirebaseDataListeners(config);
      this.notifyAuthListeners();
      this.recordAuditEvent('כניסה אוטומטית למערכת מיד לאחר אישור מנהל', 'auth');
      for (const listener of this.realtimeApprovalListeners) {
        listener(approvedProfile);
      }
    };

    if (config.mode === 'firestore' && this.firestore) {
      this.unsubscribeOwnJoinRequest = onSnapshot(
        doc(this.firestore, 'std_join_requests', uid),
        (snap) => {
          this.pendingJoinRequest = snap.exists()
            ? this.normalizeJoinRequestRecord(uid, snap.data())
            : null;
          this.notifyPendingJoinRequestListeners();
        },
        () => {}
      );
      this.unsubscribeOwnProfileWatcher = onSnapshot(
        doc(this.firestore, 'std_users', uid),
        (snap) => {
          if (snap.exists()) {
            handleRealtimeApprovedProfile(snap.data() as Partial<FirebaseUserProfile>);
          }
        },
        () => {}
      );
    } else if (this.rtdb) {
      this.unsubscribeOwnJoinRequest = onValue(
        ref(this.rtdb, `std_join_requests/${uid}`),
        (snap) => {
          this.pendingJoinRequest = snap.exists()
            ? this.normalizeJoinRequestRecord(uid, snap.val())
            : null;
          this.notifyPendingJoinRequestListeners();
        },
        () => {}
      );
      this.unsubscribeOwnProfileWatcher = onValue(
        ref(this.rtdb, `std_users/${uid}`),
        (snap) => {
          if (snap.exists()) {
            handleRealtimeApprovedProfile(snap.val() as Partial<FirebaseUserProfile>);
          }
        },
        () => {}
      );
    }
  }

  private attachAdminJoinRequestsListener(config: FirebaseConfigData) {
    if (this.unsubscribeAdminJoinRequests) {
      this.unsubscribeAdminJoinRequests();
      this.unsubscribeAdminJoinRequests = null;
    }
    if (this.firebaseUserProfile?.role !== 'admin') return;

    const processList = (list: JoinRequest[]) => {
      const sorted = list.sort((a, b) => (b.updatedAt || b.requestedAt) - (a.updatedAt || a.requestedAt));
      let newlyArrived: JoinRequest | undefined;
      for (const req of sorted) {
        if (req.status === 'pending') {
          const key = `${req.uid}:${req.attemptNumber}:${req.requestedAt}`;
          if (!this.seenPendingJoinRequestKeys.has(key)) {
            this.seenPendingJoinRequestKeys.add(key);
            if (this.hasLoadedInitialJoinRequests && !newlyArrived) {
              newlyArrived = req;
            }
          }
        }
      }
      this.hasLoadedInitialJoinRequests = true;
      this.adminJoinRequests = sorted;
      this.notifyAdminJoinRequests(newlyArrived);
    };

    if (config.mode === 'firestore' && this.firestore) {
      this.unsubscribeAdminJoinRequests = onSnapshot(
        collection(this.firestore, 'std_join_requests'),
        (snap) => {
          const list: JoinRequest[] = [];
          snap.forEach((d) => {
            const parsed = this.normalizeJoinRequestRecord(d.id, d.data());
            if (parsed) list.push(parsed);
          });
          processList(list);
        },
        () => {}
      );
    } else if (this.rtdb) {
      this.unsubscribeAdminJoinRequests = onValue(
        ref(this.rtdb, 'std_join_requests'),
        (snap) => {
          const raw = snap.val() as Record<string, any> | null;
          const list: JoinRequest[] = [];
          if (raw && typeof raw === 'object') {
            for (const [uid, val] of Object.entries(raw)) {
              const parsed = this.normalizeJoinRequestRecord(uid, val);
              if (parsed) list.push(parsed);
            }
          }
          processList(list);
        },
        () => {}
      );
    }
  }

  private async isFullNameTakenByAnotherUser(fullName: string, currentUid: string): Promise<boolean> {
    if (!this.activeFirebaseConfig) return false;
    try {
      const nameHash = await computeFullNameHash(fullName);
      if (!nameHash) return false;
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await getDoc(doc(this.firestore, 'std_taken_names', nameHash));
        if (!snap.exists()) return false;
        const data = snap.data() as { uid?: string } | undefined;
        return Boolean(data?.uid && data.uid !== currentUid);
      }
      if (this.rtdb) {
        const snap = await get(ref(this.rtdb, `std_taken_names/${nameHash}`));
        if (!snap.exists()) return false;
        const data = snap.val() as { uid?: string } | null;
        return Boolean(data?.uid && data.uid !== currentUid);
      }
    } catch {
      // If lookup fails transiently, do not crash auth flow
    }
    return false;
  }

  private async registerTakenNameHash(fullName: string, uid: string): Promise<void> {
    if (!this.activeFirebaseConfig || !uid) return;
    try {
      const nameHash = await computeFullNameHash(fullName);
      if (!nameHash) return;
      const entry = { uid, updatedAt: Date.now() };
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_taken_names', nameHash), entry);
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_taken_names/${nameHash}`), entry);
      }
    } catch {
      // non-fatal
    }
  }

  private async syncTakenNamesIndexFromProfiles(
    profiles: Iterable<FirebaseUserProfile>
  ): Promise<void> {
    if (!this.activeFirebaseConfig) return;
    try {
      const now = Date.now();
      const nextMap: Record<string, { uid: string; updatedAt: number }> = {};
      for (const p of profiles) {
        if (!p?.fullName || !p?.uid) continue;
        const hash = await computeFullNameHash(p.fullName);
        if (hash) {
          nextMap[hash] = { uid: p.uid, updatedAt: now };
        }
      }
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const existingSnap = await getDocs(collection(this.firestore, 'std_taken_names'));
        const existingIds = new Set<string>();
        existingSnap.forEach((d) => existingIds.add(d.id));
        for (const [hash, entry] of Object.entries(nextMap)) {
          await setDoc(doc(this.firestore, 'std_taken_names', hash), entry).catch(() => {});
        }
        for (const oldHash of existingIds) {
          if (!nextMap[oldHash]) {
            await deleteDoc(doc(this.firestore, 'std_taken_names', oldHash)).catch(() => {});
          }
        }
      } else if (this.rtdb) {
        await set(ref(this.rtdb, 'std_taken_names'), Object.keys(nextMap).length > 0 ? nextMap : null);
      }
    } catch {
      // non-fatal
    }
  }

  /**
   * הרשמה עצמאית של חבר צוות חדש + שליחת בקשת הצטרפות לחדר ההמתנה (אפס גישה לנתונים עד אישור מנהל)
   */
  public async registerAndSubmitJoinRequest(
    fullName: string,
    rawEmailOrUsername: string,
    password: string
  ): Promise<{
    ok: boolean;
    request?: JoinRequest;
    profile?: FirebaseUserProfile;
    alreadyApproved?: boolean;
    error?: string;
  }> {
    if (!this.firebaseAuth || !this.activeFirebaseConfig) {
      return { ok: false, error: 'שירות ההרשמה אינו זמין כרגע.' };
    }
    const cleanName = fullName.trim().slice(0, 120);
    const { email: normalizedEmail } = normalizeLoginEmail(rawEmailOrUsername);
    if (cleanName.length < 2) {
      return { ok: false, error: 'נא להזין שם מלא (לפחות 2 תווים).' };
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { ok: false, error: 'נא להזין כתובת אימייל או שם משתמש תקין.' };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: 'הסיסמה חייבת להכיל לפחות 6 תווים.' };
    }

    let signedInUser: User | null = null;
    let createdNewAuthUser = false;
    try {
      const cred = await createUserWithEmailAndPassword(this.firebaseAuth, normalizedEmail, password);
      signedInUser = cred.user;
      createdNewAuthUser = true;
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/email-already-in-use') {
        // Attempt sign-in so returning waiting/rejected users enter their server-enforced Waiting Room,
        // while blocking already-active approved accounts from re-registering via the Register tab!
        try {
          const cred = await signInWithEmailAndPassword(this.firebaseAuth, normalizedEmail, password);
          signedInUser = cred.user;
        } catch {
          return {
            ok: false,
            error:
              'שם המשתמש / האימייל הזה כבר קיים במערכת! לא ניתן להירשם שוב עם אותו שם משתמש — עבור ללשונית "התחברות" או לחץ "שכחתי סיסמה".'
          };
        }
      } else if (code === 'auth/weak-password') {
        return { ok: false, error: 'הסיסמה חלשה מדי — יש לבחור לפחות 6 תווים.' };
      } else if (code === 'auth/invalid-email') {
        return { ok: false, error: 'כתובת האימייל אינה תקינה.' };
      } else if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'יותר מדי ניסיונות כרגע. נסה שוב בעוד מספר דקות.' };
      } else {
        return { ok: false, error: err?.message || 'שגיאה ביצירת החשבון.' };
      }
    }

    if (!signedInUser) {
      return { ok: false, error: 'לא ניתן היה להשלים את יצירת החשבון.' };
    }

    this.firebaseUser = signedInUser;
    const existingProfile = await this.fetchFirebaseUserProfile(signedInUser.uid);
    if (existingProfile) {
      await this.signOutFirebase().catch(() => {});
      return {
        ok: false,
        error:
          'שם המשתמש / האימייל הזה כבר קיים ופעיל במערכת! לא ניתן להירשם שוב עם אותו שם משתמש — עבור ללשונית "התחברות".'
      };
    }

    const existingReq = await this.fetchOwnJoinRequest(signedInUser.uid);
    if (existingReq && existingReq.status !== 'approved') {
      this.pendingJoinRequest = existingReq;
      this.attachWaitingRoomListeners(signedInUser.uid);
      this.notifyPendingJoinRequestListeners();
      this.notifyAuthListeners();
      return { ok: true, request: existingReq };
    }

    // Block registering a second account under a fullName that already belongs to an active team member!
    const nameTaken = await this.isFullNameTakenByAnotherUser(cleanName, signedInUser.uid);
    if (nameTaken) {
      if (createdNewAuthUser) {
        await signedInUser.delete().catch(() => {});
      }
      await this.signOutFirebase().catch(() => {});
      return {
        ok: false,
        error: `השם "${cleanName}" כבר קיים ופעיל במערכת תחת חשבון אחר! לא ניתן להירשם שוב עם אותו שם — התחבר דרך לשונית "התחברות" עם החשבון המקורי שלך (או הוסף פרט מזהה אם מדובר בעובד אחר).`
      };
    }

    const now = Date.now();
    const newReq: JoinRequest = {
      uid: signedInUser.uid,
      fullName: cleanName,
      email: signedInUser.email || normalizedEmail,
      status: 'pending',
      rejectCount: 0,
      attemptNumber: 1,
      requestedAt: now,
      updatedAt: now
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_join_requests', signedInUser.uid), stripUndefinedDeep(newReq));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_join_requests/${signedInUser.uid}`), stripUndefinedDeep(newReq));
      }
      this.pendingJoinRequest = newReq;
      this.attachWaitingRoomListeners(signedInUser.uid);
      this.notifyPendingJoinRequestListeners();
      this.notifyAuthListeners();
      return { ok: true, request: newReq };
    } catch (err: any) {
      return {
        ok: false,
        error: err?.message || 'החשבון נוצר אך שליחת בקשת ההצטרפות לשרת נכשלה. נסה להתחבר שוב.'
      };
    }
  }

  /**
   * שליחת בקשת הצטרפות ראשונה או חוזרת למשתמש שכבר מחובר ל-Firebase Auth ונמצא בחדר ההמתנה
   */
  public async submitOrResubmitOwnJoinRequest(
    fullNameInput?: string
  ): Promise<{ ok: boolean; request?: JoinRequest; error?: string }> {
    if (!this.firebaseUser || !this.activeFirebaseConfig) {
      return { ok: false, error: 'אין משתמש מחובר.' };
    }
    const uid = this.firebaseUser.uid;
    const existing = await this.fetchOwnJoinRequest(uid);
    const now = Date.now();

    if (existing) {
      if (existing.status === 'blocked' || existing.rejectCount >= MAX_JOIN_REJECTIONS) {
        return {
          ok: false,
          error: 'החשבון שלך נחסם לאחר 3 דחיות. יש לפנות ישירות למנהל המערכת.'
        };
      }
      if (existing.status === 'pending') {
        return { ok: true, request: existing };
      }

      const cleanName = (fullNameInput || existing.fullName || '').trim().slice(0, 120);
      if (cleanName.length < 2) {
        return { ok: false, error: 'נא להזין שם מלא תקין (לפחות 2 תווים).' };
      }

      const nameTaken = await this.isFullNameTakenByAnotherUser(cleanName, uid);
      if (nameTaken) {
        return {
          ok: false,
          error: `השם "${cleanName}" כבר קיים ופעיל במערכת תחת חשבון אחר! אם כבר יש לך חשבון אחר במערכת — התנתק והתחבר דרכו.`
        };
      }

      // Handle both rejected retry AND previously-approved accounts whose std_users profile was removed
      const isRevokedApproved = existing.status === 'approved';
      const retryReq: JoinRequest = isRevokedApproved
        ? {
            uid,
            fullName: cleanName,
            email: existing.email || this.firebaseUser.email || '',
            status: 'pending',
            rejectCount: 0,
            attemptNumber: 1,
            requestedAt: now,
            updatedAt: now
          }
        : {
            uid,
            fullName: cleanName,
            email: existing.email || this.firebaseUser.email || '',
            status: 'pending',
            rejectCount: existing.rejectCount,
            attemptNumber: Math.min(existing.rejectCount + 1, MAX_JOIN_REJECTIONS),
            requestedAt: now,
            updatedAt: now,
            ...(existing.rejectionReason ? { rejectionReason: existing.rejectionReason } : {}),
            ...(existing.rejectedAt ? { rejectedAt: existing.rejectedAt } : {}),
            ...(existing.rejectedBy ? { rejectedBy: existing.rejectedBy } : {})
          };

      try {
        if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
          await setDoc(doc(this.firestore, 'std_join_requests', uid), stripUndefinedDeep(retryReq));
        } else if (this.rtdb) {
          await set(ref(this.rtdb, `std_join_requests/${uid}`), stripUndefinedDeep(retryReq));
        }
        this.pendingJoinRequest = retryReq;
        this.notifyPendingJoinRequestListeners();
        return { ok: true, request: retryReq };
      } catch (err: any) {
        return { ok: false, error: err?.message || 'לא ניתן היה לשלוח בקשה מחדש.' };
      }
    }

    // No join request yet for an authenticated unapproved account
    const cleanName = (fullNameInput || '').trim().slice(0, 120);
    if (cleanName.length < 2) {
      return { ok: false, error: 'נא להזין שם מלא תקין (לפחות 2 תווים).' };
    }
    const nameTaken = await this.isFullNameTakenByAnotherUser(cleanName, uid);
    if (nameTaken) {
      return {
        ok: false,
        error: `השם "${cleanName}" כבר קיים ופעיל במערכת תחת חשבון אחר! אם כבר יש לך חשבון אחר במערכת — התנתק והתחבר דרכו.`
      };
    }
    const freshReq: JoinRequest = {
      uid,
      fullName: cleanName,
      email: this.firebaseUser.email || '',
      status: 'pending',
      rejectCount: 0,
      attemptNumber: 1,
      requestedAt: now,
      updatedAt: now
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_join_requests', uid), stripUndefinedDeep(freshReq));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_join_requests/${uid}`), stripUndefinedDeep(freshReq));
      }
      this.pendingJoinRequest = freshReq;
      this.attachWaitingRoomListeners(uid);
      this.notifyPendingJoinRequestListeners();
      return { ok: true, request: freshReq };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שליחת הבקשה למנהל נכשלה.' };
    }
  }

  /**
   * אישור בקשת הצטרפות ע"י מנהל (מאפשר אך ורק 'qa' או 'dev' — לעולם לא 'admin'!)
   */
  public async approveJoinRequest(
    req: JoinRequest,
    role: 'qa' | 'dev',
    allowedSystems?: string[]
  ): Promise<{ ok: boolean; error?: string }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    if (role !== 'qa' && role !== 'dev') {
      return { ok: false, error: 'ניתן לאשר בקשת הצטרפות כבודק תוכנה (QA) או מפתח (Dev) בלבד.' };
    }

    const now = Date.now();
    const adminName = this.firebaseUserProfile.fullName || 'מנהל מערכת';
    const scopedSystems =
      Array.isArray(allowedSystems) && allowedSystems.length > 0 ? allowedSystems : undefined;
    const accessFields = buildProfileAccessFields(role, scopedSystems);
    const newProfile: FirebaseUserProfile = {
      uid: req.uid,
      email: req.email,
      fullName: req.fullName.trim(),
      role,
      ...accessFields,
      isSuperAdmin: false,
      updatedAt: now
    };

    const updatedReq: JoinRequest = {
      ...req,
      status: 'approved',
      approvedRole: role,
      ...(scopedSystems ? { approvedSystems: scopedSystems } : {}),
      approvedAt: now,
      approvedBy: adminName,
      updatedAt: now
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_users', req.uid), stripUndefinedDeep(newProfile));
        await setDoc(doc(this.firestore, 'std_join_requests', req.uid), stripUndefinedDeep(updatedReq));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_users/${req.uid}`), stripUndefinedDeep(newProfile));
        await set(ref(this.rtdb, `std_join_requests/${req.uid}`), stripUndefinedDeep(updatedReq));
      }
      await this.registerTakenNameHash(newProfile.fullName, req.uid);
      const roleHe = role === 'dev' ? 'מפתח (Dev)' : 'בודק תוכנה (QA)';
      this.recordAuditEvent(
        `אישור בקשת הצטרפות (${roleHe}): ${req.fullName}`,
        'team',
        req.email
      );
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שגיאה באישור הבקשה מול השרת.' };
    }
  }

  /**
   * דחיית בקשת הצטרפות ע"י מנהל עם סיבה אופציונלית + ספירת 3 ניסיונות בצד השרת
   */
  public async rejectJoinRequest(
    req: JoinRequest,
    reason?: string
  ): Promise<{
    ok: boolean;
    nextStatus?: 'rejected' | 'blocked';
    nextRejectCount?: number;
    error?: string;
  }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    const now = Date.now();
    const adminName = this.firebaseUserProfile.fullName || 'מנהל מערכת';
    const nextRejectCount = Math.min((req.rejectCount || 0) + 1, MAX_JOIN_REJECTIONS);
    const nextStatus: 'rejected' | 'blocked' =
      nextRejectCount >= MAX_JOIN_REJECTIONS ? 'blocked' : 'rejected';
    const cleanReason = String(reason || '').trim().slice(0, 300);

    const updatedReq: JoinRequest = {
      uid: req.uid,
      fullName: req.fullName,
      email: req.email,
      status: nextStatus,
      rejectCount: nextRejectCount,
      attemptNumber: req.attemptNumber || nextRejectCount,
      requestedAt: req.requestedAt || now,
      updatedAt: now,
      ...(cleanReason ? { rejectionReason: cleanReason } : {}),
      rejectedAt: now,
      rejectedBy: adminName
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_join_requests', req.uid), stripUndefinedDeep(updatedReq));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_join_requests/${req.uid}`), stripUndefinedDeep(updatedReq));
      }
      this.recordAuditEvent(
        nextStatus === 'blocked'
          ? `חסימת בקשת הצטרפות לאחר 3 דחיות: ${req.fullName}${cleanReason ? ` (${cleanReason})` : ''}`
          : `דחיית בקשת הצטרפות (${nextRejectCount}/3): ${req.fullName}${cleanReason ? ` (${cleanReason})` : ''}`,
        'team',
        req.email
      );
      return { ok: true, nextStatus, nextRejectCount };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שגיאה בדחיית הבקשה מול השרת.' };
    }
  }

  /**
   * שחרור חסימה ואיפוס מונה הדחיות ע"י מנהל בלבד
   */
  public async unblockAndResetJoinRequest(req: JoinRequest): Promise<{ ok: boolean; error?: string }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    const now = Date.now();
    const resetReq: JoinRequest = {
      uid: req.uid,
      fullName: req.fullName,
      email: req.email,
      status: 'pending',
      rejectCount: 0,
      attemptNumber: 1,
      requestedAt: now,
      updatedAt: now
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_join_requests', req.uid), stripUndefinedDeep(resetReq));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_join_requests/${req.uid}`), stripUndefinedDeep(resetReq));
      }
      this.recordAuditEvent(`שחרור חסימה ואיפוס ניסיונות הצטרפות: ${req.fullName}`, 'team', req.email);
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שגיאה בשחרור החסימה.' };
    }
  }

  public async deleteJoinRequest(uid: string): Promise<{ ok: boolean; error?: string }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await deleteDoc(doc(this.firestore, 'std_join_requests', uid));
      } else if (this.rtdb) {
        await remove(ref(this.rtdb, `std_join_requests/${uid}`));
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שגיאה במחיקת הבקשה.' };
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
      await this.registerTakenNameHash(profile.fullName, profile.uid);
      this.firebaseUserProfile = profile;
      this.attachFirebaseDataListeners(this.activeFirebaseConfig);
      this.notifyAuthListeners();
      return { ok: true, profile };
    } catch (err: any) {
      const firestoreHint =
        this.activeFirebaseConfig.mode === 'firestore'
          ? ' (ב-Cloud Firestore יש ליצור את מסמך המנהל הראשון ידנית ב-std_users/{uid} ב-Firebase Console, או להשתמש ב-Realtime Database שתומך באתחול אוטומטי)'
          : '';
      return {
        ok: false,
        error:
          (err?.message ||
            'השרת חסם יצירת פרופיל מנהל. אם כבר קיימים משתמשים ב-std_users, רק מנהל קיים יכול להגדיר משתמשים חדשים.') +
          firestoreHint
      };
    }
  }

  public async registerTeamMemberInFirebaseAuth(
    email: string,
    password: string,
    fullName: string,
    role: TeamRole,
    allowedSystems?: string[]
  ): Promise<{ ok: boolean; uid?: string; normalizedEmail?: string; error?: string }> {
    if (!this.activeFirebaseConfig) {
      return { ok: false, error: 'Firebase אינו מחובר.' };
    }
    const { email: cleanEmail } = normalizeLoginEmail(email);
    const cleanName = fullName.trim();
    if (!cleanEmail || !password || password.length < 6 || !cleanName) {
      return { ok: false, error: 'נא להזין אימייל או שם משתמש תקין, שם מלא וסיסמה של לפחות 6 תווים.' };
    }

    // Use a secondary temporary app so creating the team member account does NOT log out the Admin!
    const secondaryName = `provisioning-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let secondaryApp: FirebaseApp | null = null;
    try {
      secondaryApp = initializeApp(this.buildFirebaseOptions(this.activeFirebaseConfig), secondaryName);
      if (isValidAppCheckSiteKey(this.activeFirebaseConfig.appCheckSiteKey)) {
        try {
          initializeAppCheck(secondaryApp, {
            provider: new ReCaptchaEnterpriseProvider(
              (this.activeFirebaseConfig.appCheckSiteKey as string).trim()
            ),
            isTokenAutoRefreshEnabled: false
          });
        } catch {
          // ignore secondary App Check init error if already initialized
        }
      }
      const secondaryAuth = initializeAuth(secondaryApp, {
        persistence: inMemoryPersistence
      });
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
      await this.registerTakenNameHash(profile.fullName, newUid);

      this.recordAuditEvent(
        `יצירת חשבון Firebase Auth חדש (${role}) עבור ${cleanName}`,
        'team',
        cleanEmail
      );
      return { ok: true, uid: newUid, normalizedEmail: cleanEmail };
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/email-already-in-use') {
        return { ok: false, error: 'כתובת אימייל זו כבר רשומה במערכת.' };
      }
      if (code === 'auth/weak-password') {
        return { ok: false, error: 'הסיסמה חלשה מדי — יש לבחור לפחות 6 תווים.' };
      }
      return { ok: false, error: err?.message || 'שגיאה ביצירת החשבון.' };
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp).catch(() => {});
      }
    }
  }

  private async clearLocalSensitiveCaches(): Promise<void> {
    this.highestSeenRevision = 0;
    this.lastAppliedFingerprint = '';
    this.currentState = {
      systems: [],
      archivedSystems: [],
      deletedIssueIds: [],
      deletedSystemIds: [],
      issues: [],
      teamMembers: [],
      revision: 0
    };
    this.chatsBySystem = {};
    this.mcpAppCheckDebugToken = '';
    this.mcpBridgeEnabled = true;
    this.devVaultCredential = null;
    this.notifyMcpBridgeListeners();

    try {
      const sensitiveKeys = [
        'std_qa_auth_user_v1',
        'std_qa_fallback_cache',
        CHATS_LOCAL_STORAGE_KEY,
        'std_qa_gdrive_webapp_url',
        'std_qa_gdrive_api_secret',
        'std_qa_pending_push',
        'tzavman_team_members_v2',
        'tzavman_security_config_v2'
      ];
      for (const k of sensitiveKeys) {
        localStorage.removeItem(k);
      }
    } catch {
      // ignore
    }
    await this.withTimeout(clearWorkspaceAndChatsFromIndexedDB(), 1500, 'idb-clear-timeout').catch(
      () => {}
    );
  }

  public async signOutFirebase(): Promise<void> {
    this.authEpoch++;
    this.firebaseUserProfile = null;
    this.firebaseUser = null;
    this.detachDataListenersOnly();
    this.detachWaitingRoomListeners();
    this.partitionIssues.clear();
    this.lastPushedPartitionHashes.clear();
    this.currentMetaState = null;

    await this.clearLocalSensitiveCaches();

    if (this.firebaseAuth) {
      await signOut(this.firebaseAuth).catch(() => {});
    }
    this.notifyState(false);
    this.notifyChats();
    this.notifyPendingJoinRequestListeners();
    this.updateStatus({
      connected: false,
      firebaseUid: undefined,
      firebaseUserEmail: undefined
    });
    this.notifyAuthListeners();
  }

  private applyPrivateConfigSnapshot(pData: {
    googleDriveUrl?: string;
    apiSecret?: string;
    mcpAppCheckToken?: string;
    mcpEnabled?: boolean;
    devVaultSalt?: string;
    devVaultHash?: string;
  } | null) {
    if (!pData) return;
    const decodedUrl = decodeProtectedUrl(pData.googleDriveUrl);
    if (decodedUrl) setSavedGoogleDriveUrl(decodedUrl);
    if (typeof pData.apiSecret === 'string') setSavedGoogleDriveSecret(pData.apiSecret);
    if (typeof pData.mcpAppCheckToken === 'string') {
      this.mcpAppCheckDebugToken = pData.mcpAppCheckToken.trim();
    }
    if (typeof pData.mcpEnabled === 'boolean') {
      this.mcpBridgeEnabled = pData.mcpEnabled;
    }
    if (
      typeof pData.devVaultSalt === 'string' &&
      typeof pData.devVaultHash === 'string' &&
      pData.devVaultSalt.trim() &&
      /^[0-9a-f]{64}$/i.test(pData.devVaultHash.trim())
    ) {
      this.devVaultCredential = {
        salt: pData.devVaultSalt.trim(),
        hash: pData.devVaultHash.trim().toLowerCase()
      };
    }
    this.notifyMcpBridgeListeners();
  }

  public getDeveloperVaultCredential(): DeveloperVaultCredential | null {
    return this.devVaultCredential;
  }

  public async verifyDeveloperVaultPasswordLive(rawInput: string): Promise<boolean> {
    return verifyDeveloperVaultPassword(rawInput, this.devVaultCredential);
  }

  /**
   * שינוי סיסמת סביבת מפתח — מאמת את הסיסמה הנוכחית ושומר רק PBKDF2-SHA256 (ללא טקסט גלוי) ב-std_private_config
   */
  public async updateDeveloperVaultPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ ok: boolean; error?: string }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    const cleanNew = newPassword.trim();
    if (cleanNew.length < 6) {
      return { ok: false, error: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים.' };
    }
    const currentValid = await this.verifyDeveloperVaultPasswordLive(currentPassword);
    if (!currentValid) {
      return { ok: false, error: 'הסיסמה הנוכחית שגויה.' };
    }
    const hashed = await hashDeveloperVaultPassword(cleanNew);
    if (!hashed) {
      return { ok: false, error: 'לא ניתן להצפין את הסיסמה בדפדפן זה.' };
    }
    const payload = {
      devVaultSalt: hashed.salt,
      devVaultHash: hashed.hash,
      updatedAt: Date.now()
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_workspaces', 'private_config'), payload, {
          merge: true
        });
      } else if (this.rtdb) {
        await update(ref(this.rtdb, 'std_private_config'), payload);
      } else {
        return { ok: false, error: 'החיבור למסד הנתונים אינו פעיל.' };
      }
      this.devVaultCredential = hashed;
      this.recordAuditEvent('שינוי סיסמת הכניסה לסביבת מפתח', 'security');
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שמירת הסיסמה החדשה נכשלה.' };
    }
  }

  /**
   * עדכון השם המלא של המנהל המחובר בפרופיל שלו (std_users/{uid}) ובאינדקס השמות (std_taken_names)
   */
  public async updateOwnAdminDisplayName(
    newFullName: string
  ): Promise<{ ok: boolean; oldName?: string; newName?: string; error?: string }> {
    if (!this.activeFirebaseConfig || !this.firebaseUser || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת מחובר בלבד.' };
    }
    const cleanName = newFullName.trim().replace(/\s+/g, ' ').slice(0, 120);
    if (cleanName.length < 2) {
      return { ok: false, error: 'נא להזין שם מלא תקין (לפחות 2 תווים).' };
    }
    const uid = this.firebaseUser.uid;
    const oldName = this.firebaseUserProfile.fullName.trim();
    if (cleanName === oldName) {
      return { ok: true, oldName, newName: cleanName };
    }
    const takenByOther = await this.isFullNameTakenByAnotherUser(cleanName, uid);
    if (takenByOther) {
      return { ok: false, error: `השם "${cleanName}" כבר בשימוש אצל חבר צוות אחר במערכת.` };
    }
    const updatedProfile: FirebaseUserProfile = {
      ...this.firebaseUserProfile,
      uid,
      fullName: cleanName,
      updatedAt: Date.now()
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_users', uid), stripUndefinedDeep(updatedProfile));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_users/${uid}`), stripUndefinedDeep(updatedProfile));
      } else {
        return { ok: false, error: 'החיבור למסד הנתונים אינו פעיל.' };
      }
      this.firebaseUserProfile = updatedProfile;
      await this.registerTakenNameHash(cleanName, uid);
      this.notifyAuthListeners();
      this.recordAuditEvent(`עדכון שם מנהל מ-"${oldName}" ל-"${cleanName}"`, 'team', updatedProfile.email || uid);
      return { ok: true, oldName, newName: cleanName };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'עדכון השם בשרת נכשל.' };
    }
  }

  private notifyMcpBridgeListeners() {
    const info = this.getMcpBridgeStatus();
    for (const listener of this.mcpBridgeListeners) {
      listener(info);
    }
  }

  public getMcpBridgeStatus(): { configured: boolean; enabled: boolean } {
    return {
      configured: isValidAppCheckDebugToken(this.mcpAppCheckDebugToken),
      enabled: this.mcpBridgeEnabled !== false
    };
  }

  public subscribeMcpBridgeStatus(
    listener: (info: { configured: boolean; enabled: boolean }) => void
  ): () => void {
    this.mcpBridgeListeners.add(listener);
    listener(this.getMcpBridgeStatus());
    return () => {
      this.mcpBridgeListeners.delete(listener);
    };
  }

  public getAdminMcpBridgeConfig(): { appCheckDebugToken: string; enabled: boolean } {
    return {
      appCheckDebugToken: this.mcpAppCheckDebugToken,
      enabled: this.mcpBridgeEnabled !== false
    };
  }

  public async testMcpDebugTokenLive(
    rawToken: string
  ): Promise<{ ok: boolean; error?: string }> {
    const token = rawToken.trim();
    if (!isValidAppCheckDebugToken(token)) {
      return { ok: false, error: 'פורמט הטוקן אינו תקין (צפוי מזהה UUID מ-Firebase Console).' };
    }
    const cfg = this.activeFirebaseConfig;
    if (!cfg?.projectId || !cfg?.appId || !cfg?.apiKey) {
      return { ok: false, error: 'הגדרות הפרויקט חסרות.' };
    }
    try {
      const url = `https://firebaseappcheck.googleapis.com/v1/projects/${encodeURIComponent(
        cfg.projectId
      )}/apps/${encodeURIComponent(cfg.appId)}:exchangeDebugToken?key=${encodeURIComponent(
        cfg.apiKey
      )}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debug_token: token })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.token) {
        return { ok: true };
      }
      if (res.status === 403 || res.status === 401) {
        return {
          ok: false,
          error: 'הטוקן נדחה — ודא שהוא שמור תחת Manage debug tokens בפרויקט tzavman-qa.'
        };
      }
      return {
        ok: false,
        error: data?.error?.message || `אימות הטוקן נכשל (HTTP ${res.status}).`
      };
    } catch {
      return { ok: false, error: 'שגיאת רשת בבדיקת הטוקן.' };
    }
  }

  public async saveMcpBridgeConfig(
    rawDebugToken: string,
    enabled: boolean
  ): Promise<{ ok: boolean; error?: string }> {
    if (!this.activeFirebaseConfig || this.firebaseUserProfile?.role !== 'admin') {
      return { ok: false, error: 'פעולה זו מותרת למנהל מערכת בלבד.' };
    }
    const cleanToken = rawDebugToken.trim();
    if (cleanToken && !isValidAppCheckDebugToken(cleanToken)) {
      return { ok: false, error: 'פורמט הטוקן אינו תקין.' };
    }
    const payload = {
      mcpAppCheckToken: cleanToken,
      mcpEnabled: Boolean(enabled),
      updatedAt: Date.now()
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_workspaces', 'private_config'), payload, {
          merge: true
        });
      } else if (this.rtdb) {
        await update(ref(this.rtdb, 'std_private_config'), payload);
      } else {
        return { ok: false, error: 'החיבור למסד הנתונים אינו פעיל.' };
      }
      this.mcpAppCheckDebugToken = cleanToken;
      this.mcpBridgeEnabled = Boolean(enabled);
      this.notifyMcpBridgeListeners();
      this.recordAuditEvent(
        enabled && cleanToken
          ? 'הפעלת/עדכון גשר סוכני AI (MCP) לצוות'
          : 'השבתת גשר סוכני AI (MCP)',
        'security'
      );
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'שמירת הגדרות סוכן AI נכשלה.' };
    }
  }

  /**
   * מפיק לכל משתמש מאושר ומחובר טוקן חיבור אישי ל-MCP לפי החשבון וההרשאות שלו (בלי לחשוף סיסמה!)
   */
  public generatePersonalMcpToken(): { ok: boolean; token?: string; error?: string } {
    const cfg = this.activeFirebaseConfig;
    if (!cfg || !this.firebaseUser || !this.firebaseUserProfile) {
      return { ok: false, error: 'יש להתחבר לחשבון מאושר כדי להפיק טוקן אישי.' };
    }
    if (!this.mcpBridgeEnabled) {
      return { ok: false, error: 'חיבור סוכני AI מושבת כרגע ע״י מנהל המערכת.' };
    }
    if (!isValidAppCheckDebugToken(this.mcpAppCheckDebugToken)) {
      return {
        ok: false,
        error: 'חיבור סוכן AI טרם הופעל ע״י מנהל המערכת (יש להגדיר טוקן פעם אחת בסביבת מפתח).'
      };
    }
    const refreshToken = (this.firebaseUser.refreshToken || '').trim();
    if (!refreshToken) {
      return {
        ok: false,
        error: 'לא נמצא אסימון חיבור פעיל. נסה להתנתק ולהתחבר מחדש.'
      };
    }
    const dbUrl = (
      cfg.databaseURL || `https://${cfg.projectId}-default-rtdb.firebaseio.com`
    ).replace(/\/+$/, '');
    if (!cfg.apiKey || !cfg.projectId || !cfg.appId || !dbUrl) {
      return { ok: false, error: 'הגדרות החיבור של המערכת חסרות.' };
    }
    const token = encodeMcpPersonalToken({
      v: 1,
      rt: refreshToken,
      ac: this.mcpAppCheckDebugToken,
      apiKey: cfg.apiKey,
      dbUrl,
      projectId: cfg.projectId,
      appId: cfg.appId
    });
    return { ok: true, token };
  }

  public async syncPrivateDriveConfig(googleDriveUrl: string, apiSecret?: string): Promise<void> {
    if (!this.activeFirebaseConfig) return;
    const cleanSecret = typeof apiSecret === 'string' ? apiSecret.trim() : '';
    const payload = {
      googleDriveUrl: googleDriveUrl ? encodeProtectedUrl(googleDriveUrl) : '',
      apiSecret: cleanSecret,
      updatedAt: Date.now()
    };
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_workspaces', 'private_config'), payload, {
          merge: true
        });
      } else if (this.rtdb) {
        await update(ref(this.rtdb, 'std_private_config'), payload);
      }
      this.recordAuditEvent('עדכון הגדרת Google Drive בענן המאובטח', 'backup');
    } catch {
      // ignore if user does not have admin permission on private_config
    }
  }

  /**
   * כותב רשומת ביקורת בלתי-ניתנת למחיקה לשרת (std_audit_log) - חוקי האבטחה מאפשרים הוספה בלבד
   */
  public async recordAuditEvent(
    action: string,
    category: ServerAuditLogEntry['category'] = 'security',
    target?: string
  ): Promise<void> {
    if (!this.activeFirebaseConfig || !this.firebaseUser) return;
    const cleanAction = String(action || '').trim().slice(0, 300);
    if (!cleanAction) return;
    const actorName = (
      this.firebaseUserProfile?.fullName ||
      this.firebaseUser.email ||
      'משתמש'
    )
      .trim()
      .slice(0, 120);
    const id = `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry: ServerAuditLogEntry = {
      id,
      action: cleanAction,
      category,
      actorUid: this.firebaseUser.uid,
      actorName,
      ...(this.firebaseUser.email ? { actorEmail: this.firebaseUser.email } : {}),
      ...(target ? { target: String(target).slice(0, 120) } : {}),
      createdAt: Date.now()
    };

    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        await setDoc(doc(this.firestore, 'std_audit_log', id), stripUndefinedDeep(entry));
      } else if (this.rtdb) {
        await set(ref(this.rtdb, `std_audit_log/${id}`), stripUndefinedDeep(entry));
      }
    } catch {
      // ignore background audit write errors (never block UI)
    }
  }

  /**
   * שליפת רשומות יומן הביקורת האחרונות מהשרת (קריאה מותרת למנהלים בלבד לפי חוקי השרת)
   */
  public async fetchRecentAuditLogs(limitCount = 60): Promise<ServerAuditLogEntry[]> {
    if (!this.activeFirebaseConfig || !this.firebaseUser) return [];
    const entries: ServerAuditLogEntry[] = [];
    if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
      const q = fsQuery(
        collection(this.firestore, 'std_audit_log'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const val = d.data() as Partial<ServerAuditLogEntry>;
        if (val && val.action && val.createdAt) {
          entries.push({
            id: val.id || d.id,
            action: String(val.action),
            category: val.category || 'security',
            actorUid: String(val.actorUid || ''),
            actorName: String(val.actorName || ''),
            actorEmail: val.actorEmail,
            target: val.target,
            createdAt: Number(val.createdAt)
          });
        }
      });
    } else if (this.rtdb) {
      const q = query(
        ref(this.rtdb, 'std_audit_log'),
        orderByChild('createdAt'),
        limitToLast(limitCount)
      );
      const snap = await get(q);
      const raw = snap.val() as Record<string, Partial<ServerAuditLogEntry>> | null;
      if (raw && typeof raw === 'object') {
        for (const [key, val] of Object.entries(raw)) {
          if (val && val.action && val.createdAt) {
            entries.push({
              id: val.id || key,
              action: String(val.action),
              category: val.category || 'security',
              actorUid: String(val.actorUid || ''),
              actorName: String(val.actorName || ''),
              actorEmail: val.actorEmail,
              target: val.target,
              createdAt: Number(val.createdAt)
            });
          }
        }
      }
    }
    return entries.sort((a, b) => b.createdAt - a.createdAt);
  }

  private getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * רושם הנפקת טוקן App Check חדש (מסונן לפי Hash כדי שטוקן שמור ב-cache לא ייספר פעמיים)
   */
  private async recordAppCheckTokenUsage(token: string): Promise<void> {
    if (!token || !this.firebaseUser || !this.firebaseUserProfile || !this.activeFirebaseConfig) {
      return;
    }
    const tokenHash = hashString(token);
    if (!tokenHash || tokenHash === this.lastRecordedAppCheckTokenHash) return;
    try {
      const storedHash = localStorage.getItem('tzavman_last_ac_hash');
      if (storedHash === tokenHash) {
        this.lastRecordedAppCheckTokenHash = tokenHash;
        return;
      }
      localStorage.setItem('tzavman_last_ac_hash', tokenHash);
    } catch {
      // ignore storage errors
    }
    this.lastRecordedAppCheckTokenHash = tokenHash;

    const monthKey = this.getCurrentMonthKey();
    const uid = this.firebaseUser.uid;
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const docRef = doc(this.firestore, 'std_usage', `${monthKey}_${uid}`);
        const snap = await getDoc(docRef).catch(() => null);
        const prev = snap && snap.exists() ? Number(snap.data()?.appCheckTokens || 0) : 0;
        await setDoc(docRef, {
          monthKey,
          uid,
          appCheckTokens: Math.min(prev + 1, 100000),
          updatedAt: Date.now()
        });
      } else if (this.rtdb) {
        const usageRef = ref(this.rtdb, `std_usage/${monthKey}/${uid}`);
        const snap = await get(usageRef).catch(() => null);
        const prev = snap && snap.exists() ? Number(snap.val()?.appCheckTokens || 0) : 0;
        await set(usageRef, {
          appCheckTokens: Math.min(prev + 1, 100000),
          updatedAt: Date.now()
        });
      }
    } catch {
      // ignore background usage write errors
    }
  }

  /**
   * מחשב ושולף תמונת מצב מלאה של מכסות השימוש החינמיות בכל הפלטפורמות (מנהל בלבד)
   */
  public async fetchPlatformQuotaSnapshot(): Promise<PlatformQuotaSnapshot> {
    const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
    const byteSize = (value: unknown): number => {
      try {
        const str = JSON.stringify(value ?? null);
        return encoder ? encoder.encode(str).length : str.length * 2;
      } catch {
        return 0;
      }
    };

    const issues = this.currentState.issues || [];
    const issuesBytes = byteSize(issues);
    const chatsBytes = byteSize(this.chatsBySystem || {});

    let totalChatsCount = 0;
    let inlineBase64ImageCount = 0;
    let inlineBase64Bytes = 0;

    for (const list of Object.values(this.chatsBySystem || {})) {
      totalChatsCount += list.length;
      for (const m of list) {
        for (const sc of m.screenshots || []) {
          if (isDataUrlImage(sc)) {
            inlineBase64ImageCount += 1;
            inlineBase64Bytes += sc.length;
          }
        }
      }
    }

    const issueCountBySystem = new Map<string, number>();
    for (const iss of issues) {
      issueCountBySystem.set(iss.system, (issueCountBySystem.get(iss.system) || 0) + 1);
      for (const sc of iss.screenshots || []) {
        if (isDataUrlImage(sc)) {
          inlineBase64ImageCount += 1;
          inlineBase64Bytes += sc.length;
        }
      }
      for (const c of iss.comments || []) {
        if (c.screenshot && isDataUrlImage(c.screenshot)) {
          inlineBase64ImageCount += 1;
          inlineBase64Bytes += c.screenshot.length;
        }
      }
    }

    let maxSystemName: string | null = null;
    let maxSystemIssueCount = 0;
    for (const [sys, count] of issueCountBySystem.entries()) {
      if (count > maxSystemIssueCount) {
        maxSystemIssueCount = count;
        maxSystemName = sys;
      }
    }

    const monthKey = this.getCurrentMonthKey();
    let registeredUsersCount = (this.currentState.teamMembers || []).filter((m) => m.uid).length;
    let metaAndUsersBytes = byteSize(this.currentMetaState || { systems: this.currentState.systems, teamMembers: this.currentState.teamMembers });
    let auditLogBytes = 0;
    let monthlyAppCheckTokens = 0;

    if (this.activeFirebaseConfig && this.firebaseUser) {
      try {
        if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
          const [usersSnap, auditSnap, usageSnap] = await Promise.all([
            getDocs(collection(this.firestore, 'std_users')).catch(() => null),
            getDocs(collection(this.firestore, 'std_audit_log')).catch(() => null),
            getDocs(collection(this.firestore, 'std_usage')).catch(() => null)
          ]);
          if (usersSnap) {
            registeredUsersCount = usersSnap.size;
            const uList: unknown[] = [];
            usersSnap.forEach((d) => uList.push(d.data()));
            metaAndUsersBytes += byteSize(uList);
          }
          if (auditSnap) {
            const aList: unknown[] = [];
            auditSnap.forEach((d) => aList.push(d.data()));
            auditLogBytes = byteSize(aList);
          }
          if (usageSnap) {
            usageSnap.forEach((d) => {
              const data = d.data();
              if (data?.monthKey === monthKey) {
                monthlyAppCheckTokens += Number(data.appCheckTokens || 0);
              }
            });
          }
        } else if (this.rtdb) {
          const [usersSnap, auditSnap, usageSnap] = await Promise.all([
            get(ref(this.rtdb, 'std_users')).catch(() => null),
            get(ref(this.rtdb, 'std_audit_log')).catch(() => null),
            get(ref(this.rtdb, `std_usage/${monthKey}`)).catch(() => null)
          ]);
          if (usersSnap && usersSnap.exists()) {
            const val = usersSnap.val() as Record<string, unknown>;
            registeredUsersCount = Object.keys(val).length;
            metaAndUsersBytes += byteSize(val);
          }
          if (auditSnap && auditSnap.exists()) {
            auditLogBytes = byteSize(auditSnap.val());
          }
          if (usageSnap && usageSnap.exists()) {
            const val = usageSnap.val() as Record<string, { appCheckTokens?: number }>;
            for (const item of Object.values(val)) {
              monthlyAppCheckTokens += Number(item?.appCheckTokens || 0);
            }
          }
        }
      } catch {
        // fallback gracefully to in-memory estimates
      }
    }

    // If App Check is active in this session and counter wasn't synced yet, try recording current token once
    if (this.firebaseAppCheck && monthlyAppCheckTokens === 0) {
      try {
        const res = await getAppCheckToken(this.firebaseAppCheck, false);
        if (res?.token) {
          await this.recordAppCheckTokenUsage(res.token);
          monthlyAppCheckTokens = 1;
        }
      } catch {
        // ignore
      }
    }

    const driveRes = await fetchGoogleDriveQuota();
    const totalDbBytes = issuesBytes + chatsBytes + metaAndUsersBytes + auditLogBytes;

    return {
      totalDbBytes,
      dbLimitBytes: 1024 * 1024 * 1024, // 1 GB Spark RTDB free tier
      issuesBytes,
      chatsBytes,
      metaAndUsersBytes,
      auditLogBytes,
      totalIssuesCount: issues.length,
      totalChatsCount,
      inlineBase64ImageCount,
      inlineBase64Bytes,
      maxSystemName,
      maxSystemIssueCount,
      onlineCount: Math.max(this.statusInfo.onlineCount || 1, 1),
      onlineLimit: 100, // 100 concurrent RTDB Spark limit
      registeredUsersCount: Math.max(registeredUsersCount, 1),
      authUsersLimit: 50000, // 50,000 MAU free tier
      monthlyAppCheckTokens,
      monthlyAppCheckLimit: 10000, // 10,000 free reCAPTCHA Enterprise assessments / month
      monthKey,
      driveConnected: driveRes.connected,
      driveQuota: driveRes.quota,
      driveError: driveRes.error,
      generatedAt: Date.now()
    };
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
      issues: scopedIssues,
      revision: meta.revision || this.highestSeenRevision,
      lastUpdatedBy: meta.lastUpdatedBy,
      lastAction: meta.lastAction,
      updatedAt: meta.updatedAt || Date.now(),
      clientId: meta.clientId
    });

    this.currentState = combined;
    this.persistLocally(combined);
    this.notifyState(isRemote);
  }

  /**
   * שליפת כלל פרופילי המשתמשים מ-std_users למנהל בלבד (כולל כתובת אימייל ההתחברות לתצוגה במסך ניהול צוות)
   */
  public async fetchAdminUserProfiles(): Promise<FirebaseUserProfile[]> {
    if (!this.activeFirebaseConfig || !this.isFirebaseAuthRequired()) return [];
    if (this.firebaseUserProfile?.role !== 'admin') return [];

    const profiles: FirebaseUserProfile[] = [];
    try {
      if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
        const snap = await getDocs(collection(this.firestore, 'std_users'));
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Partial<FirebaseUserProfile>;
          if (data && data.fullName && data.role) {
            profiles.push({
              uid: docSnap.id,
              email: data.email,
              fullName: data.fullName.trim(),
              role: data.role,
              allowedSystems: data.allowedSystems,
              allowedSystemKeys: data.allowedSystemKeys,
              allSystems: data.allSystems,
              isSuperAdmin: data.isSuperAdmin,
              updatedAt: data.updatedAt
            });
          }
        });
      } else if (this.rtdb) {
        const res = await this.fetchRtdbNodeWithFallback('std_users');
        const val = (res.ok && res.exists ? res.value : null) as
          | Record<string, Partial<FirebaseUserProfile>>
          | null;
        if (val && typeof val === 'object') {
          for (const [uid, data] of Object.entries(val)) {
            if (data && data.fullName && data.role) {
              profiles.push({
                uid,
                email: data.email,
                fullName: data.fullName.trim(),
                role: data.role,
                allowedSystems: data.allowedSystems,
                allowedSystemKeys: data.allowedSystemKeys,
                allSystems: data.allSystems,
                isSuperAdmin: data.isSuperAdmin,
                updatedAt: data.updatedAt
              });
            }
          }
        }
      }
    } catch {
      // ignore read errors
    }
    return profiles;
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

      const activeUids = new Set<string>();
      const survivingProfiles = new Map<string, FirebaseUserProfile>();
      for (const m of members) {
        // Match by UID strictly when linked; fall back to name ONLY for legacy unlinked rows (never steal another UID!)
        const targetProfile = m.uid
          ? byUid.get(m.uid)
          : byName.get(m.fullName.trim().toLowerCase());
        if (!targetProfile) continue;
        activeUids.add(targetProfile.uid);

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
        survivingProfiles.set(updatedProfile.uid, updatedProfile);

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

      // Revoke server access immediately for any removed team members (never delete active admin or super admin)
      for (const [uid, existingProfile] of byUid.entries()) {
        if (activeUids.has(uid)) continue;
        if (uid === this.firebaseUser?.uid || existingProfile.isSuperAdmin) {
          survivingProfiles.set(uid, existingProfile);
          continue;
        }
        if (this.activeFirebaseConfig.mode === 'firestore' && this.firestore) {
          await deleteDoc(doc(this.firestore, 'std_users', uid)).catch(() => {});
          // Clear stale 'approved' join request so removed user never hits a dead-end waiting screen
          const reqSnap = await getDoc(doc(this.firestore, 'std_join_requests', uid)).catch(() => null);
          if (reqSnap && reqSnap.exists() && reqSnap.data()?.status === 'approved') {
            await deleteDoc(doc(this.firestore, 'std_join_requests', uid)).catch(() => {});
          }
        } else if (this.rtdb) {
          await remove(ref(this.rtdb, `std_users/${uid}`)).catch(() => {});
          const reqSnap = await get(ref(this.rtdb, `std_join_requests/${uid}`)).catch(() => null);
          if (reqSnap && reqSnap.exists() && reqSnap.val()?.status === 'approved') {
            await remove(ref(this.rtdb, `std_join_requests/${uid}`)).catch(() => {});
          }
        }
        this.recordAuditEvent(
          `ביטול הרשאות שרת למשתמש שהוסר: ${existingProfile.fullName}`,
          'team',
          existingProfile.email || uid
        );
      }

      // Keep privacy-preserving SHA-256 taken-names index strictly synchronized with active std_users
      await this.syncTakenNamesIndexFromProfiles(survivingProfiles.values());
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
              lastUpdatedBy: baseState.lastUpdatedBy || this.firebaseUserProfile?.fullName || 'מנהל מערכת'
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
          partitionVersion: 2,
          revision: Math.max(baseState.revision || 0, 1),
          lastUpdatedBy: baseState.lastUpdatedBy || this.firebaseUserProfile?.fullName || 'מנהל מערכת',
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
        const existingChatsSnap = await get(ref(this.rtdb, 'std_chats')).catch(() => null);
        if (existingChatsSnap && existingChatsSnap.exists()) {
          const rawChats = existingChatsSnap.val() as Record<
            string,
            Record<string, SystemChatMessage> | SystemChatMessage[]
          > | null;
          if (rawChats) {
            const parsedLegacyChats: Record<string, SystemChatMessage[]> = {};
            for (const bucket of Object.values(rawChats)) {
              if (!bucket) continue;
              const list = Array.isArray(bucket) ? bucket : Object.values(bucket);
              for (const msg of list) {
                if (msg && msg.id && msg.system) {
                  if (!parsedLegacyChats[msg.system]) parsedLegacyChats[msg.system] = [];
                  parsedLegacyChats[msg.system].push(msg);
                }
              }
            }
            baseChats = mergeAllChats(baseChats, parsedLegacyChats);
          }
        }
        const systemsList = Array.from(
          new Set([
            ...(baseState.systems || DEFAULT_SYSTEMS),
            ...(baseState.archivedSystems || []),
            ...baseState.issues.map((i) => i.system),
            ...Object.keys(baseChats)
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
              lastUpdatedBy: baseState.lastUpdatedBy || this.firebaseUserProfile?.fullName || 'מנהל מערכת',
              clientId: this.clientId
            })
          );
          if (baseChats[sys] && baseChats[sys].length > 0) {
            const chatBucket: Record<string, Record<string, any>> = {};
            for (const msg of pruneChatMessages(baseChats[sys])) {
              chatBucket[msg.id] = stripUndefinedChatFields(msg);
            }
            await set(ref(this.rtdb, `std_chats/${sysKey}`), chatBucket);
          }
        }

        const metaNode = stripUndefinedDeep({
          systems: baseState.systems || DEFAULT_SYSTEMS,
          archivedSystems: baseState.archivedSystems || [],
          deletedIssueIds: baseState.deletedIssueIds || [],
          deletedSystemIds: baseState.deletedSystemIds || [],
          teamMembers: baseState.teamMembers || getStoredTeamMembers(),
          partitionVersion: 2,
          revision: Math.max(baseState.revision || 0, 1),
          lastUpdatedBy: baseState.lastUpdatedBy || this.firebaseUserProfile?.fullName || 'מנהל מערכת',
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
    this.clearRtdbWatchdogTimers();
    this.activeDataListenersUid = null;
    this.rtdbMetaSnapshotReceived = false;
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
    if (this.unsubscribeAdminJoinRequests) {
      this.unsubscribeAdminJoinRequests();
      this.unsubscribeAdminJoinRequests = null;
    }
    this.adminJoinRequests = [];
    this.hasLoadedInitialChatsFirebase = false;
  }

  private attachFirebaseDataListeners(config: FirebaseConfigData, forceReattach = false) {
    const currentUid = this.firebaseUser?.uid || '__anonymous__';
    if (!forceReattach && this.activeDataListenersUid === currentUid && this.unsubscribeFirebase) {
      return;
    }
    this.detachDataListenersOnly();
    this.activeDataListenersUid = currentUid;
    this.rtdbMetaSnapshotReceived = false;
    const useFirestore = config.mode === 'firestore';
    const isEnforced = Boolean(config.requireFirebaseAuth);

    if (isEnforced && this.firebaseUserProfile?.role === 'admin') {
      this.attachAdminJoinRequestsListener(config);
    }

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
            this.applyPrivateConfigSnapshot(snap.data() as any);
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
          this.applyPrivateConfigSnapshot(snap.data() as any);
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
            this.rtdbMetaSnapshotReceived = true;
            this.hasAutoRebuiltFirebaseApp = false;
            this.clearRtdbWatchdogTimers();
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
          () => {
            this.updateStatus({
              mode: 'error',
              connected: false,
              projectId: config.projectId,
              errorMessage: 'החיבור לסנכרון החי נקטע זמנית'
            });
            if (!this.rtdbMetaSnapshotReceived) {
              void this.hydrateWorkspaceViaRestFallback(config);
              void this.recoverRtdbRealtimeConnection(true);
            }
          }
        );

        // Watchdog: if real-time WebSocket does not deliver std_meta within 3.5s (e.g. stale mobile/PWA transport or App Check cache),
        // hydrate systems & issues immediately via authenticated HTTPS REST and actively recover the live socket.
        const watchdogEpoch = this.authEpoch;
        const watchdogUid = this.firebaseUser?.uid;
        this.rtdbBootstrapWatchdogTimer = setTimeout(() => {
          this.rtdbBootstrapWatchdogTimer = null;
          if (
            this.rtdbMetaSnapshotReceived ||
            this.authEpoch !== watchdogEpoch ||
            this.firebaseUser?.uid !== watchdogUid
          ) {
            return;
          }
          void this.hydrateWorkspaceViaRestFallback(config);
          void this.recoverRtdbRealtimeConnection(true);

          // If still disconnected after recovery (e.g. RTDB server_kill), rebuild Firebase app at most once automatically
          this.rtdbReconnectRetryTimer = setTimeout(() => {
            this.rtdbReconnectRetryTimer = null;
            if (
              this.rtdbMetaSnapshotReceived ||
              this.authEpoch !== watchdogEpoch ||
              this.firebaseUser?.uid !== watchdogUid ||
              this.isRebuildingFirebaseApp ||
              this.hasAutoRebuiltFirebaseApp
            ) {
              return;
            }
            this.isRebuildingFirebaseApp = true;
            this.hasAutoRebuiltFirebaseApp = true;
            this.connectFirebase(config)
              .catch(() => {})
              .finally(() => {
                this.isRebuildingFirebaseApp = false;
              });
          }, 6500);
        }, 3500);

        try {
          const privateRef = ref(this.rtdb, 'std_private_config');
          this.unsubscribePrivateConfig = onValue(
            privateRef,
            (snap) => {
              this.applyPrivateConfigSnapshot(snap.val() as any);
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
        () => {
          this.updateStatus({
            mode: 'error',
            connected: false,
            projectId: config.projectId,
            errorMessage: 'החיבור לסנכרון החי נקטע זמנית'
          });
        }
      );

      // Private Drive config listener (protected by RTDB Rules)
      try {
        const privateRef = ref(this.rtdb, 'std_private_config');
        this.unsubscribePrivateConfig = onValue(
          privateRef,
          (snap) => {
            this.applyPrivateConfigSnapshot(snap.val() as any);
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
      this.firebaseAppCheck = null;

      // Firebase App Check (Fraud Defense / reCAPTCHA Enterprise): blocks use of the Firebase API key outside this app
      if (isValidAppCheckSiteKey(config.appCheckSiteKey)) {
        const activeKey = (config.appCheckSiteKey as string).trim();
        let siteKeyChanged = false;
        try {
          const savedAcKey = localStorage.getItem('tzavman_ac_sitekey_v1');
          if (savedAcKey !== activeKey) {
            siteKeyChanged = true;
            localStorage.setItem('tzavman_ac_sitekey_v1', activeKey);
          }
        } catch {
          // ignore storage errors
        }
        try {
          if (import.meta.env.DEV) {
            (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
          }
          this.firebaseAppCheck = initializeAppCheck(this.firebaseApp, {
            provider: new ReCaptchaEnterpriseProvider(activeKey),
            isTokenAutoRefreshEnabled: true
          });
          if (siteKeyChanged) {
            // Non-blocking official SDK refresh when migrating from an older site key (never locks IndexedDB!)
            getAppCheckToken(this.firebaseAppCheck, true).catch(() => {});
          }
          this.unsubscribeAppCheckToken = onTokenChanged(this.firebaseAppCheck, (tokenRes) => {
            if (tokenRes?.token) {
              this.recordAppCheckTokenUsage(tokenRes.token);
            }
          });
        } catch (appCheckErr: any) {
          this.updateStatus({
            errorMessage: `שגיאה באתחול הגנת החיבור: ${appCheckErr?.message || appCheckErr}`
          });
        }
      }

      // Use localStorage-based auth persistence instead of IndexedDB to prevent mobile/PWA & multi-tab deadlocks!
      try {
        this.firebaseAuth = initializeAuth(this.firebaseApp, {
          persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence]
        });
      } catch {
        this.firebaseAuth = getAuth(this.firebaseApp);
      }
      if (useFirestore) {
        this.firestore = getFirestore(this.firebaseApp);
        this.rtdb = null;
      } else {
        // Clear any stale RTDB WebSocket-failure / host-cache flags in localStorage so regular browsers & PWAs
        // always start with a clean WebSocket connection instead of getting stuck in legacy iframe long-polling!
        this.clearStaleRtdbTransportFlags();
        if (typeof WebSocket !== 'undefined' && !this.hasForcedWebSockets) {
          try {
            forceWebSockets();
            this.hasForcedWebSockets = true;
          } catch {
            // ignore if transport already initialized
          }
        }
        this.rtdb = getDatabase(this.firebaseApp);
        this.firestore = null;
      }

      this.unsubscribeAuthState = onAuthStateChanged(this.firebaseAuth, async (user) => {
        const myEpoch = ++this.authEpoch;
        this.firebaseUser = user;

        if (user) {
          let profile: FirebaseUserProfile | null = null;
          if (this.firebaseUserProfile?.uid === user.uid) {
            profile = this.firebaseUserProfile;
          } else {
            const profileRes = await this.fetchFirebaseUserProfileDetailed(user.uid);
            if (this.authEpoch !== myEpoch && this.firebaseUser?.uid !== user.uid) {
              return;
            }
            if (profileRes.status === 'error') {
              // Do NOT mistakenly send an approved user to Waiting Room on a transient connection/AppCheck error!
              this.updateStatus({
                firebaseUid: user.uid,
                firebaseUserEmail: user.email || undefined,
                errorMessage: `לא ניתן להשלים את החיבור כרגע (${profileRes.error || 'TIMEOUT'}). נסה שוב או התחבר מחדש.`
              });
              return;
            }
            profile = profileRes.profile;
          }
          if (this.authEpoch !== myEpoch && this.firebaseUser?.uid !== user.uid) {
            return;
          }
          this.firebaseUserProfile = profile;
          if (!profile && config.requireFirebaseAuth) {
            this.pendingJoinRequest = await this.fetchOwnJoinRequest(user.uid);
            if (this.authEpoch !== myEpoch && this.firebaseUser?.uid !== user.uid) {
              return;
            }
            this.attachWaitingRoomListeners(user.uid);
            this.notifyPendingJoinRequestListeners();
          } else {
            this.detachWaitingRoomListeners();
          }
          this.firebaseAuthInitialized = true;
          this.updateStatus({
            firebaseUid: user.uid,
            firebaseUserEmail: user.email || undefined,
            errorMessage: undefined
          });
          if (config.requireFirebaseAuth && profile) {
            this.attachFirebaseDataListeners(config);
            if (this.firebaseAppCheck) {
              getAppCheckToken(this.firebaseAppCheck, false)
                .then((res) => {
                  if (res?.token) this.recordAppCheckTokenUsage(res.token);
                })
                .catch(() => {});
            }
          }
          this.notifyAuthListeners();
        } else {
          this.firebaseUserProfile = null;
          this.detachWaitingRoomListeners();
          this.notifyPendingJoinRequestListeners();
          this.firebaseAuthInitialized = true;
          this.updateStatus({
            firebaseUid: undefined,
            firebaseUserEmail: undefined,
            ...(config.requireFirebaseAuth ? { connected: false } : {})
          });
          // Notify listeners immediately so LoginScreen renders with zero pre-auth flash
          this.notifyAuthListeners();
          if (config.requireFirebaseAuth) {
            this.detachDataListenersOnly();
            await this.clearLocalSensitiveCaches();
            if (this.authEpoch !== myEpoch || this.firebaseUser) {
              return;
            }
            this.notifyState(false);
            this.notifyChats();
          }
        }
      });

      if (!config.requireFirebaseAuth) {
        this.attachFirebaseDataListeners(config);
      }

      return { ok: true };
    } catch (err: any) {
      const msg = err?.message || String(err);
      this.firebaseAuthInitialized = true;
      this.updateStatus({
        mode: 'error',
        connected: false,
        errorMessage: msg
      });
      this.notifyAuthListeners();
      return { ok: false, error: msg };
    }
  }

  /**
   * כפתור "סנכרון חי" או רענון יזום: מנקה דגלי חיבור ישנים, מרענן טוקן, מושך נתונים מיידית ומחדש סנכרון חי
   */
  public async requestManualSync(): Promise<void> {
    const config = this.activeFirebaseConfig;
    if (!config || !this.firebaseUser || !this.firebaseUserProfile) return;

    this.hasAutoRebuiltFirebaseApp = false;
    this.clearStaleRtdbTransportFlags();

    if (config.mode !== 'firestore' && this.rtdb) {
      const wasConnected = this.statusInfo.connected && this.rtdbMetaSnapshotReceived;
      if (!wasConnected) {
        void this.hydrateWorkspaceViaRestFallback(config);
        await this.recoverRtdbRealtimeConnection(true);
      }
      this.attachFirebaseDataListeners(config, true);

      if (!wasConnected) {
        const manualEpoch = this.authEpoch;
        const manualUid = this.firebaseUser.uid;
        setTimeout(() => {
          if (
            !this.rtdbMetaSnapshotReceived &&
            this.authEpoch === manualEpoch &&
            this.firebaseUser?.uid === manualUid &&
            !this.isRebuildingFirebaseApp
          ) {
            this.isRebuildingFirebaseApp = true;
            this.hasAutoRebuiltFirebaseApp = true;
            this.connectFirebase(config)
              .catch(() => {})
              .finally(() => {
                this.isRebuildingFirebaseApp = false;
              });
          }
        }, 4500);
      }
      return;
    }

    this.attachFirebaseDataListeners(config, true);
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

    return {
      systems: finalSystems,
      archivedSystems: Array.from(archivedSet),
      deletedIssueIds: Array.from(deletedIssueSet),
      deletedSystemIds: Array.from(deletedSystemSet),
      issues: mergedIssues,
      teamMembers: mergedTeamMembers,
      lastUpdatedBy: primary.lastUpdatedBy || localState.lastUpdatedBy,
      lastAction: primary.lastAction || localState.lastAction,
      updatedAt: Math.max(incomingState.updatedAt || 0, localState.updatedAt || 0),
      revision: Math.max(incomingState.revision || 0, localState.revision || 0),
      clientId: primary.clientId || this.clientId,
      googleDriveUrl:
        incomingState.googleDriveUrl ||
        localState.googleDriveUrl ||
        getSavedGoogleDriveUrl() ||
        undefined
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

    return {
      systems,
      archivedSystems,
      deletedIssueIds,
      deletedSystemIds,
      issues,
      teamMembers,
      lastUpdatedBy: raw?.lastUpdatedBy,
      lastAction: raw?.lastAction,
      updatedAt: raw?.updatedAt,
      revision: Number(raw?.revision || 0),
      clientId: raw?.clientId,
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
              const partHash = hashString(JSON.stringify(sysIssues));
              if (this.lastPushedPartitionHashes.get(sysKey) === partHash) continue;
              this.partitionIssues.set(sysKey, sysIssues);
              await setDoc(
                doc(this.firestore, 'std_systems', sysKey),
                stripUndefinedDeep({
                  system: sys,
                  issues: sysIssues,
                  updatedAt: drivePayload.updatedAt,
                  revision: driveRev,
                  lastUpdatedBy: this.currentState.lastUpdatedBy,
                  clientId: this.clientId
                })
              );
              this.lastPushedPartitionHashes.set(sysKey, partHash);
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
              const partHash = hashString(JSON.stringify(sysIssues));
              if (this.lastPushedPartitionHashes.get(sysKey) === partHash) continue;
              this.partitionIssues.set(sysKey, sysIssues);
              await set(
                ref(this.rtdb, `std_systems/${sysKey}`),
                stripUndefinedDeep({
                  system: sys,
                  issues: sysIssues,
                  updatedAt: drivePayload.updatedAt,
                  revision: driveRev,
                  lastUpdatedBy: this.currentState.lastUpdatedBy,
                  clientId: this.clientId
                })
              );
              this.lastPushedPartitionHashes.set(sysKey, partHash);
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
        }
      }

      // Only admins / unrestricted profiles may overwrite the global auto-backup file on Google Drive!
      // Prevents a single-system dev/QA user from wiping other systems out of tzavman_auto_backup.json.
      const canSaveGlobalDriveBackup =
        !this.isFirebaseAuthRequired() ||
        this.firebaseUserProfile?.role === 'admin' ||
        this.firebaseUserProfile?.allSystems === true;
      if (canSaveGlobalDriveBackup) {
        saveAutoBackupToGoogleDrive(this.currentState);
      }
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

    const effectiveAction =
      actionSummary !== undefined ? actionSummary : this.currentState.lastAction;
    const resolvedActor =
      (actorName && actorName.trim() && actorName !== 'חבר צוות' ? actorName.trim() : '') ||
      this.firebaseUserProfile?.fullName?.trim() ||
      this.currentState.lastUpdatedBy ||
      'חבר צוות';
    const effectiveActor = resolvedActor;

    const candidatePayload: SyncStatePayload = {
      systems: nextState.systems,
      archivedSystems: nextState.archivedSystems ?? this.currentState.archivedSystems ?? [],
      deletedIssueIds:
        nextState.deletedIssueIds ?? this.currentState.deletedIssueIds ?? [],
      deletedSystemIds:
        nextState.deletedSystemIds ?? this.currentState.deletedSystemIds ?? [],
      issues: nextState.issues,
      teamMembers: effectiveTeamMembers,
      lastUpdatedBy: effectiveActor,
      lastAction: effectiveAction,
      updatedAt: Date.now(),
      revision: nextRevision,
      clientId: this.clientId,
      googleDriveUrl: undefined
    };

    // Apply Anti-Wipe Union Merge unless Admin explicitly requested a full backup replacement
    const payload: SyncStatePayload = nextState.replaceAll
      ? candidatePayload
      : this.mergeWorkspaceStates(this.currentState, candidatePayload);

    if (nextState.teamMembers) {
      payload.teamMembers = nextState.teamMembers;
    }

    payload.revision = nextRevision;
    payload.lastUpdatedBy = effectiveActor;
    payload.lastAction = effectiveAction;
    payload.updatedAt = Date.now();
    payload.clientId = this.clientId;

    if (nextState.replaceAll) {
      this.recordAuditEvent(
        actionSummary || `שחזור/החלפת מסד נתונים (${payload.issues.length} תקלות)`,
        'backup'
      );
    }

    try {
      localStorage.setItem('std_qa_pending_push', '1');
    } catch {
      // ignore
    }

    this.currentState = payload;
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

    // Strict Firebase-only mode: never publish to public MQTT/Bytebin or unauthenticated local endpoints
  }
}

export const syncService = new RealtimeSyncService();
