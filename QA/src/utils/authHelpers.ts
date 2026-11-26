import type { TeamRole } from '../types/std';
import { envStorageKey } from './appEnv.ts';

const LAST_LOGIN_IDENTIFIER_KEY = envStorageKey('tzavman_last_login_identifier_v1');
export const DEFAULT_SHORT_LOGIN_DOMAIN = 'gmail.com';
export const MAX_JOIN_REJECTIONS = 3;
export const JOIN_RETRY_COOLDOWN_MS = 60_000;

const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;
const STRICT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * מנרמל שם משתמש (אותיות קטנות, ללא רווחים)
 */
export function normalizeUsername(rawUsername: string): string {
  return String(rawUsername || '').trim().toLowerCase();
}

/**
 * בודק תקינות שם משתמש (3-32 תווים באנגלית, ספרות, נקודה, קו תחתון או מקף, ללא @ ורווחים)
 */
export function isValidUsername(rawUsername: string): boolean {
  return USERNAME_RE.test(normalizeUsername(rawUsername));
}

/**
 * בודק כתובת אימייל מלאה ותקינה (חובה בהרשמה כדי שיהיה ניתן לשחזר סיסמה)
 */
export function isValidEmailAddress(rawEmail: string): boolean {
  const cleaned = String(rawEmail || '').trim().toLowerCase();
  return cleaned.length >= 5 && cleaned.length <= 160 && STRICT_EMAIL_RE.test(cleaned);
}

/**
 * מחשב hash חד-כיווני (SHA-256) עבור שם מלא / שם משתמש לצורך איתור מייל בהתחברות/איפוס סיסמה
 */
export async function computeUsernameHash(rawIdentifier: string): Promise<string> {
  const normalized = normalizeFullNameKey(rawIdentifier);
  if (!normalized) return '';
  const bytes = new TextEncoder().encode(`tzavman-username-v1:${normalized}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * ממסך כתובת אימייל להצגה בטוחה בהודעת איפוס סיסמה לפי שם משתמש (למשל ab***@gmail.com)
 */
export function maskEmailForDisplay(rawEmail: string): string {
  const cleaned = String(rawEmail || '').trim().toLowerCase();
  const atIdx = cleaned.indexOf('@');
  if (atIdx <= 0) return cleaned;
  const local = cleaned.slice(0, atIdx);
  const domain = cleaned.slice(atIdx);
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}***${domain}`;
}

/**
 * מנרמל שם מלא לצורך זיהוי כפילויות (הסרת רווחים מיותרים ואותיות קטנות)
 */
export function normalizeFullNameKey(rawName: string): string {
  return String(rawName || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * מחשב hash חד-כיווני (SHA-256) עבור שם מלא כדי לבדוק כפילויות בשרת בלי לחשוף שמות עובדים
 */
export async function computeFullNameHash(rawName: string): Promise<string> {
  const normalized = normalizeFullNameKey(rawName);
  if (!normalized) return '';
  const bytes = new TextEncoder().encode(`tzavman-name-v1:${normalized}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * מאפשר הזנת שם משתמש קצר (למשל `david` או `1234`) בלי להקליד `@gmail.com` בכל פעם,
 * תוך שמירה מלאה על כתובות אימייל רגילות המכילות `@`.
 */
export function normalizeLoginEmail(rawInput: string): {
  email: string;
  usedDefaultDomain: boolean;
} {
  const cleaned = String(rawInput || '').trim().replace(/\s+/g, '');
  if (!cleaned) {
    return { email: '', usedDefaultDomain: false };
  }
  if (cleaned.includes('@')) {
    return { email: cleaned.toLowerCase(), usedDefaultDomain: false };
  }
  return {
    email: `${cleaned.toLowerCase()}@${DEFAULT_SHORT_LOGIN_DOMAIN}`,
    usedDefaultDomain: true
  };
}

export function getLastLoginIdentifier(): string {
  try {
    return (localStorage.getItem(LAST_LOGIN_IDENTIFIER_KEY) || '').trim();
  } catch {
    return '';
  }
}

export function saveLastLoginIdentifier(rawIdentifier: string): void {
  try {
    const cleaned = String(rawIdentifier || '').trim();
    if (cleaned) {
      localStorage.setItem(LAST_LOGIN_IDENTIFIER_KEY, cleaned);
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * מפעיל שמירה יזומה במנהל הסיסמאות המובנה של הטלפון/דפדפן (Chrome / Android / Safari Password Manager)
 * כדי שבכניסות הבאות המשתמש יוכל להתחבר בנגיעה אחת עם טביעת אצבע או FaceID.
 */
export async function storeBrowserPasswordCredential(
  identifier: string,
  password: string,
  displayName?: string
): Promise<boolean> {
  try {
    const win = window as unknown as {
      PasswordCredential?: new (data: {
        id: string;
        password: string;
        name?: string;
      }) => Credential;
    };
    if (
      typeof navigator !== 'undefined' &&
      navigator.credentials &&
      typeof navigator.credentials.store === 'function' &&
      typeof win.PasswordCredential === 'function'
    ) {
      const cred = new win.PasswordCredential({
        id: identifier,
        password,
        ...(displayName ? { name: displayName } : {})
      });
      await navigator.credentials.store(cred);
      return true;
    }
  } catch {
    // Fallback: browser native <form autoComplete> prompt handles saving automatically
  }
  return false;
}

export function buildWhatsAppInviteMessage(input: {
  fullName: string;
  email: string;
  password: string;
  role: TeamRole;
  appUrl?: string;
}): string {
  const roleLabel =
    input.role === 'admin'
      ? 'מנהל מערכת'
      : input.role === 'dev'
      ? 'מפתח (צוות פיתוח)'
      : 'בודק תוכנה (צוות QA)';
  const url =
    input.appUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://abkss001-art.github.io/python-task/');
  const shortUser = input.email.endsWith(`@${DEFAULT_SHORT_LOGIN_DOMAIN}`)
    ? input.email.slice(0, -(`@${DEFAULT_SHORT_LOGIN_DOMAIN}`).length)
    : null;

  return [
    `שלום ${input.fullName.trim()} 👋`,
    `הצטרפת למערכת "צב מן" בתור *${roleLabel}*.`,
    ``,
    `🔗 קישור לאפליקציה: ${url}`,
    `📧 אימייל להתחברות: ${input.email}${shortUser ? ` (אפשר גם להקליד בקיצור: ${shortUser})` : ''}`,
    `🔑 סיסמה זמנית: ${input.password}`,
    ``,
    `מומלץ לשמור את הסיסמה לכניסה מהירה בפעם הבאה.`
  ].join('\n');
}
