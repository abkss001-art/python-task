import type { SystemChatMessage } from '../types/std';
import type { TeamMember } from './teamMembers';

export const MAX_CHAT_MESSAGES_PER_SYSTEM = 500;
const CHAT_LAST_READ_STORAGE_KEY = 'std_qa_chat_last_read_v1';

export function pruneChatMessages(messages: SystemChatMessage[]): SystemChatMessage[] {
  if (!Array.isArray(messages)) return [];
  const sorted = [...messages].sort((a, b) => a.createdAt - b.createdAt);
  if (sorted.length <= MAX_CHAT_MESSAGES_PER_SYSTEM) {
    return sorted;
  }
  return sorted.slice(sorted.length - MAX_CHAT_MESSAGES_PER_SYSTEM);
}

/**
 * Union-merge per-system chat arrays without data loss:
 * - Admin deletion tombstones override earlier un-deleted versions
 * - Higher updatedAt wins for edits/reactions
 */
export function mergeSystemChatArrays(
  localMsgs: SystemChatMessage[] = [],
  remoteMsgs: SystemChatMessage[] = []
): SystemChatMessage[] {
  const byId = new Map<string, SystemChatMessage>();

  const ingest = (msg: SystemChatMessage) => {
    if (!msg || !msg.id || !msg.system) return;
    const existing = byId.get(msg.id);
    if (!existing) {
      byId.set(msg.id, {
        ...msg,
        screenshots: Array.isArray(msg.screenshots) ? msg.screenshots : [],
        reactions: msg.reactions ? { ...msg.reactions } : {}
      });
      return;
    }

    // Admin deletion tombstone always takes precedence
    if (msg.deletedAt && !existing.deletedAt) {
      byId.set(msg.id, {
        ...msg,
        screenshots: [],
        reactions: msg.reactions || existing.reactions || {}
      });
      return;
    }
    if (existing.deletedAt && !msg.deletedAt) {
      return;
    }

    const existingUpdated = existing.updatedAt || existing.createdAt || 0;
    const incomingUpdated = msg.updatedAt || msg.createdAt || 0;
    if (incomingUpdated >= existingUpdated) {
      // Preserve Drive URLs over raw Base64 if one copy already offloaded them
      const mergedScreenshots = resolveMergedScreenshots(
        msg.screenshots,
        existing.screenshots
      );
      byId.set(msg.id, {
        ...msg,
        screenshots: mergedScreenshots,
        reactions: msg.reactions ? { ...msg.reactions } : {}
      });
    } else if (existing.screenshots && msg.screenshots) {
      const mergedScreenshots = resolveMergedScreenshots(
        existing.screenshots,
        msg.screenshots
      );
      byId.set(msg.id, {
        ...existing,
        screenshots: mergedScreenshots
      });
    }
  };

  for (const m of localMsgs) ingest(m);
  for (const m of remoteMsgs) ingest(m);

  return pruneChatMessages(Array.from(byId.values()));
}

function resolveMergedScreenshots(
  preferred?: string[],
  fallback?: string[]
): string[] {
  const pref = Array.isArray(preferred) ? preferred : [];
  const fall = Array.isArray(fallback) ? fallback : [];
  if (pref.length === 0) return [];
  return pref.map((url, idx) => {
    const alt = fall[idx];
    if (url.startsWith('data:image/') && alt && !alt.startsWith('data:image/')) {
      return alt;
    }
    return url;
  });
}

export function mergeAllChats(
  localChats: Record<string, SystemChatMessage[]> = {},
  remoteChats: Record<string, SystemChatMessage[]> = {}
): Record<string, SystemChatMessage[]> {
  const allSystems = new Set<string>([
    ...Object.keys(localChats || {}),
    ...Object.keys(remoteChats || {})
  ]);
  const merged: Record<string, SystemChatMessage[]> = {};
  for (const sys of allSystems) {
    const arr = mergeSystemChatArrays(localChats[sys], remoteChats[sys]);
    if (arr.length > 0) {
      merged[sys] = arr;
    }
  }
  return merged;
}

/**
 * Firebase RTDB keys cannot contain . # $ [ ] /
 */
export function encodeFirebaseSystemKey(system: string): string {
  return encodeURIComponent(system).replace(/\./g, '%2E');
}

export function getLastChatReadMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CHAT_LAST_READ_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {};
}

export function saveLastChatReadTime(system: string, timestamp: number): Record<string, number> {
  const current = getLastChatReadMap();
  const next = {
    ...current,
    [system]: Math.max(current[system] || 0, timestamp)
  };
  try {
    localStorage.setItem(CHAT_LAST_READ_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function getUnreadCountForSystem(
  messages: SystemChatMessage[] = [],
  lastReadAt: number,
  currentUserName: string
): number {
  const normalizedUser = currentUserName.trim().toLowerCase();
  let count = 0;
  for (const msg of messages) {
    if (msg.createdAt <= lastReadAt) continue;
    if (msg.deletedAt) continue;
    if (msg.author.trim().toLowerCase() === normalizedUser) continue;
    count++;
  }
  return count;
}

/**
 * Extract mentioned team members' fullNames from message text.
 */
export function extractMentionsFromText(
  text: string,
  teamMembers: TeamMember[]
): string[] {
  if (!text || !text.includes('@')) return [];
  const normalizedText = text.toLowerCase();
  const sortedMembers = [...teamMembers].sort(
    (a, b) => b.fullName.length - a.fullName.length
  );
  const found = new Set<string>();

  for (const m of sortedMembers) {
    const name = m.fullName.trim();
    if (!name) continue;
    const token = `@${name.toLowerCase()}`;
    let idx = normalizedText.indexOf(token);
    while (idx !== -1) {
      const afterChar = normalizedText[idx + token.length];
      // Ensure token ends at whitespace, punctuation, or end of string
      if (!afterChar || /[\s.,!?:;()[\]{}"'<>@#]/.test(afterChar)) {
        found.add(name);
        break;
      }
      idx = normalizedText.indexOf(token, idx + 1);
    }
  }
  return Array.from(found);
}

export function doesMessageMentionUser(
  msg: Pick<SystemChatMessage, 'text' | 'mentions'>,
  userFullName: string
): boolean {
  const target = userFullName.trim().toLowerCase();
  if (!target) return false;
  if (Array.isArray(msg.mentions)) {
    if (msg.mentions.some((m) => m.trim().toLowerCase() === target)) {
      return true;
    }
  }
  const text = (msg.text || '').toLowerCase();
  const token = `@${target}`;
  const idx = text.indexOf(token);
  if (idx === -1) return false;
  const afterChar = text[idx + token.length];
  return !afterChar || /[\s.,!?:;()[\]{}"'<>@#]/.test(afterChar);
}

export type ChatTextToken =
  | { type: 'text'; value: string }
  | { type: 'issue'; value: string; testCaseId: string }
  | { type: 'mention'; value: string; name: string };

/**
 * Parse message text into plain text, #12 issue deep-links, and @name mentions.
 */
export function parseMessageTokens(
  text: string,
  teamMemberNames: string[]
): ChatTextToken[] {
  if (!text) return [];
  const escapedNames = [...teamMemberNames]
    .filter((n) => n.trim().length > 0)
    .sort((a, b) => b.length - a.length)
    .map((n) => `@${n.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

  const mentionPattern = escapedNames.length > 0 ? `(?:${escapedNames.join('|')})(?=$|[\\s.,!?:;()\\[\\]{}"'<>@#])|` : '';
  const regex = new RegExp(`(${mentionPattern}#[0-9A-Za-z_-]+)`, 'gi');

  const tokens: ChatTextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('#')) {
      tokens.push({
        type: 'issue',
        value: raw,
        testCaseId: raw.slice(1)
      });
    } else if (raw.startsWith('@')) {
      tokens.push({
        type: 'mention',
        value: raw,
        name: raw.slice(1)
      });
    } else {
      tokens.push({ type: 'text', value: raw });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

export function getChatDayKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatChatDayLabel(timestamp: number): string {
  const target = new Date(timestamp);
  const now = new Date();
  const todayKey = getChatDayKey(now.getTime());
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = getChatDayKey(yesterday.getTime());
  const targetKey = getChatDayKey(timestamp);

  if (targetKey === todayKey) return 'היום';
  if (targetKey === yesterdayKey) return 'אתמול';

  try {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(target);
  } catch {
    return target.toLocaleDateString('he-IL');
  }
}

export function formatChatTime(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}
