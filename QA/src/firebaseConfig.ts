import { FirebaseConfigData } from './types/std';

/**
 * ניתן להדביק כאן ישירות את הגדרות ה-Firebase של הפרויקט שלך,
 * או להגדיר אותן בקובץ .env, או להזין אותן בלחיצת כפתור מתוך אשף ההגדרות באפליקציה!
 */
export const HARDCODED_FIREBASE_CONFIG: Partial<FirebaseConfigData> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const STORAGE_KEY = 'std_qa_firebase_config_v1';

const SAFE_PROJECT_ID_RE = /^[a-zA-Z0-9-]{3,100}$/;
const SAFE_FIREBASE_DB_URL_RE =
  /^https:\/\/[a-zA-Z0-9.-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i;
const SAFE_FIREBASE_AUTH_DOMAIN_RE =
  /^[a-zA-Z0-9.-]+\.(firebaseapp\.com|web\.app)$/i;

export function isValidFirebaseConfig(
  cfg: Partial<FirebaseConfigData> | null | undefined
): cfg is FirebaseConfigData {
  if (!cfg || typeof cfg !== 'object') return false;
  if (cfg.projectId && !SAFE_PROJECT_ID_RE.test(String(cfg.projectId))) {
    return false;
  }
  if (cfg.databaseURL && !SAFE_FIREBASE_DB_URL_RE.test(String(cfg.databaseURL).trim())) {
    return false;
  }
  if (cfg.authDomain && !SAFE_FIREBASE_AUTH_DOMAIN_RE.test(String(cfg.authDomain).trim())) {
    return false;
  }
  return Boolean((cfg.apiKey && cfg.projectId) || cfg.databaseURL);
}

/**
 * מפענח טקסט חופשי שהודבק מ-Firebase Console (קוד JS, אובייקט JSON או כתובת Realtime Database URL)
 */
export function parseFirebaseSnippet(rawInput: string): FirebaseConfigData | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  // Case 1: User pasted a direct Firebase Realtime Database URL (e.g. https://my-app-default-rtdb.firebaseio.com)
  if (/^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(trimmed)) {
    const cleanUrl = trimmed.replace(/\/$/, '');
    const match = cleanUrl.match(/^https:\/\/([a-zA-Z0-9-]+)/);
    const inferredProject = match ? match[1].replace(/-default-rtdb$/, '') : 'firebase-rtdb-project';
    return {
      apiKey: 'rtdb-direct',
      projectId: inferredProject,
      databaseURL: cleanUrl,
      mode: 'rtdb'
    };
  }

  // Case 2: Extract key-value pairs from JS snippet or JSON
  const extractField = (key: string): string | undefined => {
    const regex = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, 'i');
    const match = trimmed.match(regex);
    return match ? match[1].trim() : undefined;
  };

  const apiKey = extractField('apiKey') || '';
  const authDomain = extractField('authDomain');
  const databaseURL = extractField('databaseURL');
  const projectId = extractField('projectId') || '';
  const storageBucket = extractField('storageBucket');
  const messagingSenderId = extractField('messagingSenderId');
  const appId = extractField('appId');

  if (!projectId && !databaseURL) {
    return null;
  }

  const inferredDatabaseURL =
    databaseURL || (projectId ? `https://${projectId}-default-rtdb.firebaseio.com` : undefined);

  return {
    apiKey: apiKey || 'rtdb-direct',
    authDomain,
    databaseURL: inferredDatabaseURL,
    projectId: projectId || 'firebase-project',
    storageBucket,
    messagingSenderId,
    appId,
    mode: databaseURL ? 'rtdb' : 'rtdb'
  };
}

export function loadActiveFirebaseConfig(): FirebaseConfigData | null {
  // 1. Check .env / hardcoded config
  if (isValidFirebaseConfig(HARDCODED_FIREBASE_CONFIG)) {
    return HARDCODED_FIREBASE_CONFIG;
  }

  // 2. Check existing stored config first
  let existingStored: FirebaseConfigData | null = null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidFirebaseConfig(parsed)) {
        existingStored = parsed;
      }
    }
  } catch {
    // ignore
  }

  // 3. Handle optional URL ?fb=... safely: validate strictly, scrub from URL bar, and require explicit user confirmation
  try {
    const url = new URL(window.location.href);
    const fbParam = url.searchParams.get('fb');
    if (fbParam) {
      // Remove sensitive/untrusted parameter from address bar & browser history immediately
      url.searchParams.delete('fb');
      window.history.replaceState({}, document.title, url.toString());

      const decoded = JSON.parse(atob(fbParam));
      if (isValidFirebaseConfig(decoded)) {
        const targetLabel = decoded.projectId || decoded.databaseURL || 'Firebase';
        const isSameConfig =
          existingStored &&
          existingStored.projectId === decoded.projectId &&
          existingStored.databaseURL === decoded.databaseURL;

        if (isSameConfig) {
          return existingStored;
        }

        const promptMsg = existingStored
          ? `קישור זה מבקש להחליף את מסד הנתונים הפעיל במסד Firebase חדש ("${targetLabel}"). האם אתה סומך על שולח הקישור ומאשר להחליף חיבור?`
          : `קישור זה מבקש לחבר את האפליקציה למסד Firebase ("${targetLabel}"). האם אתה מאשר להתחבר?`;

        if (window.confirm(promptMsg)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
          return decoded;
        }
      }
    }
  } catch {
    // ignore malformed URL param
  }

  return existingStored;
}

export function saveFirebaseConfigLocally(cfg: FirebaseConfigData | null) {
  if (!cfg) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function createShareableTeamLink(cfg: FirebaseConfigData | null): string {
  const url = new URL(window.location.href);
  if (cfg && isValidFirebaseConfig(cfg)) {
    url.searchParams.set('fb', btoa(JSON.stringify(cfg)));
  } else {
    url.searchParams.delete('fb');
  }
  return url.toString();
}
