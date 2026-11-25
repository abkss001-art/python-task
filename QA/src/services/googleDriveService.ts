import { sanitizeImageUrl } from '../utils/securityUtils';
import { GoogleDriveQuotaInfo } from '../types/std';
import { IS_STAGING, envStorageKey } from '../utils/appEnv';

const GDRIVE_URL_STORAGE_KEY = envStorageKey('std_qa_gdrive_webapp_url');
const GDRIVE_SECRET_STORAGE_KEY = envStorageKey('std_qa_gdrive_api_secret');

const SCRIPT_FOLDER_NAME = IS_STAGING
  ? 'צב מן (Pre-Prod) - צילומי מסך וגיבויים'
  : 'צב מן - צילומי מסך וגיבויים';
const SCRIPT_FIREBASE_API_KEY = IS_STAGING
  ? 'AIzaSyDcf8DHPUF2_QSOybD2epbrM1JbeoAo1Ng'
  : 'AIzaSyBUlQYiSgJxqZGjIVSQdSNy1I0dn467j9E';
const SCRIPT_FIREBASE_DB_URL = IS_STAGING
  ? 'https://tzavman-qa-staging-default-rtdb.europe-west1.firebasedatabase.app'
  : 'https://tzavman-qa-default-rtdb.europe-west1.firebasedatabase.app';
const SCRIPT_FIREBASE_PROJECT_LABEL = IS_STAGING ? 'tzavman-qa-staging' : 'tzavman-qa';

let firebaseIdTokenProvider: (() => Promise<string | null>) | null = null;
let firebaseAppCheckTokenProvider: (() => Promise<string | null>) | null = null;

/**
 * רושם ספק אסימון Firebase ID Token זמני לשליחה אוטומטית ל-Google Apps Script (ללא צורך בסוד קבוע בדפדפן)
 */
export function registerFirebaseIdTokenProvider(provider: (() => Promise<string | null>) | null) {
  firebaseIdTokenProvider = provider;
}

/**
 * רושם ספק אסימון Firebase App Check זמני להעברה ב-X-Firebase-AppCheck בעת אימות מול RTDB/Firestore
 */
export function registerFirebaseAppCheckTokenProvider(
  provider: (() => Promise<string | null>) | null
) {
  firebaseAppCheckTokenProvider = provider;
}

export interface GoogleDriveUploadResult {
  ok: boolean;
  fileId?: string;
  imageUrl?: string;
  webViewLink?: string;
  error?: string;
}

/**
 * הקוד המוכן להדבקה ב-Google Apps Script בחשבון ה-Google Drive (5TB) של המנהל
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// ============================================================================
// "צב מן" - מנוע אחסון מאובטח של צילומי מסך וגיבויים ב-Google Drive (5TB)
// אבטחה חינמית מומלצת (ללא סוד בדפדפן!): הגדר ב-Script Properties או כאן למטה:
//   FIREBASE_API_KEY  = מפתח ה-apiKey הציבורי מהפרויקט ב-Firebase
//   FIREBASE_DB_URL   = כתובת Realtime Database (למשל https://your-project-default-rtdb.firebaseio.com)
//   (או FIREBASE_PROJECT_ID אם אתה משתמש ב-Cloud Firestore)
// אם הגדרת אימות Firebase, מומלץ להשאיר את TZAVMAN_API_SECRET ריק כדי שלא יישלח סוד קבוע לדפדפן.
// ============================================================================
var MAIN_FOLDER_NAME = "${SCRIPT_FOLDER_NAME}";
var FIREBASE_API_KEY = "${SCRIPT_FIREBASE_API_KEY}";    // מפתח הפרויקט ${SCRIPT_FIREBASE_PROJECT_LABEL} (ניתן גם להגדיר ב-Script Property בשם FIREBASE_API_KEY)
var FIREBASE_DB_URL = "${SCRIPT_FIREBASE_DB_URL}"; // כתובת Realtime Database של ${SCRIPT_FIREBASE_PROJECT_LABEL}
var FIREBASE_PROJECT_ID = ""; // אופציונלי עבור Firestore בלבד (או Script Property בשם FIREBASE_PROJECT_ID)
var TZAVMAN_API_SECRET = "";  // מומלץ להשאיר ריק כאשר אימות Firebase Token פעיל למעלה

function getConfigProp(propName, fallbackVal) {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty(propName);
    if (prop && String(prop).trim()) return String(prop).trim();
  } catch (e) {}
  return String(fallbackVal || "").trim();
}

function getConfiguredSecret() {
  return getConfigProp("TZAVMAN_API_SECRET", TZAVMAN_API_SECRET);
}

function isFirebaseAuthConfigured() {
  var apiKey = getConfigProp("FIREBASE_API_KEY", FIREBASE_API_KEY);
  var dbUrl = getConfigProp("FIREBASE_DB_URL", FIREBASE_DB_URL);
  var projId = getConfigProp("FIREBASE_PROJECT_ID", FIREBASE_PROJECT_ID);
  return Boolean(apiKey && (dbUrl || projId));
}

function isSecretValid(providedSecret) {
  var expected = getConfiguredSecret();
  if (!expected) return true;
  var supplied = String(providedSecret || "").trim();
  if (expected.length !== supplied.length) return false;
  var diff = 0;
  for (var i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  }
  return diff === 0;
}

function parseFirestoreDocFields(docJson) {
  if (!docJson || !docJson.fields) return null;
  var f = docJson.fields;
  var allowedSystems = [];
  if (f.allowedSystems && f.allowedSystems.arrayValue && f.allowedSystems.arrayValue.values) {
    var vals = f.allowedSystems.arrayValue.values;
    for (var i = 0; i < vals.length; i++) {
      if (vals[i] && vals[i].stringValue) allowedSystems.push(vals[i].stringValue);
    }
  }
  return {
    role: f.role && f.role.stringValue ? f.role.stringValue : "",
    allSystems: Boolean(f.allSystems && f.allSystems.booleanValue === true),
    allowedSystems: allowedSystems
  };
}

function verifyFirebaseUserForAction(idToken, action, targetSystem, appCheckToken) {
  var token = String(idToken || "").trim();
  if (!token) {
    return { ok: false, error: "Unauthorized: Missing Firebase ID token" };
  }
  var cleanAppCheck = String(appCheckToken || "").trim();

  var apiKey = getConfigProp("FIREBASE_API_KEY", FIREBASE_API_KEY);
  var dbUrl = getConfigProp("FIREBASE_DB_URL", FIREBASE_DB_URL);
  var projId = getConfigProp("FIREBASE_PROJECT_ID", FIREBASE_PROJECT_ID);

  // 1. אימות חתימה ותוקף ה-Token מול Google Identity Toolkit
  var lookupRes = UrlFetchApp.fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + encodeURIComponent(apiKey),
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ idToken: token }),
      muteHttpExceptions: true
    }
  );
  if (lookupRes.getResponseCode() !== 200) {
    return { ok: false, error: "Unauthorized: Invalid or expired Firebase token" };
  }
  var lookupData = JSON.parse(lookupRes.getContentText() || "{}");
  var userObj = lookupData && lookupData.users && lookupData.users[0];
  if (!userObj || !userObj.localId || userObj.disabled === true) {
    return { ok: false, error: "Unauthorized: Firebase user inactive" };
  }
  var uid = String(userObj.localId);

  // 2. אימות פרופיל והרשאות המשתמש ב-std_users/{uid} (כולל X-Firebase-AppCheck אם פעיל)
  var profile = null;
  if (dbUrl) {
    var cleanDb = dbUrl.replace(/\\/+$/, "");
    var rtdbOpts = { muteHttpExceptions: true };
    if (cleanAppCheck) {
      rtdbOpts.headers = { "X-Firebase-AppCheck": cleanAppCheck };
    }
    var rtdbRes = UrlFetchApp.fetch(
      cleanDb + "/std_users/" + encodeURIComponent(uid) + ".json?auth=" + encodeURIComponent(token),
      rtdbOpts
    );
    if (rtdbRes.getResponseCode() === 200) {
      profile = JSON.parse(rtdbRes.getContentText() || "null");
    }
  } else if (projId) {
    var fsHeaders = { Authorization: "Bearer " + token };
    if (cleanAppCheck) {
      fsHeaders["X-Firebase-AppCheck"] = cleanAppCheck;
    }
    var fsRes = UrlFetchApp.fetch(
      "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(projId) +
        "/databases/(default)/documents/std_users/" + encodeURIComponent(uid),
      {
        headers: fsHeaders,
        muteHttpExceptions: true
      }
    );
    if (fsRes.getResponseCode() === 200) {
      profile = parseFirestoreDocFields(JSON.parse(fsRes.getContentText() || "{}"));
    }
  }

  if (!profile || (profile.role !== "admin" && profile.role !== "qa" && profile.role !== "dev")) {
    return { ok: false, error: "Forbidden: User is not registered in std_users" };
  }

  // 3. אכיפת הרשאות לפי פעולה ומערכת
  if (action === "SAVE_BACKUP" || action === "PING") {
    if (profile.role !== "admin") {
      return { ok: false, error: "Forbidden: Admin role required" };
    }
    return { ok: true, uid: uid, role: profile.role };
  }

  if (action === "UPLOAD_IMAGE") {
    if (profile.role === "admin" || profile.allSystems === true) {
      return { ok: true, uid: uid, role: profile.role };
    }
    var sysName = String(targetSystem || "").trim();
    var allowed = Array.isArray(profile.allowedSystems) ? profile.allowedSystems : [];
    if (sysName && allowed.indexOf(sysName) !== -1) {
      return { ok: true, uid: uid, role: profile.role };
    }
    return { ok: false, error: "Forbidden: No upload permission for this system" };
  }

  return { ok: false, error: "Unknown action" };
}

function isAuthorizedRequest(body) {
  if (isFirebaseAuthConfigured()) {
    var fbCheck = verifyFirebaseUserForAction(
      body.firebaseIdToken,
      body.action,
      body.system,
      body.firebaseAppCheckToken
    );
    if (!fbCheck.ok) return fbCheck;
    if (getConfiguredSecret() && !isSecretValid(body.apiSecret)) {
      return { ok: false, error: "Unauthorized: Invalid API secret" };
    }
    return fbCheck;
  }
  if (!isSecretValid(body.apiSecret)) {
    return { ok: false, error: "Unauthorized: Invalid API secret" };
  }
  return { ok: true };
}

function getOrCreateMainFolder() {
  var folders = DriveApp.getFoldersByName(MAIN_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  var folder = DriveApp.createFolder(MAIN_FOLDER_NAME);
  return folder;
}

function getOrCreateSystemFolder(mainFolder, systemName) {
  if (!systemName) return mainFolder;
  var cleanName = String(systemName).replace(/[\\\\/:*?"<>|]/g, "_").trim();
  if (!cleanName) return mainFolder;
  var subFolders = mainFolder.getFoldersByName(cleanName);
  if (subFolders.hasNext()) {
    return subFolders.next();
  }
  return mainFolder.createFolder(cleanName);
}

function getTodayDateKey() {
  var d = new Date();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
}

function recordAndGetDriveQuota(incrementOps) {
  var todayKey = getTodayDateKey();
  var ops = 0;
  try {
    var props = PropertiesService.getScriptProperties();
    var raw = props.getProperty("TZAVMAN_DAILY_QUOTA");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.date === todayKey && typeof parsed.ops === "number") {
        ops = parsed.ops;
      }
    }
    if (incrementOps) {
      ops += 1;
      props.setProperty("TZAVMAN_DAILY_QUOTA", JSON.stringify({ date: todayKey, ops: ops }));
    }
  } catch (e) {}

  var usedBytes = null;
  var limitBytes = null;
  try {
    usedBytes = DriveApp.getStorageUsed();
    limitBytes = DriveApp.getStorageLimit();
  } catch (e) {}

  return {
    driveStorageUsedBytes: typeof usedBytes === "number" ? usedBytes : null,
    driveStorageLimitBytes: typeof limitBytes === "number" ? limitBytes : null,
    dailyOperations: ops,
    dailyUrlFetchCalls: ops * 2,
    dailyUrlFetchLimit: 20000,
    dateKey: todayKey
  };
}

function doGet(e) {
  // אינו חושף מזהי תיקיות או קבצים ללא אימות
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    service: "tzavman-drive-bridge",
    firebaseAuthProtected: isFirebaseAuthConfigured(),
    secretProtected: Boolean(getConfiguredSecret())
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var body = JSON.parse(raw);

    var authCheck = isAuthorizedRequest(body);
    if (!authCheck.ok) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: authCheck.error || "Unauthorized"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var mainFolder = getOrCreateMainFolder();

    // 1. בדיקת חיבור מהירה + נתוני נפח ומכסה יומית (למנהל)
    if (body.action === "PING") {
      var quotaInfo = recordAndGetDriveQuota(true);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        folderName: mainFolder.getName(),
        folderUrl: mainFolder.getUrl(),
        quota: quotaInfo
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. העלאת צילום מסך ושמירתו בתיקיית המערכת ב-Google Drive
    if (body.action === "UPLOAD_IMAGE") {
      recordAndGetDriveQuota(true);
      var dataUrl = String(body.dataUrl || "");
      var parts = dataUrl.split(",");
      var base64Data = parts.length > 1 ? parts[1] : parts[0];
      var mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
      var mimeType = mimeMatch ? mimeMatch[1] : "image/webp";
      var ext = mimeType.indexOf("png") !== -1 ? "png" : mimeType.indexOf("jpeg") !== -1 || mimeType.indexOf("jpg") !== -1 ? "jpg" : "webp";

      var targetFolder = getOrCreateSystemFolder(mainFolder, body.system || "כללי");
      var fileName = (body.fileName || ("צילום_מסך_" + new Date().getTime())) + "." + ext;

      var decoded = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decoded, mimeType, fileName);
      var file = targetFolder.createFile(blob);

      // מתן הרשאת צפייה בקישור כדי שכל המכשירים והטלפונים יראו את התמונה מיד בטבלה
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var fileId = file.getId();

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        fileId: fileId,
        imageUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1600",
        webViewLink: file.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. שמירת קובץ גיבוי אוטומטי של מסד הנתונים ב-Google Drive
    if (body.action === "SAVE_BACKUP") {
      recordAndGetDriveQuota(true);
      var backupName = "tzavman_auto_backup.json";
      var existing = mainFolder.getFilesByName(backupName);
      var content = JSON.stringify(body.payload, null, 2);
      if (existing.hasNext()) {
        var f = existing.next();
        f.setContent(content);
      } else {
        mainFolder.createFile(backupName, content, MimeType.PLAIN_TEXT);
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export function isValidGoogleAppsScriptUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/i.test(
    url.trim()
  );
}

export function getSavedGoogleDriveUrl(): string {
  try {
    const saved = (localStorage.getItem(GDRIVE_URL_STORAGE_KEY) || '').trim();
    return isValidGoogleAppsScriptUrl(saved) ? saved : '';
  } catch {
    return '';
  }
}

export function setSavedGoogleDriveUrl(url: string) {
  try {
    const cleaned = url.trim();
    if (cleaned && isValidGoogleAppsScriptUrl(cleaned)) {
      localStorage.setItem(GDRIVE_URL_STORAGE_KEY, cleaned);
    } else if (!cleaned) {
      localStorage.removeItem(GDRIVE_URL_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function getSavedGoogleDriveSecret(): string {
  try {
    return (localStorage.getItem(GDRIVE_SECRET_STORAGE_KEY) || '').trim();
  } catch {
    return '';
  }
}

export function setSavedGoogleDriveSecret(secret: string) {
  try {
    const cleaned = secret.trim();
    if (cleaned) {
      localStorage.setItem(GDRIVE_SECRET_STORAGE_KEY, cleaned);
    } else {
      localStorage.removeItem(GDRIVE_SECRET_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function buildGoogleDriveRequestBody(
  action: 'PING' | 'UPLOAD_IMAGE' | 'SAVE_BACKUP',
  extra: Record<string, unknown> = {},
  explicitSecret?: string,
  firebaseIdToken?: string | null,
  firebaseAppCheckToken?: string | null
): Record<string, unknown> {
  const secret = (explicitSecret !== undefined ? explicitSecret : getSavedGoogleDriveSecret()).trim();
  const cleanToken = typeof firebaseIdToken === 'string' ? firebaseIdToken.trim() : '';
  const cleanAppCheck = typeof firebaseAppCheckToken === 'string' ? firebaseAppCheckToken.trim() : '';
  return {
    action,
    ...(secret ? { apiSecret: secret } : {}),
    ...(cleanToken ? { firebaseIdToken: cleanToken } : {}),
    ...(cleanAppCheck ? { firebaseAppCheckToken: cleanAppCheck } : {}),
    ...extra
  };
}

export async function buildGoogleDriveRequestBodyAsync(
  action: 'PING' | 'UPLOAD_IMAGE' | 'SAVE_BACKUP',
  extra: Record<string, unknown> = {},
  explicitSecret?: string
): Promise<Record<string, unknown>> {
  let token: string | null = null;
  if (firebaseIdTokenProvider) {
    try {
      token = await firebaseIdTokenProvider();
    } catch {
      token = null;
    }
  }
  let appCheckToken: string | null = null;
  if (firebaseAppCheckTokenProvider) {
    try {
      appCheckToken = await firebaseAppCheckTokenProvider();
    } catch {
      appCheckToken = null;
    }
  }
  return buildGoogleDriveRequestBody(action, extra, explicitSecret, token, appCheckToken);
}

export function isDataUrlImage(str: string): boolean {
  return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * בודק חיבור מול ה-Web App של Google Drive ומחזיר את שם התיקייה והקישור אליה
 */
export async function testGoogleDriveConnection(
  scriptUrl: string,
  explicitSecret?: string
): Promise<{
  ok: boolean;
  folderName?: string;
  folderUrl?: string;
  quota?: GoogleDriveQuotaInfo;
  error?: string;
}> {
  const cleaned = scriptUrl.trim();
  if (!isValidGoogleAppsScriptUrl(cleaned)) {
    return {
      ok: false,
      error: 'הכתובת חייבת להתחיל ב-https://script.google.com/macros/s/... ולהסתיים ב-/exec'
    };
  }

  try {
    const reqBody = await buildGoogleDriveRequestBodyAsync('PING', {}, explicitSecret);
    const res = await fetch(cleaned, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(reqBody),
      redirect: 'follow'
    });
    if (!res.ok) {
      return { ok: false, error: `שגיאת שרת (${res.status})` };
    }
    const data = await res.json();
    if (data && data.ok) {
      const q = data.quota;
      const parsedQuota: GoogleDriveQuotaInfo | undefined =
        q && typeof q === 'object'
          ? {
              driveStorageUsedBytes:
                typeof q.driveStorageUsedBytes === 'number' ? q.driveStorageUsedBytes : null,
              driveStorageLimitBytes:
                typeof q.driveStorageLimitBytes === 'number' ? q.driveStorageLimitBytes : null,
              dailyOperations: Number(q.dailyOperations) || 0,
              dailyUrlFetchCalls: Number(q.dailyUrlFetchCalls) || 0,
              dailyUrlFetchLimit: Number(q.dailyUrlFetchLimit) || 20000,
              dateKey: typeof q.dateKey === 'string' ? q.dateKey : new Date().toISOString().slice(0, 10)
            }
          : undefined;
      return {
        ok: true,
        folderName: data.folderName,
        folderUrl: data.folderUrl,
        ...(parsedQuota ? { quota: parsedQuota } : {})
      };
    }
    return { ok: false, error: data?.error || 'תגובה לא תקינה מהסקריפט' };
  } catch (err: any) {
    return {
      ok: false,
      error:
        err?.message ||
        'לא ניתן להתחבר לסקריפט. ודא שהגדרת "Who has access: Anyone" בעת הפרסום (Deploy).'
    };
  }
}

/**
 * שולף נתוני נפח Google Drive (5TB) ומכסה יומית מ-Apps Script (מנהל בלבד)
 */
export async function fetchGoogleDriveQuota(): Promise<{
  connected: boolean;
  quota: GoogleDriveQuotaInfo | null;
  error?: string;
}> {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl) {
    return { connected: false, quota: null };
  }
  const res = await testGoogleDriveConnection(scriptUrl);
  if (!res.ok) {
    return { connected: true, quota: null, error: res.error };
  }
  return { connected: true, quota: res.quota || null };
}

/**
 * מעלה צילום מסך בודד (Base64) ל-Google Drive ומחזיר קישור קל ומהיר לתמונה
 */
export async function uploadImageToGoogleDrive(
  dataUrl: string,
  meta?: { system?: string; testCaseId?: string; label?: string }
): Promise<string> {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl || !isDataUrlImage(dataUrl)) {
    return dataUrl;
  }

  try {
    const fileName = `מערכת_${meta?.system || 'כללי'}_תסריט_${meta?.testCaseId || '0'}_${Date.now()}`;
    const reqBody = await buildGoogleDriveRequestBodyAsync('UPLOAD_IMAGE', {
      dataUrl,
      system: meta?.system || 'כללי',
      fileName
    });
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(reqBody),
      redirect: 'follow'
    });

    if (!res.ok) return dataUrl;
    const json = (await res.json()) as GoogleDriveUploadResult;
    if (json && json.ok && json.imageUrl) {
      const safeUrl = sanitizeImageUrl(json.imageUrl);
      if (safeUrl) return safeUrl;
    }
    return dataUrl;
  } catch {
    // במידה ואין חיבור רגעי, שומר את התמונה המקורית כך ששום מידע לא הולך לאיבוד
    return dataUrl;
  }
}

/**
 * מעלה מערך של צילומי מסך ל-Google Drive (רק אלו שעדיין ב-Base64) ומחזיר מערך קישורים קלים
 */
export async function uploadScreenshotsArrayToGoogleDrive(
  screenshots: string[],
  meta?: { system?: string; testCaseId?: string }
): Promise<string[]> {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl || !Array.isArray(screenshots) || screenshots.length === 0) {
    return screenshots;
  }

  const results = await Promise.all(
    screenshots.map((img, idx) => {
      if (!isDataUrlImage(img)) return Promise.resolve(img);
      return uploadImageToGoogleDrive(img, {
        system: meta?.system,
        testCaseId: `${meta?.testCaseId || '0'}_תמונה_${idx + 1}`
      });
    })
  );

  return results;
}

/**
 * שומר גיבוי אוטומטי ברקע של מסד הנתונים לתיקיית ה-Google Drive
 */
export function saveAutoBackupToGoogleDrive(payload: unknown) {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl) return;

  buildGoogleDriveRequestBodyAsync('SAVE_BACKUP', { payload })
    .then((reqBody) =>
      fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(reqBody),
        redirect: 'follow'
      })
    )
    .catch(() => {});
}
