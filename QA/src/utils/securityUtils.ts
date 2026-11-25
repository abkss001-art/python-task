import type { TeamRole } from '../types/std';

const ENVELOPE_PREFIX = 'tzv_enc_v1:';
const ENVELOPE_KEY = 'TzavMan_Nahshon_QA_Shield_2026';

// PBKDF2-SHA256 (100,000 iterations) digest of the default Developer Vault password — plaintext is never stored in source
const DEV_VAULT_SALT = 'tzavman_dev_vault_v1::nahshon_2026';
const DEV_VAULT_ITERATIONS = 100_000;
const DEV_VAULT_EXPECTED_HASH =
  '4f2ae7321c407e8329ce04ca89c33861a1b927f6066c26c71df7678499992d34';

export interface DeveloperVaultCredential {
  salt: string;
  hash: string;
}

function constantTimeHexEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function deriveVaultPbkdf2Hex(password: string, salt: string): Promise<string | null> {
  const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : undefined;
  if (!subtle) return null;
  try {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: DEV_VAULT_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    const bytes = new Uint8Array(derivedBits);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
  } catch {
    return null;
  }
}

/**
 * מפיק salt אקראי ו-hash מוצפן (PBKDF2-SHA256, 100,000 איטרציות) לשמירת סיסמת סביבת מפתח חדשה ללא טקסט גלוי.
 */
export async function hashDeveloperVaultPassword(
  rawPassword: string,
  customSalt?: string
): Promise<DeveloperVaultCredential | null> {
  const cleaned = rawPassword.trim();
  if (!cleaned) return null;
  let salt = customSalt?.trim() || '';
  if (!salt) {
    const rand = new Uint8Array(16);
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(rand);
    } else {
      for (let i = 0; i < rand.length; i++) rand[i] = Math.floor(Math.random() * 256);
    }
    salt =
      'tzavman_vault_v2::' +
      Array.from(rand)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
  }
  const hash = await deriveVaultPbkdf2Hex(cleaned, salt);
  if (!hash) return null;
  return { salt, hash };
}

/**
 * אימות סיסמת "סביבת מפתח" באמצעות PBKDF2-SHA256 (100,000 איטרציות) והשוואה בזמן קבוע.
 * תומך בסיסמה מותאמת שנשמרה בענן (customCredential) עם גיבוי לסיסמת ברירת המחדל אם טרם שונתה.
 */
export async function verifyDeveloperVaultPassword(
  rawInput: string,
  customCredential?: DeveloperVaultCredential | null
): Promise<boolean> {
  const cleaned = rawInput.trim();
  if (!cleaned) return false;
  const activeSalt =
    customCredential?.salt && customCredential?.hash ? customCredential.salt : DEV_VAULT_SALT;
  const expectedHash =
    customCredential?.salt && customCredential?.hash
      ? customCredential.hash.toLowerCase()
      : DEV_VAULT_EXPECTED_HASH;
  const hex = await deriveVaultPbkdf2Hex(cleaned, activeSalt);
  if (!hex) return false;
  return constantTimeHexEqual(hex, expectedHash);
}

/**
 * גיבוב דטרמיניסטי מהיר (64-bit Salted Hash) לחתימת מצב מקומי למניעת שינוי isAdmin דרך DevTools
 */
export function hashAccessCode(input: string): string {
  const str = `tzavman_salt_v1:${input.trim()}:nahshon_qa`;
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h1 >>> 0).toString(16).padStart(8, '0')
  );
}

/**
 * חתימת אבטחה למשתמש המחובר ב-localStorage (הרשאות אמת נאכפות בשרת דרך Firebase Auth + Rules)
 */
export function computeUserAuthSignature(user: {
  fullName: string;
  role: TeamRole;
  isAdmin: boolean;
}): string {
  return hashAccessCode(
    `auth_sig:${user.fullName}:${user.role}:${user.isAdmin ? 'ADMIN_GRANTED' : 'STD_USER'}`
  );
}

export function verifyUserAuthSignature(user: {
  fullName: string;
  role: TeamRole;
  isAdmin: boolean;
  authSignature?: string;
}): boolean {
  if (!user.authSignature) return false;
  return user.authSignature === computeUserAuthSignature(user);
}

/**
 * סינון ואימות קישורי תמונות לחסימת הזרקת קוד (XSS / javascript: URIs / דומיינים חיצוניים לא מורשים)
 */
const ALLOWED_IMAGE_HOST_SUFFIXES = [
  'drive.google.com',
  'googleusercontent.com',
  'firebasestorage.googleapis.com'
];

export function isAllowedImageHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (typeof window !== 'undefined' && window.location.hostname.toLowerCase() === lower) {
    return true;
  }
  return ALLOWED_IMAGE_HOST_SUFFIXES.some(
    (suffix) => lower === suffix || lower.endsWith(`.${suffix}`)
  );
}

export function sanitizeImageUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Allow safe data:image/* base64 strings (exclude SVG script injection)
  if (/^data:image\/(png|jpe?g|webp|gif|bmp);base64,[A-Za-z0-9+/=\s]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Allow only HTTPS URLs hosted on trusted image domains (Drive / Firebase Storage / same-origin)
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' && isAllowedImageHost(parsed.hostname)) {
      return trimmed;
    }
  } catch {
    // invalid URL
  }

  return null;
}

const VALID_APPS_SCRIPT_RE =
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/i;

/**
 * מאמת כתובת Web App של Google Apps Script (ותומך גם בפענוח לאחור של ערכים שנשמרו במעטפת tzv_enc_v1:)
 */
export function encodeProtectedUrl(plainUrl: string | undefined): string | undefined {
  if (!plainUrl || typeof plainUrl !== 'string') return undefined;
  const trimmed = plainUrl.trim();
  if (!trimmed) return undefined;
  return VALID_APPS_SCRIPT_RE.test(trimmed) ? trimmed : undefined;
}

export function decodeProtectedUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const trimmed = raw.trim();

  if (VALID_APPS_SCRIPT_RE.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith(ENVELOPE_PREFIX)) {
    try {
      const b64 = trimmed.slice(ENVELOPE_PREFIX.length);
      const binStr = atob(b64);
      const chars: string[] = [];
      for (let i = 0; i < binStr.length; i++) {
        const orig = binStr.charCodeAt(i) ^ ENVELOPE_KEY.charCodeAt(i % ENVELOPE_KEY.length);
        chars.push(String.fromCharCode(orig));
      }
      const decoded = chars.join('');
      if (VALID_APPS_SCRIPT_RE.test(decoded)) {
        return decoded;
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}
