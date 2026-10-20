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

export function isValidFirebaseConfig(cfg: Partial<FirebaseConfigData> | null | undefined): cfg is FirebaseConfigData {
  if (!cfg) return false;
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
  // 1. Check URL parameter ?fb=... so shared links auto-configure immediately
  try {
    const params = new URLSearchParams(window.location.search);
    const fbParam = params.get('fb');
    if (fbParam) {
      const decoded = JSON.parse(atob(fbParam));
      if (isValidFirebaseConfig(decoded)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
        return decoded;
      }
    }
  } catch {
    // ignore malformed URL param
  }

  // 2. Check .env / hardcoded config
  if (isValidFirebaseConfig(HARDCODED_FIREBASE_CONFIG)) {
    return HARDCODED_FIREBASE_CONFIG;
  }

  // 3. Check stored config from wizard
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidFirebaseConfig(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return null;
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
