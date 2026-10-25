import { TeamRole } from '../types/std';

const ROLE_HASH_QA = 'a179515a8eadd996';
const ROLE_HASH_DEV = 'c01d202455927044';
const ROLE_HASH_ADMIN = '5e3cc70085645490';
const ENVELOPE_PREFIX = 'tzv_enc_v1:';
const ENVELOPE_KEY = 'TzavMan_Nahshon_QA_Shield_2026';

/**
 * גיבוב דטרמיניסטי מהיר (64-bit Salted Hash) להסתרת קודי הגישה מקוד המקור וחתימת הרשאות
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
 * בדיקת קוד כניסה ללא חשיפת הסיסמאות בטקסט גלוי בקוד המקור
 */
export function verifyAccessCodeRole(code: string): {
  valid: boolean;
  role: TeamRole;
  isAdmin: boolean;
} {
  const digest = hashAccessCode(code);
  if (digest === ROLE_HASH_ADMIN) {
    return { valid: true, role: 'qa', isAdmin: true };
  }
  if (digest === ROLE_HASH_DEV) {
    return { valid: true, role: 'dev', isAdmin: false };
  }
  if (digest === ROLE_HASH_QA) {
    return { valid: true, role: 'qa', isAdmin: false };
  }
  return { valid: false, role: 'qa', isAdmin: false };
}

export function isAdminAccessCode(code: string): boolean {
  return hashAccessCode(code) === ROLE_HASH_ADMIN;
}

/**
 * חתימת אבטחה למשתמש המחובר ב-localStorage כדי למנוע זיוף "isAdmin: true" דרך F12
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
 * סינון ואימות קישורי תמונות לחסימת הזרקת קוד (XSS / javascript: URIs)
 */
export function sanitizeImageUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Allow safe data:image/* base64 strings (exclude SVG script injection unless clean)
  if (/^data:image\/(png|jpe?g|webp|gif|bmp);base64,[A-Za-z0-9+/=\s]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Allow HTTPS image links (e.g. Google Drive thumbnails) or local dev server
  if (/^https:\/\/[^\s"'<>]+$/i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * הצפנת מעטפת קלה לכתובות רגישות (כמו כתובת ה-Web App של Google Drive) בעת שידור בערוץ הציבורי
 */
export function encodeProtectedUrl(plainUrl: string | undefined): string | undefined {
  if (!plainUrl || typeof plainUrl !== 'string') return undefined;
  const trimmed = plainUrl.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith(ENVELOPE_PREFIX)) return trimmed;

  try {
    const xorBytes: number[] = [];
    for (let i = 0; i < trimmed.length; i++) {
      const code = trimmed.charCodeAt(i) ^ ENVELOPE_KEY.charCodeAt(i % ENVELOPE_KEY.length);
      xorBytes.push(code);
    }
    const binStr = String.fromCharCode(...xorBytes);
    return `${ENVELOPE_PREFIX}${btoa(binStr)}`;
  } catch {
    return trimmed;
  }
}

export function decodeProtectedUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const trimmed = raw.trim();

  if (trimmed.startsWith('https://script.google.com/')) {
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
      if (decoded.startsWith('https://script.google.com/')) {
        return decoded;
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}
